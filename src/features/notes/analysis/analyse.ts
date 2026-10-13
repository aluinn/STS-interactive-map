import type { Entry, SourceMention } from '../../../types'
import type {
  AnalysisResult,
  AnalysisWarning,
  Candidate,
  CandidateRelationship,
  ExtractedDocument,
  ItemCategory,
  ParsedDate,
  PlaceGuess,
  TopicProfile,
} from '../types'
import { findDates, type FoundDate } from './dates'
import {
  buildGazetteer,
  findPlaces,
  resolvePlace,
  type GazetteerIndex,
  type PlaceMatch,
} from './gazetteer'
import {
  buildCuratedIndex,
  buildLexiconIndex,
  resolveCurated,
  scanPhrases,
  type CuratedIndex,
  type LexiconIndex,
} from './matcher'
import {
  DISCIPLINES,
  INSTITUTION_WORDS,
  NON_NAME_WORDS,
  PERSON_TITLES,
  PERSON_VERBS,
  ROLE_NOUNS,
  TOPIC_KEYWORDS,
  kindForCategory,
} from './lexicon'
import { cueRelationships, type Occurrence } from './relationships'
import {
  excerpt,
  newId,
  normalisePhrase,
  splitSentences,
  tokenize,
  yieldToBrowser,
  type Token,
} from './text'

/**
 * The deterministic extraction pipeline. It recognises familiar vocabulary and
 * simple sentence patterns; it does not understand arguments. Everything it
 * returns is a proposal for the review screen, never a finished fact.
 */

export interface AnalyseOptions {
  curated: Entry[]
  signal?: AbortSignal
  onProgress?: (done: number, total: number) => void
}

interface Indexes {
  curated: CuratedIndex
  lexicon: LexiconIndex
  gazetteer: GazetteerIndex
}

const indexCache = new WeakMap<Entry[], Indexes>()
function indexesFor(curated: Entry[]): Indexes {
  let idx = indexCache.get(curated)
  if (!idx) {
    idx = {
      curated: buildCuratedIndex(curated),
      lexicon: buildLexiconIndex(),
      gazetteer: buildGazetteer(curated),
    }
    indexCache.set(curated, idx)
  }
  return idx
}

const EVENT_WORDS = new Set([
  'war',
  'wars',
  'revolution',
  'conference',
  'congress',
  'treaty',
  'crisis',
  'trial',
  'expedition',
  'act',
  'report',
  'affair',
  'controversy',
  'scandal',
  'project',
  'experiment',
  'debate',
  'movement',
  'programme',
  'program',
  'summit',
  'disaster',
  'accident',
  'pandemic',
  'epidemic',
])

const CONNECTORS = new Set([
  'of',
  'de',
  'van',
  'von',
  'der',
  'den',
  'al',
  'el',
  'ibn',
  'bin',
  'da',
  'di',
  'du',
  'la',
  'le',
  'for',
  'the',
])
const MAX_MENTIONS = 6
const MAX_NEW_CANDIDATES = 400
const DATE_RANK: Record<ParsedDate['precision'], number> = {
  exact: 5,
  circa: 4,
  decade: 3,
  century: 2,
  period: 1,
  uncertain: 0,
}

interface Run {
  tokens: Token[]
  start: number
  end: number
  text: string
}

const isCapital = (raw: string) => /^\p{Lu}/u.test(raw)

