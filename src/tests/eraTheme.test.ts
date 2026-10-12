import { describe, expect, it } from 'vitest'
import { ERAS } from '../utils/eras'
import { ERA_THEMES, eraThemeFor, onBurgundy, themeToCssVars } from '../features/eras/eraTheme'
import { contrastRatio } from '../utils/contrast'

describe('era themes', () => {
  it('define a theme for every period', () => {
    for (const era of ERAS) expect(eraThemeFor(era.id), era.id).not.toBeNull()
  })

  for (const era of ERAS) {
    const c = ERA_THEMES[era.id].colour
    describe(era.label, () => {
      // [foreground, background, minimum ratio, what it is]
      const pairs: [string, string, number, string][] = [
        [c.ink, c.bg, 7, 'body text on page'],
        [c.ink, c.bgElevated, 7, 'body text on panels'],
        [c.ink, c.parchment, 4.5, 'text on raised controls'],
        [c.ink, c.parchmentElevated, 4.5, 'text on hovered controls'],
        [c.inkDim, c.bg, 4.5, 'secondary text on page'],
        [c.inkDim, c.bgElevated, 4.5, 'secondary text on panels'],
        [c.inkFaint, c.bg, 4.5, 'muted text on page'],
        [c.inkFaint, c.bgElevated, 4.5, 'muted text on panels'],
        [c.link, c.bgElevated, 4.5, 'links on panels'],
        [c.link, c.bg, 4.5, 'links on page'],
        [c.goldBright, c.bgElevated, 4.5, 'accent headings on panels'],
        [c.charcoal, c.gold, 4.5, 'text on accent buttons'],
        [c.bg, c.gold, 4.5, 'text on accent fills'],
        [onBurgundy(c), c.burgundy, 4.5, 'text on hovered reset buttons'],
        [c.burgundyBright, c.bgElevated, 4.5, 'warning text on panels'],
        [c.greenBright, c.bgElevated, 4.5, 'section labels on panels'],
        [c.focus, c.bg, 3, 'focus ring on page'],
        [c.focus, c.bgElevated, 3, 'focus ring on panels'],
        [c.borderStrong, c.bg, 3, 'control borders on page'],
        [c.gold, c.bgElevated, 3, 'accent graphics on panels'],
      ]
      for (const [fg, bg, min, what] of pairs) {
        it(`${what} reaches ${min}:1`, () => {
          expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min)
        })
      }
    })
  }

  it('provides every token the stylesheet expects', () => {
    const vars = themeToCssVars(ERA_THEMES['platform-age'], { translucent: true })
    for (const name of ['--color-bg', '--color-ink', '--surface-translucent', '--font-body']) {
      expect(vars[name]).toBeTruthy()
    }
  })
})
