import { useRef, useState } from 'react'
import type { Entry } from '../../../types'
import { buildProjectFile, describeDocumentRemoval, ValidationError } from '../collection'
import {
  downloadText,
  entrySummary,
  markdownReadingList,
  safeDownloadName,
  sourceList,
  unresolvedReport,
} from '../exports'
import type { Appearance } from '../useNotesPrefs'
import type { NotesAtlas } from '../useNotesAtlas'
import styles from './notes.module.css'

type Confirm =
  | { kind: 'document'; collectionId: string; id: string; name: string }
  | { kind: 'collection'; id: string; name: string }
  | { kind: 'everything' }
  | null

interface NotesManagerProps {
  notes: NotesAtlas
  curated: Entry[]
  appearance: Appearance
  onAppearance: (a: Appearance) => void
  onResetSettings: () => void
  onImport: () => void
  headingRef: React.RefObject<HTMLHeadingElement | null>
}

export function NotesManager({
  notes,
  curated,
  appearance,
  onAppearance,
  onResetSettings,
  onImport,
  headingRef,
}: NotesManagerProps) {
  const [confirm, setConfirm] = useState<Confirm>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const active = notes.active

  async function onProjectFile(file: File | undefined) {
    if (!file) return
    setError('')
    setMessage('')
    if (file.size > 25 * 1024 * 1024) {
      setError('That file is too large to be an atlas project file.')
      return
    }
    try {
      const text = await file.text()
      const c = await notes.importProject(text)
      setMessage(`Restored “${c.name}” with ${c.items.length} entries as a new collection.`)
    } catch (e) {
      setError(
        e instanceof ValidationError
          ? e.message
          : 'That file could not be read as an atlas project file.',
      )
    }
  }

  const removal =
    confirm?.kind === 'document'
      ? (() => {
          const c = notes.collections.find((x) => x.id === confirm.collectionId)
          return c ? describeDocumentRemoval(c, confirm.id) : null
        })()
      : null

  return (
    <div className={styles.stack}>
      <h3 className={styles.heading} tabIndex={-1} ref={headingRef}>
        Your Notes
      </h3>

      <div className={`${styles.callout} ${styles.calloutInfo}`}>
        <strong>What stays on this device.</strong> For each item you accept: its title, date,
        place, your edits and the short passages that support it, plus the name, title and page
        count of the file it came from. The original files and the rest of your text are{' '}
        <em>not</em> kept. Everything is stored in this browser only (IndexedDB, not encrypted) and
        is never uploaded. Export it if you want a backup.
      </div>

      {!notes.persistent && (
        <p className={`${styles.callout} ${styles.calloutWarn}`} role="alert">
          This browser is not allowing the atlas to save data (for example in a private window).
          Your collections will disappear when you close or reload the page. Export a project file
          to keep your work.
        </p>
      )}
      {notes.problem && (
        <p className={`${styles.callout} ${styles.calloutWarn}`} role="alert">
          {notes.problem}{' '}
          <button type="button" className={styles.btn} onClick={notes.dismissProblem}>
            Dismiss
          </button>
        </p>
      )}
      {notes.skipped.length > 0 && (
        <p className={`${styles.callout} ${styles.calloutWarn}`} role="alert">
          {notes.skipped.length} saved collection{notes.skipped.length === 1 ? ' was' : 's were'}{' '}
          skipped because {notes.skipped[0].reason.toLowerCase()} Your other collections are
          unaffected.
        </p>
      )}
      {message && (
        <p className={styles.callout} role="status">
          {message}
        </p>
      )}
      {error && (
        <p className={`${styles.callout} ${styles.calloutWarn}`} role="alert">
          {error}
        </p>
      )}

      <div className={styles.row}>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onImport}>
          Import notes…
        </button>
        <button type="button" className={styles.btn} onClick={() => fileInput.current?.click()}>
          Restore from a project file…
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          className={styles.srOnly}
          tabIndex={-1}
          aria-label="Choose an atlas project file to restore"
          onChange={(e) => {
            void onProjectFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>

      {notes.loading ? (
        <p className={styles.sub}>Looking for collections saved on this device…</p>
      ) : notes.collections.length === 0 ? (
        <p className={styles.sub}>
          You have no personal collections yet. Import some notes to build one, or restore a project
          file you exported earlier.
        </p>
      ) : (
        <section className={styles.section} aria-label="Collections">
          <h4 className={styles.heading}>Collections</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Entries</th>
                <th scope="col">Documents</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.collections.map((c) => (
                <tr key={c.id}>
                  <th scope="row">
                    <label>
                      <input
                        type="radio"
                        name="active-collection"
                        checked={active?.id === c.id}
                        onChange={() => notes.setActive(c.id)}
                      />{' '}
                      {c.name}
                    </label>
                  </th>
                  <td>{c.items.length + c.links.length}</td>
                  <td>{c.documents.length}</td>
                  <td>
                    <div className={styles.row}>
                      <button
                        type="button"
                        className={styles.btn}
                        onClick={() => {
                          const name = window.prompt('Rename this collection', c.name)
                          if (name?.trim()) void notes.renameCollection(c.id, name)
                        }}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className={styles.btn}
                        onClick={() =>
                          downloadText(
                            safeDownloadName(c.name, 'atlas.json'),
                            JSON.stringify(buildProjectFile(c), null, 2),
                            'application/json',
                          )
                        }
                      >
                        Export project
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={() => setConfirm({ kind: 'collection', id: c.id, name: c.name })}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {active && (
        <>
          <section className={styles.section} aria-label="Documents in the active collection">
            <h4 className={styles.heading}>Documents in “{active.name}”</h4>
            {active.documents.length === 0 ? (
              <p className={styles.sub}>No documents.</p>
            ) : (
              <ul className={styles.cards}>
                {active.documents.map((d) => (
                  <li key={d.id} className={styles.card}>
                    <div className={styles.cardHead}>
                      <p className={styles.cardTitle}>{d.title}</p>
                      <span className={styles.small}>
                        {d.fileName} · {d.kind.toUpperCase()} · {d.pageCount} page
                        {d.pageCount === 1 ? '' : 's'} · imported {d.importedAt.slice(0, 10)}
                      </span>
                    </div>
                    <div className={styles.row}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={() =>
                          setConfirm({
                            kind: 'document',
                            collectionId: active.id,
                            id: d.id,
                            name: d.title,
                          })
                        }
                      >
                        Delete this document
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Suggestions notes={notes} />

          <section className={styles.section} aria-label="Export">
            <h4 className={styles.heading}>Export “{active.name}”</h4>
            <p className={styles.small}>
              Exports contain only what you accepted. The original files are never included.
            </p>
            <div className={styles.row}>
              <button
                type="button"
                className={styles.btn}
                onClick={() =>
                  downloadText(
                    safeDownloadName(active.name, 'reading-list.md'),
                    markdownReadingList(active, curated),
                    'text/markdown',
                  )
                }
              >
                Markdown reading list
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={() =>
                  downloadText(
                    safeDownloadName(active.name, 'sources.md'),
                    sourceList(active),
                    'text/markdown',
                  )
                }
              >
                Source list
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={() =>
                  downloadText(
                    safeDownloadName(active.name, 'entries.tsv'),
                    entrySummary(active),
                    'text/tab-separated-values',
                  )
                }
              >
                Entry summary (spreadsheet)
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={() =>
                  downloadText(
                    safeDownloadName(active.name, 'unresolved.md'),
                    unresolvedReport(active),
                    'text/markdown',
                  )
                }
              >
                Unresolved-items report
              </button>
            </div>
          </section>
        </>
      )}

      <section className={styles.section} aria-label="Appearance">
        <h4 className={styles.heading}>Appearance</h4>
        <label className={styles.label}>
          How the interface follows your notes
          <select
            className={styles.select}
            value={appearance}
            onChange={(e) => onAppearance(e.target.value as Appearance)}
          >
            <option value="adaptive">Adaptive: open on the period your notes concentrate on</option>
            <option value="manual">
              Manual: I choose the period myself (period themes stay on)
            </option>
            <option value="consistent">Consistent accessible theme (no period themes)</option>
          </select>
        </label>
      </section>

      <section className={styles.section} aria-label="Reset and delete">
        <h4 className={styles.heading}>Reset and delete</h4>
        <div className={styles.row}>
          <button type="button" className={styles.btn} onClick={onResetSettings}>
            Reset appearance and collection choices
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            disabled={notes.collections.length === 0}
            onClick={() => setConfirm({ kind: 'everything' })}
          >
            Clear all personal atlas data
          </button>
        </div>
      </section>

      {confirm && (
        <div
          className={`${styles.callout} ${styles.calloutWarn}`}
          role="alertdialog"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-body"
        >
          <strong id="confirm-title">
            {confirm.kind === 'document' && `Delete “${confirm.name}”?`}
            {confirm.kind === 'collection' && `Delete the collection “${confirm.name}”?`}
            {confirm.kind === 'everything' && 'Clear all personal atlas data?'}
          </strong>
          <p id="confirm-body">
            {confirm.kind === 'document' &&
              removal &&
              `This removes the document from this collection, ${removal.items} entr${removal.items === 1 ? 'y' : 'ies'} that came only from it, ${removal.links} link${removal.links === 1 ? '' : 's'} to curated entries and ${removal.relationships} relationship${removal.relationships === 1 ? '' : 's'}. ${removal.sharedItems} entr${removal.sharedItems === 1 ? 'y' : 'ies'} also supported by other documents will stay, with their other passages. Curated atlas content is not affected.`}
            {confirm.kind === 'collection' &&
              'This removes every entry, link, relationship and document record in this collection from this device. Export a project file first if you may want it back. Curated atlas content is not affected.'}
            {confirm.kind === 'everything' &&
              `This removes all ${notes.collections.length} personal collection${notes.collections.length === 1 ? '' : 's'} and their saved settings from this browser. It cannot be undone. Export project files first if you may want them back.`}
          </p>
          <div className={styles.row}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={async () => {
                if (confirm.kind === 'document')
                  await notes.deleteDocument(confirm.collectionId, confirm.id)
                else if (confirm.kind === 'collection') await notes.deleteCollection(confirm.id)
                else await notes.clearEverything()
                setMessage('Deleted.')
                setConfirm(null)
              }}
            >
              Yes, delete
            </button>
            <button type="button" className={styles.btn} onClick={() => setConfirm(null)}>
              Keep it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/** Unreviewed suggestions and unconfirmed relationships can be resolved here after import. */
function Suggestions({ notes }: { notes: NotesAtlas }) {
  const c = notes.active
  if (!c) return null
  const pending = c.items.filter((i) => i.status !== 'user-confirmed')
  const rels = c.relationships.filter((r) => r.status === 'proposed')
  if (pending.length === 0 && rels.length === 0) return null
  return (
    <section className={styles.section} aria-label="Items to review">
      <h4 className={styles.heading}>Still to review</h4>
      <ul className={styles.cards}>
        {pending.slice(0, 40).map((i) => (
          <li key={i.id} className={styles.card}>
            <div className={styles.cardHead}>
              <p className={styles.cardTitle}>{i.title}</p>
              <span
                className={`${styles.badge} ${i.status === 'needs-review' ? styles.badgeUnreviewed : styles.badgeImported}`}
              >
                {i.status === 'needs-review'
                  ? 'Needs review'
                  : 'Imported, not individually reviewed'}
              </span>
            </div>
            {i.mentions[0] && (
              <blockquote className={styles.quote}>“{i.mentions[0].passage}”</blockquote>
            )}
            <div className={styles.row}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => void notes.confirmItemById(c.id, i.id)}
              >
                Confirm
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => void notes.deleteItem(c.id, i.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {rels.slice(0, 40).map((r) => (
          <li key={r.id} className={styles.card}>
            <div className={styles.cardHead}>
              <p className={styles.cardTitle}>Proposed: {r.type.replace(/-/g, ' ')}</p>
              <span className={`${styles.badge} ${styles.badgeUnreviewed}`}>Proposed</span>
            </div>
            <blockquote className={styles.quote}>“{r.mention.passage}”</blockquote>
            <div className={styles.row}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => void notes.confirmRel(c.id, r.id)}
              >
                Confirm
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => void notes.removeRel(c.id, r.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
