import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Walkthrough } from '../features/walkthrough/Walkthrough'
import { buildWalkthroughSteps } from '../features/walkthrough/walkthroughSteps'
import { computePlacement } from '../features/walkthrough/placement'
import {
  WALKTHROUGH_KEY,
  readWalkthroughStatus,
  recordWalkthroughStatus,
  shouldOfferWalkthrough,
} from '../features/walkthrough/storage'
import type { WalkthroughContext, WalkthroughStep } from '../features/walkthrough/types'
import { ERAS } from '../utils/eras'
import { ERA_THEMES, ERA_THEMES_LIGHT, themeToCssVars } from '../features/eras/eraTheme'
import { contrastRatio } from '../utils/contrast'

const ctx: WalkthroughContext = {
  view: 'atlas',
  globe: false,
  hasPersonal: false,
  entryOpen: false,
  sidebarCollapsible: false,
  sidebarClosed: false,
}

function stubMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: reduce && q.includes('reduced-motion'),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

/** Gives an element a real-looking position, since jsdom lays nothing out. */
function place(el: Element, top = 100, left = 100, width = 200, height = 60) {
  el.getBoundingClientRect = () =>
    ({
      top,
      left,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
    }) as DOMRect
}

beforeEach(() => {
  localStorage.clear()
  stubMotion(false)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('walkthrough content', () => {
  it('has 7-10 steps, each 30-70 words, starting with a welcome and ending with a finish', () => {
    for (const c of [ctx, { ...ctx, sidebarCollapsible: true, sidebarClosed: true }]) {
      const steps = buildWalkthroughSteps(c)
      expect(steps.length).toBeGreaterThanOrEqual(7)
      expect(steps.length).toBeLessThanOrEqual(10)
      expect(steps[0].id).toBe('welcome')
      expect(steps.at(-1)!.id).toBe('done')
      for (const s of steps) {
        const words = s.body.split(/\s+/).length
        expect(words, s.id).toBeGreaterThanOrEqual(30)
        expect(words, s.id).toBeLessThanOrEqual(70)
        if (s.targets) expect(s.targetLabel, s.id).toBeTruthy()
      }
    }
  })

  it('adapts the map step to the modern globe and the entry step to an open panel', () => {
    const map = (c: WalkthroughContext) => buildWalkthroughSteps(c).find((s) => s.id === 'map')!
    expect(map(ctx).body).toMatch(/historical map/)
    expect(map({ ...ctx, globe: true }).body).toMatch(/modern globe/)
    const entry = (c: WalkthroughContext) =>
      buildWalkthroughSteps(c).find((s) => s.id === 'entries')!
    expect(entry(ctx).targets).toEqual(['atlas-surface'])
    expect(entry({ ...ctx, entryOpen: true }).targets?.[0]).toBe('entry-panel')
  })

  it('does not imply a personal collection exists when there is none', () => {
    const body = (c: WalkthroughContext) =>
      buildWalkthroughSteps(c).find((s) => s.id === 'collections')!.body
    expect(body(ctx)).toMatch(/not added any notes/)
    expect(body({ ...ctx, hasPersonal: true })).toMatch(/already have/)
    const last = buildWalkthroughSteps(ctx).at(-1)!
    expect(last.actions?.map((a) => a.id)).toEqual(['open-paths', 'open-notes'])
    expect(
      buildWalkthroughSteps({ ...ctx, hasPersonal: true })
        .at(-1)!
        .actions?.map((a) => a.id),
    ).toEqual(['open-paths'])
  })

  it('adds the filters-button step only on a narrow screen with the sidebar closed', () => {
    const ids = (c: WalkthroughContext) => buildWalkthroughSteps(c).map((s) => s.id)
    expect(ids(ctx)).not.toContain('sidebar-toggle')
    expect(ids({ ...ctx, sidebarCollapsible: true, sidebarClosed: true })).toContain(
      'sidebar-toggle',
    )
    expect(ids({ ...ctx, sidebarCollapsible: true, sidebarClosed: false })).not.toContain(
      'sidebar-toggle',
    )
  })
})

describe('first-visit eligibility and storage', () => {
  const base = { landing: true, introDone: true, status: null, offeredThisVisit: false } as const
  it('offers the tour on a first landing visit once the intro is done', () => {
    expect(shouldOfferWalkthrough(base)).toBe(true)
  })
  it('never offers it over the cinematic intro', () => {
    expect(shouldOfferWalkthrough({ ...base, introDone: false })).toBe(false)
  })
  it('does not offer it on deep links, after a decision, or twice in a visit', () => {
    expect(shouldOfferWalkthrough({ ...base, landing: false })).toBe(false)
    expect(shouldOfferWalkthrough({ ...base, status: 'dismissed' })).toBe(false)
    expect(shouldOfferWalkthrough({ ...base, status: 'completed' })).toBe(false)
    expect(shouldOfferWalkthrough({ ...base, offeredThisVisit: true })).toBe(false)
  })
  it('stores its own versioned key, separate from the intro key', () => {
    expect(WALKTHROUGH_KEY).toBe('sts-walkthrough:v1')
    expect(WALKTHROUGH_KEY).not.toBe('atlas-intro-seen')
    recordWalkthroughStatus('completed')
    expect(readWalkthroughStatus()).toBe('completed')
    expect(localStorage.getItem('atlas-intro-seen')).toBeNull()
  })
  it('does not let a later skip overwrite a completion', () => {
    recordWalkthroughStatus('completed')
    recordWalkthroughStatus('dismissed')
    expect(readWalkthroughStatus()).toBe('completed')
  })
  it('ignores damaged or unavailable storage', () => {
    localStorage.setItem(WALKTHROUGH_KEY, '{not json')
    expect(readWalkthroughStatus()).toBeNull()
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    })
    expect(readWalkthroughStatus()).toBeNull()
    expect(() => recordWalkthroughStatus('completed')).not.toThrow()
  })
})

