import { lazy, Suspense, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styles from './App.module.css'
import { NavShell } from './components/NavShell'
import { CinematicIntro } from './components/CinematicIntro'
import { Legend } from './components/Legend'
import { SearchFilters } from './components/SearchFilters'
import { DetailPanel } from './components/DetailPanel'
import { Modal } from './components/Modal'
import { AboutContent } from './components/AboutContent'
import { SourcesDrawerContent } from './components/SourcesDrawerContent'
import { NotebookContent } from './components/NotebookContent'
import { useUrlState } from './hooks/useUrlState'
import { useTheme } from './hooks/useTheme'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useNotebook } from './hooks/useNotebook'
import { dataBundle } from './data'
import { filterEntries, filterRelationships } from './utils/filterEntries'

const AtlasView = lazy(() =>
  import('./features/atlas/AtlasView').then((m) => ({ default: m.AtlasView })),
)
const TimelineView = lazy(() =>
  import('./features/timeline/TimelineView').then((m) => ({ default: m.TimelineView })),
)
const DebatesView = lazy(() =>
  import('./features/debates/DebatesView').then((m) => ({ default: m.DebatesView })),
)
const JourneysView = lazy(() =>
  import('./features/journeys/JourneysView').then((m) => ({ default: m.JourneysView })),
)
const JourneyStepper = lazy(() =>
  import('./features/journeys/JourneyStepper').then((m) => ({ default: m.JourneyStepper })),
)

function ViewLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--color-ink-faint)',
      }}
    >
      Unrolling the map…
    </div>
  )
}

const INTRO_SEEN_KEY = 'atlas-intro-seen'

type ModalName = 'about' | 'sources' | 'notebook' | null

