import type { Entry } from '../types'

/**
 * Navigational periods for the time-travel control.
 *
 * These are conventions for browsing, not claims that history changed
 * everywhere at once: boundaries are approximate, the same place can sit in
 * different "periods" for different people, and entries are allowed to span
 * several periods.
 */

export type EraId =
  | 'ancient'
  | 'medieval'
  | 'early-modern'
  | 'industry-empire'
  | 'modern-conflict'
  | 'cold-war'
  | 'networked'
  | 'platform-age'

export interface WhatChanged {
  institutions: string
  developments: string
  centres: string
  instruments: string
  questions: string
  communication: string
  context: string
  continued: string
  contested: string
}

export interface Era {
  id: EraId
  label: string
  /** Compact label for small screens. */
  shortLabel: string
  /** First year included; -Infinity for the open start. */
  from: number
  /** First year NOT included; Infinity for the open end (present day). */
  to: number
  /** Human-facing approximate range. */
  range: string
  description: string
  whatChanged: WhatChanged
}

export const ERAS: Era[] = [
  {
    id: 'ancient',
    label: 'Ancient Worlds',
    shortLabel: 'Ancient',
    from: -Infinity,
    to: 500,
    range: 'before c. 500 CE',
    description:
      'Sky-watching, medicine, mathematics and natural philosophy developed in many places at once, from Mesopotamia and Egypt to Greece, India and China.',
    whatChanged: {
      institutions:
        'Temple observatories, scribal schools, philosophical schools and libraries such as Alexandria.',
      developments:
        'Systematic celestial record-keeping, geometry and number systems, early causal theories of nature and disease.',
      centres:
        'Several centres at once: Babylon, Egypt, Greek cities, Alexandria, South Asia and China — none the single origin of science.',
      instruments:
        'Clay tablets, papyrus, the gnomon, sighting tools and early astronomical instruments.',
      questions:
        'What is nature made of? How can we know the heavens? What counts as an explanation?',
      communication:
        'Knowledge moved by teaching, copying and travel; most people had no access to written learning.',
      context:
        'Empires, temples and courts paid for astronomers, physicians and scribes, often for calendars, taxation and omens.',
      continued:
        'This is the opening period: later periods inherit and reinterpret these traditions.',
      contested:
        'Whether "science" is the right word for these practices, and how much Greek thought owed to earlier traditions.',
    },
  },
  {
    id: 'medieval',
    label: 'Medieval and Interconnected Worlds',
    shortLabel: 'Medieval',
    from: 500,
    to: 1450,
    range: 'c. 500–1450',
    description:
      'Learning was preserved, translated and extended across the Islamic world, Byzantium, South and East Asia, Africa and Europe — a network, not a European story.',
    whatChanged: {
      institutions:
        'Houses of learning such as the House of Wisdom, madrasas, observatories, monasteries and the first European universities.',
      developments:
        'Algebra, optics, astronomy, medicine and large-scale translation between Greek, Syriac, Arabic, Sanskrit, Persian, Chinese and Latin.',
      centres:
        'Baghdad, Cairo, Córdoba, Samarkand, Chang’an and later Paris, Oxford and Bologna, linked by trade and pilgrimage routes.',
      instruments:
        'Astrolabes, observatory instruments, paper and the codex, which cheapened and spread written knowledge.',
      questions:
        'How are reason and revelation related? How reliable is inherited authority? What does experiment add?',
      communication:
        'Manuscripts, commentary traditions, teachers and translators; paper-making spread westward.',
      context:
        'Caliphates, empires, trade networks and religious institutions funded and shaped learning.',
      continued:
        'Greek, Babylonian and Indian inheritances were reworked rather than simply handed on.',
      contested:
        'How original and how continuous medieval natural philosophy was, and how to describe transmission without implying a straight line.',
    },
  },
  {
    id: 'early-modern',
    label: 'Renaissance and Early Modern Science',
    shortLabel: 'Early modern',
    from: 1450,
    to: 1750,
    range: 'c. 1450–1750',
    description:
      'Print, new instruments, long-distance trade and new societies reshaped how knowledge was made and argued over — the contested period often called the Scientific Revolution.',
    whatChanged: {
      institutions:
        'Scientific societies and academies (the Royal Society, the Académie des Sciences), court patronage, botanical gardens and cabinets of curiosities.',
      developments:
        'Heliocentric astronomy, new anatomy, mathematical physics, experimental philosophy and the microscope’s new worlds.',
      centres:
        'Italian courts, the Low Countries, London, Paris and Prague, tied into Jesuit, Ottoman, Mughal, Chinese and Atlantic exchange.',
      instruments: 'Telescope, microscope, air pump, pendulum clock and the printing press.',
      questions:
        'What is the right method? How far can mathematics describe nature? Who is a credible witness?',
      communication: 'Printed books, learned letters and the first scientific journals.',
      context:
        'Religious conflict, state-building, mercantile empires and the beginnings of colonial collecting.',
      continued: 'Ancient and medieval authorities were still cited, argued with and used.',
      contested:
        'Whether there was a single "revolution" at all, and how much it depended on craftspeople, global trade and non-European knowledge.',
    },
  },
  {
    id: 'industry-empire',
    label: 'Industry, Empire and Classification',
    shortLabel: 'Industry',
    from: 1750,
    to: 1900,
    range: 'c. 1750–1900',
    description:
      'Factories, steam and empire changed what science was for and who paid for it; the word "scientist" appeared and surveying, collecting and classifying became large-scale enterprises.',
    whatChanged: {
      institutions:
        'Universities reorganised around research, learned societies, museums, botanical gardens, surveys and colonial scientific departments.',
      developments:
        'Chemistry, thermodynamics, evolution, germ theory and public-health statistics, alongside systems of racial classification now rejected.',
      centres:
        'London, Paris, Berlin and imperial hubs, with colonial sites supplying specimens, data and labour that were often uncredited.',
      instruments:
        'Steam power, telegraph, railways, photography, the spectroscope and survey equipment.',
      questions:
        'What counts as scientific method? What is the relation between science, religion and progress? Who counts as a scientist?',
      communication: 'Mass print, popular lectures, periodicals and great exhibitions.',
      context:
        'Industrial capitalism and colonial rule shaped research priorities, and colonised people’s knowledge was often appropriated.',
      continued: 'Societies, journals and the instrument trade from the earlier period expanded.',
      contested:
        'The role of empire in making science, and how to account for scientific racism without treating it as a mere aberration.',
    },
  },
  {
    id: 'modern-conflict',
    label: 'Modern Science and Global Conflict',
    shortLabel: 'Modern',
    from: 1900,
    to: 1945,
    range: 'c. 1900–1945',
    description:
      'Physics, genetics and statistics were remade, while two world wars drew science into state planning, industry and weapons.',
    whatChanged: {
      institutions:
        'Industrial and state laboratories, philanthropic foundations and research councils.',
      developments:
        'Relativity and quantum theory, the chromosome theory, antibiotics and nuclear fission, alongside eugenics and state-directed biology.',
      centres:
        'Berlin, Göttingen, Cambridge, Copenhagen, Moscow and the United States, with many scientists forced to migrate.',
      instruments: 'Cyclotrons, radio, X-ray crystallography and early computing machines.',
      questions:
        'What does science owe the state? What are the limits of verification? What responsibility do scientists carry for applications?',
      communication: 'Radio, cinema, newspapers and state propaganda reached new mass audiences.',
      context: 'Total war, revolutions, economic crisis and fascism pushed science into politics.',
      continued: 'The professional, publicly funded research system kept growing.',
      contested:
        'How far scientists were complicit in or constrained by war, and how to read interwar philosophy of science.',
    },
  },
  {
    id: 'cold-war',
    label: 'Cold War and Big Science',
    shortLabel: 'Cold War',
    from: 1945,
    to: 1991,
    range: 'c. 1945–1991',
    description:
      'Large state-funded programmes — nuclear physics, space, computing, molecular biology — changed the scale of research and raised questions about its direction.',
    whatChanged: {
      institutions:
        'National laboratories, research councils, CERN-style collaborations and science-policy bodies.',
      developments:
        'Plate tectonics, the structure of DNA, early computers and spaceflight, alongside environmental and safety controversies.',
      centres:
        'The United States, the Soviet Union and Western Europe, with decolonising states building their own institutions.',
      instruments: 'Particle accelerators, mainframe computers, satellites and radio telescopes.',
      questions:
        'Who sets the agenda of publicly funded science? How should experts advise governments? Can science be value-free?',
      communication:
        'Television, the science-fiction boom and public information campaigns about risk.',
      context: 'Superpower rivalry, nuclear weapons and decolonisation.',
      continued: 'State funding and the wartime laboratory model.',
      contested:
        'Whether Big Science produced better knowledge or narrowed priorities, and who bore the environmental and health costs.',
    },
  },
  {
    id: 'networked',
    label: 'Networked and Biotechnological World',
    shortLabel: 'Networked',
    from: 1991,
    to: 2010,
    range: 'c. 1991–2010',
    description:
      'The web, genomics and global research networks changed how knowledge circulates, while debates about openness, ownership and expertise intensified.',
    whatChanged: {
      institutions:
        'Genome consortia, open-access repositories, biotech firms and university technology-transfer offices.',
      developments:
        'The Human Genome Project, the commercial web, search engines and early social media.',
      centres:
        'Research and technology clusters in the US, Europe and East Asia, alongside growing capacity in India, China and Brazil.',
      instruments: 'Sequencers, the web browser, large databases and mobile phones.',
      questions:
        'Who owns data and genes? Can knowledge stay open when it is commercial? Who counts as expert online?',
      communication:
        'The web, email lists and early blogs let new publics produce and share knowledge directly.',
      context: 'Globalisation, privatised research funding and new intellectual-property regimes.',
      continued:
        'Big Science, state funding and the questions about expertise from earlier decades.',
      contested:
        'Whether openness or enclosure was winning, and how new publics should be involved in decisions.',
    },
  },
  {
    id: 'platform-age',
    label: 'Platform, Climate and AI Age',
    shortLabel: 'Platform',
    from: 2010,
    to: Infinity,
    range: 'c. 2010–present',
    description:
      'Platforms, planetary observation, climate science and machine learning now structure both research and public debate — with unevenly shared benefits and power.',
    whatChanged: {
      institutions:
        'Platform companies, cloud and data-centre infrastructure, AI research labs, climate assessment bodies and open-science initiatives.',
      developments:
        'Machine learning and generative AI, gene editing, mRNA vaccines and satellite-based Earth observation.',
      centres:
        'Many: the Bay Area, Boston, London, Shenzhen, Bangalore, Nairobi, Cape Town and others — science is not confined to a few cities.',
      instruments: 'Satellites, sensor networks, subsea cables, cloud computing and large models.',
      questions:
        'Who controls knowledge infrastructure? How should risk and uncertainty be communicated? How do publics take part in governing technology?',
      communication:
        'Social platforms, podcasts, recommendation systems and synthetic media reshape how claims reach audiences.',
      context:
        'Climate change, pandemic response, platform concentration and geopolitical technology competition.',
      continued: 'Commercial research, open-science debates and questions about expertise.',
      contested:
        'The effects of platforms on public knowledge, the future of AI governance, and how to weigh benefits against harms.',
    },
  },
]