/** Maximal runs of capitalised words (with name connectors) inside one sentence. */
function capitalisedRuns(text: string, tokens: Token[]): Run[] {
  const runs: Run[] = []
  let current: Token[] = []
  const flush = () => {
    // Trim leading function words and trailing connectors.
    while (
      current.length &&
      (NON_NAME_WORDS.has(current[0].norm) || CONNECTORS.has(current[0].norm))
    )
      current.shift()
    while (
      current.length &&
      CONNECTORS.has(current[current.length - 1].norm) &&
      !isCapital(current[current.length - 1].raw)
    )
      current.pop()
    if (current.length) {
      const start = current[0].start
      const end = current[current.length - 1].end
      runs.push({ tokens: current, start, end, text: text.slice(start, end) })
    }
    current = []
  }
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    const prev = current[current.length - 1]
    const joined = !prev || /^[\s.\-–]*$/.test(text.slice(prev.end, t.start))
    if (!joined) flush()
    if (isCapital(t.raw) && (t.raw.length > 1 || text[t.end] === '.')) {
      current.push(t)
    } else if (CONNECTORS.has(t.norm) && current.length > 0) {
      const next = tokens[i + 1]
      if (next && isCapital(next.raw)) current.push(t)
      else flush()
    } else {
      flush()
    }
  }
  flush()
  return runs
}

interface Draft {
  key: string
  label: string
  category: ItemCategory
  curatedIds: string[]
  confidence: Candidate['confidence']
  count: number
  mentions: SourceMention[]
  date: ParsedDate | null
  dateIsLife: boolean
  place: PlaceGuess | null
  topics: Set<string>
  passages: string[]
  weak: boolean
  cue: boolean
  /** What the notes say under this item's heading, for its description. */
  body: string
}

function overlaps(spans: [number, number][], a: number, b: number): boolean {
  return spans.some(([x, y]) => a < y && b > x)
}

/** The date nearest to a position, preferring one in parentheses right after it. */
function nearestDate(dates: FoundDate[], from: number, to: number, text: string) {
  let best: { d: FoundDate; life: boolean } | null = null
  let bestDist = Infinity
  for (const d of dates) {
    const after = d.index - to
    if (
      after >= 0 &&
      after <= 4 &&
      /^\s*\(\s*(?:b\.|born|d\.|died|c\.|ca\.)?\s*$/i.test(text.slice(to, d.index))
    ) {
      return { d, life: true }
    }
    const dist = d.index >= to ? d.index - to : from - (d.index + d.length)
    if (dist >= 0 && dist < bestDist && dist <= 160) {
      best = { d, life: false }
      bestDist = dist
    }
  }
  return best
}

function nearestPlace(
  places: PlaceMatch[],
  from: number,
  to: number,
  skip?: [number, number],
): PlaceMatch | null {
  let best: PlaceMatch | null = null
  let bestDist = Infinity
  for (const p of places) {
    if (skip && p.index >= skip[0] && p.index + p.length <= skip[1]) continue
    const dist = p.index >= to ? p.index - to : from - (p.index + p.length)
    if (dist < bestDist && dist <= 160) {
      best = p
      bestDist = dist
    }
  }
  return best
}

function toParsed(f: FoundDate): ParsedDate {
  return {
    start: f.start,
    end: f.end,
    original: f.original,
    precision: f.precision,
    approximate: f.approximate,
  }
}

const GENERIC_HEADING =
  /^(introduction|intro|summary|conclusions?|references?|bibliography|questions?|overview|contents?|table of contents|notes?|to ?do|agenda|readings?|further reading|key terms?|glossary|abstract|appendix|(week|lecture|session|class|seminar|slide|page)\s*\d*|type|class|date|status|prep status|attendance)$/i

/** A heading worth turning into an entry of its own, or null. */
function headingLabel(raw: string, docTitle: string): string | null {
  const cleaned = raw
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/[:：]+\s*$/, '')
    .replace(/^\d+(?:\.\d+)*[.)]?\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (cleaned.length < 3 || cleaned.length > 90) return null
  // A long, sentence-like line is body text that happened to be set in a larger size.
  if (cleaned.split(' ').length > 12) return null
  if (!/\p{L}{3}/u.test(cleaned)) return null
  if (GENERIC_HEADING.test(cleaned)) return null
  if (normalisePhrase(cleaned) === normalisePhrase(docTitle)) return null
  return cleaned
}