export default function App() {
  const [state, setState] = useUrlState()
  const [theme, toggleTheme] = useTheme()
  const reducedMotion = usePrefersReducedMotion()
  const notebook = useNotebook()
  const [modal, setModal] = useState<ModalName>(null)
  const [focusToken, setFocusToken] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    try {
      return window.matchMedia('(min-width: 900px)').matches
    } catch {
      return true
    }
  })
  // The cinematic intro only plays on the plain landing route: no deep link
  // into a specific entry/debate/journey, and no non-default view already
  // requested via the URL (both of those should open immediately instead).
  const [introPhase, setIntroPhase] = useState<'cinematic' | 'done'>(() => {
    const isLandingRoute =
      !state.entry && !state.debate && !state.journey && state.view === 'atlas'
    if (!isLandingRoute) return 'done'
    try {
      return localStorage.getItem(INTRO_SEEN_KEY) === '1' ? 'done' : 'cinematic'
    } catch {
      return 'cinematic'
    }
  })
  const appBehindRef = useRef<HTMLDivElement>(null)
  const [announcement, setAnnouncement] = useState('')

  const { entries, relationships, debates, journeys } = dataBundle

  const filteredEntries = useMemo(
    () => filterEntries(entries, state.filters),
    [entries, state.filters],
  )
  const visibleIds = useMemo(() => new Set(filteredEntries.map((e) => e.id)), [filteredEntries])
  const filteredRelationships = useMemo(
    () => filterRelationships(relationships, visibleIds, state.filters),
    [relationships, visibleIds, state.filters],
  )

  const selectedEntry = state.entry ? (entries.find((e) => e.id === state.entry) ?? null) : null
  const activeJourney = state.journey
    ? (journeys.find((j) => j.id === state.journey) ?? null)
    : null
  const currentStop = activeJourney?.stops[state.stop] ?? null

  const handleIntroProgress = useCallback((p: number) => {
    const el = appBehindRef.current
    if (!el) return
    const t = Math.min(1, Math.max(0, (p - 0.72) / 0.28))
    const eased = t * t * (3 - 2 * t)
    el.style.opacity = String(eased)
    el.style.pointerEvents = p > 0.97 ? 'auto' : 'none'
  }, [])

  function handleIntroComplete() {
    setIntroPhase('done')
    try {
      localStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      // ignore
    }
    window.scrollTo(0, 0)
  }

  function replayIntro() {
    window.scrollTo(0, 0)
    setIntroPhase('cinematic')
  }

  // Guarantee a fresh scroll-driven sequence starts at the top, even if the
  // page had residual scroll from before a replay was triggered.
  useLayoutEffect(() => {
    if (introPhase === 'cinematic') window.scrollTo(0, 0)
  }, [introPhase])

  function selectEntry(id: string) {
    setState({ entry: id })
    const e = entries.find((en) => en.id === id)
    if (e) setAnnouncement(`Selected ${e.title}, ${e.dateDisplay}`)
  }

  function jumpToEntryOnMap(id: string) {
    setState({ view: 'atlas', entry: id })
    setFocusToken((t) => t + 1)
  }

  function openDebateFromEntry(debateId: string) {
    setState({ view: 'debates', debate: debateId, entry: null })
  }

  function beginJourney(id: string) {
    const j = journeys.find((jj) => jj.id === id)
    if (!j) return
    setState({ journey: id, stop: 0, entry: j.stops[0]?.entryId ?? null, view: 'journeys' })
    setFocusToken((t) => t + 1)
  }

  function goToStop(index: number) {
    if (!activeJourney) return
    const clamped = Math.max(0, Math.min(index, activeJourney.stops.length - 1))
    setState({ stop: clamped, entry: activeJourney.stops[clamped].entryId })
    setFocusToken((t) => t + 1)
  }

  function exitJourney() {
    setState({ journey: null, stop: 0 })
  }

  const relatedEntries = selectedEntry
    ? selectedEntry.relatedEntryIds
        .map((id) => entries.find((e) => e.id === id))
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
    : []

  const journeyNavForPanel =
    activeJourney && selectedEntry && currentStop?.entryId === selectedEntry.id
      ? {
          title: activeJourney.title,
          stopIndex: state.stop,
          totalStops: activeJourney.stops.length,
          caption: currentStop.caption,
          onPrev: state.stop > 0 ? () => goToStop(state.stop - 1) : undefined,
          onNext:
            state.stop < activeJourney.stops.length - 1
              ? () => goToStop(state.stop + 1)
              : undefined,
        }
      : undefined

  const appUi = (
    <div className={styles.app}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div aria-live="polite" className={styles.srLive}>
        {announcement}
      </div>

      <NavShell
        view={state.view}
        onChangeView={(v) => setState({ view: v })}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAbout={() => setModal('about')}
        onOpenSources={() => setModal('sources')}
        onOpenNotebook={() => setModal('notebook')}
        onReplayIntro={replayIntro}
      />

      <div className={styles.body}>
        <button
          type="button"
          className={styles.sidebarToggle}
          onClick={() => setSidebarOpen((o) => !o)}
          aria-expanded={sidebarOpen}
          aria-controls="filters-sidebar"
        >
          {sidebarOpen ? 'Hide filters & legend' : 'Show filters & legend'}
        </button>
        <div className={styles.sidebar} id="filters-sidebar" hidden={!sidebarOpen}>
          <SearchFilters
            filters={state.filters}
            onChange={(f) => setState({ filters: f })}
            resultCount={filteredEntries.length}
          />
          <Legend />
        </div>

        <main className={styles.main} id="main-content">
          <div className={styles.viewSurface}>
            <Suspense fallback={<ViewLoading />}>
              {state.view === 'atlas' && (
                <AtlasView
                  entries={filteredEntries}
                  relationships={filteredRelationships}
                  selectedEntryId={state.entry}
                  onSelectEntry={selectEntry}
                  focusEntryId={state.entry}
                  focusToken={focusToken}
                  reducedMotion={reducedMotion}
                />
              )}

              {state.view === 'timeline' && (
                <TimelineView entries={filteredEntries} onSelectEntry={selectEntry} />
              )}

              {state.view === 'debates' && (
                <DebatesView
                  debates={debates}
                  entries={entries}
                  selectedDebateId={state.debate}
                  onSelectDebate={(id) => setState({ debate: id })}
                  onJumpToEntry={jumpToEntryOnMap}
                />
              )}

              {state.view === 'journeys' && activeJourney && (
                <>
                  <AtlasView
                    entries={entries}
                    relationships={relationships}
                    selectedEntryId={state.entry}
                    onSelectEntry={selectEntry}
                    focusEntryId={currentStop?.entryId ?? null}
                    focusToken={focusToken}
                    reducedMotion={reducedMotion}
                  />
                  <JourneyStepper
                    journey={activeJourney}
                    stopIndex={state.stop}
                    entry={
                      currentStop ? entries.find((e) => e.id === currentStop.entryId) : undefined
                    }
                    onPrev={() => goToStop(state.stop - 1)}
                    onNext={() => goToStop(state.stop + 1)}
                    onExit={exitJourney}
                  />
                </>
              )}

              {state.view === 'journeys' && !activeJourney && (
                <JourneysView journeys={journeys} onBeginJourney={beginJourney} />
              )}
            </Suspense>
          </div>
        </main>
      </div>

      {selectedEntry && (
        <DetailPanel
          entry={selectedEntry}
          relatedEntries={relatedEntries}
          onClose={() => setState({ entry: null })}
          onSelectRelated={selectEntry}
          onOpenDebate={openDebateFromEntry}
          journeyNav={journeyNavForPanel}
          isSaved={notebook.isSaved(selectedEntry.id)}
          onToggleSave={() => notebook.toggleSave(selectedEntry.id)}
        />
      )}

      {modal === 'about' && (
        <Modal title="About this atlas" onClose={() => setModal(null)}>
          <AboutContent />
        </Modal>
      )}
      {modal === 'sources' && (
        <Modal title="Sources" onClose={() => setModal(null)}>
          <SourcesDrawerContent entries={entries} />
        </Modal>
      )}
      {modal === 'notebook' && (
        <Modal title="Your notebook" onClose={() => setModal(null)}>
          <NotebookContent
            items={notebook.items}
            entries={entries}
            onUpdateNote={notebook.updateNote}
            onRemove={notebook.remove}
            onClearAll={notebook.clearAll}
            onOpenEntry={(id) => {
              setModal(null)
              selectEntry(id)
            }}
          />
        </Modal>
      )}
    </div>
  )

  return (
    <>
      <div
        ref={appBehindRef}
        className={introPhase === 'cinematic' ? styles.appBehindIntro : undefined}
        style={introPhase === 'cinematic' ? { opacity: 0, pointerEvents: 'none' } : undefined}
        inert={introPhase === 'cinematic' ? true : undefined}
      >
        {appUi}
      </div>
      {introPhase === 'cinematic' && (
        <CinematicIntro
          reducedMotion={reducedMotion}
          onProgress={handleIntroProgress}
          onComplete={handleIntroComplete}
        />
      )}
    </>
  )
}
