import type { ViewName } from '../hooks/useUrlState'
import styles from './NavShell.module.css'

interface NavShellProps {
  view: ViewName
  onChangeView: (v: ViewName) => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onOpenAbout: () => void
  onOpenSources: () => void
  onOpenNotebook: () => void
  onOpenNotes?: () => void
  onReplayIntro?: () => void
  /** True while a period theme is overriding the light/dark choice. */
  periodThemed?: boolean
}

const TABS: { value: ViewName; label: string }[] = [
  { value: 'atlas', label: 'Atlas' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'debates', label: 'Debates' },
  { value: 'journeys', label: 'Paths' },
]

export function NavShell({
  view,
  onChangeView,
  theme,
  onToggleTheme,
  onOpenAbout,
  onOpenSources,
  onOpenNotebook,
  onOpenNotes,
  onReplayIntro,
  periodThemed,
}: NavShellProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.brandLine}>
          <h1 className={styles.brandTitle}>STS Interactive Map</h1>
          <span className={styles.brandSub}>A History &amp; Philosophy of Science</span>
        </div>
        <span className={styles.brandBy}>by Aluinn McDonald</span>
      </div>

      <nav className={styles.tabs} aria-label="Main views">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`${styles.tab} ${view === t.value ? styles.tabActive : ''}`}
            aria-current={view === t.value ? 'page' : undefined}
            onClick={() => onChangeView(t.value)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {onReplayIntro && (
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onReplayIntro}
          title="Replay the cinematic introduction"
        >
          ↺ Replay intro
        </button>
      )}
      {onOpenNotes && (
        <button type="button" className={styles.iconBtn} onClick={onOpenNotes}>
          My Notes
        </button>
      )}
      <button type="button" className={styles.iconBtn} onClick={onOpenNotebook}>
        Notebook
      </button>
      <button type="button" className={styles.iconBtn} onClick={onOpenSources}>
        Sources
      </button>
      <button type="button" className={styles.iconBtn} onClick={onOpenAbout}>
        About
      </button>
      <button
        type="button"
        className={styles.iconBtn}
        onClick={onToggleTheme}
        aria-pressed={theme === 'light'}
        title={
          periodThemed
            ? 'Light and dark mode apply to All Time and the consistent theme; each period has its own look.'
            : undefined
        }
      >
        {theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
      </button>
    </header>
  )
}
