import type { Entry } from '../types'

export const modernEntries: Entry[] = [
  {
    id: 'mary-somerville',
    slug: 'mary-somerville',
    title: 'Mary Somerville',
    subtitle: 'The woman "scientist" named by the word\'s coinage',
    kind: 'person',
    period: 'professional-science',
    summary:
      'A largely self-taught translator and expositor of Laplace\'s celestial mechanics whose synthetic breadth of knowledge led William Whewell to coin the word "scientist" partly in reaction to her work.',
    longDescription:
      'Somerville\'s Mechanism of the Heavens (1831) made advanced continental mathematical physics accessible to English readers, and her later On the Connexion of the Physical Sciences (1834) was read as modelling a new, unified vision of science across disciplines. Reviewing that book, William Whewell proposed "scientist" as a needed label — reflecting both her influence and the fact that no existing English word for a specialist natural philosopher fit comfortably.',
    startYear: 1780,
    endYear: 1872,
    dateDisplay: '1780–1872',
    approximateDate: false,
    latitude: 51.5072,
    longitude: -0.1276,
    places: [{ name: 'London', latitude: 51.5072, longitude: -0.1276 }],
    transregional: false,
    people: ['mary-somerville', 'whewell'],
    cultures: ['Scottish', 'English'],
    disciplines: ['astronomy', 'mathematics'],
    themes: ['gender', 'exclusion-and-access', 'profession-and-identity'],
    philosophicalQuestions: [
      {
        prompt:
          'Does the coining of a new professional label ("scientist") change what counts as science, or just how we talk about it?',
      },
      {
        prompt:
          'If the historian\'s answer to "what makes someone a scientist?" is a professional identity that solidified around her but never quite fit her, was Somerville a scientist?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'Her career is directly tied to the emergence of "scientist" as an English word, making her central to the history of how scientific identity and professional boundaries were drawn.',
    sources: [
      {
        author: 'Kathryn Neeley',
        title: 'Mary Somerville: Science, Illumination, and the Female Mind',
        year: '2001',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['whewell', 'word-scientist', 'laplace', 'natural-philosophy'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'whewell',
    slug: 'whewell',
    title: 'William Whewell',
    subtitle: 'Philosopher-historian of the inductive sciences',
    kind: 'person',
    period: 'professional-science',
    summary:
      'A Cambridge polymath who wrote an influential history and philosophy of the inductive sciences, coined the word "scientist," and argued that discovery involves a creative "colligation" of facts under new concepts.',
    longDescription:
      "Whewell's History of the Inductive Sciences and Philosophy of the Inductive Sciences tried to generalise, from historical case studies, how scientific discovery actually proceeds — arguing against a purely mechanical Baconian induction in favour of the active, creative role of the scientist's concepts in organising facts. His famous dispute with John Stuart Mill over the nature of induction prefigures many later twentieth-century debates about theory-ladenness.",
    startYear: 1794,
    endYear: 1866,
    dateDisplay: '1794–1866',
    approximateDate: false,
    latitude: 52.2043,
    longitude: 0.1218,
    places: [{ name: 'Cambridge', latitude: 52.2043, longitude: 0.1218 }],
    transregional: false,
    people: ['whewell'],
    cultures: ['English'],
    disciplines: ['philosophy of science', 'mineralogy'],
    themes: ['profession-and-identity', 'method'],
    philosophicalQuestions: [
      {
        prompt:
          'Is scientific discovery a matter of mechanically collecting facts, or does it require actively supplying new concepts that facts alone could never generate?',
        debateId: 'induction-problem',
      },
      {
        prompt:
          'Whewell named "the scientist" and argued for the active, conceptual side of discovery — does defining a professional identity and defining a method come from the same impulse, or two different ones?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'One of the first systematic historian-philosophers of science, and the namer of the modern "scientist."',
    sources: [
      {
        author: 'Richard Yeo',
        title:
          'Defining Science: William Whewell, Natural Knowledge, and Public Debate in Early Victorian Britain',
        year: '1993',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['mary-somerville', 'word-scientist', 'natural-philosophy'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'word-scientist',
    slug: 'word-scientist',
    title: 'The Coining of "Scientist"',
    subtitle: 'A new word for a changing social role',
    kind: 'idea',
    period: 'professional-science',
    summary:
      'William Whewell proposed the word "scientist" in 1834, by his own account partly reluctantly, to name a role that existing terms like "natural philosopher" or "man of science" no longer fit well.',
    longDescription:
      'Before this period, those who studied nature were usually called natural philosophers, and the work was often an unpaid, gentlemanly pursuit. The new word tracked a real social shift: growing specialisation, emerging paid positions, new societies organised by discipline, and a nascent sense of a distinct professional identity — changes that also reshaped who could plausibly claim the role.',
    startYear: 1834,
    endYear: 1834,
    dateDisplay: '1834',
    approximateDate: false,
    transregional: true,
    places: [{ name: 'Cambridge', latitude: 52.2043, longitude: 0.1218 }],
    people: ['whewell', 'mary-somerville'],
    cultures: ['English'],
    disciplines: ['history of science'],
    themes: ['profession-and-identity'],
    philosophicalQuestions: [
      {
        prompt:
          'Did "scientists" exist before the word did, or did the word help create a new kind of social role?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'Marks the transition from "natural philosophy" as a broad, often amateur pursuit toward a specialised, increasingly professional identity.',
    commonMyth:
      'That the word "scientist" caught on immediately and simply replaced "natural philosopher" overnight.',
    historicalComplication:
      'Whewell\'s coinage was initially contested and sometimes mocked as an ugly Americanism; "natural philosopher" and "man of science" both remained in common use for decades afterward, and the older and newer identities overlapped rather than cleanly succeeding one another.',
    sources: [
      {
        author: 'Sydney Ross',
        title: '"Scientist: The Story of a Word"',
        year: '1962',
        type: 'secondary',
      },
    ],
    relatedEntryIds: [
      'whewell',
      'mary-somerville',
      'darwin',
      'natural-philosophy',
      'professionalisation-of-science',
    ],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'natural-philosophy',
    slug: 'natural-philosophy',
    title: 'Natural Philosophy',
    subtitle: 'Studying nature as a single interconnected whole',
    kind: 'idea',
    period: 'professional-science',
    summary:
      'For centuries before "scientist" existed, investigators of nature were called natural philosophers, pursuing an interconnected study of the physical world that often carried an explicit theological dimension.',
    longDescription:
      'Natural philosophy treated questions we would now split across physics, chemistry, biology, and theology as parts of one unified inquiry into the order and purpose of creation. It was typically practised by university-trained men, clergy, and independently wealthy gentlemen rather than salaried specialists, and it supplied the conceptual vocabulary — "forces," "laws of nature," "causes" — that later, more fragmented scientific disciplines inherited. The gradual nineteenth-century fragmentation of natural philosophy into separate, professionalised fields (chemistry, geology, physics, biology) is itself a major historical event, not a simple continuation of the same enterprise under new management.',
    startYear: 1200,
    endYear: 1850,
    dateDisplay: 'c. 1200–1850 CE',
    approximateDate: true,
    transregional: true,
    places: [
      { name: 'Oxford', latitude: 51.752, longitude: -1.2577 },
      { name: 'Cambridge', latitude: 52.2043, longitude: 0.1218 },
    ],
    people: [],
    cultures: ['European'],
    disciplines: ['natural philosophy', 'theology'],
    themes: ['profession-and-identity', 'method'],
    philosophicalQuestions: [
      {
        prompt:
          'If natural philosophy treated nature, causation, and theology as one connected field of study, does splitting it into separate specialised sciences lose something, or is specialisation simply progress?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'Natural philosophy is the direct ancestor category of modern science, and understanding its theological and holistic character is essential to avoiding anachronism when reading pre-nineteenth-century investigators as "scientists" in the modern sense.',
    commonMyth:
      'That medieval and early modern "natural philosophers" were simply scientists who lacked modern equipment.',
    historicalComplication:
      "Natural philosophy's explicit theological dimension, and its lack of disciplinary boundaries, made it a genuinely different kind of enterprise from modern specialised science, not merely an under-resourced version of it.",
    sources: [
      {
        author: 'Peter Dear',
        title: 'Revolutionizing the Sciences: European Knowledge and Its Ambitions, 1500–1700',
        year: '2001',
        type: 'secondary',
      },
    ],
    relatedEntryIds: [
      'aristotle',
      'scholasticism',
      'word-scientist',
      'professionalisation-of-science',
    ],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'professionalisation-of-science',
    slug: 'professionalisation-of-science',
    title: 'The Professionalisation of Science',
    subtitle: 'From gentlemanly pursuit to salaried career',
    kind: 'idea',
    period: 'professional-science',
    summary:
      'Over the nineteenth century, the study of nature gradually changed from a pastime associated with wealthy gentlemen and aristocratic patrons into a paid occupation with training, examinations, specialised societies, and career paths.',
    longDescription:
      'Professionalisation involved more than a change of vocabulary: it meant new university posts and degree programmes, government and industrial funding, specialised journals and conferences, and societies organised around single disciplines (chemistry, geology, physics) rather than natural knowledge as a whole. This process was uneven and contested — it advanced at different speeds in different countries and fields, and it actively excluded many people, especially women and those without independent wealth, who had previously been able to participate as amateurs or patrons even without formal credentials.',
    startYear: 1800,
    endYear: 1900,
    dateDisplay: '19th century',
    approximateDate: true,
    transregional: true,
    places: [
      { name: 'London', latitude: 51.5072, longitude: -0.1276 },
      { name: 'Cambridge', latitude: 52.2043, longitude: 0.1218 },
    ],
    people: ['whewell', 'huxley'],
    cultures: ['English', 'European'],
    disciplines: ['history of science'],
    themes: ['profession-and-identity', 'exclusion-and-access', 'institutions-and-funding'],
    philosophicalQuestions: [
      {
        prompt:
          'Does turning the study of nature into a paid career change what counts as good scientific work, or just who is allowed to do it?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'Created the institutional and economic structure — salaried posts, peer-reviewed journals, disciplinary societies, credentialing — that still largely defines what it means to "be a scientist" today.',
    commonMyth:
      'That professionalisation was a smooth, inevitable process of simply replacing amateurs with trained experts.',
    historicalComplication:
      'The same process that created paid scientific careers also erected new gatekeeping barriers — degree requirements, society memberships, examination systems — that were often unavailable to women and the less wealthy, even when they had already been doing serious scientific work as amateurs.',
    sources: [
      {
        author: 'Jack Morrell',
        title:
          'Gentlemen of Science: Early Years of the British Association for the Advancement of Science',
        year: '1981',
        type: 'secondary',
      },
    ],
    relatedEntryIds: [
      'whewell',
      'word-scientist',
      'natural-philosophy',
      'huxley',
      'mary-somerville',
    ],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'darwin',
    slug: 'darwin',
    title: 'Charles Darwin',
    subtitle: 'Natural selection and a changing scientific profession',
    kind: 'person',
    period: 'professional-science',
    summary:
      "Darwin's theory of evolution by natural selection, developed over two decades after the Beagle voyage and published in On the Origin of Species (1859), explained the diversity of life without appeal to design.",
    longDescription:
      'Darwin assembled an enormous evidential base from geology, breeding practice, biogeography, and comparative anatomy, building a case he delayed publishing for years partly out of caution about its reception. His work coincided with and helped drive the broader professionalisation of British science, even as Darwin himself remained a financially independent gentleman naturalist rather than a salaried scientist, complicating simple "amateur to professional" narratives.',
    startYear: 1809,
    endYear: 1882,
    dateDisplay: '1809–1882',
    approximateDate: false,
    latitude: 51.4,
    longitude: 0.2,
    places: [{ name: 'Down House, Kent', latitude: 51.33, longitude: 0.052 }],
    transregional: false,
    people: ['darwin', 'wallace'],
    cultures: ['English'],
    disciplines: ['natural history', 'biology'],
    themes: ['overturning-authority', 'profession-and-identity'],
    theoryStatus: 'modified',
    theoryStatusNote:
      'Natural selection remains the organising principle of evolutionary biology, substantially extended by genetics and molecular biology that Darwin had no access to.',
    philosophicalQuestions: [
      {
        prompt:
          'What distinguishes a scientific "law," a "discovery," and an "explanation" — and does natural selection cleanly fit any one category?',
      },
      {
        prompt:
          'Is a long-delayed, carefully evidenced publication more or less "scientific" than a rapid, bold conjecture?',
      },
    ],
    historicalSignificance:
      'Reorganised biology around a single explanatory mechanism without purposive design, becoming one of the most consequential and contested theories in the history of science.',
    commonMyth: 'That Darwin alone and suddenly "discovered" evolution, working in isolation.',
    historicalComplication:
      'Alfred Russel Wallace independently arrived at a strikingly similar theory, forcing a joint 1858 announcement, and Darwin drew heavily on existing debates about breeding, geology, and population that were already circulating.',
    sources: [
      {
        author: 'Janet Browne',
        title: 'Charles Darwin: Voyaging',
        year: '1995',
        type: 'secondary',
      },
      { author: 'Adrian Desmond', title: 'Darwin', year: '1991', type: 'secondary' },
    ],
    relatedEntryIds: ['origin-of-species', 'alfred-russel-wallace', 'huxley', 'word-scientist'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'origin-of-species',
    slug: 'origin-of-species',
    title: 'On the Origin of Species',
    subtitle: "Darwin's 1859 case for natural selection",
    kind: 'text',
    period: 'professional-science',
    summary:
      "Darwin's carefully argued book presented natural selection as the mechanism behind the diversity and adaptation of living things, deliberately avoiding most discussion of human origins.",
    longDescription:
      'The book\'s rhetorical strategy — amassing converging evidence from many fields rather than relying on a single decisive proof — became a model later philosophers cited when discussing how historical sciences (unable to run controlled experiments) can still build a compelling case through a "consilience of inductions," a term Darwin borrowed from Whewell.',
    startYear: 1859,
    endYear: 1859,
    dateDisplay: '1859',
    approximateDate: false,
    latitude: 51.5072,
    longitude: -0.1276,
    places: [{ name: 'London (published)', latitude: 51.5072, longitude: -0.1276 }],
    transregional: false,
    people: ['darwin'],
    cultures: ['English'],
    disciplines: ['biology'],
    themes: ['texts-and-circulation', 'method'],
    philosophicalQuestions: [
      {
        prompt:
          'How should historical sciences, which cannot rerun the past experimentally, establish that their explanations are well evidenced?',
      },
    ],
    historicalSignificance:
      'Among the most influential scientific texts ever published, and a key case study in philosophy of science for explanation without direct experimental control.',
    sources: [
      {
        author: 'Charles Darwin',
        title: 'On the Origin of Species',
        year: '1859',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['darwin', 'whewell'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'alfred-russel-wallace',
    slug: 'alfred-russel-wallace',
    title: 'Alfred Russel Wallace',
    subtitle: 'Independent co-discovery from the field, not the study',
    kind: 'person',
    period: 'professional-science',
    summary:
      'A self-taught naturalist and specimen collector in Southeast Asia who independently arrived at a theory of natural selection, prompting a joint announcement with Darwin in 1858.',
    longDescription:
      "Unlike the wealthy, Cambridge-educated Darwin, Wallace supported himself by selling specimens collected during extensive fieldwork in the Malay Archipelago, developing his theory from direct field observation of biogeography. His class position shaped both how the co-discovery was handled — Darwin's allies arranged the 1858 joint reading in a way that protected Darwin's priority — and his later, more marginal standing in disciplinary history.",
    startYear: 1823,
    endYear: 1913,
    dateDisplay: '1823–1913',
    approximateDate: false,
    latitude: -2.5,
    longitude: 118.0,
    places: [{ name: 'Malay Archipelago (fieldwork)', latitude: -2.5, longitude: 118.0 }],
    transregional: false,
    people: ['wallace', 'darwin'],
    cultures: ['English'],
    disciplines: ['natural history', 'biogeography'],
    themes: ['independent-development', 'exclusion-and-access'],
    philosophicalQuestions: [
      {
        prompt:
          'When two people independently reach the same theory, what does that suggest about whether the theory tracks something real in nature?',
        debateId: 'scientific-realism-no-miracles',
      },
    ],
    historicalSignificance:
      'A textbook case of independent co-discovery, and a reminder that class and institutional position shape whose name a theory ends up carrying.',
    sources: [
      {
        author: 'Peter Raby',
        title: 'Alfred Russel Wallace: A Life',
        year: '2001',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['darwin'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'huxley',
    slug: 'huxley',
    title: 'Thomas Henry Huxley',
    subtitle: '"Darwin\'s bulldog" and the professionalisation of biology',
    kind: 'person',
    period: 'professional-science',
    summary:
      'A combative public defender of Darwinian evolution who also worked systematically to build biology into a salaried, credentialed profession independent of clerical and amateur gentleman-naturalist control.',
    longDescription:
      "Huxley's public debates (most famously with Bishop Samuel Wilberforce) popularised evolution, but his more lasting impact may have been institutional: through bodies like the X Club and reforms to science education and examinations, he helped shift biology toward paid, specialised, university-based careers, deliberately displacing earlier clerical naturalists.",
    startYear: 1825,
    endYear: 1895,
    dateDisplay: '1825–1895',
    approximateDate: false,
    latitude: 51.5072,
    longitude: -0.1276,
    places: [{ name: 'London', latitude: 51.5072, longitude: -0.1276 }],
    transregional: false,
    people: ['huxley'],
    cultures: ['English'],
    disciplines: ['biology'],
    themes: ['profession-and-identity', 'religion-and-science'],
    philosophicalQuestions: [
      {
        prompt:
          'Does professionalising a field change its intellectual content, or only who is allowed to practise it?',
      },
    ],
    historicalSignificance:
      'A central architect of the shift from amateur "natural philosophy" to credentialed professional biology in Britain.',
    sources: [
      {
        author: 'Ruth Barton',
        title: 'The X Club: Power and Authority in Victorian Science',
        year: '2018',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['darwin', 'word-scientist'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'james-watt-steam',
    slug: 'james-watt-steam',
    title: "James Watt's Steam Engine",
    subtitle: 'Incremental improvement, not a lone flash of insight',
    kind: 'instrument',
    period: 'industrial-imperial',
    summary:
      "Watt's separate-condenser improvement to the Newcomen engine (1765, patented 1769) dramatically improved fuel efficiency, built on decades of prior work by instrument makers, pump engineers, and industrial partners.",
    longDescription:
      'Watt worked as a skilled instrument maker before his improvements, and his success depended heavily on precision metalworking developed by Matthew Boulton\'s manufactory and borer John Wilkinson, plus patent protection that extended his commercial monopoly. The popular "eureka" story (a boyhood watching a kettle) is a later invention; the real history is one of incremental, collaborative, well-funded industrial engineering.',
    startYear: 1765,
    endYear: 1800,
    dateDisplay: '1765–1800',
    approximateDate: true,
    latitude: 52.4862,
    longitude: -1.8904,
    places: [{ name: 'Birmingham / Soho Works', latitude: 52.4862, longitude: -1.8904 }],
    transregional: false,
    people: ['james-watt'],
    cultures: ['Scottish', 'English'],
    disciplines: ['engineering'],
    themes: ['craft-and-instruments', 'myth-of-the-lone-genius', 'institutions-and-funding'],
    philosophicalQuestions: [
      {
        prompt:
          'If an "invention" depends on a whole supply chain of craft skills and precision tools, who deserves credit — the patent holder, or the network?',
      },
    ],
    historicalSignificance:
      'A central engine, literally, of the Industrial Revolution, and a case study against lone-genius narratives of invention.',
    commonMyth:
      'That Watt invented the steam engine, or had his key insight in a sudden flash while watching a kettle boil.',
    historicalComplication:
      'Watt improved on the existing Newcomen engine and depended on precision boring techniques and manufacturing capacity he did not himself invent; his patents also blocked some rival improvements for years.',
    missingVoices: [
      {
        role: 'Precision metalworkers and instrument makers',
        note: "John Wilkinson's boring techniques and Matthew Boulton's manufactory workforce supplied the precision metalworking Watt's design depended on; the engine's success is as much a craft and industrial achievement as an individual one.",
      },
    ],
    sources: [
      {
        author: 'Ben Russell',
        title: 'James Watt: Making the World Anew',
        year: '2014',
        type: 'secondary',
      },
    ],
    relatedEntryIds: [],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'liebig-fray-bentos',
    slug: 'liebig-fray-bentos',
    title: "Liebig's Extract of Meat and Fray Bentos",
    subtitle: 'Industrial chemistry, cattle frontiers, and global supply chains',
    kind: 'event',
    period: 'industrial-imperial',
    summary:
      "Chemist Justus von Liebig's nutritional theories inspired a vast meat-extract factory at Fray Bentos, Uruguay, feeding industrial Europe from South American cattle frontiers and their associated land and labour systems.",
    longDescription:
      'Liebig\'s laboratory research on protein and nutrition was translated into an industrial enterprise, the Liebig Extract of Meat Company, which built one of the largest meat-processing operations in the world on the Uruguayan river Fray Bentos, drawing on local ranching labour and transforming regional ecology and economy to supply European markets and later British wartime rations (the origin of the "Oxo" brand).',
    startYear: 1865,
    endYear: 1960,
    dateDisplay: 'c. 1865–1960s',
    approximateDate: true,
    latitude: -33.1333,
    longitude: -58.3,
    places: [
      { name: 'Fray Bentos, Uruguay', latitude: -33.1333, longitude: -58.3 },
      {
        name: "Giessen, Germany (Liebig's laboratory)",
        latitude: 50.5841,
        longitude: 8.6782,
        role: 'origin',
      },
    ],
    transregional: false,
    people: ['justus-von-liebig'],
    cultures: ['German', 'Uruguayan'],
    disciplines: ['chemistry', 'industry'],
    themes: ['empire-and-trade', 'laboratory-to-industry'],
    philosophicalQuestions: [
      {
        prompt:
          'When laboratory science becomes a global industrial supply chain, whose interests shape what counts as a "successful" application of the science?',
      },
    ],
    historicalSignificance:
      'A vivid case of how laboratory chemistry reorganised distant land, labour, and ecology on an industrial and global scale.',
    sources: [
      {
        author: 'Mark R. Finlay',
        title:
          '"Quackery and Cookery: Justus von Liebig\'s Extract of Meat and the Theory of Nutrition in the Victorian Age"',
        year: '1992',
        type: 'secondary',
      },
    ],
    relatedEntryIds: [],
    confidence: 'likely',
    contentStatus: 'complete',
  },
  {
    id: 'john-snow-cholera',
    slug: 'john-snow-cholera',
    title: 'John Snow and the Broad Street Pump',
    subtitle: 'Epidemiological evidence against miasma theory',
    kind: 'event',
    period: 'industrial-imperial',
    summary:
      'During the 1854 Soho cholera outbreak, physician John Snow mapped cases to a specific water pump, building a strong statistical and spatial case for waterborne transmission against the dominant miasma ("bad air") theory.',
    longDescription:
      "Snow's famous map, and his interviews establishing that a brewery whose workers drank beer rather than pump water saw almost no cases, built a compelling circumstantial case years before germ theory supplied a mechanism (Vibrio cholerae was identified by Robert Koch in 1883/1884 and earlier by Filippo Pacini in 1854). Snow persuaded local authorities to remove the pump handle, but broader miasma theory was not abandoned by the medical establishment until much later.",
    startYear: 1854,
    endYear: 1854,
    dateDisplay: '1854',
    approximateDate: false,
    latitude: 51.5136,
    longitude: -0.1365,
    places: [{ name: 'Soho, London', latitude: 51.5136, longitude: -0.1365 }],
    transregional: false,
    people: ['john-snow'],
    cultures: ['English'],
    disciplines: ['epidemiology', 'public health'],
    themes: ['evidence-and-action', 'institutions-and-funding'],
    philosophicalQuestions: [
      {
        prompt:
          'How much evidence, and of what kind, should be enough to justify acting against a disease before its causal mechanism is fully understood?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'A founding case study in epidemiology and in evidence-based public health action under causal uncertainty.',
    commonMyth:
      "That Snow's map alone and immediately overturned miasma theory and convinced the medical establishment.",
    historicalComplication:
      "Acceptance of waterborne transmission over miasma theory was gradual and contested for decades after Snow's intervention, and his own recommendation worked even without an agreed mechanism.",
    sources: [
      { author: 'Steven Johnson', title: 'The Ghost Map', year: '2006', type: 'secondary' },
    ],
    relatedEntryIds: ['great-stink-bazalgette'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'great-stink-bazalgette',
    slug: 'great-stink-bazalgette',
    title: "The Great Stink and Bazalgette's Sewers",
    subtitle: 'Smell, politics, and infrastructure built on the wrong theory',
    kind: 'event',
    period: 'industrial-imperial',
    summary:
      "The overwhelming smell of the Thames in the summer of 1858 finally forced Parliament to fund Joseph Bazalgette's massive London sewer system, built on miasma theory but effective largely because it also removed waterborne contamination.",
    longDescription:
      'Public health reformer Edwin Chadwick and engineer Bazalgette acted mainly on the belief that foul air itself caused disease, yet their sewer and embankment works dramatically reduced cholera by removing sewage from drinking-water sources — a successful public health intervention built partly on an incorrect causal theory. This complicates simple stories where correct theory must precede effective action.',
    startYear: 1858,
    endYear: 1875,
    dateDisplay: '1858–1875',
    approximateDate: false,
    latitude: 51.5072,
    longitude: -0.1276,
    places: [{ name: 'London', latitude: 51.5072, longitude: -0.1276 }],
    transregional: false,
    people: ['joseph-bazalgette'],
    cultures: ['English'],
    disciplines: ['engineering', 'public health'],
    themes: ['evidence-and-action', 'institutions-and-funding'],
    philosophicalQuestions: [
      {
        prompt:
          'Can an action motivated by a false theory still count as a genuine scientific success if it works for other, unrecognised reasons?',
      },
    ],
    historicalSignificance:
      'A striking case for philosophy of science: effective, theory-driven intervention is possible even when the operative theory is wrong, which complicates simple "successful prediction proves the theory" reasoning.',
    sources: [
      {
        author: 'Stephen Halliday',
        title: 'The Great Stink of London',
        year: '1999',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['john-snow-cholera'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'bengal-famine-science',
    slug: 'bengal-famine-science',
    title: 'Science, Infrastructure, and the Bengal Famines',
    subtitle: 'How colonial data and infrastructure shaped famine outcomes',
    kind: 'event',
    period: 'industrial-imperial',
    summary:
      'Colonial administrators used statistical survey and famine "codes" developed after earlier Indian famines, yet the catastrophic 1943 Bengal famine shows how scientific administration can fail or actively worsen outcomes when political priorities override evidence.',
    longDescription:
      'British colonial India developed relatively sophisticated famine codes and agricultural statistics after the famines of the 1870s–1890s, intended to trigger relief. In 1943, wartime priorities, export policy, and administrative failures meant that this apparatus of scientific administration did not prevent an estimated two to three million deaths, illustrating how statistical and administrative "science" is never separate from the political priorities that control its use.',
    startYear: 1943,
    endYear: 1944,
    dateDisplay: '1943–1944',
    approximateDate: false,
    latitude: 22.5726,
    longitude: 88.3639,
    places: [{ name: 'Bengal (Kolkata)', latitude: 22.5726, longitude: 88.3639 }],
    transregional: false,
    people: [],
    cultures: ['Bengali', 'British colonial'],
    disciplines: ['statistics', 'administration'],
    themes: ['empire-and-trade', 'evidence-and-action', 'ethics'],
    philosophicalQuestions: [
      {
        prompt:
          'Can scientific infrastructure (statistics, early-warning systems) be "neutral" when the political authority controlling it has other priorities?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'A sobering case study linking the history of statistics and administrative science directly to colonial governance and its human costs.',
    sources: [
      { author: 'Mike Davis', title: 'Late Victorian Holocausts', year: '2001', type: 'secondary' },
      { author: 'Amartya Sen', title: 'Poverty and Famines', year: '1981', type: 'secondary' },
    ],
    relatedEntryIds: ['congo-resource-extraction', 'colonial-korea-science'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'colonial-korea-science',
    slug: 'colonial-korea-science',
    title: 'Science and Technocracy under Japanese Colonial Rule in Korea',
    subtitle: 'Infrastructure, agronomy, and resource extraction',
    kind: 'event',
    period: 'industrial-imperial',
    summary:
      "Japan's colonial administration of Korea (1910–1945) developed agricultural science, railways, and public health infrastructure explicitly organised to serve the extraction of resources and labour for the Japanese empire.",
    longDescription:
      'Colonial technocrats presented their rice-production research, land surveys, and sanitation programs as modernising improvements, while the resulting increases in output were substantially exported to Japan, often worsening Korean food security, and scientific institutions were closed to most Koreans in senior roles. This is a case where the same scientific techniques served both infrastructural improvement and extractive colonial control simultaneously.',
    startYear: 1910,
    endYear: 1945,
    dateDisplay: '1910–1945',
    approximateDate: false,
    latitude: 37.5665,
    longitude: 126.978,
    places: [{ name: 'Seoul (Keijō)', latitude: 37.5665, longitude: 126.978 }],
    transregional: false,
    people: [],
    cultures: ['Korean', 'Japanese'],
    disciplines: ['agronomy', 'engineering', 'public health'],
    themes: ['empire-and-trade', 'exclusion-and-access'],
    philosophicalQuestions: [
      {
        prompt:
          'Can the same piece of scientific infrastructure be both a genuine improvement and an instrument of extraction and control at the same time?',
      },
    ],
    historicalSignificance:
      'Illustrates how colonial science frequently combined real technical capacity with structures designed to benefit the colonising power rather than the colonised population.',
    sources: [
      {
        author: 'Hong Yung Lee',
        title: 'Colonial Rule and Social Change in Korea, 1910–1945',
        year: '2013',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['bengal-famine-science', 'congo-resource-extraction'],
    confidence: 'likely',
    contentStatus: 'complete',
  },
  {
    id: 'congo-resource-extraction',
    slug: 'congo-resource-extraction',
    title: 'Scientific Surveying and Resource Extraction in the Congo',
    subtitle: 'Geology and botany in service of colonial exploitation',
    kind: 'event',
    period: 'industrial-imperial',
    summary:
      'Belgian colonial geological and botanical surveys of the Congo Free State and later Belgian Congo mapped mineral and rubber resources with scientific rigor used to organise forced labour and extraction, including during the rubber atrocities under Leopold II.',
    longDescription:
      'Expeditions trained in botany, geology, and tropical medicine produced genuinely useful scientific knowledge about Central African ecosystems and mineral deposits, knowledge that was simultaneously deployed to organise one of the most violent systems of forced extraction in modern colonial history. Botanical surveys that mapped and classified wild rubber vines (Landolphia species) across the forest were used directly to set village extraction quotas during the Congo Free State\'s rubber terror of the 1890s–1900s, when failure to meet quotas was punished with mutilation and killing; the same botanical expertise later supported a shift toward cultivated plantation rubber once wild-vine stocks were depleted. The case sharply poses the question of whether "extracting knowledge" and "extracting resources" can really be separated in colonial science.',
    startYear: 1885,
    endYear: 1960,
    dateDisplay: '1885–1960',
    approximateDate: true,
    latitude: -4.0383,
    longitude: 21.7587,
    places: [{ name: 'Congo Basin', latitude: -4.0383, longitude: 21.7587 }],
    transregional: false,
    people: [],
    cultures: ['Congolese', 'Belgian'],
    disciplines: ['geology', 'botany', 'tropical medicine'],
    themes: ['empire-and-trade', 'ethics', 'exclusion-and-access'],
    philosophicalQuestions: [
      {
        prompt:
          'Does knowledge produced to enable violence and extraction remain "scientific" in the same sense as knowledge produced for other ends?',
        debateId: 'ethics-in-science',
      },
    ],
    historicalSignificance:
      'One of the starkest cases in the atlas of science directly instrumentalised for colonial violence, important for resisting any tidy separation of "pure" knowledge from its uses.',
    missingVoices: [
      {
        role: 'Congolese forest communities and labourers',
        note: 'The botanical and geological knowledge this entry describes was gathered with the assistance of, and enforced against, Congolese communities whose own ecological knowledge of the forest went uncredited, and whose forced labour the resulting surveys were used to extract.',
      },
    ],
    sources: [
      { author: 'Adam Hochschild', title: "King Leopold's Ghost", year: '1998', type: 'secondary' },
    ],
    relatedEntryIds: ['bengal-famine-science', 'colonial-korea-science'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
]
