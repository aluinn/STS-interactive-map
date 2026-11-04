import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// The views are heavy (d3, canvas) and irrelevant here; the shell is what is under test.
vi.mock('../features/atlas/AtlasView', () => ({ AtlasView: () => <div>map stub</div> }))
vi.mock('../features/globe/GlobeView', () => ({ GlobeView: () => <div>globe stub</div> }))
vi.mock('../features/timeline/TimelineView', () => ({ TimelineView: () => <div>timeline</div> }))
vi.mock('../features/debates/DebatesView', () => ({ DebatesView: () => <div>debates</div> }))
vi.mock('../features/journeys/JourneysView', () => ({
  JourneysView: () => <div>paths view</div>,
}))
vi.mock('../components/CinematicIntro', () => ({
  CinematicIntro: ({ onComplete }: { onComplete: () => void }) => (
    <div role="dialog" aria-label="Cinematic introduction">
      <button onClick={onComplete}>Skip introduction</button>
    </div>
  ),
}))

import App from '../App'
import { WALKTHROUGH_KEY, readWalkthroughStatus } from '../features/walkthrough/storage'

function stubMedia(opts: { narrow?: boolean; reduce?: boolean } = {}) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: q.includes('reduced-motion')
      ? !!opts.reduce
      : q.includes('max-width: 900px')
        ? !!opts.narrow
        : q.includes('min-width: 900px')
          ? !opts.narrow
          : false,
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

function visit(search = '') {
  window.history.replaceState(null, '', `/${search}`)
}

const tourDialog = () =>
  screen.queryByRole('dialog', { name: /welcome to the sts interactive map/i })
// jsdom hides the toggle (its CSS shows it only below 900px), so find it by its stable hook.
const filtersToggle = () =>
  document.querySelector<HTMLButtonElement>('[data-walkthrough="sidebar-toggle"]')!
const intro = () => screen.queryByRole('dialog', { name: /cinematic introduction/i })

/** Lets the short delay before the welcome card elapse. */
async function afterDelay() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 700))
  })
}

beforeEach(() => {
  window.scrollTo = () => {}
  localStorage.clear()
  stubMedia()
  visit()
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  document.documentElement.removeAttribute('style')
})

describe('first-time visit', () => {
  it('does not show the welcome card over the cinematic intro, then offers it after skipping', async () => {
    render(<App />)
    expect(intro()).toBeInTheDocument()
    await afterDelay()
    expect(tourDialog()).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Skip introduction' }))
    await waitFor(() => expect(tourDialog()).toBeInTheDocument(), { timeout: 2000 })
    expect(screen.getByRole('button', { name: 'Start tour' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Explore independently' })).toBeInTheDocument()
  })

  it('offers it straight away when the intro has been seen before', async () => {
    localStorage.setItem('atlas-intro-seen', '1')
    render(<App />)
    expect(intro()).not.toBeInTheDocument()
    await waitFor(() => expect(tourDialog()).toBeInTheDocument(), { timeout: 2000 })
  })

  it('"Explore on my own" dismisses it and it is not offered again', async () => {
    localStorage.setItem('atlas-intro-seen', '1')
    const first = render(<App />)
    await waitFor(() => expect(tourDialog()).toBeInTheDocument(), { timeout: 2000 })
    await userEvent.click(screen.getByRole('button', { name: 'Explore independently' }))
    expect(tourDialog()).not.toBeInTheDocument()
    expect(readWalkthroughStatus()).toBe('dismissed')
    first.unmount()

    render(<App />)
    await afterDelay()
    expect(tourDialog()).not.toBeInTheDocument()
  })

  it('remembers completion', async () => {
    localStorage.setItem('atlas-intro-seen', '1')
    const user = userEvent.setup()
    const first = render(<App />)
    await waitFor(() => expect(tourDialog()).toBeInTheDocument(), { timeout: 2000 })
    await user.click(screen.getByRole('button', { name: 'Start tour' }))
    for (
      let i = 0;
      i < 20 && screen.queryByRole('button', { name: 'Begin exploring' }) === null;
      i++
    )
      await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Begin exploring' }))
    expect(JSON.parse(localStorage.getItem(WALKTHROUGH_KEY)!).status).toBe('completed')
    first.unmount()
    render(<App />)
    await afterDelay()
    expect(tourDialog()).not.toBeInTheDocument()
  })
})

describe('deep links', () => {
  for (const [name, search] of [
    ['an entry', '?entry=anything'],
    ['a debate', '?view=debates&debate=x'],
    ['a journey', '?view=journeys&journey=x'],
    ['another view', '?view=timeline'],
    ['a filtered state', '?q=kepler'],
    ['a chosen period', '?era=ancient'],
  ] as const)
    it(`do not trigger it automatically (${name})`, async () => {
      localStorage.setItem('atlas-intro-seen', '1')
      visit(search)
      render(<App />)
      await afterDelay()
      expect(tourDialog()).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Guide' })).toBeInTheDocument()
    })
})

describe('Guide button', () => {
  beforeEach(() => localStorage.setItem('atlas-intro-seen', '1'))

  it('reopens the walkthrough at any time, even a deep link, and returns focus to itself', async () => {
    visit('?view=timeline&q=kepler')
    render(<App />)
    const guide = screen.getByRole('button', { name: 'Guide' })
    await userEvent.click(guide)
    expect(tourDialog()).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(tourDialog()).not.toBeInTheDocument()
    expect(guide).toHaveFocus()
    // Opening and closing the tour leaves the URL state untouched.
    expect(window.location.search).toBe('?view=timeline&q=kepler')
  })

  it('stays available after completion and replays', async () => {
    localStorage.setItem(WALKTHROUGH_KEY, JSON.stringify({ status: 'completed' }))
    render(<App />)
    await afterDelay()
    expect(tourDialog()).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Guide' }))
    expect(tourDialog()).toBeInTheDocument()
    // Closing early must not erase the earlier completion.
    await userEvent.keyboard('{Escape}')
    expect(readWalkthroughStatus()).toBe('completed')
  })

  it('is separate from Replay intro', async () => {
    localStorage.setItem(WALKTHROUGH_KEY, JSON.stringify({ status: 'dismissed' }))
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /replay intro/i }))
    expect(intro()).toBeInTheDocument()
    expect(tourDialog()).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Skip introduction' }))
    expect(tourDialog()).not.toBeInTheDocument() // replaying the intro does not start the tour
  })

  it('can be started from the quick reference in About', async () => {
    localStorage.setItem(WALKTHROUGH_KEY, JSON.stringify({ status: 'completed' }))
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'About' }))
    expect(screen.getByRole('heading', { name: 'How to use the atlas' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Start the guided tour' }))
    expect(tourDialog()).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'About this atlas' })).not.toBeInTheDocument()
  })

  it('does not touch filters, collections, notes or bookmarks, or the history stack', async () => {
    visit('?q=darwin&kinds=person')
    localStorage.setItem('atlas-notebook', '[]')
    localStorage.setItem('atlas-collection-mode', 'curated')
    const before = {
      search: window.location.search,
      length: window.history.length,
      store: JSON.stringify({ ...localStorage }),
    }
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Guide' }))
    for (
      let i = 0;
      i < 20 && screen.queryByRole('button', { name: 'Begin exploring' }) === null;
      i++
    )
      await user.click(
        screen.queryByRole('button', { name: 'Start tour' }) ??
          screen.getByRole('button', { name: 'Next' }),
      )
    await user.click(screen.getByRole('button', { name: 'Begin exploring' }))
    expect(window.location.search).toBe(before.search)
    expect(window.history.length).toBe(before.length)
    const after = JSON.parse(JSON.stringify({ ...localStorage }))
    const old = JSON.parse(before.store)
    for (const k of Object.keys(old)) expect(after[k], k).toBe(old[k])
    // The only new key is the walkthrough's own.
    expect(Object.keys(after).filter((k) => !(k in old))).toContain(WALKTHROUGH_KEY)
    expect((screen.getByLabelText(/search entries/i) as HTMLInputElement).value).toBe('darwin')
  })

  it('"Open Paths" on the last step switches to Paths; nothing starts automatically', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Guide' }))
    for (let i = 0; i < 20 && screen.queryByRole('button', { name: 'Open Paths' }) === null; i++)
      await user.click(
        screen.queryByRole('button', { name: 'Start tour' }) ??
          screen.getByRole('button', { name: 'Next' }),
      )
    await user.click(screen.getByRole('button', { name: 'Open Paths' }))
    expect(window.location.search).toBe('?view=journeys')
    expect(screen.getByText('paths view')).toBeInTheDocument()
    expect(tourDialog()).not.toBeInTheDocument()
  })
})

