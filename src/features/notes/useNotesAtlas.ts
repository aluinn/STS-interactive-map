import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  confirmItem,
  confirmRelationship,
  createCollection,
  parseProjectFile,
  removeDocument,
  removeItem,
  removeRelationship,
} from './collection'
import { openStore, StorageError, type NotesStore } from './storage/store'
import { deleteDatabase } from './storage/store'
import { personalAtlas, type PersonalAtlas } from './toEntries'
import type { PersonalCollection } from './types'

/** `curated` is the shared General Notes atlas; `mine` is the visitor's own notes map. */
export type CollectionMode = 'curated' | 'mine'

const MODE_KEY = 'atlas-collection-mode'
const ACTIVE_KEY = 'atlas-active-collection'

function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function writeLocal(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Storage may be blocked; the choice then lasts for this visit only.
  }
}

export interface NotesAtlas {
  mode: CollectionMode
  setMode: (m: CollectionMode) => void
  /** True until the stored collections have been read. */
  loading: boolean
  /** False when collections cannot be kept after this visit. */
  persistent: boolean
  collections: PersonalCollection[]
  active: PersonalCollection | null
  setActive: (id: string) => void
  atlas: PersonalAtlas
  /** Plain-language problem with storage, or null. */
  problem: string | null
  skipped: { id: string; reason: string }[]
  dismissProblem: () => void
  /** Saves (creating or replacing) a collection and makes it the active one. */
  saveCollection: (c: PersonalCollection) => Promise<boolean>
  newCollection: (name: string) => Promise<PersonalCollection | null>
  deleteCollection: (id: string) => Promise<void>
  clearEverything: () => Promise<void>
  renameCollection: (id: string, name: string) => Promise<void>
  deleteDocument: (collectionId: string, docId: string) => Promise<void>
  deleteItem: (collectionId: string, itemId: string) => Promise<void>
  confirmItemById: (collectionId: string, itemId: string) => Promise<void>
  confirmRel: (collectionId: string, relId: string) => Promise<void>
  removeRel: (collectionId: string, relId: string) => Promise<void>
  importProject: (text: string) => Promise<PersonalCollection>
}

/**
 * Personal collections: load from this device, keep the active one, and offer
 * the General Notes / Your Notes choice (two separate maps, never merged). Nothing here touches
 * the network.
 */
export function useNotesAtlas(): NotesAtlas {
  const [mode, setModeState] = useState<CollectionMode>(() => {
    const v = readLocal(MODE_KEY)
    return v === 'mine' ? v : 'curated'
  })
  const [collections, setCollections] = useState<PersonalCollection[]>([])
  const [activeId, setActiveId] = useState<string | null>(() => readLocal(ACTIVE_KEY))
  const [loading, setLoading] = useState(true)
  const [persistent, setPersistent] = useState(true)
  const [problem, setProblem] = useState<string | null>(null)
  const [skipped, setSkipped] = useState<{ id: string; reason: string }[]>([])
  const storeRef = useRef<NotesStore | null>(null)
  const storePromise = useRef<Promise<NotesStore> | null>(null)

  const getStore = useCallback(() => {
    storePromise.current ??= openStore().then((s) => {
      storeRef.current = s
      setPersistent(s.persistent)
      return s
    })
    return storePromise.current
  }, [])

  useEffect(() => {
    let cancelled = false
    getStore()
      .then((s) => s.load())
      .then((report) => {
        if (cancelled) return
        setCollections(report.collections)
        setSkipped(report.skipped)
      })
      .catch(() => {
        if (!cancelled)
          setProblem(
            'Your saved collections could not be read. They may be unavailable in this browser mode.',
          )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [getStore])

  const setMode = useCallback((m: CollectionMode) => {
    setModeState(m)
    writeLocal(MODE_KEY, m === 'curated' ? null : m)
  }, [])

  const active = useMemo(
    () => collections.find((c) => c.id === activeId) ?? collections[0] ?? null,
    [collections, activeId],
  )
  const atlas = useMemo(() => personalAtlas(active), [active])

  const setActive = useCallback((id: string) => {
    setActiveId(id)
    writeLocal(ACTIVE_KEY, id)
  }, [])

  const describe = (e: unknown): string => {
    if (e instanceof StorageError && e.problem === 'quota') {
      return 'There is not enough storage space on this device to save this. Delete a document or collection you no longer need, or export your project file first.'
    }
    return 'This could not be saved on this device. Your changes are still shown, but may be lost when you close the page. Export your project file to keep them.'
  }

  const persist = useCallback(
    async (next: PersonalCollection): Promise<boolean> => {
      setCollections((cs) =>
        cs.some((c) => c.id === next.id)
          ? cs.map((c) => (c.id === next.id ? next : c))
          : [...cs, next],
      )
      try {
        const store = await getStore()
        await store.save(next)
        return store.persistent
      } catch (e) {
        setProblem(describe(e))
        return false
      }
    },
    [getStore],
  )

  const saveCollection = useCallback(
    async (c: PersonalCollection) => {
      const ok = await persist(c)
      setActive(c.id)
      return ok
    },
    [persist, setActive],
  )

  const mutate = useCallback(
    async (id: string, fn: (c: PersonalCollection) => PersonalCollection) => {
      const current = collections.find((c) => c.id === id)
      if (current) await persist(fn(current))
    },
    [collections, persist],
  )

  const newCollection = useCallback(
    async (name: string) => {
      const c = createCollection(name)
      await persist(c)
      setActive(c.id)
      return c
    },
    [persist, setActive],
  )

  const deleteCollection = useCallback(
    async (id: string) => {
      setCollections((cs) => cs.filter((c) => c.id !== id))
      try {
        await (await getStore()).remove(id)
      } catch (e) {
        setProblem(describe(e))
      }
    },
    [getStore],
  )

  const clearEverything = useCallback(async () => {
    setCollections([])
    setActiveId(null)
    writeLocal(ACTIVE_KEY, null)
    writeLocal(MODE_KEY, null)
    setModeState('curated')
    try {
      const store = await getStore()
      await store.clearAll()
      if (store.persistent) {
        // Release the database itself once nothing is using it.
        store.close()
        storePromise.current = null
        storeRef.current = null
        await deleteDatabase()
      }
    } catch (e) {
      setProblem(describe(e))
    }
  }, [getStore])

  const importProject = useCallback(
    async (text: string) => {
      const c = parseProjectFile(text)
      await persist(c)
      setActive(c.id)
      return c
    },
    [persist, setActive],
  )

  return {
    mode,
    setMode,
    loading,
    persistent,
    collections,
    active,
    setActive,
    atlas,
    problem,
    skipped,
    dismissProblem: () => setProblem(null),
    saveCollection,
    newCollection,
    deleteCollection,
    clearEverything,
    renameCollection: (id, name) =>
      mutate(id, (c) => ({
        ...c,
        name: name.trim().slice(0, 120) || c.name,
        updatedAt: new Date().toISOString(),
      })),
    deleteDocument: (cid, docId) => mutate(cid, (c) => removeDocument(c, docId)),
    deleteItem: (cid, itemId) => mutate(cid, (c) => removeItem(c, itemId)),
    confirmItemById: (cid, itemId) => mutate(cid, (c) => confirmItem(c, itemId)),
    confirmRel: (cid, relId) => mutate(cid, (c) => confirmRelationship(c, relId)),
    removeRel: (cid, relId) => mutate(cid, (c) => removeRelationship(c, relId)),
    importProject,
  }
}
