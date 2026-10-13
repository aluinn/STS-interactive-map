import type { Entry } from '../../../types'
import type { PlaceGuess, PlaceOption } from '../types'

/**
 * A small bundled gazetteer for matching place names in notes. It is not a
 * complete geography: it covers countries, regions and the cities that recur
 * in the history of science, plus the places named in the curated atlas.
 * Names shared by several places are kept as separate options so ambiguity is
 * shown to the user instead of being guessed away.
 */

interface Place {
  id: string
  name: string
  names: string[]
  latitude: number
  longitude: number
  broad: boolean
  /** Shown to the user, e.g. "present-day Iraq". */
  note?: string
  /** Words nearby in the text that support this reading. */
  hints?: string[]
}

function p(
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  opts: { aka?: string[]; broad?: boolean; note?: string; hints?: string[] } = {},
): Place {
  return {
    id,
    name,
    names: [name.toLowerCase(), ...(opts.aka ?? []).map((a) => a.toLowerCase())],
    latitude,
    longitude,
    broad: opts.broad ?? false,
    note: opts.note,
    hints: opts.hints?.map((h) => h.toLowerCase()),
  }
}

const COUNTRY = { broad: true }

const PLACES: Place[] = [
  // Countries (present-day centroids, for orientation only)
  p('c-uk', 'United Kingdom', 54.0, -2.5, { ...COUNTRY, aka: ['uk', 'britain', 'great britain'] }),
  p('c-england', 'England', 52.8, -1.5, COUNTRY),
  p('c-scotland', 'Scotland', 56.8, -4.2, COUNTRY),
  p('c-wales', 'Wales', 52.3, -3.7, COUNTRY),
  p('c-ireland', 'Ireland', 53.2, -8.0, COUNTRY),
  p('c-france', 'France', 46.6, 2.4, COUNTRY),
  p('c-germany', 'Germany', 51.1, 10.4, COUNTRY),
  p('c-italy', 'Italy', 42.8, 12.5, COUNTRY),
  p('c-spain', 'Spain', 40.2, -3.7, COUNTRY),
  p('c-portugal', 'Portugal', 39.6, -8.0, COUNTRY),
  p('c-netherlands', 'Netherlands', 52.2, 5.5, { ...COUNTRY, aka: ['dutch republic', 'holland'] }),
  p('c-belgium', 'Belgium', 50.6, 4.6, COUNTRY),
  p('c-switzerland', 'Switzerland', 46.8, 8.2, COUNTRY),
  p('c-austria', 'Austria', 47.6, 14.1, COUNTRY),
  p('c-poland', 'Poland', 52.1, 19.4, COUNTRY),
  p('c-russia', 'Russia', 60.0, 90.0, { ...COUNTRY, aka: ['russian empire'] }),
  p('c-ussr', 'Soviet Union', 55.8, 37.6, {
    ...COUNTRY,
    aka: ['ussr'],
    note: 'present-day Russia and neighbours',
  }),
  p('c-sweden', 'Sweden', 62.0, 15.0, COUNTRY),
  p('c-denmark', 'Denmark', 56.0, 10.0, COUNTRY),
  p('c-norway', 'Norway', 61.0, 9.0, COUNTRY),
  p('c-finland', 'Finland', 64.0, 26.0, COUNTRY),
  p('c-greece', 'Greece', 39.0, 22.0, COUNTRY),
  p('c-turkey', 'Turkey', 39.0, 35.0, { ...COUNTRY, aka: ['türkiye'] }),
  p('c-egypt', 'Egypt', 26.8, 30.0, COUNTRY),
  p('c-iraq', 'Iraq', 33.0, 44.0, COUNTRY),
  p('c-iran', 'Iran', 32.4, 53.7, COUNTRY),
  p('c-israel', 'Israel', 31.0, 34.9, COUNTRY),
  p('c-saudi', 'Saudi Arabia', 24.0, 45.0, COUNTRY),
  p('c-india', 'India', 21.0, 78.0, COUNTRY),
  p('c-pakistan', 'Pakistan', 30.0, 70.0, COUNTRY),
  p('c-china', 'China', 35.0, 103.0, COUNTRY),
  p('c-japan', 'Japan', 36.0, 138.0, COUNTRY),
  p('c-korea', 'South Korea', 36.5, 127.8, { ...COUNTRY, aka: ['korea'] }),
  p('c-singapore', 'Singapore', 1.35, 103.8, COUNTRY),
  p('c-indonesia', 'Indonesia', -2.5, 118.0, COUNTRY),
  p('c-australia', 'Australia', -25.0, 134.0, COUNTRY),
  p('c-nz', 'New Zealand', -41.0, 174.0, COUNTRY),
  p('c-usa', 'United States', 39.8, -98.6, {
    ...COUNTRY,
    aka: ['usa', 'u.s.', 'us', 'america', 'united states of america'],
  }),
  p('c-canada', 'Canada', 56.0, -96.0, COUNTRY),
  p('c-mexico', 'Mexico', 23.6, -102.5, COUNTRY),
  p('c-brazil', 'Brazil', -10.0, -52.0, COUNTRY),
  p('c-argentina', 'Argentina', -34.0, -64.0, COUNTRY),
  p('c-chile', 'Chile', -33.5, -70.7, { ...COUNTRY, hints: ['andes', 'santiago', 'atacama'] }),
  p('c-peru', 'Peru', -9.2, -75.0, COUNTRY),
  p('c-southafrica', 'South Africa', -29.0, 24.0, COUNTRY),
  p('c-nigeria', 'Nigeria', 9.1, 8.7, COUNTRY),
  p('c-kenya', 'Kenya', 0.2, 37.9, COUNTRY),
  p('c-ghana', 'Ghana', 7.9, -1.0, COUNTRY),
  p('c-ethiopia', 'Ethiopia', 9.1, 40.5, COUNTRY),
  p('c-uganda', 'Uganda', 1.4, 32.3, COUNTRY),
  p('c-morocco', 'Morocco', 31.8, -7.1, COUNTRY),
  p('c-algeria', 'Algeria', 28.0, 1.7, COUNTRY),
  p('c-tunisia', 'Tunisia', 34.0, 9.0, COUNTRY),
  p('c-georgia-country', 'Georgia', 42.3, 43.4, {
    ...COUNTRY,
    note: 'the country',
    hints: ['tbilisi', 'caucasus', 'soviet', 'black sea', 'republic of georgia'],
  }),
  // Regions and historical names (shown at a point in a present-day location)
  p('r-mesopotamia', 'Mesopotamia', 33.0, 44.0, {
    broad: true,
    aka: ['babylonia'],
    note: 'historical region, mostly present-day Iraq',
  }),
  p('r-levant', 'Levant', 33.5, 36.0, { broad: true, note: 'historical region' }),
  p('r-persia', 'Persia', 32.4, 53.7, { broad: true, note: 'historical name; present-day Iran' }),
  p('r-ottoman', 'Ottoman Empire', 39.0, 35.0, {
    broad: true,
    note: 'historical empire; shown in present-day Turkey',
  }),
  p('r-byzantium', 'Byzantium', 41.0, 28.98, {
    broad: true,
    aka: ['byzantine empire', 'constantinople'],
    note: 'historical name; present-day Istanbul, Turkey',
  }),
  p('r-prussia', 'Prussia', 52.5, 13.4, { broad: true, note: 'historical state; shown at Berlin' }),
  p('r-bohemia', 'Bohemia', 49.8, 15.5, {
    broad: true,
    note: 'historical region; present-day Czechia',
  }),
  p('r-magna-graecia', 'Magna Graecia', 39.0, 16.5, {
    broad: true,
    note: 'historical region; southern Italy',
  }),
  p('r-al-andalus', 'al-Andalus', 37.4, -4.6, {
    broad: true,
    aka: ['andalusia'],
    note: 'historical region; present-day Spain',
  }),
  p('r-ionia', 'Ionia', 38.4, 27.1, { broad: true, note: 'historical region; present-day Turkey' }),
  p('r-gaul', 'Gaul', 46.6, 2.4, { broad: true, note: 'historical region; present-day France' }),
  p('r-holy-roman', 'Holy Roman Empire', 50.0, 10.0, {
    broad: true,
    note: 'historical empire; mostly present-day Germany',
  }),
  p('r-europe', 'Europe', 50.0, 10.0, { broad: true }),
  p('r-africa', 'Africa', 2.0, 20.0, { broad: true }),
  p('r-asia', 'Asia', 34.0, 100.0, { broad: true }),
  p('r-south-asia', 'South Asia', 23.0, 80.0, { broad: true }),
  p('r-middle-east', 'Middle East', 29.0, 41.0, { broad: true }),
  p('r-latin-america', 'Latin America', -10.0, -60.0, { broad: true }),
  // Cities
  p('london-uk', 'London', 51.5074, -0.1278, {
    note: 'England',
    hints: ['england', 'british', 'royal society', 'uk'],
  }),
  p('london-on', 'London, Ontario', 42.9849, -81.2453, {
    note: 'Ontario, Canada',
    hints: ['ontario', 'canada', 'canadian'],
  }),
  p('oxford-uk', 'Oxford', 51.752, -1.2577, {
    note: 'England',
    hints: ['england', 'bodleian', 'british'],
  }),
  p('oxford-ms', 'Oxford, Mississippi', 34.3665, -89.5192, {
    note: 'Mississippi, USA',
    hints: ['mississippi', 'ole miss'],
  }),
  p('cambridge-uk', 'Cambridge', 52.2053, 0.1218, {
    note: 'England',
    hints: ['england', 'british', 'trinity', 'cavendish', 'newton', 'darwin', 'uk'],
  }),
  p('cambridge-ma', 'Cambridge, Massachusetts', 42.3736, -71.1097, {
    aka: ['cambridge'],
    note: 'Massachusetts, USA',
    hints: ['massachusetts', 'harvard', 'mit', 'boston', 'kendall'],
  }),
  p('edinburgh', 'Edinburgh', 55.9533, -3.1883),
  p('glasgow', 'Glasgow', 55.8642, -4.2518),
  p('manchester-uk', 'Manchester', 53.4808, -2.2426, {
    note: 'England',
    hints: ['england', 'british', 'industrial', 'cotton'],
  }),
  p('manchester-nh', 'Manchester, New Hampshire', 42.9956, -71.4548, {
    note: 'New Hampshire, USA',
    hints: ['new hampshire'],
  }),
  p('birmingham-uk', 'Birmingham', 52.4862, -1.8904, {
    note: 'England',
    hints: ['england', 'british', 'lunar society', 'soho'],
  }),
  p('birmingham-al', 'Birmingham, Alabama', 33.5186, -86.8104, {
    note: 'Alabama, USA',
    hints: ['alabama'],
  }),
  p('paris', 'Paris', 48.8566, 2.3522, { hints: ['france', 'french', 'sorbonne'] }),
  p('lyon', 'Lyon', 45.764, 4.8357),
  p('geneva', 'Geneva', 46.2044, 6.1432),
  p('zurich', 'Zurich', 47.3769, 8.5417, { aka: ['zürich'] }),
  p('basel', 'Basel', 47.5596, 7.5886),
  p('berlin', 'Berlin', 52.52, 13.405),
  p('munich', 'Munich', 48.1351, 11.582),
  p('gottingen', 'Göttingen', 51.5413, 9.9158, { aka: ['gottingen'] }),
  p('heidelberg', 'Heidelberg', 49.3988, 8.6724),
  p('vienna', 'Vienna', 48.2082, 16.3738),
  p('prague', 'Prague', 50.0755, 14.4378),
  p('budapest', 'Budapest', 47.4979, 19.0402),
  p('amsterdam', 'Amsterdam', 52.3676, 4.9041),
  p('leiden', 'Leiden', 52.1601, 4.497),
  p('rome', 'Rome', 41.9028, 12.4964),
  p('florence', 'Florence', 43.7696, 11.2558),
  p('padua', 'Padua', 45.4064, 11.8768),
  p('bologna', 'Bologna', 44.4949, 11.3426),
  p('pisa', 'Pisa', 43.7228, 10.4017),
  p('venice', 'Venice', 45.4408, 12.3155),
  p('naples', 'Naples', 40.8518, 14.2681),
  p('athens', 'Athens', 37.9838, 23.7275),
  p('miletus', 'Miletus', 37.53, 27.28, { note: 'present-day Turkey' }),
  p('alexandria-eg', 'Alexandria', 31.2001, 29.9187, {
    note: 'Egypt',
    hints: ['egypt', 'library', 'ptolemy', 'museum', 'hellenistic', 'euclid'],
  }),
  p('alexandria-va', 'Alexandria, Virginia', 38.8048, -77.0469, {
    aka: ['alexandria'],
    note: 'Virginia, USA',
    hints: ['virginia'],
  }),
  p('cairo', 'Cairo', 30.0444, 31.2357),
  p('baghdad', 'Baghdad', 33.3152, 44.3661, {
    note: 'present-day Iraq',
    hints: ['house of wisdom', 'abbasid'],
  }),
  p('damascus', 'Damascus', 33.5138, 36.2765),
  p('cordoba-es', 'Córdoba', 37.8882, -4.7794, {
    aka: ['cordoba'],
    note: 'Spain',
    hints: ['spain', 'andalus', 'caliphate', 'averroes'],
  }),
  p('cordoba-ar', 'Córdoba, Argentina', -31.4201, -64.1888, {
    aka: ['cordoba', 'córdoba'],
    note: 'Argentina',
    hints: ['argentina'],
  }),
  p('toledo', 'Toledo', 39.8628, -4.0273),
  p('istanbul', 'Istanbul', 41.0082, 28.9784),
  p('jerusalem', 'Jerusalem', 31.7683, 35.2137),
  p('tehran', 'Tehran', 35.6892, 51.389),
  p('delhi', 'Delhi', 28.6139, 77.209, { aka: ['new delhi'] }),
  p('kolkata', 'Kolkata', 22.5726, 88.3639, { aka: ['calcutta'], note: 'present-day India' }),
  p('chennai', 'Chennai', 13.0827, 80.2707, { aka: ['madras'] }),
  p('mumbai', 'Mumbai', 19.076, 72.8777, { aka: ['bombay'] }),
  p('bangalore', 'Bengaluru', 12.9716, 77.5946, { aka: ['bangalore'] }),
  p('beijing', 'Beijing', 39.9042, 116.4074, { aka: ['peking'] }),
  p('nanjing', 'Nanjing', 32.0603, 118.7969),
  p('shanghai', 'Shanghai', 31.2304, 121.4737),
  p('shenzhen', 'Shenzhen', 22.5431, 114.0579),
  p('tokyo', 'Tokyo', 35.6762, 139.6503),
  p('kyoto', 'Kyoto', 35.0116, 135.7681),
  p('seoul', 'Seoul', 37.5665, 126.978),
  p('hsinchu', 'Hsinchu', 24.8138, 120.9675),
  p('taipei', 'Taipei', 25.033, 121.5654),
  p('moscow', 'Moscow', 55.7558, 37.6173),
  p('st-petersburg', 'St Petersburg', 59.9343, 30.3351, {
    aka: ['saint petersburg', 'st. petersburg', 'petrograd', 'leningrad'],
  }),
  p('stockholm', 'Stockholm', 59.3293, 18.0686),
  p('uppsala', 'Uppsala', 59.8586, 17.6389),
  p('copenhagen', 'Copenhagen', 55.6761, 12.5683),
  p('lisbon', 'Lisbon', 38.7223, -9.1393),
  p('madrid', 'Madrid', 40.4168, -3.7038),
  p('dublin', 'Dublin', 53.3498, -6.2603),
  p('new-york', 'New York', 40.7128, -74.006, {
    aka: ['new york city', 'nyc'],
    hints: ['manhattan', 'columbia'],
  }),
  p('boston', 'Boston', 42.3601, -71.0589),
  p('philadelphia', 'Philadelphia', 39.9526, -75.1652),
  p('washington', 'Washington, D.C.', 38.9072, -77.0369, {
    aka: ['washington dc', 'washington d.c.'],
  }),
  p('princeton', 'Princeton', 40.3573, -74.6672),
  p('chicago', 'Chicago', 41.8781, -87.6298),
  p('los-alamos', 'Los Alamos', 35.88, -106.3031),
  p('berkeley', 'Berkeley', 37.8715, -122.273),
  p('stanford', 'Stanford', 37.4275, -122.1697),
  p('san-francisco', 'San Francisco', 37.7749, -122.4194),
  p('silicon-valley', 'Silicon Valley', 37.3875, -122.0575),
  p('los-angeles', 'Los Angeles', 34.0522, -118.2437),
  p('seattle', 'Seattle', 47.6062, -122.3321),
  p('toronto', 'Toronto', 43.6532, -79.3832),
  p('montreal', 'Montreal', 45.5017, -73.5673),
  p('mexico-city', 'Mexico City', 19.4326, -99.1332),
  p('rio', 'Rio de Janeiro', -22.9068, -43.1729),
  p('buenos-aires', 'Buenos Aires', -34.6037, -58.3816),
  p('santiago', 'Santiago', -33.4489, -70.6693, { note: 'Chile', hints: ['chile', 'andes'] }),
  p('cape-town', 'Cape Town', -33.9249, 18.4241),
  p('johannesburg', 'Johannesburg', -26.2041, 28.0473),
  p('nairobi', 'Nairobi', -1.2921, 36.8219),
  p('lagos', 'Lagos', 6.5244, 3.3792),
  p('accra', 'Accra', 5.6037, -0.187),
  p('timbuktu', 'Timbuktu', 16.7666, -3.0026, { note: 'present-day Mali' }),
  p('sydney', 'Sydney', -33.8688, 151.2093),
  p('melbourne', 'Melbourne', -37.8136, 144.9631),
  p('galapagos', 'Galápagos', -0.9538, -90.9656, {
    aka: ['galapagos', 'galápagos islands'],
    note: 'present-day Ecuador',
  }),
  p('hawaii', 'Hawaii', 19.8968, -155.5828),
  p('georgia-us', 'Georgia, USA', 33.249, -83.4441, {
    aka: ['georgia'],
    note: 'the US state',
    hints: ['atlanta', 'savannah', 'usa', 'american', 'u.s.', 'united states'],
  }),
]

