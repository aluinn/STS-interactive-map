import type { Entry } from '../types'

export const newFiguresEntries: Entry[] = [
  {
    id: 'louis-pasteur',
    slug: 'louis-pasteur',
    title: 'Louis Pasteur',
    subtitle: 'Germ theory, laboratory method, and a new kind of medical authority',
    kind: 'person',
    period: 'industrial-imperial',
    summary:
      'Pasteur\'s laboratory experiments on fermentation and spontaneous generation, and his subsequent work on vaccination, helped establish germ theory and made the controlled laboratory — rather than the bedside or the clinic — a central site of medical authority.',
    longDescription:
      'Beginning with industrial problems (why wine and beer sometimes spoiled), Pasteur\'s fermentation studies led him to argue that specific microorganisms caused specific processes, a line of reasoning he extended into his swan-neck flask experiments refuting spontaneous generation and, later, into attenuated-pathogen vaccines for anthrax and rabies. Pasteur was also a skilled self-promoter and institution-builder: his dramatic public demonstrations (including the widely publicised 1885 treatment of a boy bitten by a rabid dog) and the Pasteur Institute he founded helped establish the laboratory scientist, rather than the practising physician, as the figure whose authority the public and the state increasingly deferred to on questions of disease. Historians including Bruno Latour have used Pasteur\'s career to examine how laboratory results get translated into wider social and political authority, not simply accepted on their technical merits alone.',
    startYear: 1822,
    endYear: 1895,
    dateDisplay: '1822–1895',
    approximateDate: false,
    latitude: 48.8566,
    longitude: 2.3522,
    places: [{ name: 'Paris', latitude: 48.8566, longitude: 2.3522, role: 'institution' }],
    transregional: false,
    people: ['louis-pasteur'],
    cultures: ['French'],
    disciplines: ['microbiology', 'medicine'],
    themes: ['scientific-practice', 'profession-and-identity', 'instruments-and-method'],
    philosophicalQuestions: [
      {
        prompt:
          'Pasteur\'s authority rested partly on dramatic public demonstration as well as laboratory results — how much does scientific credibility depend on effective public performance, separate from the underlying evidence?',
        debateId: 'objectivity-values',
      },
    ],
    historicalSignificance:
      'Central to establishing germ theory and the modern laboratory as a site of medical and scientific authority, with lasting influence on public health, vaccination, and the sociology of scientific credibility.',
    commonMyth: 'That Pasteur single-handedly and instantly proved germ theory, ending all scientific debate on disease causation.',
    historicalComplication:
      'Pasteur\'s rivalry with Félix Pouchet over spontaneous generation, and his later rivalry with Robert Koch over bacteriology, show germ theory\'s acceptance was contested and nationally inflected (French versus German scientific prestige), not a simple, uncontested discovery.',
    sources: [
      {
        author: 'Bruno Latour',
        title: 'The Pasteurization of France',
        year: '1988',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['spontaneous-generation-theory', 'john-snow-cholera', 'laboratory-ethnography'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'imre-lakatos',
    slug: 'imre-lakatos',
    title: 'Imre Lakatos',
    subtitle: 'Research programmes: a middle path between Popper and Kuhn',
    kind: 'person',
    period: 'philosophy-of-science',
    summary:
      'Lakatos proposed that science should be understood through "research programmes" — a protected theoretical core surrounded by an adjustable belt of auxiliary hypotheses — offering a more historically realistic account than strict Popperian falsification while resisting what he saw as Kuhn\'s relativism.',
    longDescription:
      'Lakatos distinguished a research programme\'s "hard core" (the central commitments scientists protect from refutation by adjusting surrounding assumptions) from its "protective belt" of auxiliary hypotheses, which can be revised in response to anomalies. A programme is "progressive" if its adjustments successfully predict new facts, and "degenerating" if its adjustments are merely ad hoc patches that explain away anomalies without new predictive power. This let Lakatos retain Popper\'s core concern with testability and progress while acknowledging, as Kuhn had shown historically, that scientists do not actually abandon a theory at its first failed prediction — they can rationally persist with a programme for a long time, so long as it keeps being progressive. Lakatos\'s framework was itself revised by later philosophers who questioned whether "progressive" and "degenerating" could be identified except with the benefit of hindsight.',
    startYear: 1970,
    endYear: 1978,
    dateDisplay: '1970–1978',
    approximateDate: false,
    latitude: 51.5072,
    longitude: -0.1276,
    places: [{ name: 'London School of Economics', latitude: 51.5072, longitude: -0.1276 }],
    transregional: false,
    people: ['imre-lakatos'],
    cultures: ['Hungarian', 'British'],
    disciplines: ['philosophy'],
    themes: ['method', 'scientific-change'],
    philosophicalQuestions: [
      {
        prompt:
          'If a "progressive" research programme can only be reliably distinguished from a "degenerating" one in hindsight, how useful is the distinction for scientists actually trying to decide, in the moment, whether to keep pursuing a programme?',
        debateId: 'kuhn-paradigms-revolutions',
      },
    ],
    historicalSignificance:
      'Offered an influential middle path between Popperian falsificationism and Kuhnian paradigm theory, still widely taught as a key station in twentieth-century philosophy of science.',
    sources: [
      {
        author: 'Imre Lakatos',
        title: '"Falsification and the Methodology of Scientific Research Programmes"',
        year: '1970',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['karl-popper', 'thomas-kuhn', 'paul-feyerabend'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'ai-governance-and-safety-institutions',
    slug: 'ai-governance-and-safety-institutions',
    title: 'AI Governance and Safety Institutions',
    subtitle: 'New state bodies for a fast-moving, commercially dominated technology',
    kind: 'institution',
    period: 'environmental-contemporary',
    summary:
      'From around 2023, several governments established dedicated AI safety institutes and governance bodies — the UK AI Safety Institute and the US AI Safety Institute among the first — to evaluate frontier AI systems, a notably rapid state response compared with how long equivalent oversight bodies took to form for earlier technologies.',
    longDescription:
      'These institutions aim to independently evaluate the capabilities and risks of advanced AI systems before and after deployment, a task complicated by the fact that the most capable systems are developed by a small number of well-resourced private companies that control access to the technical details needed for evaluation — raising the same policy-brokerage and access questions that recur throughout the history of science advice. International coordination efforts, including the 2023 Bletchley Park AI Safety Summit and its successors, represent an attempt at global governance moving roughly in step with a still-developing technology, rather than regulation arriving long after deployment as in many historical cases. As with other recently established institutions in this atlas, their effectiveness and longevity cannot yet be assessed with the confidence available for older, historically settled cases.',
    startYear: 2023,
    endYear: 2023,
    dateDisplay: '2023–present',
    approximateDate: false,
    transregional: true,
    scale: 'nation',
    places: [
      { name: 'London', latitude: 51.5072, longitude: -0.1276 },
      { name: 'Washington, D.C.', latitude: 38.9072, longitude: -77.0369 },
    ],
    people: [],
    cultures: ['British', 'American', 'transnational'],
    disciplines: ['science policy', 'computer science'],
    themes: ['innovation-policy', 'expertise-and-policy', 'ethics'],
    evidenceStatus: 'contemporary-developing',
    evidenceStatusNote:
      'As a very recent and still-evolving policy area, claims here describe the state of institutions as of the mid-2020s rather than a settled historical record.',
    philosophicalQuestions: [
      {
        prompt:
          'If independent safety evaluation of a technology depends on access that only its commercial developers control, can that evaluation ever be fully independent?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'A live, contemporary test of whether state oversight can move at the same pace as a commercially driven technology, directly comparable to historical cases of regulation lagging well behind deployment.',
    sources: [],
    relatedEntryIds: ['ai-academic-knowledge', 'science-policy-ecology', 'assetisation-technoscientific-rent'],
    confidence: 'likely',
    contentStatus: 'sourceNeeded',
  },
]
