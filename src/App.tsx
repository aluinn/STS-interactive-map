import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
import { useEraPrefs } from './hooks/useEraPrefs'
import { EraSlider } from './features/eras/EraSlider'
import { AppDecor } from './features/eras/AppDecor'
import { useEraTheme } from './features/eras/useEraTheme'
import { preloadEarthTextures } from './features/globe/earthTextures'
import { eraById, eraOfYear, splitByEra, entryEraVisibility } from './utils/eras'
import type { Entry } from './types'
import type { MapFocus } from './utils/mapFocus'
import { dataBundle } from './data'
import { filterEntries, filterRelationships } from './utils/filterEntries'
import { useNotesAtlas, type CollectionMode } from './features/notes/useNotesAtlas'
import { useNotesPrefs, type Appearance } from './features/notes/useNotesPrefs'
import { prefersConceptView, profileEntries } from './features/notes/adapt'
import { personalAtlas, withNotesMentions } from './features/notes/toEntries'
import { CollectionSelector } from './features/notes/ui/CollectionSelector'
import { NotesEmpty } from './features/notes/ui/NotesEmpty'
import type { Journey, Relationship } from './types'
import type { PersonalCollection } from './features/notes/types'
import notesStyles from './features/notes/ui/notes.module.css'

const AtlasView = lazy(() =>
  import('./features/atlas/AtlasView').then((m) => ({ default: m.AtlasView })),
)
const GlobeView = lazy(() =>
  import('./features/globe/GlobeView').then((m) => ({ default: m.GlobeView })),
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
const NotesModal = lazy(() =>
  import('./features/notes/ui/NotesModal').then((m) => ({ default: m.NotesModal })),
)
const ConceptNetwork = lazy(() =>
  import('./features/notes/ui/ConceptNetwork').then((m) => ({ default: m.ConceptNetwork })),
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
      <span className={styles.pulse} aria-hidden />
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
  const [eraPrefs, setEraPrefs] = useEraPrefs()
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
    const isLandingRoute = !state.entry && !state.debate && !state.journey && state.view === 'atlas'
    if (!isLandingRoute) return 'done'
    try {
      return localStorage.getItem(INTRO_SEEN_KEY) === '1' ? 'done' : 'cinematic'
    } catch {
      return 'cinematic'
    }
  })
  const appBehindRef = useRef<HTMLDivElement>(null)
  const [announcement, setAnnouncement] = useState('')

  const notes = useNotesAtlas()
  const [appearance, setAppearance] = useNotesPrefs()
  const [notesModal, setNotesModal] = useState<'home' | 'import' | null>(null)
  const [layout, setLayout] = useState<'map' | 'concepts'>('map')
  const [fit, setFit] = useState<{ token: number; points: [number, number][] } | null>(null)
  const [importNotice, setImportNotice] = useState('')
  const [droppedFiles, setDroppedFiles] = useState<File[]>([])

  const { debates } = dataBundle
  const curatedEntries = dataBundle.entries
  const personal = notes.atlas
  const mode = notes.mode

  // What the map, timeline and filters draw depends on the chosen collection.
  const mineEntries = useMemo(
    () => [
      ...personal.entries,
      ...curatedEntries
        .filter((e) => personal.linkedCurated.has(e.id))
        .map((e) => withNotesMentions(e, personal.linkedCurated.get(e.id))),
    ],
    [personal, curatedEntries],
  )
  const entries = mode === 'curated' ? curatedEntries : mineEntries
  // Your Notes draws only the relationships found in the viewer's own notes.
  const relationships = useMemo<Relationship[]>(
    () => (mode === 'curated' ? dataBundle.relationships : personal.relationships),
    [mode, personal],
  )
  // Journeys, debates and the notebook refer to curated entries (and the
  // viewer's own), whichever collection is showing.
  const allEntries = useMemo(
    () => [...curatedEntries, ...personal.entries],
    [curatedEntries, personal],
  )
  const allRelationships = useMemo(
    () => [...dataBundle.relationships, ...personal.relationships],
    [personal],
  )
  const journeys = useMemo<Journey[]>(() => {
    const stops = personal.entries
      .filter((e) => !e.undated && e.latitude !== undefined)
      .sort((a, b) => a.startYear - b.startYear)
      .slice(0, 12)
    if (stops.length < 3) return dataBundle.journeys
    return [
      ...dataBundle.journeys,
      {
        id: 'my-notes-path',
        slug: 'my-notes-path',
        title: 'Your notes, in date order',
        summary: `A walk through ${stops.length} dated, located entries from your own notes. These come from your notes and have not been verified.`,
        themes: [],
        stops: stops.map((e) => ({
          entryId: e.id,
          caption: e.personal?.mentions[0]?.passage ?? e.summary,
        })),
      },
    ]
  }, [personal])
  const entryById = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries])

  const filteredEntries = useMemo(
    () => filterEntries(entries, state.filters),
    [entries, state.filters],
  )
  const era = eraById(state.era)
  const hasQuery = state.filters.q.trim().length > 0
  const split = useMemo(
    () =>
      splitByEra(filteredEntries, era, {
        echoes: eraPrefs.echoes,
        searchAllTime: eraPrefs.searchAllTime,
        hasQuery,
      }),
    [filteredEntries, era, eraPrefs.echoes, eraPrefs.searchAllTime, hasQuery],
  )
  const periodEntries = split.active
  const visibleIds = useMemo(() => new Set(periodEntries.map((e) => e.id)), [periodEntries])
  const filteredRelationships = useMemo(
    () => filterRelationships(relationships, visibleIds, state.filters),
    [relationships, visibleIds, state.filters],
  )
  // Relationships that reach back to a faint echo from the previous period.
  const ghostRelationships = useMemo(() => {
    if (!era || split.echoes.length === 0) return []
    const echoIds = new Set(split.echoes.map((e) => e.id))
    return relationships.filter(
      (r) =>
        (echoIds.has(r.sourceId) || echoIds.has(r.targetId)) &&
        (echoIds.has(r.sourceId) || visibleIds.has(r.sourceId)) &&
        (echoIds.has(r.targetId) || visibleIds.has(r.targetId)) &&
        (state.filters.relationTypes.length === 0 || state.filters.relationTypes.includes(r.type)),
    )
  }, [era, split.echoes, relationships, visibleIds, state.filters.relationTypes])
  // How the viewer's notes spread over the periods (shown on the slider).
  const distribution = useMemo(() => {
    if (mode !== 'mine') return null
    const d: Record<string, number> = { all: mineEntries.length }
    for (const e of mineEntries) {
      if (e.undated) continue
      const id = eraOfYear(e.startYear).id
      d[id] = (d[id] ?? 0) + 1
    }
    return d
  }, [mode, mineEntries])
  const profile = useMemo(() => profileEntries(mineEntries), [mineEntries])
  const suggestedAreas = useMemo(
    () => (mode === 'curated' ? [] : profile.areas.slice(0, 3)),
    [mode, profile],
  )
  const extraRelationshipTypes = useMemo(
    () => [...new Set(personal.relationships.map((r) => r.type))],
    [personal],
  )
  const displayAppearance: Appearance = !eraPrefs.immersive
    ? 'consistent'
    : appearance === 'consistent'
      ? 'adaptive'
      : appearance
  function chooseAppearance(a: Appearance) {
    setAppearance(a)
    setEraPrefs({ immersive: a !== 'consistent' })
  }
  // Keep the saved appearance choice and the period-theme switch in step.
  useEffect(() => {
    if (appearance === 'consistent' && eraPrefs.immersive) setEraPrefs({ immersive: false })
    // Only on first load: after that the two are changed together.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Applies a collection's profile to the interface: period, map framing and view. */
  function adaptTo(c: PersonalCollection) {
    const atlas = personalAtlas(c)
    const linked = curatedEntries.filter((e) => atlas.linkedCurated.has(e.id))
    const p = profileEntries([...atlas.entries, ...linked])
    if (displayAppearance === 'adaptive') setState({ era: p.dominantEra })
    if (p.points.length > 0) setFit({ token: Date.now(), points: p.points })
    setLayout(prefersConceptView(p) ? 'concepts' : 'map')
  }
  function chooseMode(m: CollectionMode) {
    notes.setMode(m)
    if (m === 'mine' && notes.active) adaptTo(notes.active)
    if (m === 'curated') setLayout('map')
    setAnnouncement(
      m === 'curated' ? 'Showing the General Notes atlas.' : 'Showing your notes on their own map.',
    )
  }
  function handleImported(c: PersonalCollection, summary: string) {
    setNotesModal(null)
    setImportNotice(summary)
    setAnnouncement(summary)
    if (mode === 'curated') notes.setMode('mine')
    adaptTo(c)
  }
  function resetNotesSettings() {
    notes.setMode('curated')
    setAppearance('adaptive')
    setEraPrefs({ immersive: true })
    setLayout('map')
    setAnnouncement('Collection and appearance choices were reset.')
  }

  const mapFocusRef = useRef<MapFocus | null>(null)
  // The latest period is shown as a satellite-style globe (unless the viewer
  // chose the consistent theme, which keeps the flat chart throughout).
  const showGlobe = era?.id === 'platform-age' && eraPrefs.immersive
  // One source of truth: the selected period drives the whole interface theme.
  useEraTheme(era?.id ?? null, eraPrefs.immersive, reducedMotion, theme)

  // Start fetching the imagery one period early so the globe doesn't wait.
  useEffect(() => {
    if (era?.id === 'networked' || era?.id === 'platform-age') preloadEarthTextures()
  }, [era?.id])

  const selectedEntry = state.entry
    ? (entries.find((e) => e.id === state.entry) ??
      (state.view === 'journeys' ? allEntries.find((e) => e.id === state.entry) : null) ??
      null)
    : null
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

  /** Moves to the entry's own period when it would otherwise be hidden by the
   * selected one, and says so rather than leaving a selection with no marker. */
  function periodUpdateFor(
    id: string,
    announce = true,
  ): { era: string | null } | Record<string, never> {
    const e = entryById.get(id)
    if (!e || !era) return {}
    if (entryEraVisibility(e, era, eraPrefs.echoes) !== 'hidden') return {}
    if (eraPrefs.searchAllTime && hasQuery) return {}
    const target = eraOfYear(e.startYear)
    if (announce) setAnnouncement(`Moved to ${target.label} so ${e.title} is on the map.`)
    return { era: target.id }
  }

  // A deep link (or back-button step) can name an entry the selected period
  // would hide; move to the entry's own period instead of leaving a selection
  // with nothing on the map.
  const selectedId = state.entry
  const pendingPeriodFix = selectedId ? periodUpdateFor(selectedId, false) : {}
  const pendingEra = 'era' in pendingPeriodFix ? pendingPeriodFix.era : undefined
  useEffect(() => {
    if (pendingEra) {
      setState({ era: pendingEra })
    }
  }, [pendingEra, setState])

  function selectEntry(id: string) {
    setState({ entry: id, ...periodUpdateFor(id) })
    const e = entries.find((en) => en.id === id)
    if (e) setAnnouncement(`Selected ${e.title}, ${e.dateDisplay}`)
  }

  function jumpToEntryOnMap(id: string) {
    setState({ view: 'atlas', entry: id, ...periodUpdateFor(id) })
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

  // "Related" links are listed on one side only in the data; treat them as
  // two-way so an entry is reachable from everything that points at it.
  const incomingRelated = useMemo(() => {
    const m = new Map<string, string[]>()
    for (const e of entries) {
      for (const target of e.relatedEntryIds) {
        m.set(target, [...(m.get(target) ?? []), e.id])
      }
    }
    return m
  }, [entries])
  const getRelatedEntries = useCallback(
    (entry: Entry) =>
      [...new Set([...entry.relatedEntryIds, ...(incomingRelated.get(entry.id) ?? [])])]
        .filter((id) => id !== entry.id)
        .map((id) => entryById.get(id))
        .filter((e): e is Entry => e !== undefined),
    [entryById, incomingRelated],
  )
  const relatedEntries = selectedEntry ? getRelatedEntries(selectedEntry) : []

  const clusterTools = {
    getRelatedEntries,
    isSaved: notebook.isSaved,
    onToggleSave: notebook.toggleSave,
    onOpenDebate: openDebateFromEntry,
    journeysForEntry: (entryId: string) =>
      journeys
        .filter((j) => j.stops.some((stop) => stop.entryId === entryId))
        .map((j) => ({ id: j.id, title: j.title })),
    onBeginJourney: beginJourney,
  }

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
      <AppDecor eraId={era?.id ?? null} enabled={eraPrefs.immersive} />
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
        onOpenNotes={() => setNotesModal('home')}
        onReplayIntro={replayIntro}
        periodThemed={eraPrefs.immersive && era !== null}
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
          <CollectionSelector
            mode={mode}
            onMode={chooseMode}
            curatedCount={curatedEntries.length}
            mineCount={mineEntries.length}
            collectionName={notes.active?.name ?? null}
            onImport={() => setNotesModal('import')}
            onManage={() => setNotesModal('home')}
          />
          {importNotice && (
            <p className={notesStyles.callout} role="status">
              {importNotice}{' '}
              <button type="button" className={notesStyles.btn} onClick={() => setImportNotice('')}>
                Dismiss
              </button>
            </p>
          )}
          <SearchFilters
            filters={state.filters}
            onChange={(f) => setState({ filters: f })}
            resultCount={periodEntries.length}
            suggestedAreas={suggestedAreas}
            extraRelationshipTypes={extraRelationshipTypes}
          />
          <Legend showProvenance={mode !== 'curated'} />
        </div>

        <main className={styles.main} id="main-content">
          <div className={styles.viewSurface}>
            {state.view === 'atlas' && mode !== 'curated' && mineEntries.length > 0 && (
              <div
                className={notesStyles.layoutToggle}
                role="group"
                aria-label="How to show your notes"
              >
                <button
                  type="button"
                  className={`${notesStyles.btn} ${layout === 'map' ? notesStyles.btnPrimary : ''}`}
                  aria-pressed={layout === 'map'}
                  onClick={() => setLayout('map')}
                >
                  Map
                </button>
                <button
                  type="button"
                  className={`${notesStyles.btn} ${layout === 'concepts' ? notesStyles.btnPrimary : ''}`}
                  aria-pressed={layout === 'concepts'}
                  onClick={() => setLayout('concepts')}
                >
                  Concept network
                </button>
              </div>
            )}
            <Suspense fallback={<ViewLoading />}>
              {state.view === 'atlas' && mode === 'mine' && periodEntries.length === 0 && (
                <NotesEmpty
                  loading={notes.loading}
                  reason={mineEntries.length === 0 ? 'no-collection' : 'no-entries-in-view'}
                  onImport={() => setNotesModal('import')}
                  onFiles={(files) => {
                    setDroppedFiles(files)
                    setNotesModal('import')
                  }}
                  onShowCurated={() => chooseMode('curated')}
                />
              )}

              {state.view === 'atlas' &&
                mode !== 'curated' &&
                layout === 'concepts' &&
                periodEntries.length > 0 && (
                  <ConceptNetwork
                    entries={periodEntries.filter(
                      (e) => e.origin === 'personal' || e.notesMentions,
                    )}
                    relationships={filteredRelationships}
                    selectedId={state.entry}
                    onSelect={selectEntry}
                  />
                )}

              {state.view === 'atlas' &&
                !showGlobe &&
                !(mode === 'mine' && periodEntries.length === 0) &&
                !(mode !== 'curated' && layout === 'concepts') && (
                  <AtlasView
                    entries={periodEntries}
                    relationships={filteredRelationships}
                    eraId={era?.id ?? null}
                    immersive={eraPrefs.immersive}
                    ghostEntries={split.echoes}
                    ghostRelationships={ghostRelationships}
                    outsideIds={split.outside}
                    focusRef={mapFocusRef}
                    selectedEntryId={state.entry}
                    onSelectEntry={selectEntry}
                    focusEntryId={state.entry}
                    focusToken={focusToken}
                    fitPoints={fit}
                    clusterTools={clusterTools}
                    reducedMotion={reducedMotion}
                  />
                )}

              {state.view === 'atlas' &&
                showGlobe &&
                !(mode === 'mine' && periodEntries.length === 0) &&
                !(mode !== 'curated' && layout === 'concepts') && (
                  <GlobeView
                    entries={periodEntries}
                    relationships={filteredRelationships}
                    ghostEntries={split.echoes}
                    ghostRelationships={ghostRelationships}
                    outsideIds={split.outside}
                    focusRef={mapFocusRef}
                    selectedEntryId={state.entry}
                    onSelectEntry={selectEntry}
                    focusEntryId={state.entry}
                    focusToken={focusToken}
                    clusterTools={clusterTools}
                    reducedMotion={reducedMotion}
                  />
                )}

              {state.view === 'timeline' && (
                <TimelineView entries={periodEntries} onSelectEntry={selectEntry} />
              )}

              {state.view === 'debates' && (
                <DebatesView
                  debates={debates}
                  entries={curatedEntries}
                  selectedDebateId={state.debate}
                  onSelectDebate={(id) => setState({ debate: id })}
                  onJumpToEntry={jumpToEntryOnMap}
                />
              )}

              {state.view === 'journeys' && activeJourney && (
                <>
                  <AtlasView
                    entries={allEntries}
                    relationships={allRelationships}
                    selectedEntryId={state.entry}
                    onSelectEntry={selectEntry}
                    focusEntryId={currentStop?.entryId ?? null}
                    focusToken={focusToken}
                    clusterTools={clusterTools}
                    reducedMotion={reducedMotion}
                  />
                  <JourneyStepper
                    journey={activeJourney}
                    stopIndex={state.stop}
                    entry={
                      currentStop ? allEntries.find((e) => e.id === currentStop.entryId) : undefined
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
          {(state.view === 'atlas' || state.view === 'timeline') && (
            <EraSlider
              era={era}
              onChange={(id) => setState({ era: id })}
              prefs={eraPrefs}
              onPrefsChange={setEraPrefs}
              entryCount={periodEntries.length}
              echoCount={split.echoes.length}
              hasQuery={hasQuery}
              distribution={distribution}
            />
          )}
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

      {notesModal && (
        <Suspense fallback={null}>
          <NotesModal
            notes={notes}
            curated={curatedEntries}
            appearance={displayAppearance}
            onAppearance={chooseAppearance}
            onResetSettings={resetNotesSettings}
            initial={notesModal}
            initialFiles={droppedFiles}
            onImported={handleImported}
            onClose={() => {
              setNotesModal(null)
              setDroppedFiles([])
            }}
          />
        </Suspense>
      )}

      {modal === 'about' && (
        <Modal title="About this atlas" onClose={() => setModal(null)}>
          <AboutContent />
        </Modal>
      )}
      {modal === 'sources' && (
        <Modal title="Sources" onClose={() => setModal(null)}>
          <SourcesDrawerContent entries={curatedEntries} />
        </Modal>
      )}
      {modal === 'notebook' && (
        <Modal title="Your notebook" onClose={() => setModal(null)}>
          <NotebookContent
            items={notebook.items}
            entries={allEntries}
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
