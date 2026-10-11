import type { Entry } from '../types'

export const ancientEntries: Entry[] = [
  {
    id: 'babylonian-astronomy',
    slug: 'babylonian-astronomy',
    title: 'Babylonian Celestial Record-Keeping',
    subtitle: 'Cuneiform astronomy in Mesopotamia',
    kind: 'idea',
    period: 'ancient',
    summary:
      'For centuries, Babylonian scribes recorded the positions of planets and the Moon on clay tablets, building mathematical methods to predict eclipses and planetary motion without a physical model of the cosmos.',
    longDescription:
      'Beginning well before the first millennium BCE, Mesopotamian scribes kept systematic diaries of celestial omens that gradually became a tradition of mathematical prediction. By the later Babylonian period, astronomers used arithmetic schemes — not geometric models — to forecast lunar eclipses, planetary stations, and the length of months with remarkable accuracy. This tradition treated the sky as something whose regularities could be captured numerically, independent of any claim about what physically caused them.',
    startYear: -1800,
    endYear: -100,
    dateDisplay: 'c. 1800–100 BCE',
    approximateDate: true,
    latitude: 32.5355,
    longitude: 44.4275,
    places: [
      { name: 'Babylon, Mesopotamia', latitude: 32.5355, longitude: 44.4275, role: 'origin' },
    ],
    transregional: false,
    people: [],
    cultures: ['Mesopotamian', 'Babylonian'],
    disciplines: ['astronomy', 'mathematics'],
    themes: ['instruments-and-method', 'non-western-origins', 'prediction'],
    philosophicalQuestions: [
      {
        prompt:
          'Does successful prediction require a causal or physical explanation, or can purely mathematical regularity count as knowledge?',
        debateId: 'discovery-invention-progress',
      },
    ],
    historicalSignificance:
      'Babylonian arithmetic astronomy is among the earliest evidence of a long-term, cumulative, institutionally supported research tradition, and it directly shaped later Greek mathematical astronomy via Hellenistic contact.',
    commonMyth: 'That rigorous mathematical science begins with the Greeks.',
    historicalComplication:
      'Greek astronomers such as Hipparchus and Ptolemy inherited Babylonian numerical parameters and eclipse records, meaning "Greek astronomy" was already a cross-cultural synthesis.',
    sources: [
      {
        author: 'Otto Neugebauer',
        title: 'The Exact Sciences in Antiquity',
        year: '1957',
        type: 'secondary',
      },
      {
        author: 'Francesca Rochberg',
        title: 'Before Nature: Cuneiform Knowledge and the History of Science',
        year: '2016',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['venus-tablet', 'ptolemy'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'venus-tablet',
    slug: 'venus-tablet',
    title: 'The Venus Tablet of Ammisaduqa',
    subtitle: 'An omen record of Venus risings and settings',
    kind: 'text',
    period: 'ancient',
    summary:
      'A cuneiform tablet recording 21 years of observations of Venus, copied and recopied by later scribes, used for astrological omens rather than physical cosmology.',
    longDescription:
      'The tablet preserves observations attributed to the reign of the Babylonian king Ammisaduqa, tracking the heliacal risings and settings of Venus. Its primary purpose was omen interpretation — linking celestial events to royal and agricultural fortune — yet the underlying data became valuable centuries later for reconstructing ancient chronology and for later mathematical astronomy.',
    startYear: -1700,
    endYear: -1600,
    dateDisplay: 'c. 17th century BCE (surviving copies later)',
    approximateDate: true,
    latitude: 32.5355,
    longitude: 44.4275,
    places: [{ name: 'Babylon', latitude: 32.5355, longitude: 44.4275 }],
    transregional: false,
    people: [],
    cultures: ['Mesopotamian', 'Babylonian'],
    disciplines: ['astronomy'],
    themes: ['instruments-and-method', 'non-western-origins'],
    philosophicalQuestions: [
      {
        prompt:
          'If a record was kept for omen-reading, not prediction in the modern sense, is it still "science"? Who gets to decide?',
      },
    ],
    historicalSignificance:
      'One of the earliest sustained records of a single celestial phenomenon, and a reminder that careful, cumulative observation often grows out of practices — divination, administration, agriculture — that are not themselves "scientific" by later definitions.',
    sources: [
      {
        author: 'Francesca Rochberg',
        title: 'Before Nature: Cuneiform Knowledge and the History of Science',
        year: '2016',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['babylonian-astronomy'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'thales',
    slug: 'thales',
    title: 'Thales of Miletus',
    subtitle: 'Natural explanation without appeal to myth',
    kind: 'person',
    period: 'classical',
    summary:
      'An early Greek thinker credited with proposing that natural phenomena, including earthquakes and the origin of all things, have natural rather than purely mythological causes.',
    longDescription:
      'Thales is remembered less for any surviving text — none exists in his own words — than for inaugurating a style of explanation that looked for a single underlying material principle (he proposed water) behind the diversity of nature. Later Greek thinkers framed him as the first in a sequence of natural philosophers, though this origin story was partly constructed retrospectively by Aristotle.',
    startYear: -624,
    endYear: -546,
    dateDisplay: 'c. 624–546 BCE',
    approximateDate: true,
    latitude: 37.5333,
    longitude: 27.2833,
    places: [{ name: 'Miletus, Ionia', latitude: 37.5333, longitude: 27.2833 }],
    transregional: false,
    people: ['thales'],
    cultures: ['Greek', 'Ionian'],
    disciplines: ['natural philosophy'],
    themes: ['naturalism', 'non-western-origins'],
    philosophicalQuestions: [
      {
        prompt:
          'Is proposing a single material cause for everything a scientific move, a metaphysical one, or both?',
      },
    ],
    historicalSignificance:
      'Symbolically marks a shift, within later Greek self-understanding, toward explanations that could in principle be debated and revised rather than accepted as settled myth.',
    commonMyth: 'That Thales "founded science" in a modern sense.',
    historicalComplication:
      'Almost everything attributed to Thales comes from later authors, especially Aristotle, writing centuries afterward with their own agendas about the history of philosophy.',
    sources: [
      {
        author: 'G.E.R. Lloyd',
        title: 'Early Greek Science: Thales to Aristotle',
        year: '1970',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['democritus', 'aristotle'],
    confidence: 'contested',
    contentStatus: 'complete',
  },
  {
    id: 'pythagoras',
    slug: 'pythagoras',
    title: 'Pythagoras and the Pythagoreans',
    subtitle: 'Number as the structure of the cosmos',
    kind: 'person',
    period: 'classical',
    summary:
      'A religious and philosophical community that treated mathematical relationships, especially in music and astronomy, as revealing the hidden order of reality.',
    longDescription:
      "The Pythagoreans linked numerical ratios to musical harmony and extended that idea to the structure of the heavens itself, imagining a cosmos ordered by proportion. Their influence on later mathematical astronomy, including aspects of Plato's and Kepler's thought nearly two thousand years later, was considerable, even though the historical Pythagoras is difficult to separate from legend.",
    startYear: -570,
    endYear: -495,
    dateDisplay: 'c. 570–495 BCE',
    approximateDate: true,
    latitude: 39.0808,
    longitude: 16.5917,
    places: [{ name: 'Croton, Magna Graecia', latitude: 39.0808, longitude: 16.5917 }],
    transregional: false,
    people: ['pythagoras'],
    cultures: ['Greek'],
    disciplines: ['mathematics', 'natural philosophy'],
    themes: ['mathematical-order', 'non-western-origins'],
    philosophicalQuestions: [
      {
        prompt:
          'If mathematics describes nature so well, does that mean nature is fundamentally mathematical, or just that mathematics is a powerful tool?',
      },
    ],
    historicalSignificance:
      'Established a durable current in Western thought linking mathematical elegance with cosmic truth, later echoed by Copernicus and Kepler.',
    sources: [
      {
        author: 'Walter Burkert',
        title: 'Lore and Science in Ancient Pythagoreanism',
        year: '1972',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['kepler', 'copernicus'],
    confidence: 'contested',
    contentStatus: 'complete',
  },
  {
    id: 'democritus',
    slug: 'democritus',
    title: 'Democritus and Ancient Atomism',
    subtitle: 'A cosmos of indivisible particles and void',
    kind: 'idea',
    period: 'classical',
    summary:
      'The theory, developed by Leucippus and Democritus, that all matter consists of indivisible atoms moving through empty space, with no need for purpose or design.',
    longDescription:
      'Ancient atomism proposed that qualities we perceive — colour, taste, warmth — arise from the arrangement and motion of imperceptible atoms, while the atoms themselves have only shape, size, and motion. This was a strikingly anti-teleological picture of nature, rejected by Aristotle, revived in modified form by Epicurus and Lucretius, and only vindicated in a transformed sense by nineteenth- and twentieth-century physics and chemistry.',
    startYear: -460,
    endYear: -370,
    dateDisplay: 'c. 460–370 BCE',
    approximateDate: true,
    latitude: 40.9167,
    longitude: 24.9667,
    places: [{ name: 'Abdera, Thrace', latitude: 40.9167, longitude: 24.9667 }],
    transregional: false,
    people: ['democritus'],
    cultures: ['Greek'],
    disciplines: ['natural philosophy'],
    themes: ['naturalism', 'matter-theory'],
    theoryStatus: 'historically-influential',
    theoryStatusNote:
      'Ancient atomism bears only a loose family resemblance to modern atomic theory, but the idea that perceptible qualities reduce to the arrangement of imperceptible particles proved durable.',
    philosophicalQuestions: [
      {
        prompt:
          'When a modern theory echoes an ancient idea in name only, does the ancient thinker deserve credit for anticipating it?',
      },
    ],
    historicalSignificance:
      'Offers an early example of a non-teleological, mechanistic account of nature that later mechanical philosophers such as Descartes and Boyle consciously revived.',
    commonMyth: 'That ancient atomism is essentially the same theory as modern atomic physics.',
    historicalComplication:
      "Democritus's atoms are defined by shape and arrangement, not by anything resembling protons, neutrons, or electrons; continuity between the two is conceptual and rhetorical more than substantive.",
    sources: [
      {
        author: 'C.C.W. Taylor',
        title: 'The Atomists: Leucippus and Democritus',
        year: '1999',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['aristotle', 'descartes', 'boyle'],
    confidence: 'likely',
    contentStatus: 'complete',
  },
  {
    id: 'aristotle',
    slug: 'aristotle',
    title: "Aristotle's Cosmos",
    subtitle: 'A teleological, qualitative, geocentric universe',
    kind: 'person',
    period: 'classical',
    summary:
      'Aristotle built a comprehensive natural philosophy in which everything has a purpose (telos), the heavens are perfect and unchanging, and knowledge proceeds from necessary first principles.',
    longDescription:
      'Aristotle treated science (epistēmē) as demonstrative knowledge derived from necessary first principles, and his physics explained motion by appeal to the natures and purposes of things rather than universal mathematical laws. His geocentric cosmology, elaborated by later astronomers, dominated learned thought in the Mediterranean, Islamic, and European worlds for roughly eighteen centuries, not because it was never questioned but because it offered a coherent, teachable synthesis of physics, biology, and logic.',
    startYear: -384,
    endYear: -322,
    dateDisplay: '384–322 BCE',
    approximateDate: false,
    latitude: 37.9838,
    longitude: 23.7275,
    places: [{ name: 'Athens', latitude: 37.9838, longitude: 23.7275, role: 'institution' }],
    transregional: false,
    people: ['aristotle'],
    cultures: ['Greek'],
    disciplines: ['natural philosophy', 'logic', 'biology'],
    themes: ['teleology', 'method', 'cosmology'],
    theoryStatus: 'superseded',
    theoryStatusNote:
      "Aristotelian cosmology and physics were gradually dismantled between Copernicus and Newton, but Aristotle's biological observations and his logic remained influential long after his physics fell away.",
    philosophicalQuestions: [
      {
        prompt:
          'What counts as knowledge obtained from "necessary first principles," and is that standard achievable, or even desirable, for empirical science?',
        debateId: 'induction-problem',
      },
    ],
    historicalSignificance:
      "Aristotle's framework defined what counted as a satisfying scientific explanation for most of Western and Islamicate intellectual history, making his eventual displacement one of the central dramas of the history of science.",
    commonMyth:
      'That Aristotle\'s physics was simply "wrong" and unscientific by the standards of its own time.',
    historicalComplication:
      "Aristotle's system was empirically grounded by the standards of his era, internally coherent, and productive for biology; its later rejection reflects a change in what counted as an adequate explanation, not merely the correction of sloppy thinking.",
    sources: [
      {
        author: 'G.E.R. Lloyd',
        title: 'Aristotle: The Growth and Structure of His Thought',
        year: '1968',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['ptolemy', 'copernicus', 'galileo', 'democritus'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'ptolemy',
    slug: 'ptolemy',
    title: 'Claudius Ptolemy and the Almagest',
    subtitle: 'Mathematical astronomy for a geocentric cosmos',
    kind: 'text',
    period: 'classical',
    summary:
      "Ptolemy's Almagest combined Babylonian numerical data with Greek geometry to build a predictive mathematical model of planetary motion using epicycles and equants.",
    longDescription:
      'Working in Roman Alexandria, Ptolemy synthesised centuries of observational data, much of it ultimately Babylonian in origin, into a geometric system capable of predicting planetary positions with useful accuracy. Ptolemy was explicit that his geometric devices were tools for prediction (he called them "saving the phenomena"), which later raised exactly the philosophical question of whether a model that predicts well must also be true.',
    startYear: 100,
    endYear: 170,
    dateDisplay: 'c. 100–170 CE',
    approximateDate: true,
    latitude: 31.2001,
    longitude: 29.9187,
    places: [
      { name: 'Alexandria, Egypt', latitude: 31.2001, longitude: 29.9187, role: 'institution' },
    ],
    transregional: false,
    people: ['ptolemy'],
    cultures: ['Greek', 'Roman-Egyptian'],
    disciplines: ['astronomy', 'mathematics'],
    themes: ['instruments-and-method', 'cosmology'],
    theoryStatus: 'superseded',
    theoryStatusNote:
      "Geocentric epicyclic astronomy was displaced by heliocentrism, but Ptolemy's mathematical techniques and much of his data were absorbed, corrected, and extended rather than simply discarded by Islamic and European astronomers.",
    philosophicalQuestions: [
      {
        prompt:
          'If a mathematical model predicts planetary positions accurately, must the geometric devices it uses (like epicycles) describe something physically real?',
        debateId: 'scientific-realism-no-miracles',
      },
    ],
    historicalSignificance:
      'The Almagest was the most authoritative astronomical text in the Mediterranean, Islamic, and European worlds for well over a millennium, and the target that Copernicus eventually set out to replace.',
    sources: [
      { author: 'Liba Taub', title: "Ptolemy's Universe", year: '1993', type: 'secondary' },
      {
        author: 'Otto Neugebauer',
        title: 'The Exact Sciences in Antiquity',
        year: '1957',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['babylonian-astronomy', 'aristotle', 'copernicus', 'alexandria-library'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'alexandria-library',
    slug: 'alexandria-library',
    title: 'The Library and Museum of Alexandria',
    subtitle: 'A state-funded centre of research under the Ptolemies',
    kind: 'institution',
    period: 'classical',
    summary:
      'A royally funded research institution in Hellenistic Egypt that gathered scholars, texts, and instruments, prefiguring later ideas of state-supported science.',
    longDescription:
      "Founded under the Ptolemaic dynasty, the Museum and its associated Library brought together scholars working on mathematics, astronomy, medicine, and textual criticism, supported by royal patronage. It illustrates that large, resource-intensive, state-backed scholarly institutions are not a modern invention, even though the Library's legendary destruction has become a cautionary myth that often obscures its more gradual, complicated decline.",
    startYear: -300,
    endYear: 400,
    dateDisplay: 'c. 300 BCE – 4th century CE',
    approximateDate: true,
    latitude: 31.2001,
    longitude: 29.9187,
    places: [{ name: 'Alexandria, Egypt', latitude: 31.2001, longitude: 29.9187 }],
    transregional: false,
    people: [],
    cultures: ['Hellenistic', 'Egyptian'],
    disciplines: ['mathematics', 'astronomy', 'medicine', 'philology'],
    themes: ['institutions-and-funding', 'non-western-origins'],
    philosophicalQuestions: [
      {
        prompt:
          'Does large-scale state patronage of research change the kind of knowledge that gets produced?',
      },
    ],
    historicalSignificance:
      "An early model for how concentrated funding, texts, and talent in one place can accelerate research — a pattern repeated at Baghdad's House of Wisdom, the Royal Society, and Los Alamos.",
    commonMyth:
      'That the Library was destroyed in a single catastrophic fire caused by Julius Caesar or later conquerors.',
    historicalComplication:
      'Ancient sources disagree, and the Library most likely declined gradually through funding cuts, political instability, and the dispersal of scholars rather than one dramatic event.',
    sources: [
      {
        author: 'Roger Bagnall',
        title: '"Alexandria: Library of Dreams"',
        year: '2002',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['ptolemy', 'baghdad-translation-movement'],
    confidence: 'likely',
    contentStatus: 'complete',
  },
]
