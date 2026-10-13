import type { RelationshipType } from '../../../types'
import type { ItemCategory } from '../types'

/**
 * Cue words for relationships. A relationship is only proposed when both
 * entities are in one sentence and one of these phrases sits between them,
 * so two names merely sharing a paragraph never produce an edge.
 */

type Group = 'person' | 'thing' | 'institution' | 'any'

interface Cue {
  type: RelationshipType
  /** Phrase fragments (regex source) in active voice: "A influenced B". */
  active: string
  /** Passive "A was influenced by B" is the same relation with the roles swapped. */
  passive?: string
  from: Group
  to: Group
}

const CUES: Cue[] = [
  {
    type: 'worked-at',
    active:
      '(?:worked|taught|studied|lectured|researched|was (?:a )?professor|was based|held a chair) (?:at|in)',
    from: 'person',
    to: 'institution',
  },
  {
    type: 'corresponded',
    active: '(?:corresponded with|exchanged letters with|wrote to)',
    from: 'person',
    to: 'person',
  },
  {
    type: 'collaborated',
    active: '(?:collaborated with|worked with|co-?authored with|partnered with)',
    from: 'any',
    to: 'any',
  },
  {
    type: 'taught',
    active: '(?:taught|tutored|mentored|supervised)',
    from: 'person',
    to: 'person',
  },
  {
    type: 'translated',
    active: 'translat(?:ed|es|ing)',
    passive: 'translated',
    from: 'any',
    to: 'any',
  },
  {
    type: 'published',
    active: '(?:published|authored|wrote)',
    from: 'person',
    to: 'thing',
  },
  {
    type: 'developed',
    active:
      '(?:developed|proposed|formulated|introduced|devised|invented|discovered|coined|designed)',
    passive:
      '(?:developed|proposed|formulated|introduced|devised|invented|discovered|coined|designed)',
    from: 'any',
    to: 'thing',
  },
  {
    type: 'influenced',
    active:
      '(?:influenc(?:ed|es|ing)|inspir(?:ed|es|ing)|shap(?:ed|es|ing)|built (?:on|upon)|drew (?:on|upon))',
    passive: '(?:influenced|inspired|shaped)',
    from: 'any',
    to: 'any',
  },
  {
    type: 'criticised',
    active: '(?:critici[sz](?:ed|es|ing)|critiqu(?:ed|es|ing)|attack(?:ed|s|ing)|objected to)',
    passive: '(?:criticised|criticized|critiqued|attacked)',
    from: 'any',
    to: 'any',
  },
  {
    type: 'challenged',
    active:
      '(?:challeng(?:ed|es|ing)|disput(?:ed|es|ing)|question(?:ed|s|ing)|refut(?:ed|es|ing)|rejected|overturned)',
    passive: '(?:challenged|disputed|questioned|refuted|rejected|overturned)',
    from: 'any',
    to: 'any',
  },
  {
    type: 'replaced',
    active: '(?:replac(?:ed|es|ing)|supersed(?:ed|es|ing)|displac(?:ed|es|ing))',
    passive: '(?:replaced|superseded|displaced)',
    from: 'any',
    to: 'any',
  },
  {
    type: 'supported',
    active:
      '(?:support(?:ed|s|ing)|defend(?:ed|s|ing)|endors(?:ed|es|ing)|confirm(?:ed|s|ing)|champion(?:ed|s|ing))',
    passive: '(?:supported|defended|endorsed|confirmed|championed)',
    from: 'any',
    to: 'any',
  },
  {
    type: 'funded',
    active: '(?:fund(?:ed|s|ing)|financ(?:ed|es|ing)|sponsor(?:ed|s|ing))',
    passive: '(?:funded|financed|sponsored)',
    from: 'any',
    to: 'any',
  },
  {
    type: 'regulated',
    active: '(?:regulat(?:ed|es|ing))',
    passive: 'regulated',
    from: 'any',
    to: 'any',
  },
]

const COMPILED = CUES.map((c) => ({
  ...c,
  activeRe: new RegExp(`\\b${c.active}\\b`, 'gi'),
  passiveRe: c.passive ? new RegExp(`\\b${c.passive}\\s+by\\b`, 'gi') : null,
}))

/** The last place in `gap` where `re` matches, as [start, end]. */
function lastMatch(re: RegExp, gap: string): [number, number] | null {
  let last: [number, number] | null = null
  for (const m of gap.matchAll(re)) last = [m.index, m.index + m[0].length]
  return last
}

/** How much text may follow the cue before the second entity ("with", "the new"). */
const MAX_TAIL = 30

function groupOf(category: ItemCategory): Group {
  if (category === 'person') return 'person'
  if (category === 'institution') return 'institution'
  if (category === 'place' || category === 'period') return 'any'
  return 'thing'
}

function fits(want: Group, category: ItemCategory): boolean {
  if (want === 'any') return category !== 'place' && category !== 'period'
  if (want === 'thing') return groupOf(category) === 'thing' || category === 'institution'
  return groupOf(category) === want
}

export interface CuedRelationship {
  type: RelationshipType
  /** Index into the occurrence list for the source and target. */
  from: number
  to: number
}

export interface Occurrence {
  start: number
  end: number
  category: ItemCategory
}

/** The longest gap (in characters) allowed between two entities of a relation. */
const MAX_GAP = 100

/**
 * Looks at consecutive entity occurrences in one sentence and returns the
 * relationships that a cue phrase between them strongly indicates.
 */
export function cueRelationships(sentence: string, occ: Occurrence[]): CuedRelationship[] {
  const out: CuedRelationship[] = []
  for (let i = 0; i + 1 < occ.length; i++) {
    const a = occ[i]
    const b = occ[i + 1]
    const gap = sentence.slice(a.end, b.start)
    if (gap.length > MAX_GAP || /[.;!?]/.test(gap)) continue
    for (const c of COMPILED) {
      const passive = c.passiveRe ? lastMatch(c.passiveRe, gap) : null
      if (
        passive &&
        gap.length - passive[1] <= MAX_TAIL &&
        fits(c.to, a.category) &&
        fits(c.from, b.category)
      ) {
        out.push({ type: c.type, from: i + 1, to: i })
        break
      }
      const active = lastMatch(c.activeRe, gap)
      if (
        active &&
        gap.length - active[1] <= MAX_TAIL &&
        !/\bby\s*$/i.test(gap) &&
        fits(c.from, a.category) &&
        fits(c.to, b.category)
      ) {
        out.push({ type: c.type, from: i, to: i + 1 })
        break
      }
    }
  }
  return out
}