describe('card placement', () => {
  const viewport = { width: 1200, height: 800 }
  const card = { width: 380, height: 260 }
  it('centres the card with no target', () => {
    expect(computePlacement({ target: null, card, viewport, sheet: false }).mode).toBe('center')
  })
  it('puts the card beside the target without covering it, inside the viewport', () => {
    const target = { top: 20, left: 40, width: 400, height: 50 }
    const p = computePlacement({ target, card, viewport, sheet: false })
    expect(p.side).toBe('bottom')
    expect(p.top).toBeGreaterThanOrEqual(target.top + target.height)
    expect(p.left + card.width).toBeLessThanOrEqual(viewport.width)
  })
  it('keeps the card on screen when the target is at the right edge', () => {
    const target = { top: 20, left: 1100, width: 90, height: 40 }
    const p = computePlacement({ target, card, viewport, sheet: false })
    expect(p.left + card.width).toBeLessThanOrEqual(viewport.width - 16)
  })
  it('falls back to a corner for a target that fills the screen', () => {
    const target = { top: 0, left: 0, width: 1200, height: 800 }
    const p = computePlacement({ target, card, viewport, sheet: false })
    expect(p.side).toBe('corner')
    expect(p.top + card.height).toBeLessThanOrEqual(viewport.height)
  })
  it('uses a sheet on the side away from the target on narrow screens', () => {
    const narrow = { width: 390, height: 800 }
    const slider = { top: 700, left: 8, width: 374, height: 80 }
    const header = { top: 10, left: 8, width: 374, height: 40 }
    expect(computePlacement({ target: slider, card, viewport: narrow, sheet: true }).mode).toBe(
      'sheet-top',
    )
    expect(computePlacement({ target: header, card, viewport: narrow, sheet: true }).mode).toBe(
      'sheet-bottom',
    )
  })
})

function Harness({
  steps,
  onClose = () => {},
  onStepChange,
}: {
  steps: WalkthroughStep[]
  onClose?: (r: unknown) => void
  onStepChange?: (s: WalkthroughStep) => void
}) {
  return (
    <>
      <button data-walkthrough="guide-button">Guide</button>
      <nav data-walkthrough="main-navigation">tabs</nav>
      <Walkthrough steps={steps} onClose={onClose} onStepChange={onStepChange} />
    </>
  )
}