/**
 * A short Title Case line standing alone ("Enrico Fermi", "Scale and
 * Organisation of Manhattan Project") is how slides and outliners mark a topic
 * even when the PDF gives it no heading style.
 */
function looksLikeTopicLine(text: string): boolean {
  if (text.length < 4 || text.length > 70 || text.includes('\n')) return false
  if (!/^[\p{L}][\p{L} '&-]*$/u.test(text)) return false
  const words = text.split(/\s+/)
  if (words.length < 2 || words.length > 8) return false
  const significant = words.filter(
    (w) => !CONNECTORS.has(w.toLowerCase()) && !/^(and|in|on|to|a|an)$/i.test(w),
  )
  const capital = significant.filter((w) => /^\p{Lu}/u.test(w)).length
  return significant.length >= 2 && capital / significant.length >= 0.75
}

const SECTION_CATEGORY_OK = new Set<ItemCategory>([
  'person',
  'institution',
  'publication',
  'concept',
  'theory',
  'technology',
  'instrument',
  'event',
])

const PLACE_BEARING = new Set<ItemCategory>([
  'person',
  'institution',
  'event',
  'publication',
  'technology',
  'instrument',
])

export async function analyseDocuments(
  docs: ExtractedDocument[],
  opts: AnalyseOptions,
): Promise<AnalysisResult> {
  const idx = indexesFor(opts.curated)
  const drafts = new Map<string, Draft>()
  const relations: (Omit<CandidateRelationship, 'id'> & {
    sourceKey: string
    targetKey: string
  })[] = []
  const warnings: AnalysisWarning[] = []
  const ignored: string[] = []
  const topicText: string[] = []
  const seenPlaces = new Set<string>()
  let datesFound = 0
  let totalPages = 0
  for (const d of docs) totalPages += d.pages.length
  let donePages = 0

  const register = (
    key: string,
    label: string,
    category: ItemCategory,
    init: Partial<Draft>,
    mention: SourceMention,
  ): Draft => {
    let d = drafts.get(key)
    if (!d) {
      d = {
        key,
        label,
        category,
        curatedIds: [],
        confidence: 'medium',
        count: 0,
        mentions: [],
        date: null,
        dateIsLife: false,
        place: null,
        topics: new Set(),
        passages: [],
        weak: false,
        cue: false,
        body: '',
        ...init,
      }
      drafts.set(key, d)
    }
    d.count++
    if (
      d.mentions.length < MAX_MENTIONS &&
      !d.mentions.some((m) => m.passage === mention.passage && m.fileId === mention.fileId)
    ) {
      d.mentions.push(mention)
    }
    return d
  }

  let headingKeys: string[] = []
  for (const doc of docs) {
    // The heading in force, which can run on across pages.
    let section: string | undefined
    let sectionDraft: Draft | null = null
    for (const page of doc.pages) {
      if (opts.signal?.aborted) throw new DOMException('Analysis cancelled', 'AbortError')
      for (const paragraph of page.text.split(/\n{2,}/)) {
        const trimmed = paragraph.trim().replace(/[\u02BC\u2018\u2019\u0060\u00B4]/g, "'")
        if (!trimmed) continue
        const isHeading = trimmed.startsWith('# ') || looksLikeTopicLine(trimmed)
        const body = trimmed.startsWith('# ') ? trimmed.replace(/^#+\s*/, '') : trimmed
        if (isHeading) {
          section = body.slice(0, 120)
          sectionDraft = null
          headingKeys = []
        }
        topicText.push(body)

        const sentences = splitSentences(body)
        const paraDates = findDates(body)
        for (const s of sentences) {
          const sentence = s.text
          const tokens = tokenize(sentence, 2000)
          const dates = findDates(sentence)
          datesFound += dates.length
          const places = findPlaces(sentence, idx.gazetteer)
          for (const pm of places) seenPlaces.add(pm.options[0].name)
          const mentionFor = (start: number, end: number, method: string): SourceMention => ({
            fileId: doc.fileId,
            fileName: doc.fileName,
            docTitle: doc.title,
            page: page.page,
            ...(section ? { section } : {}),
            passage: excerpt(sentence, start, end),
            method,
          })
          const occurrences: (Occurrence & { key: string })[] = []
          const claimed: [number, number][] = []
          const placeSpans: [number, number][] = places.map((p) => [p.index, p.index + p.length])

          // Dates and places are attached after every entity in the sentence is
          // known, so that a place that is part of another name ("Berlin
          // Conference") is not credited to a neighbouring person.
          const queue: { d: Draft; start: number; end: number }[] = []
          const attach = (d: Draft, start: number, end: number) => {
            queue.push({ d, start, end })
          }
          const attachNow = (d: Draft, start: number, end: number) => {
            // A date near the name; paragraph dates only when there is exactly one.
            let found = nearestDate(dates, start, end, sentence)
            if (!found && dates.length === 0 && paraDates.length === 1)
              found = { d: paraDates[0], life: false }
            if (found) {
              const better =
                !d.date ||
                (found.life && !d.dateIsLife) ||
                (!d.dateIsLife && DATE_RANK[found.d.precision] > DATE_RANK[d.date.precision])
              if (better) {
                d.date = toParsed(found.d)
                d.dateIsLife = found.life
              }
            }
            if (PLACE_BEARING.has(d.category) && (!d.place || d.place.chosen === null)) {
              const usable = places.filter((p) => {
                const inOwn = p.index >= start && p.index + p.length <= end
                const inOther = claimed.some(
                  ([x, y]) => !(x === start && y === end) && p.index < y && p.index + p.length > x,
                )
                return !inOther && (!inOwn || d.category === 'institution')
              })
              const near = nearestPlace(usable, start, end)
              if (near) {
                const guess = resolvePlace(near, sentence + ' ' + body)
                if (!d.place || (guess.chosen !== null && d.place.chosen === null)) d.place = guess
              }
            }
            for (const area of topicsOf(sentence)) d.topics.add(area)
            if (d.passages.length < 6) d.passages.push(sentence)
          }

          // 1. Entries already in the curated atlas.
          for (const m of scanPhrases(tokens, idx.curated.phrases, idx.curated.maxWords)) {
            const { ids, confidence } = resolveCurated(m.targets)
            const key = `curated:${[...ids].sort().join('+')}`
            const label =
              ids.length === 1
                ? (idx.curated.titles.get(ids[0]) ?? m.phrase)
                : sentence.slice(m.start, m.end)
            const cat = ids.length === 1 ? curatedCategory(opts.curated, ids[0]) : 'concept'
            const d = register(
              key,
              label,
              cat,
              { curatedIds: ids, confidence },
              mentionFor(m.start, m.end, 'curated-match'),
            )
            if (confidence === 'high') d.confidence = 'high'
            attach(d, m.start, m.end)
            claimed.push([m.start, m.end])
            occurrences.push({ key, start: m.start, end: m.end, category: cat })
          }

          // 2. Familiar vocabulary: concepts, theories, technologies, events.
          for (const m of scanPhrases(tokens, idx.lexicon.phrases, idx.lexicon.maxWords)) {
            if (overlaps(claimed, m.start, m.end)) continue
            const term = m.targets
            const key = `lex:${term.term}`
            const d = register(
              key,
              term.term,
              term.category,
              { confidence: 'medium' },
              mentionFor(m.start, m.end, 'vocabulary'),
            )
            for (const t of term.topics ?? []) d.topics.add(t)
            attach(d, m.start, m.end)
            claimed.push([m.start, m.end])
            occurrences.push({ key, start: m.start, end: m.end, category: term.category })
          }

          // 3. Titles in quotes or italics.
          for (const m of sentence.matchAll(
            /[“"]([^”"\n]{6,110})[”"]|\*([^*\n]{4,100})\*|_([^_\n]{4,100})_/g,
          )) {
            const title = (m[1] ?? m[2] ?? m[3]).trim()
            const words = title.split(/\s+/)
            const italic = m[2] !== undefined || m[3] !== undefined
            const capitals = words.filter((w) => w.length >= 4 && isCapital(w)).length
            if (!isCapital(title) || words.length > 14) continue
            if (!italic && (words.length < 2 || capitals < Math.ceil(words.length / 3))) continue
            if (overlaps(claimed, m.index, m.index + m[0].length)) continue
            const key = `new:publication:${normalisePhrase(title)}`
            const d = register(
              key,
              title,
              'publication',
              { confidence: 'low', weak: false },
              mentionFor(m.index, m.index + m[0].length, 'quoted-title'),
            )
            attach(d, m.index, m.index + m[0].length)
            claimed.push([m.index, m.index + m[0].length])
            occurrences.push({
              key,
              start: m.index,
              end: m.index + m[0].length,
              category: 'publication',
            })
          }

          // 4. Capitalised names not already accounted for.
          for (const run of capitalisedRuns(sentence, tokens)) {
            if (overlaps(claimed, run.start, run.end)) continue
            const words = run.tokens.map((t) => t.norm)
            const significant = words.filter((w) => !CONNECTORS.has(w))
            if (significant.length === 0) continue
            const hasInstitution = words.some((w) => INSTITUTION_WORDS.has(w))
            const hasEvent = words.some((w) => EVENT_WORDS.has(w))
            const inPlace = overlaps(placeSpans, run.start, run.end)
            let category: ItemCategory | null = null
            let cue = false
            if (hasEvent && run.tokens.length >= 2 && !NON_NAME_WORDS.has(words[0]))
              category = 'event'
            else if (hasInstitution && run.tokens.length >= 2) category = 'institution'
            else if (
              !inPlace &&
              significant.length >= 2 &&
              significant.length <= 4 &&
              !significant.some((w) => NON_NAME_WORDS.has(w)) &&
              run.tokens.every((t) => t.raw.length >= 2 || sentence[t.end] === '.')
            ) {
              const before = tokens[tokens.indexOf(run.tokens[0]) - 1]?.norm ?? ''
              const afterTok =
                tokens[tokens.indexOf(run.tokens[run.tokens.length - 1]) + 1]?.norm ?? ''
              const rest = sentence.slice(run.end, run.end + 60)
              const alone = run.start === 0 && sentence.slice(run.end).replace(/[\s.:]/g, '') === ''
              cue =
                alone ||
                PERSON_TITLES.has(before) ||
                ROLE_NOUNS.has(before) ||
                PERSON_VERBS.has(afterTok) ||
                /^\s*\(\s*(?:b\.|born|d\.|died|c\.)?\s*\d/.test(rest) ||
                (/^,\s*(?:a|an|the)\s+(?:\p{L}+\s+){0,2}\p{L}+/u.test(rest) &&
                  [...ROLE_NOUNS].some((r) => rest.toLowerCase().includes(r)))
              category = 'person'
            }
            if (!category) continue
            const key = `new:${category}:${normalisePhrase(run.text)}`
            const d = register(
              key,
              run.text,
              category,
              { confidence: cue ? 'medium' : 'low', weak: category === 'person' },
              mentionFor(
                run.start,
                run.end,
                category === 'person' ? 'name-pattern' : 'heading-pattern',
              ),
            )
            if (cue) d.cue = true
            attach(d, run.start, run.end)
            claimed.push([run.start, run.end])
            occurrences.push({ key, start: run.start, end: run.end, category })
          }

          for (const q of queue) attachNow(q.d, q.start, q.end)
          if (isHeading) headingKeys.push(...occurrences.map((o) => o.key))

          // 5. Relationships between entities that a cue phrase connects.
          occurrences.sort((a, b) => a.start - b.start)
          if (occurrences.length >= 2) {
            for (const r of cueRelationships(sentence, occurrences)) {
              const a = occurrences[r.from]
              const b = occurrences[r.to]
              if (a.key === b.key) continue
              const lo = Math.min(a.start, b.start)
              const hi = Math.max(a.end, b.end)
              relations.push({
                sourceKey: a.key,
                targetKey: b.key,
                type: r.type,
                mention: mentionFor(lo, hi, 'cue-phrase'),
              })
            }
          }
        }

        // Headings become entries; the notes under them become their description.
        if (isHeading) {
          const known = headingKeys
            .map((k) => drafts.get(k))
            .find(
              (d): d is Draft =>
                d !== undefined && SECTION_CATEGORY_OK.has(d.category) && !(d.weak && !d.cue),
            )
          if (known) sectionDraft = known
          else {
            const label = headingLabel(body, doc.title)
            if (label) {
              const words = tokenize(label).map((t) => t.norm)
              const category: ItemCategory = words.some((w) => EVENT_WORDS.has(w))
                ? 'event'
                : words.some((w) => INSTITUTION_WORDS.has(w))
                  ? 'institution'
                  : 'concept'
              sectionDraft = register(
                `section:${normalisePhrase(label)}`,
                label,
                category,
                { confidence: 'medium' },
                {
                  fileId: doc.fileId,
                  fileName: doc.fileName,
                  docTitle: doc.title,
                  page: page.page,
                  passage: label,
                  method: 'heading',
                },
              )
              for (const area of topicsOf(label)) sectionDraft.topics.add(area)
            }
          }
        } else if (sectionDraft && sectionDraft.body.length < 1500) {
          const d: Draft = sectionDraft
          d.body += `${d.body ? ' ' : ''}${body}`
          for (const sent of sentences.slice(0, 2)) {
            if (d.mentions.length >= MAX_MENTIONS) break
            const passage = excerpt(sent.text, 0, sent.text.length)
            if (!d.mentions.some((m) => m.passage === passage)) {
              d.mentions.push({
                fileId: doc.fileId,
                fileName: doc.fileName,
                docTitle: doc.title,
                page: page.page,
                ...(section ? { section } : {}),
                passage,
                method: 'section-text',
              })
            }
          }
          if (!d.date && paraDates.length > 0) d.date = toParsed(paraDates[0])
          if (PLACE_BEARING.has(d.category) && !d.place) {
            const pl = findPlaces(body, idx.gazetteer)[0]
            if (pl) d.place = resolvePlace(pl, body)
          }
          for (const area of topicsOf(body)) d.topics.add(area)
        }
      }
      donePages++
      opts.onProgress?.(donePages, totalPages)
      if (donePages % 3 === 0) await yieldToBrowser()
    }
  }

  // Decide which weakly-evidenced new people to keep.
  const keep = new Map<string, Draft>()
  for (const d of drafts.values()) {
    if (d.weak && !d.cue && d.count < 2) continue
    keep.set(d.key, d)
  }

  let newSeen = 0
  const candidates: Candidate[] = [...keep.values()]
    .sort((a, b) => b.count - a.count)
    .filter((d) => d.curatedIds.length > 0 || ++newSeen <= MAX_NEW_CANDIDATES)
    .map((d) => {
      const passageText = d.passages.join(' ').toLowerCase()
      const disciplines = DISCIPLINES.filter((x) => passageText.includes(x)).slice(0, 4)
      return {
        key: d.key,
        label: d.label,
        category: d.category,
        curatedIds: d.curatedIds,
        confidence: d.curatedIds.length > 1 ? 'low' : d.confidence,
        count: d.count,
        mentions: d.mentions,
        date: d.date,
        place: d.place,
        disciplines,
        topics: [...d.topics].slice(0, 3),
        sectionText: d.body.trim() ? d.body.trim().slice(0, 1200) : undefined,
      }
    })

  const seenRel = new Set<string>()
  const rels: CandidateRelationship[] = []
  for (const r of relations) {
    const src = keep.get(r.sourceKey)
    const dst = keep.get(r.targetKey)
    // Both ends must be settled: an ambiguous "possible match" cannot anchor an edge.
    if (!src || !dst || src.curatedIds.length > 1 || dst.curatedIds.length > 1) continue
    const id = `${r.sourceKey}|${r.type}|${r.targetKey}`
    if (seenRel.has(id)) continue
    seenRel.add(id)
    rels.push({ id: newId('rel'), ...r })
  }

  const tally: Record<string, number> = {}
  for (const c of candidates) {
    const label = c.curatedIds.length ? `${c.category} (known)` : c.category
    tally[label] = (tally[label] ?? 0) + 1
  }
  tally['places mentioned'] = seenPlaces.size
  tally['dates found'] = datesFound

  const topics = topicProfile(topicText.join('\n'))
  const total = docs.reduce((n, d) => n + d.pages.reduce((m, p) => m + p.text.length, 0), 0)
  if (total < 200)
    warnings.push({ code: 'short', message: 'The notes are very short, so little could be found.' })
  if (datesFound === 0)
    warnings.push({
      code: 'no-dates',
      message:
        'No dates were found, so items will not have a position on the timeline until you add one.',
    })
  if (seenPlaces.size === 0)
    warnings.push({
      code: 'no-places',
      message:
        'No place names were recognised, so nothing can be shown on the map unless you add locations.',
    })
  if (!candidates.some((c) => c.curatedIds.length))
    warnings.push({
      code: 'no-known',
      message: 'Nothing was matched to the curated atlas; every item below is new and unverified.',
    })
  if (candidates.length === 0)
    warnings.push({
      code: 'nothing',
      message: 'No people, concepts or events were recognised in these notes.',
    })

  return {
    candidates,
    relationships: rels,
    tally,
    topics,
    datesFound,
    placesFound: seenPlaces.size,
    warnings,
    ignoredSections: ignored,
  }
}

function curatedCategory(curated: Entry[], id: string): ItemCategory {
  const e = curated.find((x) => x.id === id)
  switch (e?.kind) {
    case 'person':
      return 'person'
    case 'institution':
      return 'institution'
    case 'text':
      return 'publication'
    case 'instrument':
      return 'instrument'
    case 'event':
      return 'event'
    default:
      return 'concept'
  }
}

const topicCache = new Map<string, string[]>()
/** Subject-area buckets whose keywords appear in a short text. */
export function topicsOf(text: string): string[] {
  const lower = text.toLowerCase()
  const key = lower.length < 400 ? lower : ''
  if (key && topicCache.has(key)) return topicCache.get(key) as string[]
  const hit: string[] = []
  for (const [area, words] of Object.entries(TOPIC_KEYWORDS)) {
    if (words.some((w) => lower.includes(w))) hit.push(area)
  }
  if (key) {
    if (topicCache.size > 2000) topicCache.clear()
    topicCache.set(key, hit)
  }
  return hit
}

/** Counts keyword hits per subject area across all the notes. */
export function topicProfile(text: string): TopicProfile {
  const lower = text.toLowerCase().slice(0, 3_000_000)
  const counts: Record<string, number> = {}
  let total = 0
  for (const [area, words] of Object.entries(TOPIC_KEYWORDS)) {
    let n = 0
    for (const w of words) {
      let at = lower.indexOf(w)
      let guard = 0
      while (at !== -1 && guard++ < 5000) {
        n++
        at = lower.indexOf(w, at + w.length)
      }
    }
    counts[area] = n
    total += n
  }
  const shares: Record<string, number> = {}
  for (const [area, n] of Object.entries(counts)) shares[area] = total ? n / total : 0
  const top = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([a]) => a)
  return { shares, top, totalHits: total }
}

export { kindForCategory }
