import type { EntryKind, RelationshipType } from '../types'
import { MarkerIcon } from './MarkerIcon'
import styles from './Legend.module.css'

const KIND_LABELS: Record<EntryKind, string> = {
  person: 'Person',
  idea: 'Idea / theory',
  discovery: 'Discovery',
  experiment: 'Experiment',
  instrument: 'Instrument',
  text: 'Text',
  institution: 'Institution',
  event: 'Event',
  debate: 'Debate',
}

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
}

const BROKEN_LEGEND_TYPES = new Set<RelationshipType>(['replaced', 'criticised', 'contested'])

export function Legend() {
  return (
    <div className={styles.legend} aria-label="Map legend">
      <h3 className={styles.heading}>Marker kinds</h3>
      {(Object.keys(KIND_LABELS) as EntryKind[]).map((kind) => (
        <div className={styles.row} key={kind}>
          <MarkerIcon kind={kind} size={14} className={styles.swatch} />
          <span>{KIND_LABELS[kind]}</span>
        </div>
      ))}

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