/** Names that are also ordinary words or common surnames: match only after a preposition. */
const WEAK_NAMES = new Set([
  'turkey',
  'chile',
  'georgia',
  'cordoba',
  'córdoba',
  'santiago',
  'washington',
])
const PRECEDING_PREPOSITIONS = new Set([
  'in',
  'at',
  'from',
  'to',
  'near',
  'of',
  'across',
  'around',
  'throughout',
  'within',
])

export interface GazetteerIndex {
  /** Lower-case name → possible places. */
  byName: Map<string, Place[]>
  maxWords: number
}

function normName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[.,’']/g, '')
    .trim()
}

/** Builds the lookup, adding any named place from the curated atlas that has coordinates. */
export function buildGazetteer(curated: Entry[] = []): GazetteerIndex {
  const byName = new Map<string, Place[]>()
  const add = (place: Place) => {
    for (const raw of place.names) {
      const key = normName(raw)
      if (key.length < 3) continue
      const list = byName.get(key) ?? []
      if (!list.some((x) => x.id === place.id)) list.push(place)
      byName.set(key, list)
    }
  }
  for (const place of PLACES) add(place)

  const seen = new Set<string>()
  for (const e of curated) {
    for (const pl of e.places) {
      if (pl.latitude === undefined || pl.longitude === undefined) continue
      const short = pl.name.split(/[,(/]/)[0].trim()
      const key = normName(short)
      if (key.length < 5 || byName.has(key) || seen.has(key)) continue
      if (/^(the |university|institute|royal|american|national)/.test(key)) continue
      seen.add(key)
      add({
        id: `cur-${key}`,
        name: short,
        names: [short.toLowerCase()],
        latitude: pl.latitude,
        longitude: pl.longitude,
        broad: false,
      })
    }
  }
  let maxWords = 1
  for (const key of byName.keys()) maxWords = Math.max(maxWords, key.split(/\s+/).length)
  return { byName, maxWords }
}

export interface PlaceMatch {
  text: string
  index: number
  length: number
  options: Place[]
}

const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu

/**
 * Finds place names in a passage. A name must start with a capital letter
 * in the notes; weak names (e.g. "Chile", "Georgia") also need a nearby
 * preposition. Longer names win over shorter ones.
 */
export function findPlaces(text: string, index: GazetteerIndex): PlaceMatch[] {
  const words: { w: string; start: number; end: number }[] = []
  for (const m of text.matchAll(WORD_RE)) {
    words.push({ w: m[0].replace(/[.,;:]+$/, ''), start: m.index, end: m.index + m[0].length })
    if (words.length > 20_000) break
  }
  const out: PlaceMatch[] = []
  let i = 0
  while (i < words.length) {
    let matched = false
    for (let n = Math.min(index.maxWords, words.length - i); n >= 1; n--) {
      const first = words[i].w
      if (!/^\p{Lu}/u.test(first) && !/^(al|the)$/i.test(first)) continue
      const phrase = words
        .slice(i, i + n)
        .map((x) => x.w)
        .join(' ')
      const key = normName(phrase)
      const options = index.byName.get(key)
      if (!options) continue
      if (n === 1 && WEAK_NAMES.has(key)) {
        const prev = i > 0 ? words[i - 1].w.toLowerCase() : ''
        if (!PRECEDING_PREPOSITIONS.has(prev)) continue
      }
      const start = words[i].start
      const end = words[i + n - 1].start + words[i + n - 1].w.length
      out.push({ text: text.slice(start, end), index: start, length: end - start, options })
      i += n
      matched = true
      break
    }
    if (!matched) i++
  }
  return out
}

/**
 * Turns the places found around an item into one guess. If the surrounding
 * words support exactly one reading, it is chosen; otherwise the choice is
 * left to the user.
 */
export function resolvePlace(match: PlaceMatch, context: string): PlaceGuess {
  const ctx = context.toLowerCase()
  const options: PlaceOption[] = match.options.map((o) => ({
    id: o.id,
    name: o.name,
    latitude: o.latitude,
    longitude: o.longitude,
    note: o.note,
    supported: (o.hints ?? []).some((h) => ctx.includes(h)),
  }))
  let chosen: number | null = null
  if (options.length === 1) chosen = 0
  else {
    const supported = options.map((o, i) => (o.supported ? i : -1)).filter((i) => i >= 0)
    if (supported.length === 1) chosen = supported[0]
    // Several options but none contradicted and the first is the unmarked
    // reading only when nothing at all points elsewhere.
  }
  return {
    text: match.text,
    options,
    chosen,
    broad: match.options.every((o) => o.broad),
  }
}

/** Looks a typed place name up in the gazetteer (used when the user corrects a location). */
export function lookupPlace(name: string, index: GazetteerIndex): PlaceOption[] {
  const found = index.byName.get(normName(name)) ?? []
  return found.map((o) => ({
    id: o.id,
    name: o.name,
    latitude: o.latitude,
    longitude: o.longitude,
    note: o.note,
    supported: false,
  }))
}
