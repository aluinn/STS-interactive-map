const heading = {
  color: 'var(--color-oxidised-green-bright)',
  fontSize: '0.85rem',
  textTransform: 'uppercase' as const,
}

const ITEMS: { title: string; text: string }[] = [
  {
    title: 'Main views',
    text: 'Atlas maps people, events, ideas and institutions. Timeline arranges them across periods. Debates sets out competing positions in philosophy of science. Paths offers curated journeys through connected entries.',
  },
  {
    title: 'Map controls',
    text: 'Drag to move and scroll, pinch or use the + and − buttons to zoom. Select a marker to open its entry; select a numbered bubble to see the grouped entries by country. Curved routes are documented relationships. The list-view button gives a keyboard- and screen-reader-friendly alternative.',
  },
  {
    title: 'Period slider',
    text: 'All Time shows everything; a period shows its entries and changes the look of the interface. Historical echoes keep the previous period faintly visible, Play steps through the periods, and the latest period uses a modern globe. Period boundaries are approximate.',
  },
  {
    title: 'Search and filters',
    text: 'Narrow the atlas by subject area, entry type, historical grouping, date, region, evidence status, theme and relationship type. On small screens, open them with “Show filters & legend”. The legend explains markers and lines.',
  },
  {
    title: 'Entry details',
    text: 'An entry can include a description, philosophical questions, evidence and theory status, related entries, documented relationships, sources, guided journeys and a bookmark button.',
  },
  {
    title: 'Your Notes',
    text: 'Import text-based PDFs, .txt or .md files to build a separate, private atlas. Files are read on this device and are not uploaded. Your material is always labelled apart from the curated entries.',
  },
  {
    title: 'Notebook',
    text: 'The Notebook keeps entries you bookmark and any private notes you write, in this browser only.',
  },
  {
    title: 'Accessibility options',
    text: 'Light and dark mode, and a consistent theme (in the time-travel settings) that replaces the period looks with one steady, high-contrast design. Motion respects your system’s reduced-motion setting. Every dialog closes with Escape.',
  },
]

/** A static summary of how to use the atlas; stays available after the tour. */
export function QuickReference({ onStartGuide }: { onStartGuide?: () => void }) {
  return (
    <section aria-labelledby="how-to-use-title">
      <h3 id="how-to-use-title" style={heading}>
        How to use the atlas
      </h3>
      <dl style={{ display: 'grid', gap: '0.6rem', margin: '0.5rem 0' }}>
        {ITEMS.map((i) => (
          <div key={i.title}>
            <dt style={{ color: 'var(--color-ink)', fontWeight: 600 }}>{i.title}</dt>
            <dd style={{ margin: 0 }}>{i.text}</dd>
          </div>
        ))}
      </dl>
      {onStartGuide && (
        <button
          type="button"
          onClick={onStartGuide}
          style={{
            border: '1px solid var(--color-border-strong)',
            background: 'var(--color-bg)',
            color: 'var(--color-ink)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.9rem',
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          Start the guided tour
        </button>
      )}
    </section>
  )
}