describe('narrow screens', () => {
  beforeEach(() => {
    localStorage.setItem('atlas-intro-seen', '1')
    stubMedia({ narrow: true })
  })

  async function walkTo(user: ReturnType<typeof userEvent.setup>, heading: RegExp) {
    await user.click(screen.getByRole('button', { name: 'Guide' }))
    await user.click(screen.getByRole('button', { name: 'Start tour' }))
    for (let i = 0; i < 20 && !screen.queryByRole('heading', { name: heading }); i++)
      await user.click(screen.getByRole('button', { name: 'Next' }))
  }

  it('points at the filters button first, opens the sidebar for the filter steps, then restores it', async () => {
    const user = userEvent.setup()
    render(<App />)
    const toggle = filtersToggle()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await walkTo(user, /^Filters and legend$/)
    expect(document.getElementById('filters-sidebar')).toHaveAttribute('hidden')

    await user.click(screen.getByRole('button', { name: 'Next' })) // collections
    expect(
      screen.getByRole('heading', { name: /General Notes and Your Notes/ }),
    ).toBeInTheDocument()
    expect(document.getElementById('filters-sidebar')).not.toHaveAttribute('hidden')

    await user.click(screen.getByRole('button', { name: 'Next' })) // filters
    expect(document.getElementById('filters-sidebar')).not.toHaveAttribute('hidden')

    await user.click(screen.getByRole('button', { name: 'Next' })) // periods: no sidebar needed
    expect(document.getElementById('filters-sidebar')).toHaveAttribute('hidden')
  })

  it('restores the sidebar when the tour is skipped partway', async () => {
    const user = userEvent.setup()
    render(<App />)
    await walkTo(user, /General Notes and Your Notes/)
    expect(document.getElementById('filters-sidebar')).not.toHaveAttribute('hidden')
    await user.click(screen.getByRole('button', { name: 'Skip tour' }))
    expect(document.getElementById('filters-sidebar')).toHaveAttribute('hidden')
    expect(filtersToggle()).toHaveAttribute('aria-expanded', 'false')
  })

  it('leaves an already-open sidebar open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(filtersToggle())
    await walkTo(user, /General Notes and Your Notes/)
    expect(screen.queryByRole('heading', { name: /^Filters and legend$/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Skip tour' }))
    expect(document.getElementById('filters-sidebar')).not.toHaveAttribute('hidden')
  })
})