describe('Walkthrough component', () => {
  const steps = buildWalkthroughSteps(ctx)

  it('opens as a labelled modal dialog with focus inside and a progress count', () => {
    render(<Harness steps={steps} />)
    const dialog = screen.getByRole('dialog', { name: /welcome to the sts interactive map/i })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveFocus()
    expect(screen.getByText(`1 of ${steps.length}`)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(`Step 1 of ${steps.length}`)
  })

  it('moves with Next and Previous, and with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<Harness steps={steps} />)
    await user.click(screen.getByRole('button', { name: 'Start tour' }))
    expect(screen.getByRole('heading', { name: steps[1].title })).toBeInTheDocument()
    expect(screen.getByText(`2 of ${steps.length}`)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('heading', { name: steps[2].title })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Previous' }))
    expect(screen.getByRole('heading', { name: steps[1].title })).toBeInTheDocument()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('heading', { name: steps[2].title })).toBeInTheDocument()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('heading', { name: steps[1].title })).toBeInTheDocument()
  })

  it('"Explore independently" dismisses and remembers it', async () => {
    const onClose = vi.fn()
    render(<Harness steps={steps} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Explore independently' }))
    expect(onClose).toHaveBeenCalledWith({ status: 'dismissed', action: undefined })
    expect(readWalkthroughStatus()).toBe('dismissed')
  })

  it('Escape skips the tour, even when something underneath also listens for Escape', async () => {
    const onClose = vi.fn()
    const underneath = vi.fn()
    document.addEventListener('keydown', underneath)
    render(<Harness steps={steps} onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledWith({ status: 'dismissed', action: undefined })
    expect(underneath).not.toHaveBeenCalled()
    document.removeEventListener('keydown', underneath)
  })

  it('finishing records completion and can pass on an action', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Harness steps={steps} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Start tour' }))
    for (let i = 1; i < steps.length - 1; i++) {
      await user.click(screen.getByRole('button', { name: 'Next' }))
    }
    expect(screen.queryByRole('button', { name: 'Skip tour' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open Paths' }))
    expect(onClose).toHaveBeenCalledWith({ status: 'completed', action: 'open-paths' })
    expect(readWalkthroughStatus()).toBe('completed')
  })

  it('restores focus to the element that opened it', () => {
    function Opener() {
      return (
        <>
          <button id="opener">Open</button>
        </>
      )
    }
    render(<Opener />)
    const opener = document.getElementById('opener')!
    opener.focus()
    const view = render(<Harness steps={steps} />)
    expect(screen.getByRole('dialog')).toHaveFocus()
    view.unmount()
    expect(opener).toHaveFocus()
  })

  it('falls back to the Guide button when nothing specific had focus', () => {
    const guide = document.createElement('button')
    guide.setAttribute('data-walkthrough', 'guide-button')
    document.body.appendChild(guide)
    const view = render(<Walkthrough steps={steps} onClose={() => {}} />)
    view.unmount()
    expect(guide).toHaveFocus()
  })

  it('keeps Tab inside the card', async () => {
    const user = userEvent.setup()
    render(<Harness steps={steps} />)
    const dialog = screen.getByRole('dialog')
    for (let i = 0; i < 6; i++) {
      await user.tab()
      expect(dialog.contains(document.activeElement)).toBe(true)
    }
    await user.tab({ shift: true })
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('shows a centred fallback card when the target is missing', async () => {
    const user = userEvent.setup()
    render(<Walkthrough steps={steps} onClose={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Start tour' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('data-mode', 'center')
    expect(dialog).toHaveAttribute('data-fallback', 'true')
    expect(screen.queryByTestId('walkthrough-spotlight')).not.toBeInTheDocument()
    expect(screen.getByText(/Main views navigation: not on screen/)).toBeInTheDocument()
    // Still fully navigable.
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(`3 of ${steps.length}`)).toBeInTheDocument()
  })

  it('spotlights a present target and names it in the text', async () => {
    const user = userEvent.setup()
    render(<Harness steps={steps} />)
    place(document.querySelector('[data-walkthrough="main-navigation"]')!, 20, 300, 400, 40)
    await user.click(screen.getByRole('button', { name: 'Start tour' }))
    const spot = await screen.findByTestId('walkthrough-spotlight')
    expect(spot).toHaveStyle({ top: '12px', left: '292px' })
    expect(screen.getByText('Highlighted: Main views navigation')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('data-mode', 'anchored')
  })

  it('reports each step so the app can prepare it', async () => {
    const onStepChange = vi.fn()
    render(<Harness steps={steps} onStepChange={onStepChange} />)
    expect(onStepChange).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'welcome' }))
    await userEvent.click(screen.getByRole('button', { name: 'Start tour' }))
    expect(onStepChange).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'views' }))
  })

  it('does not animate the spotlight when reduced motion is requested', () => {
    stubMotion(true)
    render(<Harness steps={steps} />)
    expect(screen.getByTestId('walkthrough-root')).toHaveAttribute('data-motion', 'none')
  })

  it('animates normally otherwise', () => {
    render(<Harness steps={steps} />)
    expect(screen.getByTestId('walkthrough-root')).toHaveAttribute('data-motion', 'smooth')
  })

  it('does not scroll or pan anything for a target already in view', async () => {
    const scroll = vi.fn()
    render(<Harness steps={steps} />)
    const nav = document.querySelector('[data-walkthrough="main-navigation"]') as HTMLElement
    place(nav, 20, 100, 300, 40)
    nav.scrollIntoView = scroll
    await userEvent.click(screen.getByRole('button', { name: 'Start tour' }))
    await screen.findByTestId('walkthrough-spotlight')
    await act(async () => {})
    expect(scroll).not.toHaveBeenCalled()
  })

  it('scrolls an off-screen target into view instantly under reduced motion', async () => {
    stubMotion(true)
    const scroll = vi.fn()
    render(<Harness steps={steps} />)
    const nav = document.querySelector('[data-walkthrough="main-navigation"]') as HTMLElement
    place(nav, 5000, 100, 300, 40)
    nav.scrollIntoView = scroll
    await userEvent.click(screen.getByRole('button', { name: 'Start tour' }))
    await waitFor(() => expect(scroll).toHaveBeenCalledWith({ block: 'center', behavior: 'auto' }))
  })
})

/** Flattens an rgba() fill onto a hex background, as the browser would paint it. */
function flatten(fill: string, over: string): string {
  const m = fill.match(/rgba?\(([^)]+)\)/)
  if (!m) return fill
  const [r, g, b, a = '1'] = m[1].split(',').map((x) => parseFloat(x))
  const o = over.replace('#', '')
  const base = [0, 2, 4].map((i) => parseInt(o.slice(i, i + 2), 16))
  const mix = [r, g, b].map((v, i) => Math.round(v * +a + base[i] * (1 - +a)))
  return `#${mix.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

describe('readability in every period theme', () => {
  // The card sits on the elevated surface; its buttons on raised or accent fills.
  for (const [mode, set] of [
    ['dark', ERA_THEMES],
    ['light', ERA_THEMES_LIGHT],
  ] as const)
    for (const era of ERAS) {
      const t = set[era.id]
      const c = t.colour
      it(`${era.label} (${mode}): card text, buttons and focus ring are legible`, () => {
        const pairs: [string, string, number][] = [
          [c.ink, c.bgElevated, 7], // title and body
          [c.inkDim, c.bgElevated, 4.5], // progress and target caption
          [c.ink, c.parchment, 4.5], // secondary buttons
          [t.active.fg, flatten(t.active.bg, c.bgElevated), 4.5], // primary button
          [c.focus, c.bgElevated, 3],
          [c.gold, c.bgElevated, 3], // spotlight ring and progress bar
        ]
        for (const [fg, bg, min] of pairs) expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min)
      })
    }

  it('the modern satellite-era theme uses a translucent surface the card can sit on', () => {
    const vars = themeToCssVars(ERA_THEMES['platform-age'], { translucent: true })
    expect(vars['--surface-translucent']).toBeTruthy()
    expect(vars['--overlay-scrim']).toBeTruthy()
  })
})
