import type { Entry } from '../../../types'
import { provenanceOf } from '../provenance'
import styles from './notes.module.css'

const CLASS: Record<ReturnType<typeof provenanceOf>['key'], string> = {
  curated: styles.badgeCurated,
  confirmed: styles.badgeConfirmed,
  imported: styles.badgeImported,
  unreviewed: styles.badgeUnreviewed,
}

export function ProvenanceBadge({ entry, short }: { entry: Entry; short?: boolean }) {
  const p = provenanceOf(entry)
  return (
    <span className={`${styles.badge} ${CLASS[p.key]}`} title={p.description}>
      {short ? p.label.replace('Your notes · ', '') : p.label}
    </span>
  )
}
