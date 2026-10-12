import { ERAS } from '../../utils/eras'
import styles from './AppDecor.module.css'

/**
 * Faint page-wide texture for the period, one layer per period cross-faded
 * by opacity. Plain CSS gradients tinted from the current ink colour, so it
 * costs nothing to load and always matches the theme.
 */
export function AppDecor({ eraId, enabled }: { eraId: string | null; enabled: boolean }) {
  return (
    <div className={styles.stack} aria-hidden>
      {ERAS.map((era) => (
        <div
          key={era.id}
          className={`${styles.layer} ${styles[era.id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())]} ${enabled && eraId === era.id ? styles.on : ''}`}
        />
      ))}
    </div>
  )
}
