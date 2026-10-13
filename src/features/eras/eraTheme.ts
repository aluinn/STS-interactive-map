import type { EraId } from '../../utils/eras'
import { contrastRatio } from '../../utils/contrast'

/**
 * The single place that says what every period looks like.
 *
 * Each theme gives values for the shared design tokens. `applyEraTheme`
 * writes them onto <html> when the period changes (never per frame), and the
 * browser interpolates the registered colour tokens, so panels, controls,
 * map and typography move together. "All Time" and the consistent accessible
 * theme have no entry here: they use the stylesheet defaults in tokens.css.
 */

export interface EraTheme {
  /** Native form controls and scrollbars follow this. */
  scheme: 'light' | 'dark'
  colour: {
    bg: string
    bgElevated: string
    parchment: string
    parchmentElevated: string
    ink: string
    inkDim: string
    inkFaint: string
    border: string
    borderStrong: string
    /** Primary accent; `charcoal` is the text colour used on top of it. */
    gold: string
    goldBright: string
    burgundy: string
    burgundyBright: string
    green: string
    greenBright: string
    charcoal: string
    focus: string
    link: string
    scrim: string
  }
  /** Panel surface; translucent in the satellite era. */
  surface: { translucent: string; opaque: string; backdrop: string; shadow: string; glow: string }
  /** What an "active" tab/chip looks like. */
  active: { bg: string; fg: string; edge: string; underline: string }
  type: { display: string; body: string; ui: string; meta: string; headingTransform: string }
  shape: { sm: string; md: string; lg: string; trackHeight: string }
  chart: {
    paper: string
    deep: string
    ink: string
    routeAccent: string
    routePrimary: string
    markerFill: string
    markerInk: string
    markerSelected: string
    clusterFill: string
    clusterInk: string
    labelHalo: string
    font: string
    markerStroke: string
    aged: string
    clusterOpacity: string
    clusterStroke: string
    clusterStrokeWidth: string
  }
  searchIcon: string
}

const SERIF_DISPLAY = "'Cormorant Garamond', 'EB Garamond', Georgia, serif"
const SERIF_BODY = "'EB Garamond', 'IM Fell English', Georgia, serif"

const searchIconFor = (hex: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${hex}' stroke-width='2' stroke-linecap='round'><circle cx='11' cy='11' r='7'/><path d='M20 20l-3.5-3.5'/></svg>`,
  )}")`

const flat = (shadow: string) => ({
  translucent: 'transparent',
  opaque: 'transparent',
  backdrop: 'none',
  shadow,
  glow: 'rgba(0, 0, 0, 0)',
})

const hexToRgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}
/** A quiet "selected" look: tinted fill, accent edge and underline, normal text. */
const classicActive = (accent: string, ink: string) => ({
  bg: hexToRgba(accent, 0.2),
  fg: ink,
  edge: accent,
  underline: accent,
})
const classicType = {
  display: SERIF_DISPLAY,
  body: SERIF_BODY,
  ui: SERIF_BODY,
  meta: SERIF_BODY,
  headingTransform: 'none',
}

