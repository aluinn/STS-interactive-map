import type { EntryKind, RelationshipType } from '../types'
import { MarkerIcon } from './MarkerIcon'
import { KIND_LABELS } from '../utils/kindLabels'
import styles from './Legend.module.css'

const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  influenced: 'Influenced',
  taught: 'Taught',
  translated: 'Translated',
  corresponded: 'Corresponded',
  travelled: 'Travelled',
  collaborated: 'Collaborated',
  criticised: 'Criticised',
  supported: 'Supported',
  challenged: 'Challenged',
  replaced: 'Replaced / overturned',
  preserved: 'Preserved',
  funded: 'Funded',
  appropriated: 'Appropriated',
  excluded: 'Excluded',
  extracted: 'Extracted knowledge or resources',
  institutionalised: 'Institutionalised',
  'independently-developed': 'Independently developed',
  commercialised: 'Commercialised',
  regulated: 'Regulated',
  'co-produced': 'Co-produced',
  represented: 'Represented',
  'materially-enabled': 'Materially enabled',
  contested: 'Contested',
  revised: 'Revised',
  'applied-to': 'Applied to',
  'worked-at': 'Worked at',
  published: 'Published',
  developed: 'Developed',
}

const BROKEN_LEGEND_TYPES = new Set<RelationshipType>(['replaced', 'criticised', 'contested'])

export function Legend({ showProvenance = false }: { showProvenance?: boolean }) {
  return (
    <div className={styles.legend} aria-label="Map legend">
      <h3 className={styles.heading}>Marker kinds</h3>
      {(Object.keys(KIND_LABELS) as EntryKind[]).map((kind) => (
        <div className={styles.row} key={kind}>
          <MarkerIcon kind={kind} size={14} className={styles.swatch} />
          <span>{KIND_LABELS[kind]}</span>
        </div>
      ))}

      {showProvenance && (
        <>
          <h3 className={styles.heading}>Where it came from</h3>
          <div className={styles.row}>
            <span aria-hidden>●</span>
            <span>Curated and sourced atlas entry (round marker)</span>
          </div>
          <div className={styles.row}>
            <span aria-hidden>◆</span>
            <span>From your notes (marker inside a diamond outline)</span>
          </div>
          <div className={styles.row}>
            <span aria-hidden>◇</span>
            <span>From your notes, not yet reviewed (dotted diamond)</span>
          </div>
          <div className={styles.row}>
            <span aria-hidden>- -</span>
            <span>Proposed relationship (dashed line)</span>
          </div>
        </>
      )}

      <details>
        <summary>Relationship types (click any route on the map)</summary>
        <div style={{ marginTop: 6 }}>
          {(Object.keys(RELATIONSHIP_LABELS) as RelationshipType[]).map((type) => (
            <div className={styles.row} key={type}>
              <span
                className={`${styles.lineSample} ${BROKEN_LEGEND_TYPES.has(type) ? styles.lineBroken : ''}`}
              />
              <span>{RELATIONSHIP_LABELS[type]}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
