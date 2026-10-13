import type { Entry } from '../../../types'
import { LEXICON, type LexiconTerm } from './lexicon'
import { normalisePhrase, type Token } from './text'

/**
 * Phrase matching against the curated atlas and the bundled lexicon. Both use
 * the same approach: a map from a normalised phrase to its targets, scanned
 * with the longest phrase winning at each position.
 */

export type Strength = 'high' | 'medium' | 'low'
const RANK: Record<Strength, number> = { high: 3, medium: 2, low: 1 }

export interface CuratedTarget {
  id: string
  strength: Strength
}

export interface CuratedIndex {
  phrases: Map<string, CuratedTarget[]>
  maxWords: number
  titles: Map<string, string>
}

/** Alternative names for curated entries, by entry id. Spellings, not claims. */
const ALIASES: Record<string, { phrase: string; strength?: Strength }[]> = {
  'ibn-al-haytham': [{ phrase: 'alhazen' }, { phrase: 'ibn al haytham' }],
  'al-khwarizmi': [{ phrase: 'khwarizmi' }, { phrase: 'al khwarizmi' }],
  copernicus: [
    { phrase: 'nicolaus copernicus' },
    { phrase: 'nicolas copernicus' },
    { phrase: 'heliocentrism', strength: 'medium' },
    { phrase: 'heliocentric', strength: 'medium' },
  ],
  'de-revolutionibus': [{ phrase: 'de revolutionibus' }],
  ptolemy: [{ phrase: 'almagest' }, { phrase: 'ptolemaic', strength: 'medium' }],
  principia: [{ phrase: 'principia' }, { phrase: 'principia mathematica', strength: 'medium' }],
  'origin-of-species': [{ phrase: 'origin of species' }, { phrase: 'on the origin of species' }],
  'royal-society': [{ phrase: 'royal society' }],
  'thomas-kuhn': [
    { phrase: 'kuhn' },
    { phrase: 'paradigm shift', strength: 'medium' },
    { phrase: 'normal science', strength: 'medium' },
  ],
  'karl-popper': [
    { phrase: 'popper' },
    { phrase: 'falsifiability', strength: 'medium' },
    { phrase: 'falsificationism', strength: 'medium' },
  ],
  quine: [{ phrase: 'w v o quine' }, { phrase: 'willard van orman quine' }],
  'logical-positivism-vienna-circle': [
    { phrase: 'vienna circle' },
    { phrase: 'logical positivism' },
    { phrase: 'logical empiricism', strength: 'medium' },
  ],
  'actor-network-theory': [{ phrase: 'actor network theory' }, { phrase: 'actor network' }],
  'sociology-of-scientific-knowledge': [
    { phrase: 'sociology of scientific knowledge' },
    { phrase: 'ssk' },
  ],
  'strong-programme-symmetry': [
    { phrase: 'strong programme' },
    { phrase: 'strong program' },
    { phrase: 'principle of symmetry', strength: 'medium' },
  ],
  'gieryn-boundary-work': [{ phrase: 'boundary work', strength: 'medium' }],
  'co-production': [{ phrase: 'coproduction' }, { phrase: 'co production' }],
  'social-construction-of-technology': [{ phrase: 'scot', strength: 'low' }],
  'sociotechnical-imaginaries': [{ phrase: 'sociotechnical imaginaries' }],
  'deficit-model-public-understanding': [{ phrase: 'deficit model' }],
  'wicked-problems-rittel-webber': [{ phrase: 'wicked problems' }, { phrase: 'wicked problem' }],
  'triple-helix-model': [{ phrase: 'triple helix' }],
  'mode-2-knowledge-production': [{ phrase: 'mode 2' }],
  'linear-model-of-innovation': [{ phrase: 'linear model' }],
  'multi-level-perspective': [{ phrase: 'multi level perspective' }],
  'lysenkoism-soviet-genetics': [
    { phrase: 'lysenkoism' },
    { phrase: 'lysenko', strength: 'medium' },
  ],
  'plate-tectonics': [{ phrase: 'continental drift', strength: 'medium' }],
  'manhattan-project': [{ phrase: 'manhattan project' }],
  'rachel-carson-silent-spring': [{ phrase: 'silent spring' }, { phrase: 'rachel carson' }],
  'ipcc-assessment-reports': [{ phrase: 'ipcc' }],
  'keeling-curve-mauna-loa': [{ phrase: 'keeling curve' }],
  'arpanet-early-internet': [{ phrase: 'arpanet' }],
  'google-pagerank-search': [{ phrase: 'pagerank' }],
  'world-wide-web-cern': [{ phrase: 'world wide web', strength: 'medium' }],
  'surveillance-capitalism': [{ phrase: 'surveillance capitalism' }],
  'transformers-generative-ai': [{ phrase: 'generative ai', strength: 'medium' }],
  'james-watt-steam': [{ phrase: 'steam engine', strength: 'medium' }, { phrase: 'james watt' }],
  'galileo-telescope': [{ phrase: 'telescope', strength: 'low' }],
  'human-genome-project-bermuda-principles': [{ phrase: 'human genome project' }],
  'asilomar-recombinant-dna-1975': [{ phrase: 'asilomar' }],
  'humoral-medicine': [
    { phrase: 'four humours' },
    { phrase: 'humoral theory', strength: 'medium' },
  ],
  'miasma-theory': [{ phrase: 'miasma', strength: 'medium' }],
  'phlogiston-theory': [{ phrase: 'phlogiston' }],
  'luminiferous-ether': [
    { phrase: 'luminiferous aether' },
    { phrase: 'aether', strength: 'medium' },
  ],
  geocentrism: [{ phrase: 'geocentric', strength: 'medium' }],
  'scientific-racism': [{ phrase: 'scientific racism' }],
  'natural-philosophy': [{ phrase: 'natural philosophy' }],
  'professionalisation-of-science': [
    { phrase: 'professionalization of science' },
    { phrase: 'professionalisation of science' },
  ],
}

