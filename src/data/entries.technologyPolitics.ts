import type { Entry } from '../types'

export const technologyPoliticsEntries: Entry[] = [
  {
    id: 'winner-artifacts-have-politics',
    slug: 'winner-artifacts-have-politics',
    title: '"Do Artifacts Have Politics?"',
    subtitle: "Langdon Winner's case that technologies can embody political arrangements",
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'Langdon Winner argued that technical artefacts can have politics in two distinct ways: some acquire political properties through the specific circumstances of their design and use, while others, Winner argued, are strongly — even inherently — compatible with particular forms of social authority regardless of circumstance.',
    longDescription:
      'Winner distinguished technologies that happen to settle a political question in a particular case (his famous, later historically disputed, example was Robert Moses\'s allegedly low highway overpasses on Long Island) from technologies he argued are inherently compatible with certain political arrangements — a centralised nuclear power system, he suggested, plausibly requires centralised, hierarchical control over security and operation in a way a decentralised solar array does not. Critics, including social-construction-of-technology scholars, argue Winner understates how much "inherent" political compatibility is itself produced by specific social choices rather than built into the technology as such. The essay remains a foundational provocation for asking whether technologies merely get used politically, or can themselves embody political arrangements.',
    startYear: 1980,
    endYear: 1980,
    dateDisplay: '1980',
    approximateDate: false,
    transregional: true,
    scale: 'network',
    places: [],
    people: ['langdon-winner'],
    cultures: ['American'],
    disciplines: ['science and technology studies', 'political theory'],
    themes: ['technology-and-politics', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          'Is it technological determinism to say a centralised power grid requires centralised control, or is that a genuine technical constraint that happens to have political consequences?',
      },
    ],
    historicalSignificance:
      'One of the most widely taught and debated essays in science and technology studies, setting the terms for subsequent arguments about technological determinism versus the social shaping of technology.',
    sources: [
      {
        author: 'Langdon Winner',
        title: '"Do Artifacts Have Politics?"',
        year: '1980',
        type: 'primary',
      },
    ],
    relatedEntryIds: [
      'robert-moses-bridges',
      'social-construction-of-technology',
      'collingridge-dilemma',
    ],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'robert-moses-bridges',
    slug: 'robert-moses-bridges',
    title: 'Robert Moses and the Long Island Overpasses',
    subtitle: 'A famous, and famously disputed, case of technology encoding politics',
    kind: 'event',
    period: 'environmental-contemporary',
    summary:
      "Langdon Winner's most famous example claimed that urban planner Robert Moses deliberately built Long Island parkway overpasses too low for buses to pass under, restricting poorer and predominantly Black New Yorkers' access to Jones Beach — historians have since disputed key parts of this story.",
    longDescription:
      "Winner used the low bridges as a vivid illustration of how a built artefact could encode and enforce a political and racial arrangement independent of any single discriminatory act at the point of use. Subsequent historians, notably Bernward Joerges, challenged aspects of the account: bus routes to Long Island beaches existed by other roads, the overpasses were of a standard height for parkways of the era, and the available documentary evidence for Moses's specific discriminatory intent regarding these particular bridges is thinner than the story's popularity suggests. This does not mean Moses's broader career was free of discriminatory planning decisions — it is well documented elsewhere — but the overpass story specifically is best treated as a contested illustration rather than a settled fact, which is itself an instructive lesson about how appealing anecdotes can outrun the evidence supporting them.",
    startYear: 1920,
    endYear: 1930,
    dateDisplay: 'c. 1920s–1930s (built); disputed since c. 1999',
    approximateDate: true,
    latitude: 40.6042,
    longitude: -73.5312,
    places: [{ name: 'Long Island, New York', latitude: 40.6042, longitude: -73.5312 }],
    transregional: false,
    people: ['robert-moses', 'langdon-winner'],
    cultures: ['American'],
    disciplines: ['urban planning'],
    themes: ['technology-and-politics', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          'If a famous illustration of a theory turns out to be historically disputed, does that undermine the theory itself, or just that particular example of it?',
      },
    ],
    historicalSignificance:
      'Became the canonical teaching example for "artifacts have politics" — and its subsequent historical disputation is itself a widely cited lesson in checking influential anecdotes against primary evidence.',
    commonMyth:
      "That the low-bridges story is a straightforwardly documented fact about Moses's specific intentions.",
    historicalComplication:
      "Historians dispute whether the available evidence actually supports the specific claim that these particular overpasses were built low with discriminatory intent, even though Moses's broader planning record included well-documented racial and class bias.",
    sources: [
      {
        author: 'Langdon Winner',
        title: '"Do Artifacts Have Politics?"',
        year: '1980',
        type: 'primary',
      },
      {
        author: 'Bernward Joerges',
        title: '"Do Politics Have Artefacts?"',
        year: '1999',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['winner-artifacts-have-politics'],
    confidence: 'contested',
    contentStatus: 'complete',
  },
  {
    id: 'agricultural-mechanization-labour-politics',
    slug: 'agricultural-mechanization-labour-politics',
    title: 'Agricultural Mechanisation and Contested Labour Politics',
    subtitle: "McCormick's moulding machines and the mechanical tomato harvester",
    kind: 'idea',
    period: 'industrial-imperial',
    summary:
      "Two widely discussed cases — McCormick Harvesting Machine Company's adoption of iron-moulding machines in the 1880s, and the mechanical tomato harvester developed at the University of California in the 1940s–60s — are used in science and technology studies to argue that mechanisation decisions can be shaped by labour politics as much as by efficiency.",
    longDescription:
      'Historian David Noble argued that Cyrus McCormick\'s adoption of pneumatic moulding machines in his reaper factory, replacing skilled unionised iron moulders with less-skilled machine operators during a period of labour conflict, was motivated as much by weakening organised labour as by straightforward technical efficiency — a case often cited for how mechanisation choices can embed labour politics inside apparently neutral technical decisions. The mechanical tomato harvester, developed with public university research funding, dramatically increased the scale at which tomatoes could be economically grown and harvested, accelerating consolidation toward large agribusiness operations and away from smaller growers who could not afford the machine, and reducing demand for the seasonal farm labour the harvester replaced. Both cases are used to argue that "efficiency" is never a politically neutral yardstick on its own — it always presupposes a judgement about whose costs and benefits count.',
    startYear: 1880,
    endYear: 1965,
    dateDisplay: 'c. 1880–1965',
    approximateDate: true,
    transregional: true,
    scale: 'institution',
    places: [
      { name: 'Chicago, Illinois (McCormick works)', latitude: 41.8781, longitude: -87.6298 },
      { name: 'University of California, Davis', latitude: 38.5382, longitude: -121.7617 },
    ],
    people: ['cyrus-mccormick'],
    cultures: ['American'],
    disciplines: ['agricultural science', 'industrial engineering'],
    themes: ['technology-and-politics', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          'When a new machine is adopted partly to weaken organised labour, is that a misuse of a neutral technology, or evidence that the technology was never neutral to begin with?',
        debateId: 'ethics-in-science',
      },
    ],
    historicalSignificance:
      'Widely used case studies for arguing that mechanisation decisions routinely embed labour and class politics inside choices that are usually presented as purely technical or efficiency-driven.',
    sources: [
      {
        author: 'David F. Noble',
        title: 'Forces of Production: A Social History of Industrial Automation',
        year: '1984',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['winner-artifacts-have-politics', 'social-construction-of-technology'],
    confidence: 'likely',
    contentStatus: 'complete',
  },
  {
    id: 'collingridge-dilemma',
    slug: 'collingridge-dilemma',
    title: 'The Collingridge Dilemma',
    subtitle: 'Early control, late knowledge',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'David Collingridge observed that a technology is easiest to change early in its development, when its consequences are hardest to predict — and that by the time its consequences become clear, the technology is often too entrenched, economically and socially, to change easily.',
    longDescription:
      "This double bind — early intervention is easy but poorly informed; late intervention is well informed but difficult — underlies much of the responsible-innovation literature's emphasis on anticipation and early public engagement. It is not a counsel of paralysis: Collingridge argued for building in flexibility and reversibility during early development specifically so that course-correction remains possible once consequences become clearer, rather than either locking in a design prematurely or waiting for perfect information before acting.",
    startYear: 1980,
    endYear: 1980,
    dateDisplay: '1980',
    approximateDate: false,
    transregional: true,
    scale: 'network',
    places: [],
    people: ['david-collingridge'],
    cultures: ['British'],
    disciplines: ['science policy'],
    themes: ['technology-and-politics', 'innovation-policy'],
    philosophicalQuestions: [
      {
        prompt:
          "If a technology's consequences only become clear once it is already entrenched, how much should society be willing to restrict a promising new technology on the basis of hard-to-predict future risks?",
      },
    ],
    historicalSignificance:
      'A foundational concept in responsible-innovation and technology-assessment literature, explaining why early engagement with emerging technologies matters even under deep uncertainty.',
    sources: [
      {
        author: 'David Collingridge',
        title: 'The Social Control of Technology',
        year: '1980',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['spice-geoengineering-project', 'winner-artifacts-have-politics'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'spice-geoengineering-project',
    slug: 'spice-geoengineering-project',
    title: 'The SPICE Geoengineering Project',
    subtitle: 'Responsible innovation tested by a cancelled field trial',
    kind: 'event',
    period: 'environmental-contemporary',
    summary:
      'The UK-funded Stratospheric Particle Injection for Climate Engineering (SPICE) project planned a small outdoor test — spraying water from a tethered balloon via a long hose — of equipment relevant to future solar geoengineering, before cancelling the field test in 2012 amid public controversy and an intellectual-property dispute among the investigators.',
    longDescription:
      'SPICE was funded with an explicit "stage-gate" review process intended to let independent reviewers and public engagement inform whether the project should proceed to each next stage, including the proposed outdoor equipment test. The test was ultimately cancelled before deployment, following public concern about geoengineering more broadly and a dispute over patent applications some investigators had filed related to the project\'s delivery-system technology — a conflict critics argued sat uneasily with the project\'s own stated commitment to open, responsible, publicly engaged research. Jack Stilgoe and colleagues used SPICE as a detailed case study for the practical difficulty of enacting "responsible innovation" principles (anticipation, reflexivity, inclusion, responsiveness) under real institutional and commercial pressure, including the risk that responsible-innovation processes can end up functioning more as reputation management than as genuine power-sharing over a project\'s direction.',
    startYear: 2010,
    endYear: 2012,
    dateDisplay: '2010–2012',
    approximateDate: false,
    latitude: 51.4545,
    longitude: -2.5879,
    places: [{ name: 'University of Bristol', latitude: 51.4545, longitude: -2.5879 }],
    transregional: false,
    people: ['matthew-watson', 'jack-stilgoe'],
    cultures: ['British'],
    disciplines: ['climate science', 'science policy'],
    themes: [
      'technology-and-politics',
      'ethics',
      'innovation-policy',
      'climate',
      'policy-and-participation',
    ],
    philosophicalQuestions: [
      {
        prompt:
          'If researchers who publicly commit to "responsible innovation" also file patents on the same technology, does that conflict undermine the stated commitment, or is commercial interest simply compatible with responsible practice if disclosed?',
        debateId: 'ethics-in-science',
      },
    ],
    historicalSignificance:
      'A widely studied real-world test of whether formal "responsible innovation" processes can actually constrain a controversial technology\'s development, or mainly manage its public reputation.',
    sources: [
      {
        author: 'Jack Stilgoe',
        title: 'Experiment Earth: Responsible Innovation in Geoengineering',
        year: '2015',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['collingridge-dilemma', 'climate-science-scepticism'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
]
