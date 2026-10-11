import type { Entry } from '../types'

export const globalEntries: Entry[] = [
  {
    id: 'zheng-he-voyages',
    slug: 'zheng-he-voyages',
    title: "Zheng He's Treasure Fleet Voyages",
    subtitle: 'Ming maritime expertise and diplomacy across the Indian Ocean',
    kind: 'event',
    period: 'early-modern',
    summary:
      'Between 1405 and 1433, admiral Zheng He led seven enormous Ming fleets across South and Southeast Asia to East Africa, combining advanced navigation with trade and diplomacy, before the voyages were abruptly halted.',
    longDescription:
      'Zheng He\'s fleets dwarfed anything Europe would send for the next century, relying on sophisticated compass navigation, star charts, and shipbuilding. The voyages aimed at tribute, trade, and prestige rather than colonisation, and their cessation after 1433 — driven by court politics and fiscal retrenchment, not technological failure — is often misread in Western narratives as evidence that China "fell behind," when it instead reflects a deliberate political choice.',
    startYear: 1405,
    endYear: 1433,
    dateDisplay: '1405–1433',
    approximateDate: false,
    latitude: 32.0603,
    longitude: 118.7969,
    places: [{ name: 'Nanjing (fleet departure)', latitude: 32.0603, longitude: 118.7969 }],
    transregional: true,
    people: ['zheng-he'],
    cultures: ['Chinese', 'Ming'],
    disciplines: ['navigation', 'cartography'],
    themes: ['non-western-origins', 'empire-and-trade', 'independent-development'],
    philosophicalQuestions: [
      {
        prompt:
          'Is the decision to stop pursuing a technological capacity itself a scientific or political judgement — and who gets to make it?',
      },
    ],
    historicalSignificance:
      'Demonstrates a level of state-funded navigational and nautical expertise equal to or exceeding contemporary Europe, decades before the Portuguese voyages usually centred in "Age of Discovery" narratives.',
    commonMyth:
      'That China lacked the capacity or will for long-distance maritime exploration before European contact.',
    historicalComplication:
      'The fleets were deliberately curtailed by Ming court decision, not technological limitation, and most records were later destroyed, making reconstruction difficult.',
    sources: [
      {
        author: 'Edward Dreyer',
        title: 'Zheng He: China and the Oceans in the Early Ming Dynasty',
        year: '2007',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['chinese-astronomy-technology', 'qing-gewu'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'qing-gewu',
    slug: 'qing-gewu',
    title: 'Qing Dynasty gewu and Administrative Science',
    subtitle: 'Investigating things within a Confucian framework',
    kind: 'idea',
    period: 'early-modern',
    summary:
      'The Confucian concept of gewu ("investigating things") was adapted by Qing scholars and officials into practical programs of cartography, forestry management, hydrology, and medicine serving imperial administration.',
    longDescription:
      'Rather than importing a Western category wholesale, Qing scholars reframed natural inquiry within existing philosophical vocabulary, producing substantial achievements in cartographic surveying, agricultural and forestry management, and medical compilation, often directly tied to the practical needs of governing a vast empire. This illustrates that "science" organised around state administration and classical philosophy, rather than disinterested curiosity, can still be systematic and cumulative.',
    startYear: 1644,
    endYear: 1800,
    dateDisplay: 'c. 1644–1800',
    approximateDate: true,
    latitude: 39.9042,
    longitude: 116.4074,
    places: [{ name: 'Beijing', latitude: 39.9042, longitude: 116.4074 }],
    transregional: true,
    people: [],
    cultures: ['Chinese', 'Qing'],
    disciplines: ['cartography', 'medicine', 'administration'],
    themes: ['non-western-origins', 'institutions-and-funding'],
    philosophicalQuestions: [
      {
        prompt:
          'If a tradition of inquiry is organised around statecraft rather than curiosity, does that make it less "scientific," or just differently motivated?',
      },
    ],
    historicalSignificance:
      'Shows that practical, administratively embedded inquiry can generate sustained knowledge production outside the categories European historiography usually uses to recognise "science."',
    sources: [
      {
        author: 'Benjamin Elman',
        title: 'On Their Own Terms: Science in China, 1550–1900',
        year: '2005',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['chinese-astronomy-technology', 'jesuit-china-exchange'],
    confidence: 'likely',
    contentStatus: 'complete',
  },
  {
    id: 'jesuit-china-exchange',
    slug: 'jesuit-china-exchange',
    title: 'Jesuit–Chinese Scientific Exchange',
    subtitle: 'Astronomy, cartography, and mutual appropriation at the Qing court',
    kind: 'event',
    period: 'early-modern',
    summary:
      'Jesuit missionaries such as Matteo Ricci and later Ferdinand Verbiest served as court astronomers in Beijing, exchanging European mathematical astronomy for access and patronage, while Chinese scholars evaluated and selectively adopted what proved useful.',
    longDescription:
      'The relationship was genuinely two-directional: Jesuits transmitted Copernican and Tychonic astronomical techniques useful for calendar reform, while absorbing and transmitting Chinese achievements back to Europe. Qing scholars were not passive recipients — they tested European predictions against existing records and adopted techniques selectively, rejecting or modifying others, within an ongoing debate about whose calendrical authority should prevail.',
    startYear: 1580,
    endYear: 1720,
    dateDisplay: 'c. 1580–1720',
    approximateDate: true,
    latitude: 39.9042,
    longitude: 116.4074,
    places: [{ name: 'Beijing', latitude: 39.9042, longitude: 116.4074 }],
    transregional: false,
    people: ['matteo-ricci'],
    cultures: ['Chinese', 'Italian', 'European'],
    disciplines: ['astronomy', 'cartography'],
    themes: ['translation-and-transmission', 'non-western-origins'],
    philosophicalQuestions: [
      {
        prompt:
          'When two scientific traditions meet, is the result best described as transmission, exchange, or appropriation — and does the right word depend on who holds power?',
      },
    ],
    historicalSignificance:
      'A clear counterexample to one-directional "diffusion" models of how science spreads, and a case where calendrical accuracy had direct political stakes for imperial legitimacy.',
    sources: [
      {
        author: 'Benjamin Elman',
        title: 'On Their Own Terms: Science in China, 1550–1900',
        year: '2005',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['qing-gewu', 'chinese-astronomy-technology'],
    confidence: 'likely',
    contentStatus: 'complete',
  },
  {
    id: 'petersburg-academy',
    slug: 'petersburg-academy',
    title: 'The St Petersburg Academy of Sciences',
    subtitle: "Peter the Great's selective import of European institutions",
    kind: 'institution',
    period: 'enlightenment',
    summary:
      'Founded by Peter the Great in 1724, the Academy imported European scholars and institutional models wholesale to rapidly build a Russian scientific establishment from the top down.',
    longDescription:
      'Unlike the gradual, bottom-up emergence of societies like the Royal Society, the St Petersburg Academy was a deliberate state project, initially staffed largely by recruited foreign scholars (many German and Swiss, including Leonhard Euler), designed to modernise Russia quickly. This "selective appropriation" model — importing institutional forms while retaining autocratic political structures — shaped how science developed in Russia for the next two centuries.',
    startYear: 1724,
    dateDisplay: 'founded 1724',
    approximateDate: false,
    latitude: 59.9311,
    longitude: 30.3609,
    places: [{ name: 'St Petersburg', latitude: 59.9311, longitude: 30.3609 }],
    transregional: false,
    people: ['lomonosov'],
    cultures: ['Russian'],
    disciplines: ['various'],
    themes: ['institutions-and-funding', 'translation-and-transmission'],
    philosophicalQuestions: [
      {
        prompt:
          'Can scientific institutions be transplanted between societies without also transplanting the social conditions that produced them?',
      },
    ],
    historicalSignificance:
      'A key case study in how states can deliberately engineer scientific capacity as a tool of modernisation, rather than science emerging organically from existing civil institutions.',
    sources: [
      {
        author: 'Alexander Vucinich',
        title: 'Science in Russian Culture: A History to 1860',
        year: '1963',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['lomonosov', 'scientific-societies'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'scientific-societies',
    slug: 'scientific-societies',
    title: 'The Rise of Scientific Societies',
    subtitle: 'Specialised institutions for producing and certifying knowledge',
    kind: 'institution',
    period: 'enlightenment',
    summary:
      'Between the seventeenth and nineteenth centuries, dedicated societies and academies — the Royal Society, the Paris Academy of Sciences, the St Petersburg Academy, and later many single-discipline bodies — became the central institutions organising, funding, and certifying scientific work.',
    longDescription:
      'Unlike medieval universities, built around teaching an inherited curriculum, scientific societies were organised around producing new knowledge: running experiments, corresponding across borders, publishing journals, and awarding credibility through membership and peer review. Early societies were broad, covering all natural knowledge; the nineteenth century saw a proliferation of narrower, discipline-specific societies (geological, chemical, astronomical) that paralleled and reinforced the professionalisation and specialisation of science more broadly.',
    startYear: 1660,
    endYear: 1850,
    dateDisplay: 'c. 1660–1850 CE',
    approximateDate: true,
    transregional: true,
    places: [
      { name: 'London', latitude: 51.5072, longitude: -0.1276 },
      { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
      { name: 'St Petersburg', latitude: 59.9311, longitude: 30.3609 },
    ],
    people: [],
    cultures: ['European'],
    disciplines: ['institutions-and-funding'],
    themes: ['institutions-and-funding', 'profession-and-identity'],
    philosophicalQuestions: [
      {
        prompt:
          "When a society's members decide what counts as a properly conducted experiment or a credible result, are they discovering a standard or inventing one?",
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'Scientific societies created the lasting institutional machinery — peer review, membership, published proceedings — through which claims are still certified as scientifically credible today.',
    sources: [
      {
        author: 'James E. McClellan III',
        title: 'Science Reorganized: Scientific Societies in the Eighteenth Century',
        year: '1985',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['royal-society', 'petersburg-academy', 'professionalisation-of-science'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'lomonosov',
    slug: 'lomonosov',
    title: 'Mikhail Lomonosov',
    subtitle: 'A peasant-born polymath inside an imported academy',
    kind: 'person',
    period: 'enlightenment',
    summary:
      'A Russian scientist, poet, and reformer of famously humble origins who worked in chemistry, physics, and geology at the St Petersburg Academy, articulating an early version of the conservation of matter.',
    longDescription:
      "Lomonosov's career illustrates the tension within Russia's imported academic model: he pushed for the inclusion and advancement of Russian-born scholars against a largely foreign-dominated institution, while producing genuine scientific work, including early statements anticipating conservation principles later associated with Lavoisier.",
    startYear: 1711,
    endYear: 1765,
    dateDisplay: '1711–1765',
    approximateDate: false,
    latitude: 59.9311,
    longitude: 30.3609,
    places: [{ name: 'St Petersburg', latitude: 59.9311, longitude: 30.3609 }],
    transregional: false,
    people: ['lomonosov'],
    cultures: ['Russian'],
    disciplines: ['chemistry', 'physics'],
    themes: ['exclusion-and-access', 'non-western-origins'],
    philosophicalQuestions: [
      {
        prompt:
          'When similar ideas (like conservation of matter) arise in more than one place, how should credit and priority be assigned fairly?',
      },
    ],
    historicalSignificance:
      'Represents both the possibilities and constraints facing non-elite, non-Western European scientists working within institutions built on imported foreign models.',
    sources: [
      {
        author: 'Alexander Vucinich',
        title: 'Science in Russian Culture: A History to 1860',
        year: '1963',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['petersburg-academy'],
    confidence: 'likely',
    contentStatus: 'complete',
  },
  {
    id: 'margaret-cavendish',
    slug: 'margaret-cavendish',
    title: 'Margaret Cavendish',
    subtitle: 'A natural philosopher excluded from the institutions she criticised',
    kind: 'person',
    period: 'early-modern',
    summary:
      'A prolific natural philosopher who published extensively on matter theory and critiqued the experimental program of the Royal Society, despite being barred from membership on account of her sex.',
    longDescription:
      "Cavendish attended a single, celebrated demonstration at the Royal Society in 1667 as a visitor, never as a member, and used her writing to challenge mechanistic philosophy's claims to certainty, proposing her own vitalist materialism. Her exclusion from formal scientific institutions, despite sustained intellectual engagement with their core questions, is a clear case of how gender shaped who could participate in early modern natural philosophy.",
    startYear: 1623,
    endYear: 1673,
    dateDisplay: '1623–1673',
    approximateDate: false,
    latitude: 51.5072,
    longitude: -0.1276,
    places: [{ name: 'London', latitude: 51.5072, longitude: -0.1276 }],
    transregional: false,
    people: ['margaret-cavendish'],
    cultures: ['English'],
    disciplines: ['natural philosophy'],
    themes: ['exclusion-and-access', 'gender'],
    philosophicalQuestions: [
      {
        prompt:
          'Who gets to count as a legitimate critic of a scientific program when they are formally excluded from the institution that runs it?',
        debateId: 'feminist-epistemology',
      },
    ],
    historicalSignificance:
      'A documented case of a woman producing serious, published natural philosophy while being structurally barred from the institutional recognition given to her male contemporaries.',
    sources: [
      {
        author: 'Londa Schiebinger',
        title: 'The Mind Has No Sex? Women in the Origins of Modern Science',
        year: '1989',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['royal-society', 'maria-sibylla-merian'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'maria-sibylla-merian',
    slug: 'maria-sibylla-merian',
    title: 'Maria Sibylla Merian',
    subtitle: "Metamorphosis, fieldwork, and a woman's workshop training",
    kind: 'person',
    period: 'early-modern',
    summary:
      'A naturalist and artist who travelled to Suriname to directly observe and document insect metamorphosis, producing some of the most accurate natural-history illustration of her era, after training in a family workshop rather than a university.',
    longDescription:
      "Merian's detailed observation of caterpillars, pupae, and moths challenged the still-common belief in spontaneous generation of insects, work she pursued through an artisanal illustration tradition rather than formal academic science — a route open to women when universities were not. Her 1705 account of Surinamese insects, plants, and enslaved and Indigenous informants' knowledge also exemplifies how colonial fieldwork depended on local expertise rarely credited by name.",
    startYear: 1647,
    endYear: 1717,
    dateDisplay: '1647–1717',
    approximateDate: false,
    latitude: 52.3676,
    longitude: 4.9041,
    places: [
      { name: 'Amsterdam', latitude: 52.3676, longitude: 4.9041 },
      { name: 'Suriname', latitude: 3.9193, longitude: -56.0278, role: 'fieldwork' },
    ],
    transregional: false,
    people: ['maria-sibylla-merian'],
    cultures: ['German', 'Dutch'],
    disciplines: ['natural history', 'illustration'],
    themes: [
      'exclusion-and-access',
      'gender',
      'empire-and-trade',
      'craft-and-instruments',
      'scientific-images',
    ],
    philosophicalQuestions: [
      {
        prompt:
          "When a naturalist's findings depend on unnamed local and enslaved informants' knowledge, who is the actual discoverer?",
        debateId: 'discovery-invention-progress',
      },
      {
        prompt:
          'Merian composed her plates to show a plant and insect together at their most instructive stage, not as she necessarily observed them in a single moment — does careful artistic composition clarify scientific evidence, or quietly misrepresent it?',
        debateId: 'scientific-images-objectivity',
      },
    ],
    historicalSignificance:
      'A major contributor to the empirical refutation of spontaneous generation and to entomological illustration, working entirely outside university science.',
    commonMyth:
      'That natural history illustration was a decorative art separate from serious scientific observation.',
    historicalComplication:
      "Merian's colonial fieldwork relied on the knowledge of enslaved and Indigenous people in Suriname whose names and contributions her published work does not fully credit.",
    missingVoices: [
      {
        role: 'Enslaved and Indigenous informants in Suriname',
        note: "Merian's published observations drew directly on local knowledge of plant and insect behaviour from enslaved Africans and Indigenous Surinamese people, whose names she did not record and whose expertise her book does not credit as co-authorship.",
      },
    ],
    sources: [
      {
        author: 'Kim Todd',
        title: 'Chrysalis: Maria Sibylla Merian and the Secrets of Metamorphosis',
        year: '2007',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['margaret-cavendish'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'laplace',
    slug: 'laplace',
    title: 'Pierre-Simon Laplace',
    subtitle: 'Celestial mechanics and the dream of total predictability',
    kind: 'person',
    period: 'enlightenment',
    summary:
      'Laplace extended Newtonian mechanics to resolve apparent long-term instabilities in planetary orbits and became the central figure behind the Enlightenment vision of a fully deterministic, predictable universe.',
    longDescription:
      "Laplace's multi-volume Celestial Mechanics demonstrated the long-term stability of the solar system under Newtonian gravity and articulated the idea, later called \"Laplace's demon,\" that a sufficiently powerful intelligence knowing every particle's position and momentum could predict the entire future. This vision of total determinism became both an emblem of Enlightenment confidence in science and a target for later critiques once statistical and quantum physics complicated the picture.",
    startYear: 1749,
    endYear: 1827,
    dateDisplay: '1749–1827',
    approximateDate: false,
    latitude: 48.8566,
    longitude: 2.3522,
    places: [{ name: 'Paris', latitude: 48.8566, longitude: 2.3522 }],
    transregional: false,
    people: ['laplace'],
    cultures: ['French'],
    disciplines: ['astronomy', 'mathematics'],
    themes: ['determinism', 'cosmology'],
    philosophicalQuestions: [
      {
        prompt:
          'Does Newtonian determinism imply that the future is, in principle, fully predictable — and does modern physics actually vindicate or undercut that idea?',
      },
    ],
    historicalSignificance:
      'Represents the high point of Enlightenment confidence that mathematical physics could, in principle, achieve total predictive mastery over nature.',
    sources: [
      {
        author: 'Charles Coulston Gillispie',
        title: 'Pierre-Simon Laplace, 1749–1827: A Life in Exact Science',
        year: '1997',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['newton'],
    confidence: 'established',
    contentStatus: 'complete',
  },
]
