import { ERAS } from '../../utils/eras'
import styles from './EraDecor.module.css'

/**
 * Decorative texture and border layers, one per period, stacked and
 * cross-faded by opacity so the map seems to change in place. They are
 * plain CSS gradients (no filters or blend modes) to stay cheap to paint,
 * never intercept input, and carry no meaning of their own.
 */
export function EraDecor({ eraId }: { eraId: string | null }) {
  return (
    <div className={styles.stack} aria-hidden>
      {ERAS.map((era) => (
        <div
          key={era.id}
          className={`${styles.layer} ${styles[era.id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())]} ${eraId === era.id ? styles.on : ''}`}
        />
      ))}
    </div>
  )
}
