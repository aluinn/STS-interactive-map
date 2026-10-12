import type { Entry } from '../types'

export const globalAndAfricanEntries: Entry[] = [
  {
    id: 'heterarchical-scientific-networks',
    slug: 'heterarchical-scientific-networks',
    title: 'Heterarchical Scientific Networks',
    subtitle: 'Connections, not just centres',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'Historians of global science increasingly describe scientific knowledge as circulating through heterarchical networks — multiple, overlapping connections — rather than radiating outward from a single controlling centre, while some knowledge still travels far more easily than other knowledge.',
    longDescription:
      'Older "diffusionist" histories pictured science spreading outward from a European centre to a passive periphery. More recent scholarship, including work on the circulation of knowledge between South Asia and Europe, shows instead a heterarchical pattern: multiple centres, cross-cutting connections, and genuine two-way exchange, where the connections between places often mattered as much as any single dominant institution. At the same time, knowledge does not circulate evenly: some knowledge is readily codified and travels easily (a chemical formula, a mathematical proof), while other knowledge is "sticky" — remaining tied to specific places, tacit skills, and embodied practices that resist easy transfer (a craft technique, a farmer\'s feel for local soil). International science can function as a genuine public good while still reproducing inequality: researchers in wealthier countries frequently define research agendas and retain authorship credit, while researchers and communities elsewhere are treated mainly as sites of data collection — and governance of international collaboration often lags well behind the pace of the research networks themselves.',
    startYear: 1650,
    endYear: 2020,
    dateDisplay: 'c. 1650–present',
    approximateDate: true,
    transregional: true,
    scale: 'globe',
    places: [],
    people: [],
    cultures: ['transnational'],
    disciplines: ['history of science', 'science policy'],
    themes: ['global-knowledge-networks', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          'If international scientific collaboration is a genuine public good that still reproduces inequality between rich and poor countries, is the solution more collaboration, or different terms of collaboration?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'Reframes the history of global science away from one-directional "diffusion" narratives and toward a more accurate, if messier, picture of uneven, multi-directional circulation.',
    sources: [
      {
        author: 'Kapil Raj',
        title:
          'Relocating Modern Science: Circulation and the Construction of Knowledge in South Asia and Europe, 1650–1900',
        year: '2007',
        type: 'primary',
      },
    ],
    relatedEntryIds: [
      'baghdad-translation-movement',
      'trickle-down-science',
      'jesuit-china-exchange',
    ],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'trickle-down-science',
    slug: 'trickle-down-science',
    title: '"Trickle-Down" Science',
    subtitle: 'A critical look at an unexamined assumption',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'A critical term for the frequently unexamined assumption that research directed and funded by wealthy institutions in wealthy countries will automatically, eventually benefit less powerful communities elsewhere, without those communities having any say in setting the research agenda.',
    longDescription:
      'The assumption mirrors economic "trickle-down" reasoning: invest resources at the top, and benefits will eventually flow outward and downward. Critics argue this pattern has repeatedly failed communities who were treated as beneficiaries-in-waiting rather than agenda-setters — colonial agricultural science, some global-health research programmes, and internationally funded environmental projects have all been criticised on these grounds for defining problems, measuring success, and claiming credit in ways set entirely by funders rather than the people the research was meant to serve. This does not mean externally funded research never helps; it means the assumption that it automatically and fairly does so needs to be checked case by case, against who set the agenda and who controls the resulting knowledge or technology.',
    startYear: 1960,
    endYear: 2020,
    dateDisplay: 'c. 1960s–present',
    approximateDate: true,
    transregional: true,
    scale: 'globe',
    places: [],
    people: [],
    cultures: ['transnational'],
    disciplines: ['science policy', 'development studies'],
    themes: ['global-knowledge-networks', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          'How would research priorities differ if the communities expected to benefit from "trickle-down" science set the research agenda themselves from the start?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'A useful diagnostic term for examining whether internationally funded research genuinely serves, or merely claims to serve, less powerful communities.',
    commonMyth:
      'That research funded by wealthy institutions automatically and fairly benefits everyone it is said to be for.',
    contentStatus: 'sourceNeeded',
    sources: [],
    relatedEntryIds: [
      'heterarchical-scientific-networks',
      'bengal-famine-science',
      'congo-resource-extraction',
    ],
    confidence: 'likely',
  },
  {
    id: 'west-african-ironsmithing',
    slug: 'west-african-ironsmithing',
    title: 'West African Ironsmithing',
    subtitle: 'Practical chemical and metallurgical knowledge, outside a university',
    kind: 'idea',
    period: 'medieval-translation',
    summary:
      'West African ironworking traditions developed sophisticated furnace design, smelting technique, and metallurgical knowledge over many centuries — knowledge embedded in craft practice, ritual, and apprenticeship rather than written treatises, and often bound up with gendered symbolism of transformation.',
    longDescription:
      'Archaeological and anthropological research has documented African bloomery iron smelting dating back over two thousand years in some regions, using furnace designs and smelting techniques independently developed and refined through generations of embodied, practical skill. Smithing was frequently organised through specialised lineages or castes, with knowledge transmitted by apprenticeship rather than text, and smelting itself often ritually framed — Eugenia Herbert\'s research describes how smelting was frequently understood through gendered and reproductive symbolism, the furnace likened to a womb transforming ore into iron. This tradition is a clear case of sophisticated technical knowledge that operated entirely outside university or text-based institutions, and that colonial-era commentators frequently failed to recognise as "science" because it did not take a familiar written, institutional form.',
    startYear: -500,
    endYear: 1900,
    dateDisplay: 'c. 500 BCE – 19th century CE',
    approximateDate: true,
    transregional: true,
    scale: 'network',
    places: [
      { name: 'Great Lakes region, East-Central Africa', latitude: -1.5, longitude: 30 },
      { name: 'West Africa (various sites)', latitude: 9, longitude: -2 },
    ],
    people: [],
    cultures: ['African'],
    disciplines: ['metallurgy', 'craft knowledge'],
    themes: ['non-western-origins', 'craft-and-instruments', 'global-knowledge-networks'],
    philosophicalQuestions: [
      {
        prompt:
          'If sophisticated technical knowledge is transmitted through apprenticeship and ritual rather than written treatises, why has it so often been excluded from histories of "science"?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'Direct evidence against any history of science that treats technical sophistication as something that only developed within European, text-based institutions.',
    commonMyth:
      'That pre-colonial African technical knowledge was simple, static, or merely imitative.',
    historicalComplication:
      'Specific furnace designs, smelting temperatures, and dating vary considerably by region and period; broad claims about "African ironworking" risk flattening genuinely distinct regional traditions into one undifferentiated whole.',
    sources: [
      {
        author: 'Eugenia W. Herbert',
        title: 'Iron, Gender, and Power: Rituals of Transformation in African Societies',
        year: '1993',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['scientific-societies', 'tuareg-salt-production-kawar'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'tuareg-salt-production-kawar',
    slug: 'tuareg-salt-production-kawar',
    title: 'Tuareg Salt Production and the Kawar Trade',
    subtitle: 'Technical knowledge embedded in a trans-Saharan trade route',
    kind: 'idea',
    period: 'medieval-translation',
    summary:
      "Salt production in the Kawar oases (in present-day Niger) and its movement by Tuareg-led caravans across the Sahara combined detailed practical knowledge of evaporation, pit construction, and seasonal timing with the organisational and navigational knowledge needed to move goods across one of the world's most demanding environments.",
    longDescription:
      'Salt was extracted from natural brine pits around oases such as Bilma using techniques for managing evaporation and crystallisation refined over centuries, producing salt that was then carried thousands of kilometres by camel caravan to markets across West Africa, exchanged along routes that also carried gold, kola nuts, textiles, and enslaved people. This trade required precise seasonal timing, detailed geographic and astronomical knowledge for desert navigation, and social and logistical organisation to coordinate caravans safely across hostile terrain — technical knowledge distributed across a trade network rather than concentrated in a single institution, and transmitted through Tuareg social and kinship structures.',
    startYear: 800,
    endYear: 1900,
    dateDisplay: 'c. 800–1900 CE',
    approximateDate: true,
    latitude: 18.6853,
    longitude: 12.9164,
    places: [
      { name: 'Bilma, Kawar region (present-day Niger)', latitude: 18.6853, longitude: 12.9164 },
    ],
    transregional: false,
    people: [],
    cultures: ['Tuareg', 'African'],
    disciplines: ['craft knowledge', 'trade'],
    themes: ['non-western-origins', 'global-knowledge-networks', 'craft-and-instruments'],
    philosophicalQuestions: [
      {
        prompt:
          'Trade routes carried technical knowledge alongside goods for centuries — why does "the history of science" so rarely treat trading networks themselves as sites of knowledge production?',
      },
    ],
    historicalSignificance:
      'An example of technical and organisational knowledge embedded in and transmitted through a long-distance trade network, rather than a single site or institution.',
    sources: [
      {
        author: 'Paul E. Lovejoy',
        title:
          'Salt of the Desert Sun: A History of Salt Production and Trade in the Central Sudan',
        year: '1986',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['west-african-ironsmithing', 'heterarchical-scientific-networks'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'cotton-cultivation-uganda',
    slug: 'cotton-cultivation-uganda',
    title: 'Cotton Cultivation and Colonial Agricultural Science in Uganda',
    subtitle: 'Local agricultural knowledge reorganised for export',
    kind: 'event',
    period: 'industrial-imperial',
    summary:
      'British colonial administrators introduced cotton as a cash crop in Uganda from the early twentieth century, drawing on — and often overriding — existing local agricultural knowledge and land-use practices to reorganise farming around export production.',
    longDescription:
      "Colonial agricultural officers promoted cotton cultivation through compulsory planting requirements, agricultural extension advice, and market controls, treating Ugandan smallholders' existing crop knowledge and land-use systems as an obstacle to be managed rather than a resource to build on. Farmers nonetheless adapted cotton cultivation to fit their own land-use strategies, often integrating it into existing intercropping systems despite official pressure for monoculture. The episode illustrates both the genuine agricultural science colonial administrations claimed to apply (seed selection, pest management, soil assessment) and how that science was deployed within a coercive system designed primarily to generate export revenue for the colonial economy, not to serve the welfare of Ugandan farmers.",
    startYear: 1904,
    endYear: 1962,
    dateDisplay: '1904–1962',
    approximateDate: true,
    latitude: 0.3476,
    longitude: 32.5825,
    places: [{ name: 'Uganda', latitude: 0.3476, longitude: 32.5825 }],
    transregional: false,
    people: [],
    cultures: ['Ugandan', 'British colonial'],
    disciplines: ['agricultural science'],
    themes: ['empire-and-trade', 'global-knowledge-networks', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          "When colonial agricultural science improved yields for an export crop while overriding local farmers' own agricultural knowledge, whose interests was that science actually serving?",
        debateId: 'ethics-in-science',
      },
    ],
    historicalSignificance:
      'A documented case of colonial agricultural science organised primarily around extraction rather than local benefit, while still depending on and reshaping existing local knowledge.',
    sources: [
      {
        author: 'Allen Isaacman and Richard Roberts (eds.)',
        title: 'Cotton, Colonialism, and Social History in Sub-Saharan Africa',
        year: '1995',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['bengal-famine-science', 'congo-resource-extraction', 'trickle-down-science'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'mobile-money-east-africa',
    slug: 'mobile-money-east-africa',
    title: 'Mobile Money in East Africa',
    subtitle: 'A homegrown digital-financial innovation, not an imported one',
    kind: 'event',
    period: 'environmental-contemporary',
    summary:
      'M-Pesa, launched in Kenya in 2007, let users without bank accounts transfer money by text message through mobile-network agents, becoming one of the most consequential financial-technology innovations of the twenty-first century — developed and adopted first in East Africa, not imported from wealthier economies.',
    longDescription:
      'M-Pesa built on existing informal practices of transferring prepaid mobile airtime as a substitute for cash, formalising this into a regulated mobile-money system operated through a network of local agents who handled cash deposits and withdrawals. Economic research found it substantially increased financial inclusion and helped households smooth consumption after economic shocks. The case directly complicates any assumption that transformative digital innovation flows outward from wealthy economies to poorer ones — mobile money matured and scaled in East Africa years before equivalent systems existed in Europe or North America, later becoming a model studied and partially emulated elsewhere.',
    startYear: 2007,
    endYear: 2007,
    dateDisplay: '2007',
    approximateDate: false,
    latitude: -1.2921,
    longitude: 36.8219,
    places: [{ name: 'Nairobi, Kenya', latitude: -1.2921, longitude: 36.8219 }],
    transregional: false,
    people: [],
    cultures: ['Kenyan'],
    disciplines: ['financial technology'],
    themes: [
      'non-western-origins',
      'global-knowledge-networks',
      'independent-development',
      'digital-technology',
    ],
    philosophicalQuestions: [
      {
        prompt:
          'Mobile money matured in East Africa before comparable systems existed in wealthier economies — how should that reshape assumptions about where "cutting-edge" innovation is expected to originate?',
      },
    ],
    historicalSignificance:
      'A widely studied case of a transformative digital financial innovation originating and scaling first in a lower-income region, later examined as a model elsewhere.',
    sources: [
      {
        author: 'William Jack and Tavneet Suri',
        title: '"Mobile Money: The Economics of M-PESA"',
        year: '2010',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['heterarchical-scientific-networks', 'trickle-down-science'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
]
