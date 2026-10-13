import { useCallback, useEffect, useRef, useState } from 'react'
import type { Entry } from '../../types'
import { analyseDocuments } from './analysis/analyse'
import { newId, sanitiseFileName } from './analysis/text'
import { checkFile, extractFile } from './extract'
import { buildReview } from './review'
import {
  DEFAULT_LIMITS,
  ImportError,
  type DocumentRecord,
  type ExtractedDocument,
  type ReviewState,
} from './types'

export type FileStatus =
  'checking' | 'queued' | 'reading' | 'done' | 'error' | 'duplicate' | 'cancelled'

export interface SessionFile {
  id: string
  file: File
  name: string
  status: FileStatus
  progress: number
  total: number
  warning?: string
  error?: string
  /** Why it failed, so the panel can offer the right next step. */
  errorCode?: string
  doc?: ExtractedDocument
}

export type Stage = 'select' | 'analysing' | 'review'

/**
 * One import session: files are checked and read one at a time, in the
 * browser, and can be cancelled or removed. Analysis runs only when the user
 * asks to review. No file or text leaves the page.
 */
export function useImportSession(curated: Entry[], knownHashes: Set<string>) {
  const [files, setFiles] = useState<SessionFile[]>([])
  const [stage, setStage] = useState<Stage>('select')
  const [analysisProgress, setAnalysisProgress] = useState<{ done: number; total: number } | null>(
    null,
  )
  const [review, setReview] = useState<ReviewState | null>(null)
  const [message, setMessage] = useState('')
  const controllers = useRef(new Map<string, AbortController>())
  const analysisController = useRef<AbortController | null>(null)
  const working = useRef(false)
  // The ref is the source of truth so the queue always sees the latest list.
  const filesRef = useRef<SessionFile[]>([])
  const commit = useCallback((fn: (fs: SessionFile[]) => SessionFile[]) => {
    filesRef.current = fn(filesRef.current)
    setFiles(filesRef.current)
  }, [])

  const patch = useCallback(
    (id: string, change: Partial<SessionFile>) => {
      commit((fs) => fs.map((f) => (f.id === id ? { ...f, ...change } : f)))
    },
    [commit],
  )

  const processQueue = useCallback(async () => {
    if (working.current) return
    working.current = true
    try {
      // Re-read the queue each time so files added meanwhile are picked up.
      for (;;) {
        const next = filesRef.current.find((f) => f.status === 'queued')
        if (!next) break
        const controller = new AbortController()
        controllers.current.set(next.id, controller)
        patch(next.id, { status: 'reading', progress: 0 })
        try {
          const doc = await extractFile(
            next.file,
            (done, total) => patch(next.id, { progress: done, total }),
            controller.signal,
          )
          const dupe =
            knownHashes.has(doc.contentHash) ||
            filesRef.current.some((f) => f.id !== next.id && f.doc?.contentHash === doc.contentHash)
          if (doc.scanned) {
            patch(next.id, {
              status: 'error',
              errorCode: 'scanned',
              error:
                'This PDF looks scanned: it has pictures of pages rather than text, so there is nothing to read. On-device OCR is not available yet. Use a text-based PDF, or save the text as a .txt or .md file.',
            })
          } else if (dupe) {
            patch(next.id, {
              status: 'duplicate',
              doc,
              error:
                'You already imported a file with exactly these contents, so it will be skipped.',
            })
          } else {
            patch(next.id, { status: 'done', doc, progress: doc.pageCount, total: doc.pageCount })
          }
        } catch (e) {
          if (e instanceof ImportError && e.code === 'cancelled') {
            patch(next.id, { status: 'cancelled', error: 'Cancelled.' })
          } else if (e instanceof ImportError) {
            patch(next.id, { status: 'error', error: e.message, errorCode: e.code })
          } else {
            patch(next.id, {
              status: 'error',
              errorCode: 'unknown',
              error: 'Something went wrong reading this file. Try another copy of it.',
            })
          }
        } finally {
          controllers.current.delete(next.id)
        }
      }
    } finally {
      working.current = false
    }
  }, [knownHashes, patch])

  const addFiles = useCallback(
    async (list: FileList | File[]) => {
      const incoming = Array.from(list)
      const room = DEFAULT_LIMITS.maxFiles - filesRef.current.length
      const accepted = incoming.slice(0, Math.max(0, room))
      if (incoming.length > accepted.length) {
        setMessage(
          `Only ${DEFAULT_LIMITS.maxFiles} files can be imported at once; ${incoming.length - accepted.length} were not added.`,
        )
      } else setMessage('')
      const entries: SessionFile[] = accepted.map((file) => ({
        id: newId('f'),
        file,
        name: sanitiseFileName(file.name),
        status: 'checking',
        progress: 0,
        total: 0,
      }))
      commit((fs) => [...fs, ...entries])
      for (const entry of entries) {
        try {
          const check = await checkFile(entry.file)
          patch(entry.id, { status: 'queued', warning: check.warning })
        } catch (e) {
          patch(entry.id, {
            status: 'error',
            errorCode: e instanceof ImportError ? e.code : 'unknown',
            error: e instanceof Error ? e.message : 'This file could not be used.',
          })
        }
      }
      void processQueue()
    },
    [commit, patch, processQueue],
  )

  const removeFile = useCallback(
    (id: string) => {
      controllers.current.get(id)?.abort()
      commit((fs) => fs.filter((f) => f.id !== id))
    },
    [commit],
  )

  const cancelAll = useCallback(() => {
    for (const c of controllers.current.values()) c.abort()
    analysisController.current?.abort()
    commit((fs) =>
      fs.map((f) =>
        f.status === 'queued' || f.status === 'checking'
          ? { ...f, status: 'cancelled' as const, error: 'Cancelled.' }
          : f,
      ),
    )
  }, [commit])

  const startReview = useCallback(async () => {
    const docs = filesRef.current
      .filter((f) => f.status === 'done' && f.doc)
      .map((f) => f.doc as ExtractedDocument)
    if (docs.length === 0) return
    const controller = new AbortController()
    analysisController.current = controller
    setStage('analysing')
    setAnalysisProgress({ done: 0, total: docs.reduce((n, d) => n + d.pages.length, 0) })
    try {
      const analysis = await analyseDocuments(docs, {
        curated,
        signal: controller.signal,
        onProgress: (done, total) => setAnalysisProgress({ done, total }),
      })
      const records: DocumentRecord[] = docs.map((d) => ({
        id: d.fileId,
        fileName: d.fileName,
        title: d.title,
        kind: d.kind,
        pageCount: d.pageCount,
        contentHash: d.contentHash,
        importedAt: new Date().toISOString(),
        method: d.method,
        warnings: d.warnings,
      }))
      setReview(buildReview(analysis, records))
      setStage('review')
    } catch (e) {
      setStage('select')
      setMessage(
        e instanceof DOMException && e.name === 'AbortError'
          ? 'Processing cancelled. Your files are still listed; nothing was added.'
          : 'The notes could not be analysed. Try again with a smaller file.',
      )
    } finally {
      analysisController.current = null
      setAnalysisProgress(null)
    }
  }, [curated])

  const reset = useCallback(() => {
    cancelAll()
    commit(() => [])
    setReview(null)
    setStage('select')
    setMessage('')
  }, [cancelAll, commit])

  // Make sure nothing keeps running if the panel is closed.
  useEffect(() => {
    const live = controllers.current
    return () => {
      for (const c of live.values()) c.abort()
      analysisController.current?.abort()
    }
  }, [])

  return {
    files,
    stage,
    analysisProgress,
    review,
    setReview,
    message,
    addFiles,
    removeFile,
    cancelAll,
    startReview,
    reset,
    backToSelect: () => setStage('select'),
  }
}
