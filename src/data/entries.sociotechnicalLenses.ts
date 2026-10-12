import type { Entry } from '../types'

// A deliberately structured cluster: each entry follows the same shape
// (plain definition, best scale, one strength, one limitation, one example
// elsewhere on the map) so they can be read side by side as a comparison,
// even though this atlas does not yet have a dedicated split-screen
// comparison widget — see each entry's "relatedEntryIds" for its example.
export const sociotechnicalLensesEntries: Entry[] = [
  {
    id: 'multi-level-perspective',
    slug: 'multi-level-perspective',
    title: 'Multi-Level Perspective',
    subtitle: 'Niches, regimes, and landscapes',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'A framework for explaining large sociotechnical change as interaction between small protected "niches" where novelty develops, a dominant "regime" of established rules and infrastructure, and a slower-moving "landscape" of broad external pressures.',
    longDescription:
      'Plain-language definition: new technologies or practices usually incubate in small, protected niches (an experimental energy cooperative, an early research prototype) before they can challenge the dominant regime — the interlocking rules, infrastructure, and expectations that make existing technology hard to dislodge. Landscape-level pressures (climate change, war, a pandemic) can open windows for niche innovations to break through. Best scale: nation or sector-wide infrastructure transitions. Strength: explains why promising innovations often fail to scale even when they "work" technically — regimes resist. Limitation: can understate the role of power and conflict, treating transition as a relatively smooth multi-level process rather than a contested political struggle. Example elsewhere on this atlas: the shift from natural philosophy to professionalised science can be read as a regime change, with new societies and journals acting as the niches that eventually displaced the older, informal "gentleman amateur" regime.',
    startYear: 2002,
    endYear: 2002,
    dateDisplay: '2002',
    approximateDate: false,
    transregional: true,
    scale: 'nation',
    places: [],
    people: ['frank-geels'],
    cultures: ['Dutch'],
    disciplines: ['science and technology studies', 'innovation studies'],
    themes: ['innovation-policy', 'relationality'],
    philosophicalQuestions: [
      {
        prompt:
          'If a sociotechnical transition is explained as interacting niches, regimes, and landscapes, does that framework risk making deliberate political struggle look like an impersonal structural process?',
      },
    ],
    historicalSignificance:
      'One of the most widely used frameworks in innovation and transitions studies for explaining why some promising technologies scale and others stall.',
    sources: [
      {
        author: 'Frank W. Geels',
        title: '"Technological Transitions as Evolutionary Reconfiguration Processes"',
        year: '2002',
        type: 'primary',
      },
    ],
    relatedEntryIds: [
      'professionalisation-of-science',
      'social-construction-of-technology',
      'mission-oriented-innovation',
    ],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'social-practice-theory',
    slug: 'social-practice-theory',
    title: 'Social Practice Theory',
    subtitle: 'Materials, competences, and meanings',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'A framework treating everyday practices — showering, driving, cooking — as the real unit of social and technological change, made up of linked materials (objects, infrastructure), competences (skills, know-how), and meanings (social significance, norms).',
    longDescription:
      'Plain-language definition: practices such as "commuting" or "showering" persist and change as their three elements — materials, competences, and meanings — link, unlink, and relink over time; a technology only succeeds if it becomes integrated into a stable bundle of all three. Best scale: everyday life and household/individual behaviour, aggregated across a population. Strength: explains behaviour change (or its absence) without reducing people to purely rational, individually-choosing consumers. Limitation: can be harder to apply to single dramatic events or decisions than to slow-changing daily routines. Example elsewhere on this atlas: the adoption of the word "scientist" and professional scientific practice depended on new materials (laboratories, journals), competences (specialist training), and meanings (prestige of expertise) all reinforcing one another.',
    startYear: 2012,
    endYear: 2012,
    dateDisplay: '2012',
    approximateDate: false,
    transregional: true,
    scale: 'body',
    places: [],
    people: [],
    cultures: ['British'],
    disciplines: ['sociology', 'science and technology studies'],
    themes: ['innovation-policy', 'relationality'],
    philosophicalQuestions: [
      {
        prompt:
          'If practices, not individuals, are the real unit of social change, what does that imply about how much control any single person has over adopting or resisting a new technology?',
      },
    ],
    historicalSignificance:
      'Shifted policy-relevant behaviour-change research away from individual attitudes and choices and toward the collective, material organisation of everyday practices.',
    sources: [
      {
        author: 'Elizabeth Shove, Mika Pantzar, and Matt Watson',
        title: 'The Dynamics of Social Practice: Everyday Life and How It Changes',
        year: '2012',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['domestication-theory', 'professionalisation-of-science'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'discourse-theory-framing',
    slug: 'discourse-theory-framing',
    title: 'Discourse Theory and Discourse Coalitions',
    subtitle: 'Framing, regimes of truth, and shifting coalitions',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'Discourse-theoretic approaches to policy and technology ask how particular ways of framing a problem become dominant "regimes of truth", and how actors who would not otherwise agree can form shifting "discourse coalitions" around a shared storyline.',
    longDescription:
      'Plain-language definition: a discourse is a shared way of talking about and understanding a problem — which facts count as relevant, which solutions seem sensible — and a discourse coalition is a group of actors who back a particular storyline about an issue even if their underlying interests differ. Best scale: national or international policy debates. Strength: explains why policy positions can shift suddenly when a storyline loses credibility, even without new evidence appearing. Limitation: can be hard to say exactly when one discourse "wins" and whether that reflects better evidence or just better framing. Example elsewhere on this atlas: the climate-science-scepticism case shows a discourse coalition — not united by shared scientific findings, but by a shared storyline casting consensus science as uncertain.',
    startYear: 1995,
    endYear: 1995,
    dateDisplay: '1995',
    approximateDate: false,
    transregional: true,
    scale: 'nation',
    places: [],
    people: ['maarten-hajer'],
    cultures: ['Dutch'],
    disciplines: ['policy studies'],
    themes: [
      'innovation-policy',
      'discourse-and-identity',
      'society-and-power',
      'media-and-meaning',
    ],
    philosophicalQuestions: [
      {
        prompt:
          'If a policy position changes because a storyline loses credibility rather than because new evidence appeared, was the earlier position ever really about evidence at all?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'A key tool for explaining policy change (and deadlock) in environmental and technology debates, connecting language and framing directly to institutional outcomes.',
    sources: [
      {
        author: 'Maarten A. Hajer',
        title: 'The Politics of Environmental Discourse',
        year: '1995',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['climate-science-scepticism', 'discourse-identity-subject-formation'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'domestication-theory',
    slug: 'domestication-theory',
    title: 'Domestication Theory',
    subtitle: 'How technologies get "tamed" into everyday life',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'Domestication theory studies how new technologies are gradually incorporated — appropriated, given meaning, fitted into routines, displayed — into households and everyday life, rather than simply "adopted" in a single decision.',
    longDescription:
      'Plain-language definition: when a new technology enters a household, it has to be domesticated — practically integrated into routines, symbolically given a place and meaning (where the computer sits, who is allowed to use it, what it says about the household), not just switched on. Best scale: household and individual. Strength: captures the often slow, negotiated, sometimes resisted process by which technologies actually enter daily life, rather than treating adoption as instant. Limitation: developed mainly around household media technologies, and translates less directly to non-domestic or infrastructural technologies. Example elsewhere on this atlas: contemporary AI tools being "domesticated" into academic work (see Generative AI and Academic Knowledge) show the same slow, contested process of fitting a new technology into existing norms and routines.',
    startYear: 1992,
    endYear: 1996,
    dateDisplay: '1992–1996',
    approximateDate: true,
    transregional: true,
    scale: 'body',
    places: [],
    people: ['roger-silverstone'],
    cultures: ['British'],
    disciplines: ['media studies', 'science and technology studies'],
    themes: ['innovation-policy', 'relationality'],
    philosophicalQuestions: [
      {
        prompt:
          'Is "domesticating" a new technology into daily life a form of genuine user agency, or mostly a slower version of the technology shaping users to fit its own requirements?',
      },
    ],
    historicalSignificance:
      'Shifted technology-adoption research away from a single "diffusion" moment and toward the ongoing, everyday social work of incorporating new technologies into life.',
    sources: [
      {
        author: 'Roger Silverstone and Leslie Haddon',
        title: '"Design and the Domestication of Information and Communication Technologies"',
        year: '1996',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['social-practice-theory', 'ai-academic-knowledge'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'co-production',
    slug: 'co-production',
    title: 'Co-Production',
    subtitle: 'Scientific knowledge and social order, made together',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      "Sheila Jasanoff's idiom of co-production holds that scientific knowledge and social order are produced together, simultaneously — the ways we come to know the natural world and the ways we organise society are not separate processes but shape each other continuously.",
    longDescription:
      'Plain-language definition: asking "is this a scientific question or a social one?" is often the wrong question, because the two are produced together — a new way of measuring risk, for example, both reflects and helps constitute a particular way of organising political authority and responsibility. Best scale: nation and institution. Strength: avoids treating science as simply "applied" to a pre-existing society, or society as simply "using" pre-existing scientific facts — both are made together. Limitation: as a broad idiom rather than a specific causal mechanism, co-production can be harder to test or falsify than narrower claims. Example elsewhere on this atlas: the Daston and Galison account of historically changing objectivity norms is itself a co-production story — standards for trustworthy images both reflected and helped constitute different scientific institutions\' authority.',
    startYear: 2004,
    endYear: 2004,
    dateDisplay: '2004',
    approximateDate: false,
    transregional: true,
    scale: 'nation',
    places: [],
    people: ['sheila-jasanoff'],
    cultures: ['American'],
    disciplines: ['science and technology studies'],
    themes: ['society-and-power', 'relationality'],
    philosophicalQuestions: [
      {
        prompt:
          'If scientific knowledge and social order are co-produced rather than separate, can a scientific finding ever really be politically neutral?',
        debateId: 'objectivity-values',
      },
    ],
    historicalSignificance:
      'One of the most influential organising ideas in contemporary science and technology studies, widely used to analyse everything from biotechnology regulation to climate governance.',
    sources: [
      {
        author: 'Sheila Jasanoff (ed.)',
        title: 'States of Knowledge: The Co-Production of Science and Social Order',
        year: '2004',
        type: 'primary',
      },
    ],
    relatedEntryIds: [
      'daston-galison-objectivity',
      'sociotechnical-imaginaries',
      'discourse-identity-subject-formation',
    ],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'social-construction-of-technology',
    slug: 'social-construction-of-technology',
    title: 'Social Construction of Technology',
    subtitle: 'Interpretive flexibility and closure',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'Trevor Pinch and Wiebe Bijker argued that the design of a technology — their founding case was the bicycle — is not fixed by efficiency alone but shaped by different social groups\' competing interpretations, until a dominant design achieves "closure".',
    longDescription:
      'Plain-language definition: early versions of a technology typically have "interpretive flexibility" — different relevant social groups (racing cyclists, women cyclists, safety-conscious buyers) see different problems and solutions in the same artefact (the high-wheeled "penny-farthing" versus the safety bicycle), until design controversy closes around one dominant form, which then looks obviously "best" in hindsight. Best scale: specific artefact or product category. Strength: directly rebuts the assumption that whichever design wins must simply have been the most efficient. Limitation: the choice of "relevant social groups" to study is itself a judgement call that can under-represent groups with little power to shape the historical record. Example elsewhere on this atlas: debates over who counts as a scientist (natural philosopher versus professional) show a similar interpretive flexibility and eventual, contested closure around one dominant identity.',
    startYear: 1984,
    endYear: 1984,
    dateDisplay: '1984',
    approximateDate: false,
    transregional: true,
    scale: 'network',
    places: [],
    people: ['trevor-pinch', 'wiebe-bijker'],
    cultures: ['American', 'Dutch'],
    disciplines: ['science and technology studies'],
    themes: ['innovation-policy', 'technology-and-politics'],
    philosophicalQuestions: [
      {
        prompt:
          'If a technology\'s design "closes" around one dominant form through social negotiation, in what sense (if any) was that form really the most efficient option?',
      },
    ],
    historicalSignificance:
      'Founded Social Construction of Technology (SCOT) as a major research programme, directly influencing later debates about whether artefacts can be said to "have politics".',
    sources: [
      {
        author: 'Trevor Pinch and Wiebe Bijker',
        title: '"The Social Construction of Facts and Artefacts"',
        year: '1984',
        type: 'primary',
      },
    ],
    relatedEntryIds: [
      'winner-artifacts-have-politics',
      'actor-network-theory',
      'professionalisation-of-science',
    ],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'sociotechnical-imaginaries',
    slug: 'sociotechnical-imaginaries',
    title: 'Sociotechnical Imaginaries',
    subtitle:
      'Collectively held visions of desirable futures, built through science and technology',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'Sheila Jasanoff and Sang-Hyun Kim defined sociotechnical imaginaries as collectively held, institutionally stabilised visions of desirable futures, animated by shared understandings of social life and order, achievable through advances in science and technology.',
    longDescription:
      'Plain-language definition: nations and communities do not just pursue technologies for narrow technical reasons — they attach them to shared visions of the future (nuclear power as national self-sufficiency, the space race as geopolitical destiny, AI as economic salvation), and those visions shape which research gets funded and how its risks are weighed. Best scale: nation. Strength: explains why similar technologies are pursued, regulated, or resisted very differently in different countries with different national imaginaries. Limitation: imaginaries can be difficult to pin down empirically compared with more concrete policy documents or funding decisions. Example elsewhere on this atlas: Cold War Big Science was driven as much by a sociotechnical imaginary of national prestige and security as by narrow research questions.',
    startYear: 2009,
    endYear: 2015,
    dateDisplay: '2009–2015',
    approximateDate: true,
    transregional: true,
    scale: 'nation',
    places: [],
    people: ['sheila-jasanoff'],
    cultures: ['American', 'South Korean'],
    disciplines: ['science and technology studies'],
    themes: ['innovation-policy', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          'If funding and regulation follow a shared national vision of the future as much as narrow technical merit, how should citizens who do not share that vision have a say?',
      },
    ],
    historicalSignificance:
      'Provides a widely used vocabulary connecting science policy to national identity and collective aspiration, rather than treating funding decisions as purely technical.',
    sources: [
      {
        author: 'Sheila Jasanoff and Sang-Hyun Kim (eds.)',
        title: 'Dreamscapes of Modernity: Sociotechnical Imaginaries and the Fabrication of Power',
        year: '2015',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['co-production', 'cold-war-big-science', 'mission-oriented-innovation'],
    confidence: 'established',
    contentStatus: 'complete',
  },
]
