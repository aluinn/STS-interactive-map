import type { EntryKind, Period, RelationshipType } from '../types'
import type { Filters } from '../hooks/useUrlState'
import { defaultFilters } from '../hooks/useUrlState'
import { ALL_THEMES } from '../utils/filterEntries'
import styles from './SearchFilters.module.css'

interface SearchFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
  resultCount: number
}

const KIND_OPTIONS: EntryKind[] = [
  'person',
  'idea',
  'discovery',
  'experiment',
  'instrument',
  'text',
  'institution',
  'event',
  'debate',
]
const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'ancient', label: 'Ancient' },
  { value: 'classical', label: 'Classical' },
  { value: 'medieval-translation', label: 'Medieval & translation' },
  { value: 'renaissance', label: 'Renaissance' },
  { value: 'early-modern', label: 'Early modern' },
  { value: 'enlightenment', label: 'Enlightenment' },
  { value: 'industrial-imperial', label: 'Industrial & imperial' },
  { value: 'professional-science', label: 'Professional science' },
  { value: 'war-and-big-science', label: 'War & Big Science' },
  { value: 'cold-war', label: 'Cold War' },
  { value: 'environmental-contemporary', label: 'Environmental & contemporary' },
  { value: 'philosophy-of-science', label: 'Philosophy of science' },
]

const RELATIONSHIP_TYPE_OPTIONS: RelationshipType[] = [
  'influenced',
  'taught',
  'translated',
  'corresponded',
  'travelled',
  'collaborated',
  'criticised',
  'supported',
  'challenged',
  'replaced',
  'preserved',
  'funded',
  'appropriated',
  'excluded',
  'extracted',
  'institutionalised',
  'independently-developed',
  'commercialised',
  'regulated',
  'co-produced',
  'represented',
  'materially-enabled',
  'contested',
  'revised',
  'applied-to',
]

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function SearchFilters({ filters, onChange, resultCount }: SearchFiltersProps) {
  return (
    <div className={styles.panel} role="search" aria-label="Search and filter the atlas">
      <input
        type="search"
        className={styles.searchInput}
        placeholder="Search people, places, ideas, debates…"
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
        aria-label="Search entries"
      />

      <div className={styles.group}>
        <span className={styles.groupLabel}>Entry type</span>
        <div className={styles.chipRow}>
          {KIND_OPTIONS.map((kind) => (
            <button
              key={kind}
              type="button"
              className={`${styles.chip} ${filters.kinds.includes(kind) ? styles.chipActive : ''}`}
              aria-pressed={filters.kinds.includes(kind)}
              onClick={() => onChange({ ...filters, kinds: toggle(filters.kinds, kind) })}
            >
              {kind}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Period</span>
        <div className={styles.chipRow}>
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`${styles.chip} ${filters.periods.includes(p.value) ? styles.chipActive : ''}`}
              aria-pressed={filters.periods.includes(p.value)}
              onClick={() => onChange({ ...filters, periods: toggle(filters.periods, p.value) })}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Date range (negative = BCE)</span>
        <div className={styles.yearRow}>
          <input
            type="number"
            className={styles.yearInput}
            placeholder="from"
            aria-label="Start year filter"
            value={filters.yearMin ?? ''}
            onChange={(e) =>
              onChange({ ...filters, yearMin: e.target.value ? Number(e.target.value) : null })
            }
          />
          <span>–</span>
          <input
            type="number"
            className={styles.yearInput}
            placeholder="to"
            aria-label="End year filter"
            value={filters.yearMax ?? ''}
            onChange={(e) =>
              onChange({ ...filters, yearMax: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>
      </div>

      <details>
        <summary className={styles.groupLabel} style={{ cursor: 'pointer' }}>
          Historical &amp; philosophical theme ({filters.themes.length || 'any'})
        </summary>
        <div className={styles.chipRow} style={{ marginTop: 6 }}>
          {ALL_THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              className={`${styles.chip} ${filters.themes.includes(theme) ? styles.chipActive : ''}`}
              aria-pressed={filters.themes.includes(theme)}
              onClick={() => onChange({ ...filters, themes: toggle(filters.themes, theme) })}
            >
              {theme.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </details>

      <details>
        <summary className={styles.groupLabel} style={{ cursor: 'pointer' }}>
          Relationship type ({filters.relationTypes.length || 'any'})
        </summary>
        <div className={styles.chipRow} style={{ marginTop: 6 }}>
          {RELATIONSHIP_TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.chip} ${filters.relationTypes.includes(type) ? styles.chipActive : ''}`}
              aria-pressed={filters.relationTypes.includes(type)}
              onClick={() =>
                onChange({ ...filters, relationTypes: toggle(filters.relationTypes, type) })
              }
            >
              {type.replace('-', ' ')}
            </button>
          ))}
        </div>
      </details>

      <label className={styles.toggleRow}>
        <input
          type="checkbox"
          checked={filters.onlyPhilosophy}
          onChange={(e) => onChange({ ...filters, onlyPhilosophy: e.target.checked })}
        />
        Only entries with a philosophical lens
      </label>
      <label className={styles.toggleRow}>
        <input
          type="checkbox"
          checked={filters.onlyContested}
          onChange={(e) => onChange({ ...filters, onlyContested: e.target.checked })}
        />
        Only contested or overturned theories
      </label>
      <label className={styles.toggleRow}>
        <input
          type="checkbox"
          checked={filters.onlyOverturned}
          onChange={(e) => onChange({ ...filters, onlyOverturned: e.target.checked })}
        />
        Only overturned &amp; rejected ideas
      </label>
      <label className={styles.toggleRow}>
        <input
          type="checkbox"
          checked={filters.onlyJourney}
          onChange={(e) => onChange({ ...filters, onlyJourney: e.target.checked })}
        />
        Only guided-journey stops
      </label>

      <span className={styles.resultCount}>{resultCount} entries match</span>

      <button type="button" className={styles.resetBtn} onClick={() => onChange(defaultFilters)}>
        Reset atlas
      </button>
    </div>
  )
}
