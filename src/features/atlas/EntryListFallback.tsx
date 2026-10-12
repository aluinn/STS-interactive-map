import type { Entry } from '../../types'

export function EntryListFallback({
  entries,
  onSelectEntry,
  selectedEntryId,
}: {
  entries: Entry[]
  onSelectEntry: (id: string) => void
  selectedEntryId: string | null
}) {
  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 'var(--space-4)' }}>
      <h3 style={{ marginTop: 0 }}>Entries ({entries.length})</h3>
      <ul
        style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-2)' }}
      >
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              aria-current={entry.id === selectedEntryId}
              onClick={() => onSelectEntry(entry.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                background:
                  entry.id === selectedEntryId
                    ? 'var(--color-parchment-elevated)'
                    : 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                color: 'var(--color-ink)',
                cursor: 'pointer',
                font: 'inherit',
              }}
            >
              <strong style={{ fontFamily: 'var(--font-display)' }}>{entry.title}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-dim)' }}>
                {entry.kind} · {entry.dateDisplay}
                {entry.places[0] ? ` · ${entry.places[0].name}` : ''}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
