import type { WalkthroughContext, WalkthroughStep } from './types'

const TIMELINE_NOTE =
  'The period slider appears under the Atlas and Timeline views, so it is hidden here.'

function mapStepBody(ctx: WalkthroughContext): string {
  if (ctx.view !== 'atlas') {
    return `This is the main display area, which is currently showing the ${ctx.view === 'journeys' ? 'Paths' : ctx.view} view. On the Atlas view it becomes a map: drag to move, zoom to inspect regions, select a marker to open its entry, and follow curved routes between related entries. A list view is always available as an alternative.`
  }
  const common =
    'Select a marker to open its full entry. Curved routes show documented relationships. Numbered bubbles group nearby entries; select one to see what it holds, sorted by country. The list-view button shows the same entries as a simple list.'
  return ctx.globe
    ? `This is the main display area, currently the modern globe used for the latest period. Drag to turn it, scroll or pinch to zoom, or use the arrow keys. ${common}`
    : `This is the main display area, currently the historical map. Drag to move around and zoom to inspect regions. ${common}`
}

function collectionBody(ctx: WalkthroughContext): string {
  const base =
    'The collection selector switches between General Notes, the curated atlas everyone shares, and Your Notes, a private atlas built from notes you import. PDFs and text are read on this device and never uploaded, and your material stays clearly labelled apart from the curated entries.'
  return ctx.hasPersonal
    ? `${base} You already have a personal collection saved here; the tour will not change it.`
    : `${base} You have not added any notes yet, so nothing is imported unless you choose to.`
}

function entryStep(ctx: WalkthroughContext): WalkthroughStep {
  const list =
    'An entry can hold a historical description, philosophical questions, evidence and theory status, related entries, documented relationships, sources, guided journeys and a bookmark button to save it to your notebook.'
  return ctx.entryOpen
    ? {
        id: 'entries',
        title: 'Entries, sources and connections',
        targetLabel: 'Entry panel',
        targets: ['entry-panel', 'atlas-surface'],
        body: `This is the entry panel for the item you opened. ${list}`,
      }
    : {
        id: 'entries',
        title: 'Entries, sources and connections',
        targetLabel: 'Map markers',
        targets: ['atlas-surface'],
        body: `Selecting a marker on the map, or an item in the timeline, opens its entry panel. ${list} Try opening one once the tour ends.`,
      }
}

/**
 * Builds the tour for the current state of the app. Wording adapts to the
 * period (map or globe), the view and whether the viewer has personal notes,
 * and a step is added on narrow screens to point at the collapsed sidebar.
 */
export function buildWalkthroughSteps(ctx: WalkthroughContext): WalkthroughStep[] {
  const steps: WalkthroughStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to the STS Interactive Map',
      body: 'Explore how scientific knowledge has travelled through places, institutions, arguments, instruments and historical periods. This short tour introduces the main ways to use the atlas. You can reopen it at any time from the Guide button in the top bar.',
    },
    {
      id: 'views',
      title: 'Four ways to look',
      targetLabel: 'Main views navigation',
      targets: ['main-navigation'],
      body: 'The Main views tabs change how the atlas is shown. Atlas maps geographically situated people, events, ideas and institutions. Timeline arranges entries across historical periods. Debates explores competing positions in philosophy of science. Paths offers curated guided journeys through connected entries. Your filters stay in place as you switch.',
    },
    {
      id: 'map',
      title: ctx.globe && ctx.view === 'atlas' ? 'The globe' : 'The map',
      targetLabel: ctx.view === 'atlas' ? (ctx.globe ? 'Globe' : 'Map') : 'Main display area',
      targets: ['atlas-surface'],
      body: mapStepBody(ctx),
    },
  ]

  if (ctx.sidebarCollapsible && ctx.sidebarClosed) {
    steps.push({
      id: 'sidebar-toggle',
      title: 'Filters and legend',
      targetLabel: '“Show filters & legend” button',
      targets: ['sidebar-toggle'],
      body: 'On smaller screens the collections, search, filters and legend sit behind the “Show filters & legend” button. The tour opens this panel for the next two steps and closes it again afterwards, so your layout is left as you found it.',
    })
  }

  steps.push(
    {
      id: 'collections',
      title: 'General Notes and Your Notes',
      targetLabel: 'Collection selector',
      targets: ['collection-selector'],
      needsSidebar: true,
      body: collectionBody(ctx),
    },
    {
      id: 'filters',
      title: 'Search, filters and legend',
      targetLabel: 'Search and filters panel',
      targets: ['search-filters'],
      needsSidebar: true,
      body: 'Search and narrow the atlas by subject area, entry type, historical grouping, date, region, evidence status, theme and relationship type. Active filters change the map, the timeline and the contents of numbered bubbles. The legend just below explains what each marker and line means.',
    },
    {
      id: 'periods',
      title: 'Travelling through time',
      targetLabel: 'Period slider',
      targets: ['era-slider'],
      body: `${ctx.view === 'atlas' || ctx.view === 'timeline' ? '' : `${TIMELINE_NOTE} `}All Time shows everything; choosing a period shows its entries and shifts the look of the whole interface. Historical echoes keep faint traces of the previous period, Play steps through the periods, and the latest one becomes a satellite-style globe. Details explains what changed. Period boundaries are approximate navigation conventions, not exact years.`,
    },
    entryStep(ctx),
    {
      id: 'tools',
      title: 'Notebook, sources and settings',
      targetLabel: 'Research tools in the top bar',
      targets: ['research-tools'],
      body: 'Your Notes opens importing and personal-collection management. Notebook keeps entries you bookmark and private notes, stored only in this browser. Sources lists the project’s references, and About explains its scope and limits. The light and dark button improves readability, and Replay intro, next to Guide, replays the opening globe sequence.',
    },
    {
      id: 'done',
      title: 'You’re ready to explore',
      body: 'Try moving through time, following a route or opening a debate. You can restart this walkthrough from Guide at any time. Nothing has been imported, filtered or changed by the tour.',
      actions: [
        { id: 'open-paths', label: 'Open Paths' },
        ...(ctx.hasPersonal ? [] : [{ id: 'open-notes' as const, label: 'Open Your Notes' }]),
      ],
    },
  )
  return steps
}