export const ERA_BY_ID = new Map<string, Era>(ERAS.map((e) => [e.id, e]))

export function eraById(id: string | null | undefined): Era | null {
  return id ? (ERA_BY_ID.get(id) ?? null) : null
}

export function eraIndex(id: string | null | undefined): number {
  return id ? ERAS.findIndex((e) => e.id === id) : -1
}

/** The era a given year falls in. */
export function eraOfYear(year: number): Era {
  return ERAS.find((e) => year >= e.from && year < e.to) ?? ERAS[ERAS.length - 1]
}

const LIVE_THEORY_STATUSES = new Set([
  'dominant',
  'modified',
  'limited-domain',
  'debated',
  'still-contested',
])

/** The span of years an entry is "active" in; `to` is Infinity when it persists. */
export function activeSpan(entry: Entry): { from: number; to: number } {
  const from = entry.startYear
  const closed = entry.closedYear ?? entry.overturnedYear
  if (closed !== undefined) return { from, to: Math.max(closed, from) }
  if (entry.endYear !== undefined) return { from, to: entry.endYear }
  // Institutions with no recorded end are still running; ideas that remain
  // live debates stay visible, but overturned or purely historical ones do not.
  if (entry.kind === 'institution') return { from, to: Infinity }
  if (
    (entry.kind === 'idea' || entry.kind === 'discovery') &&
    entry.theoryStatus &&
    LIVE_THEORY_STATUSES.has(entry.theoryStatus)
  ) {
    return { from, to: Infinity }
  }
  return { from, to: from }
}

