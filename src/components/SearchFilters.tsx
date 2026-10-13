import type { EntryKind, Period, RelationshipType } from '../types'
import type { Filters } from '../hooks/useUrlState'
import { defaultFilters } from '../hooks/useUrlState'
import { ALL_THEMES } from '../utils/filterEntries'
import { AREAS, REGIONS, EVIDENCE_LABELS, regionOf } from '../utils/areas'
import { dataBundle } from '../data'
import styles from './SearchFilters.module.css'

interface SearchFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
  resultCount: number
  /** Subject areas that stand out in the viewer's own notes, offered first. */
  suggestedAreas?: string[]
  /** Relationship types present only in the viewer's notes. */
  extraRelationshipTypes?: string[]
}

const ALL_KINDS: EntryKind[] = [
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

const ALL_RELATIONSHIP_TYPES: RelationshipType[] = [
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
  'worked-at',
  'published',
  'developed',
]

// Only offer filter choices that exist in the data; a chip that can only
// ever return zero results reads as a broken filter.
const presentKinds = new Set<string>(dataBundle.entries.map((e) => e.kind))
const presentThemes = new Set<string>(dataBundle.entries.flatMap((e) => e.themes))
const presentRelTypes = new Set<string>(dataBundle.relationships.map((r) => r.type))
const KIND_OPTIONS = ALL_KINDS.filter((k) => presentKinds.has(k))
const THEME_OPTIONS = [
  ...ALL_THEMES.filter((t) => presentThemes.has(t)),
  ...[...presentThemes].filter((t) => !ALL_THEMES.includes(t)).sort(),
]
const AREA_OPTIONS = AREAS.filter((a) => dataBundle.entries.some((e) => a.test(e)))
const presentRegions = new Set<string>(dataBundle.entries.map(regionOf))
const REGION_OPTIONS = REGIONS.filter((r) => presentRegions.has(r))
const presentEvidence = new Set<string>(
  dataBundle.entries.flatMap((e) => (e.evidenceStatus ? [e.evidenceStatus] : [])),
)
const EVIDENCE_OPTIONS = Object.entries(EVIDENCE_LABELS).filter(([k]) => presentEvidence.has(k))
const RELATIONSHIP_TYPE_OPTIONS = ALL_RELATIONSHIP_TYPES.filter((t) => presentRelTypes.has(t))

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function SearchFilters({
  filters,
  onChange,
  resultCount,
  suggestedAreas = [],
  extraRelationshipTypes = [],
}: SearchFiltersProps) {
  const areaOptions = [
    ...AREA_OPTIONS.filter((a) => suggestedAreas.includes(a.id)),
    ...AREA_OPTIONS.filter((a) => !suggestedAreas.includes(a.id)),
  ]
  const relationshipOptions = [
    ...RELATIONSHIP_TYPE_OPTIONS,
    ...ALL_RELATIONSHIP_TYPES.filter(
      (t) => extraRelationshipTypes.includes(t) && !RELATIONSHIP_TYPE_OPTIONS.includes(t),
    ),
  ]
  return (
    <div className={styles.panel} role="search" aria-label="Search and filter the atlas">
      <input
        type="search"
        className={styles.searchInput}
        placeholder="Search people, places and ideas…"
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
        aria-label="Search entries"
      />

      <div className={styles.group}>
        <span className={styles.groupLabel}>Subject area</span>
        <div className={styles.chipRow}>
          {areaOptions.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`${styles.chip} ${filters.areas.includes(a.id) ? styles.chipActive : ''}`}
              aria-pressed={filters.areas.includes(a.id)}
              onClick={() => onChange({ ...filters, areas: toggle(filters.areas, a.id) })}
            >
              {a.label}
              {suggestedAreas.includes(a.id) && (
                <span title="Stands out in your notes" aria-label=", suggested for your notes">
                  {' '}
                  ★
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

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
        <span className={styles.groupLabel}>Historical grouping</span>
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
          Region ({filters.regions.length || 'any'})
        </summary>
        <p className={styles.hint}>Approximate, assigned from each entry&rsquo;s map position.</p>
        <div className={styles.chipRow} style={{ marginTop: 6 }}>
          {REGION_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              className={`${styles.chip} ${filters.regions.includes(r) ? styles.chipActive : ''}`}
              aria-pressed={filters.regions.includes(r)}
              onClick={() => onChange({ ...filters, regions: toggle(filters.regions, r) })}
            >
              {r}
            </button>
          ))}
        </div>
      </details>

      <details>
        <summary className={styles.groupLabel} style={{ cursor: 'pointer' }}>
          Evidence status ({filters.evidence.length || 'any'})
        </summary>
        <div className={styles.chipRow} style={{ marginTop: 6 }}>
          {EVIDENCE_OPTIONS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`${styles.chip} ${filters.evidence.includes(value) ? styles.chipActive : ''}`}
              aria-pressed={filters.evidence.includes(value)}
              onClick={() => onChange({ ...filters, evidence: toggle(filters.evidence, value) })}
            >
              {label}
            </button>
          ))}
        </div>
      </details>

      <details>
        <summary className={styles.groupLabel} style={{ cursor: 'pointer' }}>
          Historical &amp; philosophical theme ({filters.themes.length || 'any'})
        </summary>
        <div className={styles.chipRow} style={{ marginTop: 6 }}>
          {THEME_OPTIONS.map((theme) => (
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
          {relationshipOptions.map((type) => (
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
