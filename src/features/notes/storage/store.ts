import { sanitiseCollection, UnsupportedVersionError } from '../collection'
import type { PersonalCollection } from '../types'

/**
 * Local storage for personal collections.
 *
 * Collections live in IndexedDB, in this browser only. Nothing is sent
 * anywhere. If IndexedDB is unavailable (some private-browsing modes,
 * blocked site data) an in-memory store is used and the UI says that
 * collections will not survive a reload.
 */

export type StorageProblem = 'quota' | 'unavailable' | 'failed'

export class StorageError extends Error {
  problem: StorageProblem
  constructor(problem: StorageProblem, message: string) {
    super(message)
    this.name = 'StorageError'
    this.problem = problem
  }
}

export interface LoadReport {
  collections: PersonalCollection[]
  /** Records that could not be read (damaged, or from a newer version). */
  skipped: { id: string; reason: string }[]
}

export interface NotesStore {
  /** False for the in-memory fallback. */
  persistent: boolean
  load(): Promise<LoadReport>
  save(collection: PersonalCollection): Promise<void>
  remove(id: string): Promise<void>
  clearAll(): Promise<void>
  /** Releases the database connection (needed before deleting the database). */
  close(): void
}

const DB_NAME = 'sts-atlas-notes'
const DB_VERSION = 1
const STORE = 'collections'

function isQuotaError(e: unknown): boolean {
  return (
    e instanceof DOMException &&
    (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  )
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new StorageError('unavailable', 'IndexedDB is not available in this browser.'))
      return
    }
    let req: IDBOpenDBRequest
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION)
    } catch (e) {
      reject(new StorageError('unavailable', e instanceof Error ? e.message : 'IndexedDB failed.'))
      return
    }
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () =>
      reject(
        new StorageError('unavailable', req.error?.message ?? 'IndexedDB could not be opened.'),
      )
    req.onblocked = () =>
      reject(new StorageError('unavailable', 'Storage is blocked by another open tab.'))
  })
}

function tx<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    let result: T | undefined
    let transaction: IDBTransaction
    try {
      transaction = db.transaction(STORE, mode)
    } catch (e) {
      reject(new StorageError('failed', e instanceof Error ? e.message : 'Transaction failed.'))
      return
    }
    const request = run(transaction.objectStore(STORE))
    if (request) request.onsuccess = () => (result = request.result)
    transaction.oncomplete = () => resolve(result)
    transaction.onabort = () => {
      const err = transaction.error
      reject(
        isQuotaError(err)
          ? new StorageError('quota', 'There is not enough storage space on this device.')
          : new StorageError('failed', err?.message ?? 'The save was interrupted.'),
      )
    }
    transaction.onerror = () => undefined
  })
}

export async function openIndexedDbStore(): Promise<NotesStore> {
  const db = await openDb()
  return {
    persistent: true,
    async load() {
      const rows = (await tx<unknown[]>(db, 'readonly', (s) => s.getAll())) ?? []
      const report: LoadReport = { collections: [], skipped: [] }
      for (const raw of rows) {
        try {
          report.collections.push(sanitiseCollection(raw))
        } catch (e) {
          const id =
            typeof raw === 'object' && raw && 'id' in raw
              ? String((raw as { id: unknown }).id)
              : '?'
          report.skipped.push({
            id,
            reason:
              e instanceof UnsupportedVersionError
                ? 'It was saved by a newer version of the atlas.'
                : 'The saved data is damaged.',
          })
        }
      }
      return report
    },
    async save(collection) {
      try {
        await tx(db, 'readwrite', (s) => s.put(collection))
      } catch (e) {
        if (e instanceof StorageError) throw e
        throw new StorageError(
          isQuotaError(e) ? 'quota' : 'failed',
          'The collection could not be saved.',
        )
      }
    },
    async remove(id) {
      await tx(db, 'readwrite', (s) => s.delete(id))
    },
    async clearAll() {
      await tx(db, 'readwrite', (s) => s.clear())
    },
    close() {
      db.close()
    },
  }
}

export function createMemoryStore(): NotesStore {
  const rows = new Map<string, PersonalCollection>()
  return {
    persistent: false,
    async load() {
      return { collections: [...rows.values()], skipped: [] }
    },
    async save(c) {
      rows.set(c.id, structuredClone(c))
    },
    async remove(id) {
      rows.delete(id)
    },
    async clearAll() {
      rows.clear()
    },
    close() {},
  }
}

/** The best store available: IndexedDB when it works, otherwise memory only. */
export async function openStore(): Promise<NotesStore> {
  try {
    return await openIndexedDbStore()
  } catch {
    return createMemoryStore()
  }
}

/** Deletes the whole database, used by "clear all personal atlas data". */
export function deleteDatabase(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve()
    const req = indexedDB.deleteDatabase(DB_NAME)
    req.onsuccess = () => resolve()
    req.onerror = () => resolve()
    req.onblocked = () => resolve()
  })
}