export const ERA_THEMES: Record<EraId, EraTheme> = {
  // Sand, ochre, clay red and papyrus cream.
  ancient: {
    scheme: 'dark',
    colour: {
      bg: '#181510',
      bgElevated: '#211c15',
      parchment: '#2d261c',
      parchmentElevated: '#393123',
      ink: '#efe3c4',
      inkDim: '#c4b48f',
      inkFaint: '#a1916c',
      border: '#4b4030',
      borderStrong: '#85714c',
      gold: '#c49a58',
      goldBright: '#dbb778',
      burgundy: '#9a4a38',
      burgundyBright: '#e0a090',
      green: '#8a9a63',
      greenBright: '#a9bc7d',
      charcoal: '#181510',
      focus: '#dbb778',
      link: '#d8b57e',
      scrim: 'rgba(14, 10, 6, 0.85)',
    },
    surface: flat('0 6px 22px rgba(0, 0, 0, 0.45)'),
    active: classicActive('#c49a58', '#efe3c4'),
    type: classicType,
    shape: { sm: '2px', md: '3px', lg: '6px', trackHeight: '5px' },
    chart: {
      paper: '#dcc590',
      deep: '#c2a265',
      ink: '#2a1d0e',
      routeAccent: '#8a4a1c',
      routePrimary: '#7a2f1c',
      markerFill: '#f0deb0',
      markerInk: '#2a1d0e',
      markerSelected: '#7a2f1c',
      clusterFill: '#7a3b1c',
      clusterInk: '#f3e3b8',
      labelHalo: '#dcc590',
      font: SERIF_DISPLAY,
      markerStroke: '2.2px',
      aged: '1',
      clusterOpacity: '0.92',
      clusterStroke: '#2a1d0e',
      clusterStrokeWidth: '1.4',
    },
    searchIcon: 'none',
  },
  // Vellum, manuscript red and ultramarine.
  medieval: {
    scheme: 'dark',
    colour: {
      bg: '#171310',
      bgElevated: '#201a16',
      parchment: '#2c241f',
      parchmentElevated: '#382f28',
      ink: '#f0e6d0',
      inkDim: '#c9b9a0',
      inkFaint: '#a49580',
      border: '#4a3d34',
      borderStrong: '#85725e',
      gold: '#c4a465',
      goldBright: '#dcc084',
      burgundy: '#8f3a44',
      burgundyBright: '#e0a0a6',
      green: '#5f7fd8',
      greenBright: '#9db4f2',
      charcoal: '#171310',
      focus: '#dcc084',
      link: '#a7b6dc',
      scrim: 'rgba(14, 10, 9, 0.85)',
    },
    surface: flat('0 6px 22px rgba(0, 0, 0, 0.45)'),
    active: classicActive('#c4a465', '#f0e6d0'),
    type: classicType,
    shape: { sm: '2px', md: '4px', lg: '8px', trackHeight: '4px' },
    chart: {
      paper: '#e2d4a8',
      deep: '#cab984',
      ink: '#2b2218',
      routeAccent: '#264a73',
      routePrimary: '#7a2a3a',
      markerFill: '#f2e7c4',
      markerInk: '#2b2218',
      markerSelected: '#7a2a3a',
      clusterFill: '#2c3f78',
      clusterInk: '#f6ecca',
      labelHalo: '#e2d4a8',
      font: SERIF_DISPLAY,
      markerStroke: '1.6px',
      aged: '1',
      clusterOpacity: '0.92',
      clusterStroke: '#2b2218',
      clusterStrokeWidth: '1.4',
    },
    searchIcon: 'none',
  },
  // Ivory, sepia, oxidised green, navy and copper.
  'early-modern': {
    scheme: 'dark',
    colour: {
      bg: '#14161a',
      bgElevated: '#1c1f24',
      parchment: '#272b31',
      parchmentElevated: '#32373e',
      ink: '#efe8d6',
      inkDim: '#c0bba9',
      inkFaint: '#9aa0a3',
      border: '#3a3f46',
      borderStrong: '#76808b',
      gold: '#b98c62',
      goldBright: '#d3a982',
      burgundy: '#8f3f42',
      burgundyBright: '#e08b8d',
      green: '#5f8f72',
      greenBright: '#85b99a',
      charcoal: '#14161a',
      focus: '#d3a982',
      link: '#9db5d0',
      scrim: 'rgba(8, 12, 18, 0.85)',
    },
    surface: flat('0 6px 22px rgba(0, 0, 0, 0.45)'),
    active: classicActive('#b98c62', '#efe8d6'),
    type: classicType,
    shape: { sm: '2px', md: '4px', lg: '8px', trackHeight: '3px' },
    chart: {
      paper: '#d3bf90',
      deep: '#b8a06c',
      ink: '#1f1810',
      routeAccent: '#6b2a2d',
      routePrimary: '#5c2023',
      markerFill: '#ead9ac',
      markerInk: '#1f1810',
      markerSelected: '#5c2023',
      clusterFill: '#5c2023',
      clusterInk: '#ead9ac',
      labelHalo: '#d3bf90',
      font: SERIF_DISPLAY,
      markerStroke: '1.2px',
      aged: '1',
      clusterOpacity: '0.92',
      clusterStroke: '#1f1810',
      clusterStrokeWidth: '1.4',
    },
    searchIcon: 'none',
  },
  // Survey cream, soot grey, brass, forest green, faded burgundy.
  'industry-empire': {
    scheme: 'dark',
    colour: {
      bg: '#16171a',
      bgElevated: '#1f2124',
      parchment: '#2a2c2f',
      parchmentElevated: '#35383b',
      ink: '#ebe7d8',
      inkDim: '#bdb9a8',
      inkFaint: '#9a9786',
      border: '#3d3f42',
      borderStrong: '#7b7d7a',
      gold: '#b9a15e',
      goldBright: '#d3bd7e',
      burgundy: '#8a4446',
      burgundyBright: '#d98a8c',
      green: '#4f7d5f',
      greenBright: '#7fb592',
      charcoal: '#16171a',
      focus: '#d3bd7e',
      link: '#d3bd7e',
      scrim: 'rgba(10, 11, 13, 0.86)',
    },
    surface: flat('0 6px 22px rgba(0, 0, 0, 0.45)'),
    active: classicActive('#b9a15e', '#ebe7d8'),
    type: classicType,
    shape: { sm: '1px', md: '2px', lg: '4px', trackHeight: '4px' },
    chart: {
      paper: '#d0c7a6',
      deep: '#b4ad8c',
      ink: '#1d1a12',
      routeAccent: '#8b6a1e',
      routePrimary: '#5a3a1a',
      markerFill: '#e6dfc2',
      markerInk: '#1d1a12',
      markerSelected: '#5a3a1a',
      clusterFill: '#5b4a1a',
      clusterInk: '#f0e9ce',
      labelHalo: '#d0c7a6',
      font: SERIF_DISPLAY,
      markerStroke: '1.5px',
      aged: '0.8',
      clusterOpacity: '0.94',
      clusterStroke: '#1d1a12',
      clusterStrokeWidth: '1.4',
    },
    searchIcon: 'none',
  },
  // Desaturated archive paper, steel blue, graphite, muted red.
  'modern-conflict': {
    scheme: 'dark',
    colour: {
      bg: '#14181d',
      bgElevated: '#1c2229',
      parchment: '#262e37',
      parchmentElevated: '#313b46',
      ink: '#e6e9ec',
      inkDim: '#b7bec6',
      inkFaint: '#929ba5',
      border: '#35404c',
      borderStrong: '#6d7f92',
      gold: '#7f9fbd',
      goldBright: '#a4bdd4',
      burgundy: '#a04848',
      burgundyBright: '#e29090',
      green: '#6b9a90',
      greenBright: '#8fc1b6',
      charcoal: '#10151a',
      focus: '#a4bdd4',
      link: '#a4bdd4',
      scrim: 'rgba(8, 11, 14, 0.86)',
    },
    surface: flat('0 6px 22px rgba(0, 0, 0, 0.45)'),
    active: classicActive('#7f9fbd', '#e6e9ec'),
    type: classicType,
    shape: { sm: '1px', md: '2px', lg: '4px', trackHeight: '3px' },
    chart: {
      paper: '#d8d5c6',
      deep: '#bfbdae',
      ink: '#1d2430',
      routeAccent: '#2f5d8a',
      routePrimary: '#7a3030',
      markerFill: '#eceadb',
      markerInk: '#1d2430',
      markerSelected: '#7a3030',
      clusterFill: '#243b57',
      clusterInk: '#eceadb',
      labelHalo: '#d8d5c6',
      font: SERIF_DISPLAY,
      markerStroke: '1.3px',
      aged: '0.5',
      clusterOpacity: '0.94',
      clusterStroke: '#1d2430',
      clusterStrokeWidth: '1.4',
    },
    searchIcon: 'none',
  },
  // Charcoal, olive, radar green and amber.
  'cold-war': {
    scheme: 'dark',
    colour: {
      bg: '#14181a',
      bgElevated: '#1c2123',
      parchment: '#262d2c',
      parchmentElevated: '#303935',
      ink: '#e9ecdf',
      inkDim: '#bcc4b3',
      inkFaint: '#97a08f',
      border: '#3b4640',
      borderStrong: '#6f7d6f',
      gold: '#c4a04a',
      goldBright: '#dcc070',
      burgundy: '#9a4a38',
      burgundyBright: '#e8917a',
      green: '#6a8f5a',
      greenBright: '#9fd18a',
      charcoal: '#14181a',
      focus: '#dcc070',
      link: '#a3c496',
      scrim: 'rgba(10, 13, 14, 0.9)',
    },
    surface: flat('0 6px 22px rgba(0, 0, 0, 0.45)'),
    active: classicActive('#c4a04a', '#e9ecdf'),
    type: classicType,
    shape: { sm: '1px', md: '2px', lg: '3px', trackHeight: '3px' },
    chart: {
      paper: '#cbd3cd',
      deep: '#aeb9b3',
      ink: '#17222b',
      routeAccent: '#a8541a',
      routePrimary: '#1d3a4a',
      markerFill: '#e7ede9',
      markerInk: '#17222b',
      markerSelected: '#a8541a',
      clusterFill: '#1d3a4a',
      clusterInk: '#e7ede9',
      labelHalo: '#cbd3cd',
      font: SERIF_DISPLAY,
      markerStroke: '1.2px',
      aged: '0.35',
      clusterOpacity: '0.94',
      clusterStroke: '#17222b',
      clusterStrokeWidth: '1.4',
    },
    searchIcon: 'none',
  },
  // Deep navy, teal, cobalt and pale grey: the bridge to the modern interface.
  networked: {
    scheme: 'dark',
    colour: {
      bg: '#0e1620',
      bgElevated: '#141e2a',
      parchment: '#1c2837',
      parchmentElevated: '#253446',
      ink: '#e6eef6',
      inkDim: '#b6c6d8',
      inkFaint: '#90a4ba',
      border: '#2b3c50',
      borderStrong: '#587a99',
      gold: '#5fb0b4',
      goldBright: '#8bcfd2',
      burgundy: '#3f63b0',
      burgundyBright: '#a3bcf0',
      green: '#3f9f8a',
      greenBright: '#6fd0b8',
      charcoal: '#0c1624',
      focus: '#8bcfd2',
      link: '#8dc3e8',
      scrim: 'rgba(6, 12, 22, 0.8)',
    },
    surface: {
      translucent: 'rgba(18, 32, 51, 0.92)',
      opaque: '#122033',
      backdrop: 'none',
      shadow: '0 6px 22px rgba(0, 0, 0, 0.4)',
      glow: 'rgba(47, 179, 184, 0.12)',
    },
    active: classicActive('#5fb0b4', '#e6eef6'),
    type: classicType,
    shape: { sm: '3px', md: '5px', lg: '8px', trackHeight: '3px' },
    chart: {
      paper: '#dfe6e8',
      deep: '#c3cfcf',
      ink: '#16232b',
      routeAccent: '#1f6f7e',
      routePrimary: '#6b3a7a',
      markerFill: '#f5fafb',
      markerInk: '#16232b',
      markerSelected: '#6b3a7a',
      clusterFill: '#1c5b6b',
      clusterInk: '#f5fafb',
      labelHalo: '#dfe6e8',
      font: SERIF_DISPLAY,
      markerStroke: '1.1px',
      aged: '0.15',
      clusterOpacity: '0.95',
      clusterStroke: '#16232b',
      clusterStrokeWidth: '1.4',
    },
    searchIcon: searchIconFor('#90a4ba'),
  },
  // Near-black and satellite blue, electric cyan, restrained violet.
  'platform-age': {
    scheme: 'dark',
    colour: {
      bg: '#050b14',
      bgElevated: '#0a1422',
      parchment: '#0f1d30',
      parchmentElevated: '#16283f',
      ink: '#eaf4fb',
      inkDim: '#b9cadb',
      inkFaint: '#93a7ba',
      border: '#1d3550',
      borderStrong: '#4a789f',
      gold: '#22d3ee',
      goldBright: '#67e8f9',
      burgundy: '#6d3fd6',
      burgundyBright: '#c4b5fd',
      green: '#2dd4bf',
      greenBright: '#5eead4',
      charcoal: '#03111a',
      focus: '#67e8f9',
      link: '#7dd3fc',
      scrim: 'rgba(3, 8, 16, 0.78)',
    },
    surface: {
      translucent: 'rgba(8, 18, 32, 0.72)',
      opaque: '#0a1422',
      backdrop: 'blur(14px) saturate(1.2)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      glow: 'rgba(34, 211, 238, 0.18)',
    },
    active: {
      bg: 'rgba(34, 211, 238, 0.16)',
      fg: '#eaf4fb',
      edge: '#22d3ee',
      underline: '#22d3ee',
    },
    type: classicType,
    shape: { sm: '6px', md: '10px', lg: '16px', trackHeight: '4px' },
    chart: {
      paper: '#0f2133',
      deep: '#244a46',
      ink: '#d3e8ee',
      routeAccent: '#53c5d8',
      routePrimary: '#f0a35a',
      markerFill: '#dff3f8',
      markerInk: '#0b1a26',
      markerSelected: '#f0a35a',
      clusterFill: 'rgba(34, 211, 238, 0.28)',
      clusterInk: '#eaf4fb',
      labelHalo: '#0f2133',
      font: SERIF_DISPLAY,
      markerStroke: '1.1px',
      aged: '0.3',
      clusterOpacity: '1',
      clusterStroke: '#67e8f9',
      clusterStrokeWidth: '1.6',
    },
    searchIcon: searchIconFor('#93a7ba'),
  },
}

