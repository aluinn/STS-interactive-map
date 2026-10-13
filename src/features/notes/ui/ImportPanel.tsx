import { useEffect, useRef, useState } from 'react'
import { warmPdf } from '../extract/pdf'
import { DEFAULT_LIMITS } from '../types'
import type { SessionFile, Stage } from '../useImportSession'
import styles from './notes.module.css'

interface ImportPanelProps {
  files: SessionFile[]
  stage: Stage
  message: string
  analysisProgress: { done: number; total: number } | null
  onAddFiles: (files: FileList | File[]) => void
  onRemoveFile: (id: string) => void
  onCancel: () => void
  onReview: () => void
  headingRef: React.RefObject<HTMLHeadingElement | null>
}

const STATUS_TEXT: Record<SessionFile['status'], string> = {
  checking: 'Checking…',
  queued: 'Waiting',
  reading: 'Reading',
  done: 'Ready',
  error: 'Cannot use this file',
  duplicate: 'Already imported',
  cancelled: 'Cancelled',
}

export function ImportPanel({
  files,
  stage,
  message,
  analysisProgress,
  onAddFiles,
  onRemoveFile,
  onCancel,
  onReview,
  headingRef,
}: ImportPanelProps) {
  const input = useRef<HTMLInputElement>(null)
  // Fetch the PDF reader now, while connected, so importing needs no further requests.
  useEffect(() => {
    void warmPdf().catch(() => undefined)
  }, [])
  const [over, setOver] = useState(false)
  const ready = files.filter((f) => f.status === 'done').length
  const busy = files.some(
    (f) => f.status === 'checking' || f.status === 'queued' || f.status === 'reading',
  )
  const analysing = stage === 'analysing'

  const summary = analysing
    ? `Analysing your notes on this device… ${analysisProgress ? `page ${analysisProgress.done} of ${analysisProgress.total}` : ''}`
    : busy
      ? 'Reading your files on this device…'
      : files.length === 0
        ? ''
        : `${ready} file${ready === 1 ? '' : 's'} ready to review.`

  return (
    <div className={styles.stack}>
      <h3 className={styles.heading} tabIndex={-1} ref={headingRef}>
        Import your notes
      </h3>

      <div className={`${styles.callout} ${styles.calloutInfo}`} role="note">
        <strong>Private by design.</strong> Your notes are processed on this device. They are not
        uploaded to an AI service or made public. Imported collections remain in this browser unless
        you export them. (Browser storage is not encrypted, so avoid importing anything you would
        not want other people using this browser profile to see.)
      </div>

      <div
        className={`${styles.dropzone} ${over ? styles.dropzoneActive : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          if (e.dataTransfer.files.length) onAddFiles(e.dataTransfer.files)
        }}
      >
        <strong>Drag files here</strong>
        <span className={styles.small}>or</span>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => input.current?.click()}
          disabled={analysing}
        >
          Choose files…
        </button>
        <input
          ref={input}
          type="file"
          multiple
          accept=".pdf,.txt,.md,.markdown,application/pdf,text/plain,text/markdown"
          className={styles.srOnly}
          tabIndex={-1}
          aria-label="Choose note files to import"
          onChange={(e) => {
            if (e.target.files?.length) onAddFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <span className={styles.small}>
          Text-based PDF, .txt and .md files · up to {DEFAULT_LIMITS.maxFiles} files,{' '}
          {Math.round(DEFAULT_LIMITS.maxFileBytes / 1048576)} MB and {DEFAULT_LIMITS.maxPages} pages
          each
        </span>
      </div>

      <details>
        <summary>What can I import?</summary>
        <ul className={styles.sub}>
          <li>
            <strong>Text-based PDFs</strong> (lecture slides, articles, typed notes saved as PDF).
            Scanned pages that are only pictures cannot be read yet; on-device OCR is not available.
          </li>
          <li>
            <strong>.txt and .md</strong> notes. Headings, paragraphs and lists are kept.
          </li>
          <li>
            <strong>Word (.docx)</strong> is not supported yet. Export it as a PDF, or save it as a
            text file.
          </li>
          <li>
            Very large files (over {Math.round(DEFAULT_LIMITS.warnFileBytes / 1048576)} MB) can take
            a while. You can cancel at any time.
          </li>
        </ul>
      </details>

      {message && (
        <p className={`${styles.callout} ${styles.calloutWarn}`} role="alert">
          {message}
        </p>
      )}

      {files.length > 0 && (
        <ul className={styles.fileList} aria-label="Files in this import">
          {files.map((f) => (
            <li key={f.id} className={styles.file}>
              <div className={styles.fileHead}>
                <span className={styles.fileName}>{f.name}</span>
                <span className={styles.small}>
                  {(f.file.size / 1024).toFixed(0)} KB · {STATUS_TEXT[f.status]}
                </span>
              </div>
              {(f.status === 'reading' || f.status === 'done') && f.total > 0 && (
                <progress
                  className={styles.progress}
                  max={f.total}
                  value={f.progress}
                  aria-label={`Reading ${f.name}: page ${f.progress} of ${f.total}`}
                />
              )}
              {f.warning && <span className={styles.small}>{f.warning}</span>}
              {f.doc &&
                f.doc.warnings.map((w) => (
                  <span key={w} className={styles.small}>
                    {w}
                  </span>
                ))}
              {f.error && f.status !== 'cancelled' && (
                <span className={f.status === 'duplicate' ? styles.small : styles.errorText}>
                  {f.error}
                </span>
              )}
              <div className={styles.row}>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => onRemoveFile(f.id)}
                  aria-label={`Remove ${f.name}`}
                >
                  {f.status === 'reading' || f.status === 'queued'
                    ? 'Cancel this file'
                    : 'Remove file'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div role="status" aria-live="polite" className={styles.small}>
        {summary}
      </div>
      {analysing && analysisProgress && (
        <progress
          className={styles.progress}
          max={Math.max(1, analysisProgress.total)}
          value={analysisProgress.done}
          aria-label={`Analysing: page ${analysisProgress.done} of ${analysisProgress.total}`}
        />
      )}

      <div className={styles.row}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={ready === 0 || busy || analysing}
          onClick={onReview}
        >
          Review extracted material
        </button>
        {(busy || analysing) && (
          <button type="button" className={styles.btn} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