function deSlug(slug: string): string {
  return slug.replace(/-/g, ' ')
}

/** Splits a curated title into the forms a student is likely to write. */
function titleForms(title: string, kind: Entry['kind']): { phrase: string; strength: Strength }[] {
  const forms: { phrase: string; strength: Strength }[] = []
  const add = (raw: string, strength: Strength) => {
    const phrase = normalisePhrase(raw).replace(/^(the|a|an) /, '')
    if (phrase.length >= 4) forms.push({ phrase, strength })
  }
  add(title, 'high')
  // Parenthetical names: "Ibn al-Haytham (Alhazen)".
  const paren = /\(([^)]{3,40})\)/.exec(title)
  if (paren) {
    add(title.replace(/\([^)]*\)/g, ''), 'high')
    add(paren[1], 'high')
  }
  // "X and Y" and "X: Y" titles: multi-word parts only, so that a lone common
  // word ("Science", "London") is never treated as the whole entry.
  for (const part of title.replace(/\([^)]*\)/g, '').split(/:|\u2014|—| and (?:the )?/)) {
    if (part.trim() === title.trim()) continue
    const words = part.trim().split(/\s+/)
    if (words.length >= 2) add(part, 'medium')
    else if (kind === 'person' && words[0].length >= 6) add(part, 'medium')
  }
  return forms
}

export function buildCuratedIndex(entries: Entry[]): CuratedIndex {
  const phrases = new Map<string, CuratedTarget[]>()
  const titles = new Map<string, string>()
  const ownPerson = new Set(entries.filter((e) => e.kind === 'person').map((e) => e.id))
  const put = (phrase: string, id: string, strength: Strength) => {
    if (!phrase) return
    const list = phrases.get(phrase) ?? []
    const existing = list.find((t) => t.id === id)
    if (existing) {
      if (RANK[strength] > RANK[existing.strength]) existing.strength = strength
    } else list.push({ id, strength })
    phrases.set(phrase, list)
  }

  for (const e of entries) {
    titles.set(e.id, e.title)
    for (const f of titleForms(e.title, e.kind)) put(f.phrase, e.id, f.strength)

    if (e.kind === 'person') {
      const name = deSlug(e.people[0] ?? e.id)
      if (name.includes(' ') || name.length >= 6) put(normalisePhrase(name), e.id, 'high')
      const surname = normalisePhrase(name).split(' ').pop() ?? ''
      if (surname.length >= 4) put(surname, e.id, 'medium')
    } else {
      // People credited on non-person entries: full names only, and low confidence.
      for (const slug of e.people) {
        if (ownPerson.has(slug)) continue
        const name = normalisePhrase(deSlug(slug))
        if (name.includes(' ')) put(name, e.id, 'low')
      }
    }
    for (const a of ALIASES[e.id] ?? []) put(normalisePhrase(a.phrase), e.id, a.strength ?? 'high')
  }
  let maxWords = 1
  for (const k of phrases.keys()) maxWords = Math.max(maxWords, k.split(' ').length)
  return { phrases, maxWords, titles }
}

export interface PhraseMatch<T> {
  phrase: string
  /** Index of the first and last token consumed. */
  tokenStart: number
  tokenEnd: number
  start: number
  end: number
  targets: T
}

/** Longest-phrase-first scan of tokens against a phrase map. */
export function scanPhrases<T>(
  tokens: Token[],
  phrases: Map<string, T>,
  maxWords: number,
  accept?: (phrase: string, tokens: Token[], at: number, length: number) => boolean,
): PhraseMatch<T>[] {
  const out: PhraseMatch<T>[] = []
  let i = 0
  while (i < tokens.length) {
    let hit = false
    for (let n = Math.min(maxWords, tokens.length - i); n >= 1; n--) {
      let key = tokens[i].norm
      for (let k = 1; k < n; k++) key += ` ${tokens[i + k].norm}`
      const targets = phrases.get(key)
      if (!targets) continue
      if (accept && !accept(key, tokens, i, n)) continue
      out.push({
        phrase: key,
        tokenStart: i,
        tokenEnd: i + n - 1,
        start: tokens[i].start,
        end: tokens[i + n - 1].end,
        targets,
      })
      i += n
      hit = true
      break
    }
    if (!hit) i++
  }
  return out
}

export interface LexiconIndex {
  phrases: Map<string, LexiconTerm>
  maxWords: number
}

export function buildLexiconIndex(): LexiconIndex {
  const phrases = new Map<string, LexiconTerm>()
  for (const term of LEXICON) {
    for (const raw of [term.term, ...(term.aliases ?? [])]) {
      const key = normalisePhrase(raw)
      if (!phrases.has(key)) phrases.set(key, term)
    }
  }
  let maxWords = 1
  for (const k of phrases.keys()) maxWords = Math.max(maxWords, k.split(' ').length)
  return { phrases, maxWords }
}

/** Resolves the targets of one curated phrase into a confidence and id list. */
export function resolveCurated(targets: CuratedTarget[]): { ids: string[]; confidence: Strength } {
  const best = Math.max(...targets.map((t) => RANK[t.strength]))
  const top = targets.filter((t) => RANK[t.strength] === best)
  if (top.length === 1) return { ids: [top[0].id], confidence: top[0].strength }
  // Several entries are equally good readings: it is a "possible match".
  return { ids: top.map((t) => t.id).slice(0, 5), confidence: 'low' }
}
