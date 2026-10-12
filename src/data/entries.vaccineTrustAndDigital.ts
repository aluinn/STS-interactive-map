import type { Entry } from '../types'

export const vaccineTrustAndDigitalEntries: Entry[] = [
  {
    id: 'hpv-vaccine-ireland-regret',
    slug: 'hpv-vaccine-ireland-regret',
    title: 'The HPV Vaccine Controversy in Ireland',
    subtitle:
      'Vaccine confidence as historically and institutionally produced, not a simple information gap',
    kind: 'event',
    period: 'environmental-contemporary',
    summary:
      'Uptake of the HPV vaccine in Ireland fell sharply between 2015 and 2017 amid a public campaign, organised partly through a group called REGRET, presenting personal testimony linking the vaccine to serious illness in teenage girls — uptake later recovered following a sustained public-health communication effort.',
    longDescription:
      "The REGRET campaign used emotionally powerful media testimony from parents describing their daughters' illnesses as vaccine-caused, in a climate already shaped by broader public distrust connected to earlier, separate scandals in Irish women's healthcare (including the symphysiotomy and CervicalCheck controversies), which had damaged institutional trust in medical authorities more generally. Public health researchers emphasise the \"3Cs\" model of vaccine hesitancy — confidence (trust in vaccine safety and the system providing it), complacency (perceived risk of the disease itself), and convenience (practical access) — but caution that treating hesitancy as simply a deficit of correct information, to be fixed by better facts, badly misreads cases like this one: trust is historically and institutionally produced, shaped by a community's accumulated experience with medical authority, not just by the information available at a given moment. Public health campaigns, including testimony from HSE health promotion officer Laura Brennan (who had cervical cancer and publicly advocated for the vaccine before her death in 2019), contributed to uptake recovering substantially after 2017. Explaining why the controversy took hold is a different task from endorsing the unsupported medical claims the campaign made, and this entry does the former without doing the latter.",
    startYear: 2015,
    endYear: 2019,
    dateDisplay: '2015–2019',
    approximateDate: true,
    latitude: 53.3498,
    longitude: -6.2603,
    places: [{ name: 'Ireland', latitude: 53.3498, longitude: -6.2603 }],
    transregional: false,
    people: [],
    cultures: ['Irish'],
    disciplines: ['public health', 'science communication'],
    themes: [
      'expertise-and-policy',
      'society-and-power',
      'communication-and-publics',
      'risk-and-uncertainty',
    ],
    philosophicalQuestions: [
      {
        prompt:
          'If vaccine hesitancy is driven by historically produced institutional distrust rather than a simple lack of facts, what does that imply about how public health communication should respond to it?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      "A detailed, well-documented contemporary case study showing that vaccine trust is shaped by a community's broader institutional history, not simply by the clarity or volume of scientific information provided.",
    commonMyth:
      'That vaccine hesitancy can be adequately explained, or fixed, simply by giving people more correct facts.',
    historicalComplication:
      "The controversy drew much of its force from genuine prior institutional failures in Irish women's healthcare unrelated to the vaccine itself, showing that a specific health controversy can become a lightning rod for broader, independently justified distrust.",
    sources: [
      {
        author: 'Heidi J. Larson',
        title: "Stuck: How Vaccine Rumors Start — and Why They Don't Go Away",
        year: '2020',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['brian-wynne-cumbrian-sheep-farmers', 'climate-science-scepticism'],
    confidence: 'likely',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'woebot-ai-psychotherapy',
    slug: 'woebot-ai-psychotherapy',
    title: 'AI Psychotherapy and Woebot',
    subtitle: 'Wider access, and new questions about human connection',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'Woebot, launched in 2017, is an automated conversational agent delivering cognitive behavioural therapy techniques by text — part of a wave of AI mental-health tools aiming to reduce cost and access barriers to therapy, while raising new questions about dependency, privacy, and the value of human therapeutic relationship.',
    longDescription:
      'A published randomised study found Woebot reduced symptoms of depression and anxiety among young adults over a two-week trial, evidence its developers cite for genuine clinical value, particularly for people who cannot afford or access human therapists. Critics raise several distinct concerns: whether an automated tool can provide the relational, empathic qualities some therapeutic approaches consider essential rather than incidental; whether users might develop unhealthy dependency on an always-available chatbot in place of addressing underlying needs for human connection; and how sensitive mental-health data shared with a private company is governed, retained, and potentially monetised. As with most contemporary digital-health cases in this atlas, the evidence base and the regulatory landscape are both still actively developing, and specific claims here should be read as describing the state of debate as of the mid-2020s, not as settled, permanent facts.',
    startYear: 2017,
    endYear: 2017,
    dateDisplay: '2017',
    approximateDate: false,
    transregional: true,
    scale: 'body',
    places: [],
    people: ['alison-darcy'],
    cultures: ['American'],
    disciplines: ['digital health', 'psychology'],
    themes: ['ethics', 'society-and-power', 'artificial-intelligence', 'digital-technology'],
    philosophicalQuestions: [
      {
        prompt:
          'If an AI tool measurably reduces symptoms but cannot offer genuine human relationship, how should "effective therapy" be defined — by symptom outcomes alone, or by something more?',
        debateId: 'ethics-in-science',
      },
    ],
    historicalSignificance:
      'A widely cited early case of AI-delivered mental healthcare, used throughout as a test case for the tradeoffs between improved access and the value of human therapeutic relationship.',
    sources: [
      {
        author: 'Kathleen Kara Fitzpatrick, Alison Darcy, and Molly Vierhile',
        title:
          '"Delivering Cognitive Behavior Therapy to Young Adults With Symptoms of Depression and Anxiety Using a Fully Automated Conversational Agent (Woebot)"',
        year: '2017',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['ai-academic-knowledge', 'platform-enshittification'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'platform-enshittification',
    slug: 'platform-enshittification',
    title: 'Platform "Enshittification"',
    subtitle: 'From serving users, to serving business customers, to extracting value from both',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      "A term popularised by writer Cory Doctorow in 2022–2023 describing a recurring lifecycle of digital platforms: first attracting and serving users well to build a dominant position, then shifting value toward business customers (advertisers, sellers) at users' expense, and finally extracting value from both sides once switching costs make leaving the platform difficult.",
    longDescription:
      'Doctorow\'s account draws on platform economics and network effects: a platform with a large, "locked-in" user base (through social graphs, accumulated data, or habit) can degrade the user experience with less immediate risk of losing users than a smaller platform could tolerate, because switching costs are high. The pattern is offered as a critique of how platform and app-store business models can convert initially genuine value creation into a form of rent extraction once a dominant market position is secured — directly connecting to the broader assetisation literature\'s account of continuing extraction from controlled digital infrastructure. As a recently coined, actively debated term describing an ongoing and contested economic pattern, this entry should be read as describing a live policy and business debate as of the mid-2020s, not a settled academic consensus.',
    startYear: 2022,
    endYear: 2023,
    dateDisplay: '2022–2023',
    approximateDate: false,
    transregional: true,
    scale: 'globe',
    places: [],
    people: ['cory-doctorow'],
    cultures: ['Canadian', 'British'],
    disciplines: ['digital economy', 'science and technology studies'],
    themes: ['assetisation', 'society-and-power', 'digital-technology', 'platform-power'],
    philosophicalQuestions: [
      {
        prompt:
          "If a platform's decline follows a predictable economic pattern driven by lock-in rather than any single bad decision, what kind of regulation (if any) could actually interrupt that pattern?",
      },
    ],
    historicalSignificance:
      'A recent, widely adopted term for analysing platform business-model dynamics, directly relevant to ongoing debates over digital-platform regulation and antitrust policy.',
    sources: [],
    relatedEntryIds: ['assetisation-technoscientific-rent', 'woebot-ai-psychotherapy'],
    confidence: 'likely',
    contentStatus: 'sourceNeeded',
  },
]