function spanOverlapsEra(span: { from: number; to: number }, era: Era): boolean {
  // A span ending exactly on `to` still touches the era that starts there.
  return span.from < era.to && span.to >= era.from
}

export type EraVisibility = 'active' | 'echo' | 'hidden'

/**
 * Whether an entry belongs in a period.
 * - `active`: part of the period itself.
 * - `echo`: belonged to the period just before (or was overturned during
 *   it) and is shown faintly when "historical echoes" is on.
 */
export function entryEraVisibility(entry: Entry, era: Era, allowEchoes: boolean): EraVisibility {
  if (entry.transhistorical) return 'active'
  if (entry.activePeriods) {
    if (entry.activePeriods.includes(era.id)) return 'active'
  } else if (spanOverlapsEra(activeSpan(entry), era)) {
    return 'active'
  }
  if (!allowEchoes) return 'hidden'
  const i = ERAS.findIndex((e) => e.id === era.id)
  const previous = i > 0 ? ERAS[i - 1] : null
  if (!previous) return 'hidden'
  const wasActiveBefore = entry.activePeriods
    ? entry.activePeriods.includes(previous.id)
    : spanOverlapsEra(activeSpan(entry), previous)
  return wasActiveBefore ? 'echo' : 'hidden'
}

export interface EraSplit {
  /** Entries that belong in the period (clustered and listed normally). */
  active: Entry[]
  /** Faint echoes from the preceding period. */
  echoes: Entry[]
  /** Entries shown only because the search covers all time. */
  outside: Set<string>
}

/**
 * Applies a period to an already filtered list. With `era === null` ("All
 * Time") everything is active. With `searchAllTime` and an active text
 * query, matches from any period are included and flagged as outside it.
 */
export function splitByEra(
  entries: Entry[],
  era: Era | null,
  options: { echoes: boolean; searchAllTime: boolean; hasQuery: boolean },
): EraSplit {
  if (!era) return { active: entries, echoes: [], outside: new Set() }
  const active: Entry[] = []
  const echoes: Entry[] = []
  const outside = new Set<string>()
  for (const entry of entries) {
    const v = entryEraVisibility(entry, era, options.echoes)
    if (v === 'active') active.push(entry)
    else if (options.searchAllTime && options.hasQuery) {
      active.push(entry)
      outside.add(entry.id)
    } else if (v === 'echo') echoes.push(entry)
  }
  return { active, echoes, outside }
}
