import { useCallback, useEffect, useState } from 'react'

export interface NotebookItem {
  entryId: string
  note: string
  savedAt: string
}

const STORAGE_KEY = 'atlas-notebook'

function isNotebookItem(v: unknown): v is NotebookItem {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return typeof o.entryId === 'string' && o.entryId.length > 0
}

/** Reads saved items, tolerating missing, corrupt or older-shaped data. */
export function readNotebook(): NotebookItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    const seen = new Set<string>()
    const items: NotebookItem[] = []
    for (const raw of parsed) {
      if (!isNotebookItem(raw) || seen.has(raw.entryId)) continue
      seen.add(raw.entryId)
      const o = raw as unknown as Record<string, unknown>
      items.push({
        entryId: raw.entryId,
        note: typeof o.note === 'string' ? o.note : '',
        savedAt: typeof o.savedAt === 'string' ? o.savedAt : new Date(0).toISOString(),
      })
    }
    return items
  } catch {
    return []
  }
}

function write(items: NotebookItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore (private browsing / storage blocked)
  }
}

export function useNotebook() {
  const [items, setItems] = useState<NotebookItem[]>(() => readNotebook())

  useEffect(() => {
    write(items)
  }, [items])

  const isSaved = useCallback(
    (entryId: string) => items.some((i) => i.entryId === entryId),
    [items],
  )

  const toggleSave = useCallback((entryId: string) => {
    setItems((prev) =>
      prev.some((i) => i.entryId === entryId)
        ? prev.filter((i) => i.entryId !== entryId)
        : [...prev, { entryId, note: '', savedAt: new Date().toISOString() }],
    )
  }, [])

  const updateNote = useCallback((entryId: string, note: string) => {
    setItems((prev) => prev.map((i) => (i.entryId === entryId ? { ...i, note } : i)))
  }, [])

  const remove = useCallback((entryId: string) => {
    setItems((prev) => prev.filter((i) => i.entryId !== entryId))
  }, [])

  const clearAll = useCallback(() => setItems([]), [])

  return { items, isSaved, toggleSave, updateNote, remove, clearAll }
}