// ---- Light variants --------------------------------------------------------

type Hsl = [number, number, number]
function hexToHsl(hex: string): Hsl {
  const n = parseInt(hex.slice(1), 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return [0, 0, l]
  const sat = d / (1 - Math.abs(2 * l - 1))
  let h: number
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return [(h * 60 + 360) % 360, sat, l]
}
function hsl(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l)
  const f = (k: number) => {
    const m = (k + h / 30) % 12
    const v = l - a * Math.max(-1, Math.min(m - 3, 9 - m, 1))
    return Math.round(v * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/** Light chart palette for the one period whose dark map is a night chart. */
const LIGHT_CHART_OVERRIDES: Partial<Record<EraId, Partial<EraTheme['chart']>>> = {
  'platform-age': {
    paper: '#e4eef2',
    deep: '#c3d9d9',
    ink: '#10252f',
    routeAccent: '#1d7c90',
    routePrimary: '#b4622a',
    markerFill: '#f7fcfd',
    markerInk: '#10252f',
    markerSelected: '#b4622a',
    clusterFill: 'rgba(29, 124, 144, 0.3)',
    clusterInk: '#10252f',
    labelHalo: '#e4eef2',
    aged: '0.2',
    clusterStroke: '#1d7c90',
  },
}

/**
 * The same period in daylight: hues are taken from the dark theme, lightness
 * is flipped so the page is pale and the text and accents are dark.
 */
function lightVariant(id: EraId, t: EraTheme): EraTheme {
  const c = t.colour
  const [h, bs] = hexToHsl(c.bg)
  const tint = Math.min(0.42, Math.max(0.2, bs + 0.1))
  const [gh, gs] = hexToHsl(c.gold)
  const [bh, bgs] = hexToHsl(c.burgundy)
  const [rh, rs] = hexToHsl(c.green)
  const [lh, ls] = hexToHsl(c.link)
  const accent = (hue: number, sat: number, l: number) => hsl(hue, Math.min(0.7, sat), l)
  const gold = accent(gh, gs, 0.27)
  const bgElevated = hsl(h, tint, 0.95)
  const ink = hsl(h, 0.35, 0.11)
  const translucentAlpha = /[\d.]+\)$/.exec(t.surface.translucent)
  const translucent =
    t.surface.translucent === 'transparent'
      ? 'transparent'
      : hexToRgba(bgElevated, Math.min(1, Number(translucentAlpha?.[0].slice(0, -1) ?? 0.8) + 0.1))
  const inkFaint = hsl(h, 0.18, 0.33)
  return {
    ...t,
    scheme: 'light',
    colour: {
      bg: hsl(h, tint, 0.9),
      bgElevated,
      parchment: hsl(h, tint * 0.9, 0.85),
      parchmentElevated: hsl(h, tint * 0.9, 0.8),
      ink,
      inkDim: hsl(h, 0.25, 0.24),
      inkFaint,
      border: hsl(h, 0.2, 0.72),
      borderStrong: hsl(h, 0.2, 0.42),
      gold,
      goldBright: accent(gh, gs, 0.22),
      burgundy: accent(bh, bgs, 0.34),
      burgundyBright: accent(bh, bgs, 0.3),
      green: accent(rh, rs, 0.28),
      greenBright: accent(rh, rs, 0.24),
      charcoal: hsl(h, 0.4, 0.97),
      focus: accent(gh, gs, 0.26),
      link: accent(lh, ls, 0.27),
      scrim: hexToRgba(hsl(h, tint, 0.9), 0.85),
    },
    surface: {
      translucent,
      opaque: t.surface.opaque === 'transparent' ? 'transparent' : bgElevated,
      backdrop: t.surface.backdrop,
      shadow: '0 6px 22px rgba(40, 32, 20, 0.16)',
      glow: t.surface.glow === 'rgba(0, 0, 0, 0)' ? t.surface.glow : hexToRgba(gold, 0.14),
    },
    active: classicActive(gold, ink),
    chart: { ...t.chart, ...LIGHT_CHART_OVERRIDES[id] },
    searchIcon: t.searchIcon === 'none' ? 'none' : searchIconFor(inkFaint),
  }
}

export const ERA_THEMES_LIGHT = Object.fromEntries(
  (Object.keys(ERA_THEMES) as EraId[]).map((id) => [id, lightVariant(id, ERA_THEMES[id])]),
) as Record<EraId, EraTheme>

export type ThemeMode = 'light' | 'dark'

export function eraThemeFor(
  id: string | null | undefined,
  mode: ThemeMode = 'dark',
): EraTheme | null {
  const set = mode === 'light' ? ERA_THEMES_LIGHT : ERA_THEMES
  return id && id in set ? set[id as EraId] : null
}

/** Flattens a theme into the CSS custom properties it controls. */
/** The text colour that reads best on the theme's burgundy fill. */
export function onBurgundy(c: EraTheme['colour']): string {
  return [c.ink, c.charcoal, c.bg].sort(
    (a, b) => contrastRatio(b, c.burgundy) - contrastRatio(a, c.burgundy),
  )[0]
}

export function themeToCssVars(
  t: EraTheme,
  options: { translucent: boolean },
): Record<string, string> {
  const c = t.colour
  const surface = options.translucent ? t.surface.translucent : t.surface.opaque
  const hasSurface = t.surface.translucent !== 'transparent'
  return {
    '--color-bg': c.bg,
    '--color-bg-elevated': c.bgElevated,
    '--color-parchment': c.parchment,
    '--color-parchment-elevated': c.parchmentElevated,
    '--color-ink': c.ink,
    '--color-ink-dim': c.inkDim,
    '--color-ink-faint': c.inkFaint,
    '--color-border': c.border,
    '--color-border-strong': c.borderStrong,
    '--color-gold': c.gold,
    '--color-gold-bright': c.goldBright,
    '--color-burgundy': c.burgundy,
    '--color-burgundy-bright': c.burgundyBright,
    '--color-oxidised-green': c.green,
    '--color-oxidised-green-bright': c.greenBright,
    '--color-charcoal': c.charcoal,
    '--color-focus': c.focus,
    '--color-link': c.link,
    '--color-on-burgundy': onBurgundy(c),
    '--overlay-scrim': c.scrim,
    '--map-overlay': c.scrim.replace(/[\d.]+\)$/, '0.93)'),
    '--surface-translucent': hasSurface ? surface : c.bgElevated,
    '--panel-backdrop': options.translucent ? t.surface.backdrop : 'none',
    '--panel-shadow': t.surface.shadow,
    '--accent-glow': t.surface.glow,
    '--control-active-bg': t.active.bg,
    '--control-active-fg': t.active.fg,
    '--control-active-edge': t.active.edge,
    '--control-active-underline': t.active.underline,
    '--font-display': t.type.display,
    '--font-body': t.type.body,
    '--font-ui': t.type.ui,
    '--metadata-font': t.type.meta,
    '--radius-sm': t.shape.sm,
    '--radius-md': t.shape.md,
    '--radius-lg': t.shape.lg,
    '--track-height': t.shape.trackHeight,
    '--search-icon': t.searchIcon,
    '--search-pad': t.searchIcon === 'none' ? '' : '34px',
    '--chart-paper': t.chart.paper,
    '--chart-paper-deep': t.chart.deep,
    '--chart-ink': t.chart.ink,
    '--chart-route-accent': t.chart.routeAccent,
    '--chart-route-primary': t.chart.routePrimary,
    '--chart-marker-fill': t.chart.markerFill,
    '--chart-marker-ink': t.chart.markerInk,
    '--chart-marker-selected': t.chart.markerSelected,
    '--chart-cluster-fill': t.chart.clusterFill,
    '--chart-cluster-ink': t.chart.clusterInk,
    '--chart-label-halo': t.chart.labelHalo,
    '--chart-font': t.chart.font,
    '--marker-stroke': t.chart.markerStroke,
    '--aged': t.chart.aged,
    '--cluster-opacity': t.chart.clusterOpacity,
    '--cluster-stroke': t.chart.clusterStroke,
    '--cluster-stroke-width': t.chart.clusterStrokeWidth,
  }
}

const ALL_VAR_NAMES = Object.keys(themeToCssVars(ERA_THEMES['platform-age'], { translucent: true }))

/** Fonts cannot be interpolated, so a small dip hides the swap. */
const FONT_VARS = ['--font-display', '--font-body', '--font-ui']

export interface ApplyOptions {
  /** Null clears the era theme (All Time or the consistent accessible theme). */
  eraId: string | null
  mode?: ThemeMode
  translucent: boolean
  instant: boolean
  reducedMotion: boolean
}

let appliedEra: string | null = null

/** Writes (or clears) the era theme on the document root. */
export function applyEraTheme(root: HTMLElement, o: ApplyOptions): void {
  const theme = eraThemeFor(o.eraId, o.mode)
  const nextKey = theme ? `${o.eraId}:${o.mode ?? 'dark'}:${o.translucent}` : null
  const previousFonts = FONT_VARS.map((v) => root.style.getPropertyValue(v))

  if (o.instant) root.setAttribute('data-era-instant', '')

  if (!theme) {
    for (const name of ALL_VAR_NAMES) root.style.removeProperty(name)
    root.style.removeProperty('color-scheme')
    root.removeAttribute('data-era')
  } else {
    const vars = themeToCssVars(theme, { translucent: o.translucent })
    for (const [name, value] of Object.entries(vars)) {
      if (value === '') root.style.removeProperty(name)
      else root.style.setProperty(name, value)
    }
    root.style.setProperty('color-scheme', theme.scheme)
    root.setAttribute('data-era', o.eraId as string)
  }

  const nextFonts = FONT_VARS.map((v) => root.style.getPropertyValue(v))
  const fontsChanged = previousFonts.some((f, i) => f !== nextFonts[i])
  if (fontsChanged && !o.instant && !o.reducedMotion) {
    root.removeAttribute('data-era-type-swap')
    // Restart the animation even if one is already running.
    void root.offsetWidth
    root.setAttribute('data-era-type-swap', '')
  }

  if (o.instant) {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.removeAttribute('data-era-instant')),
    )
  }
  appliedEra = nextKey
}

export function currentAppliedEra(): string | null {
  return appliedEra
}
