import type { Entry } from '../types'

export const expertiseAndActivismEntries: Entry[] = [
  {
    id: 'brian-wynne-cumbrian-sheep-farmers',
    slug: 'brian-wynne-cumbrian-sheep-farmers',
    title: 'Brian Wynne and the Cumbrian Sheep Farmers',
    subtitle: 'Local knowledge versus official expertise after Chernobyl',
    kind: 'event',
    period: 'environmental-contemporary',
    summary:
      "Following the 1986 Chernobyl nuclear accident, UK government scientists repeatedly gave Cumbrian hill-sheep farmers restriction advice based on models that assumed the wrong soil type and underestimated how radioactive caesium would behave locally — advice the farmers' own practical knowledge of their land often contradicted.",
    longDescription:
      'Brian Wynne\'s study documented how scientists initially predicted restrictions on sheep movement and sale would last only about three weeks, based on models assuming alkaline soils that would bind caesium — when much of the affected Cumbrian upland is in fact acidic peat, on which caesium behaves very differently and persists far longer. Restrictions ultimately lasted over a decade in places. Farmers\' detailed, practical knowledge of their own land and animals was initially dismissed by visiting scientists, deepening local distrust that Wynne argued was not irrational "ignorance" of science but a reasonable response to repeatedly wrong official predictions delivered with unwarranted confidence. The case became a foundational example for arguing that public scepticism of expertise can reflect legitimate, situated knowledge and a realistic assessment of institutional trustworthiness, not simply a deficit of scientific understanding.',
    startYear: 1986,
    endYear: 1998,
    dateDisplay: '1986–1998',
    approximateDate: true,
    latitude: 54.4609,
    longitude: -3.0886,
    places: [{ name: 'Cumbria, England', latitude: 54.4609, longitude: -3.0886 }],
    transregional: false,
    people: ['brian-wynne'],
    cultures: ['British'],
    disciplines: ['science and technology studies', 'environmental science'],
    themes: ['expertise-and-activism', 'expertise-and-policy'],
    philosophicalQuestions: [
      {
        prompt:
          'If experts repeatedly give wrong predictions with high confidence, is public distrust of those experts a failure of public understanding, or a reasonable response to a track record?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'One of the most widely cited case studies in science and technology studies for directly rebutting the "public deficit model," where public scepticism is assumed to reflect ignorance rather than legitimate local knowledge or institutional distrust.',
    sources: [
      {
        author: 'Brian Wynne',
        title: '"Misunderstood Misunderstanding: Social Identities and Public Uptake of Science"',
        year: '1992',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['rachel-carson-silent-spring', 'feminist-epistemology-idea'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'aids-activism-treatment-expertise',
    slug: 'aids-activism-treatment-expertise',
    title: 'AIDS Activism and Treatment Expertise',
    subtitle: 'Patients as co-producers of medical research design',
    kind: 'event',
    period: 'environmental-contemporary',
    summary:
      'In the late 1980s and 1990s, AIDS activists — many with no formal scientific training — mastered the technical literature on HIV treatment and clinical-trial design well enough to directly influence FDA policy and trial protocols, becoming genuine contributors to the research process rather than passive research subjects.',
    longDescription:
      'Groups associated with ACT UP and related treatment-activist networks argued that standard double-blind placebo trial design was ethically and practically unsuited to a fast-moving fatal epidemic, pushed for expanded access programmes, and became sufficiently fluent in virology and trial methodology to sit on research review bodies as substantive participants. Sociologist Steven Epstein\'s study of this movement, and later work by Harry Collins and Robert Evans, distinguished "contributory expertise" (the ability to actually contribute original research), "interactional expertise" (deep enough fluency in a field\'s language to contribute meaningfully to its debates without doing its technical work oneself), and expertise attributed mainly through social relationships and trust rather than credentials — categories AIDS activism helped make visible by demonstrating that non-credentialed outsiders could acquire genuine interactional, and in places contributory, expertise.',
    startYear: 1987,
    endYear: 1996,
    dateDisplay: '1987–1996',
    approximateDate: true,
    latitude: 40.7128,
    longitude: -74.006,
    places: [{ name: 'New York City', latitude: 40.7128, longitude: -74.006 }],
    transregional: false,
    people: ['steven-epstein'],
    cultures: ['American'],
    disciplines: ['medicine', 'science and technology studies'],
    themes: ['expertise-and-activism', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          'If patients without formal credentials can acquire genuine expertise well enough to improve research design, what should that change about who gets a seat at the research-design table?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'A landmark case for expanding who counts as a legitimate contributor to scientific knowledge production, and for the vocabulary (contributory and interactional expertise) later used across science and technology studies.',
    sources: [
      {
        author: 'Steven Epstein',
        title: 'Impure Science: AIDS, Activism, and the Politics of Knowledge',
        year: '1996',
        type: 'primary',
      },
      {
        author: 'Harry Collins and Robert Evans',
        title: '"The Third Wave of Science Studies: Studies of Expertise and Experience"',
        year: '2002',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['brian-wynne-cumbrian-sheep-farmers', 'mary-somerville'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'franklin-wu-credit-and-exclusion',
    slug: 'franklin-wu-credit-and-exclusion',
    title: 'Credit and Exclusion: Rosalind Franklin and Chien-Shiung Wu',
    subtitle: "Two well-documented cases of women's experimental work under-credited",
    kind: 'person',
    period: 'cold-war',
    summary:
      "Rosalind Franklin's X-ray diffraction data was essential to discovering DNA's double-helix structure, and Chien-Shiung Wu's experiment confirmed the violation of parity in weak interactions — in both cases, Nobel Prizes went to male theorists whose work depended on these women's experimental contributions.",
    longDescription:
      'Franklin\'s crystallography, particularly her "Photo 51," gave Watson and Crick a critical piece of evidence for the double-helix structure of DNA; her data was shown to them without her knowledge via colleague Maurice Wilkins, and the 1962 Nobel Prize went to Watson, Crick, and Wilkins — Franklin had died in 1958 and in any case the prize is not awarded posthumously, but her relative lack of credit during her lifetime remains a widely discussed case of a woman\'s essential experimental contribution being under-recognised. Chien-Shiung Wu designed and carried out the 1956 beta-decay experiment that experimentally confirmed Tsung-Dao Lee and Chen-Ning Yang\'s theoretical prediction that parity is not conserved in weak nuclear interactions; Lee and Yang received the 1957 Nobel Prize in Physics for the theoretical prediction, while Wu, whose experimental work made the confirmation possible, did not share it. Both cases are frequently cited together in discussions of the "leaky pipeline" — the pattern by which women are lost from science careers at a higher rate than men at each successive career stage, through a combination of funding, hiring, and recognition bias rather than any single dramatic act of exclusion.',
    startYear: 1952,
    endYear: 1957,
    dateDisplay: '1952–1957',
    approximateDate: false,
    transregional: true,
    scale: 'laboratory',
    places: [
      { name: "King's College London", latitude: 51.5115, longitude: -0.1161 },
      { name: 'Columbia University, New York', latitude: 40.8075, longitude: -73.9626 },
    ],
    people: ['rosalind-franklin', 'chien-shiung-wu'],
    cultures: ['British', 'Chinese', 'American'],
    disciplines: ['molecular biology', 'physics'],
    themes: ['expertise-and-activism', 'gender-and-representation', 'exclusion-and-access'],
    philosophicalQuestions: [
      {
        prompt:
          'When essential experimental work goes uncredited while theoretical or interpretive work built on it is celebrated, what does that reveal about which kinds of scientific labour get recognised as "discovery"?',
        debateId: 'discovery-invention-progress',
      },
    ],
    historicalSignificance:
      'Two of the most widely cited cases in discussions of gender, credit, and the "leaky pipeline" in twentieth-century physical science.',
    commonMyth:
      "That Franklin's and Wu's contributions went completely unrecognised by their scientific peers at the time.",
    historicalComplication:
      'Both women were respected scientists among specialists during their careers; the exclusion was specifically from the highest public honours and popular credit, not total professional invisibility — a more precise and in some ways more troubling pattern than simple erasure.',
    missingVoices: [
      {
        role: 'Rosalind Franklin',
        note: "Franklin's X-ray diffraction data (including Photograph 51) was shown to Watson and Crick without her knowledge or consent and was essential to their 1953 DNA model; she died in 1958, four years before the Nobel Prize that recognised Watson, Crick, and Wilkins was awarded.",
      },
      {
        role: 'Chien-Shiung Wu',
        note: "Wu's 1956 experiment disproved the conservation of parity, a result central to the 1957 Nobel Prize in Physics awarded solely to the theorists Tsung-Dao Lee and Chen-Ning Yang, who had proposed the hypothesis her experiment tested.",
      },
    ],
    sources: [
      {
        author: 'Brenda Maddox',
        title: 'Rosalind Franklin: The Dark Lady of DNA',
        year: '2002',
        type: 'secondary',
      },
      {
        author: 'Sharon Bertsch McGrayne',
        title: 'Nobel Prize Women in Science',
        year: '1998',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['feminist-epistemology-idea', 'mary-somerville', 'bourdieu-forms-of-capital'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'strong-programme-symmetry',
    slug: 'strong-programme-symmetry',
    title: "The Strong Programme's Principle of Symmetry",
    subtitle: 'Explaining true and false beliefs with the same kind of cause',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'David Bloor\'s "strong programme" proposed that sociological explanation of scientific belief should be symmetrical — the same types of social causes should be invoked to explain both beliefs we now consider true and beliefs we now consider false — a principle frequently misread as claiming all beliefs are equally valid.',
    longDescription:
      'Bloor set out four requirements for a properly scientific sociology of knowledge: it should be causal (seeking the conditions that produce belief), impartial with respect to truth and falsity, symmetrical in explanatory style (using the same kind of explanation for both true and false beliefs), and reflexive (applicable to sociology\'s own claims too). Symmetry does not claim every belief is equally true or equally well evidenced — it claims that *why a community came to hold* a belief, true or false, is always open to the same kind of sociological investigation, rather than reserving sociological explanation only for beliefs we now regard as mistaken (with true beliefs waved through as simply following from "the evidence" with no social dimension at all). Critics, including some realist philosophers of science, argue the symmetry principle still risks underselling how evidence itself can rationally constrain belief independent of social interest.',
    startYear: 1976,
    endYear: 1976,
    dateDisplay: '1976',
    approximateDate: false,
    transregional: true,
    scale: 'network',
    places: [],
    people: ['david-bloor'],
    cultures: ['British'],
    disciplines: ['sociology of science'],
    themes: ['scientific-practice', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          'If the same type of sociological explanation applies to both true and false beliefs, does that mean evidence plays no independent role in which beliefs scientific communities come to hold?',
        debateId: 'demarcation-boundary-work',
      },
    ],
    historicalSignificance:
      "One of the most influential and most frequently misunderstood methodological principles in the sociology of science, central to the strong programme's legacy.",
    commonMyth:
      'That the symmetry principle claims all beliefs, however arrived at, are equally true or equally justified.',
    historicalComplication:
      'Symmetry is a claim about the *style* of explanation sociologists should offer, not a claim about epistemology or truth — but the two are easily, and often, conflated in popular summaries.',
    sources: [
      {
        author: 'David Bloor',
        title: 'Knowledge and Social Imagery',
        year: '1976',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['sociology-of-scientific-knowledge', 'gieryn-boundary-work'],
    confidence: 'established',
    contentStatus: 'complete',
  },
]
