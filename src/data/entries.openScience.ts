import type { Entry } from '../types'

export const openScienceEntries: Entry[] = [
  {
    id: 'galileo-anagram-priority',
    slug: 'galileo-anagram-priority',
    title: "Galileo's Anagram",
    subtitle: 'Claiming priority while keeping a discovery secret',
    kind: 'event',
    period: 'renaissance',
    summary:
      'In 1610, Galileo sent Johannes Kepler an anagram encoding his observation of Saturn\'s puzzling "ears" (later understood as the rings), securing a timestamped claim to priority while keeping the actual discovery secret from rivals until he was ready to announce it.',
    longDescription:
      'Scrambling a Latin sentence into an unreadable string of letters, then later revealing the solution, let Galileo establish a verifiable date for his discovery without disclosing its content — a practice several contemporaries used, since open disclosure without protection risked a rival claiming the finding first. This small episode captures a tension at the heart of the later "open science" ideal: scientific credit has always required some proof of priority, and secrecy and openness have coexisted in tension throughout the history of science, not simply replaced one another in a steady march toward transparency.',
    startYear: 1610,
    endYear: 1610,
    dateDisplay: '1610',
    approximateDate: false,
    latitude: 45.4064,
    longitude: 11.8768,
    places: [{ name: 'Padua', latitude: 45.4064, longitude: 11.8768 }],
    transregional: false,
    people: ['galileo', 'kepler'],
    cultures: ['Italian', 'German'],
    disciplines: ['astronomy'],
    themes: ['open-science', 'instruments-and-method'],
    philosophicalQuestions: [
      {
        prompt:
          'If priority has always required some proof of being first, can scientific openness and scientific secrecy ever be fully separated, or are they always in some tension?',
      },
    ],
    historicalSignificance:
      'An early, vivid illustration that the tension between claiming priority and protecting a discovery predates modern patents and publication by centuries.',
    sources: [
      { author: 'Mario Biagioli', title: 'Galileo, Courtier', year: '1993', type: 'secondary' },
    ],
    relatedEntryIds: ['galileo', 'henry-oldenburg-philosophical-transactions', 'merton-norms'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'henry-oldenburg-philosophical-transactions',
    slug: 'henry-oldenburg-philosophical-transactions',
    title: 'Henry Oldenburg and the Philosophical Transactions',
    subtitle: 'Publication as a solution to the priority problem',
    kind: 'text',
    period: 'early-modern',
    summary:
      "As founding secretary of the Royal Society, Henry Oldenburg launched the Philosophical Transactions in 1665, pioneering the idea that prompt, dated publication — rather than secrecy or private correspondence alone — could establish and publicly register a researcher's priority.",
    longDescription:
      'Oldenburg maintained an enormous international correspondence network, soliciting and circulating reports of experiments and observations, then formalised this into a periodical that registered submissions by date of receipt, creating a public, citable record of who had reported a finding first. This offered scientists an alternative to the anagram-style claims Galileo and others had relied on: publish promptly and openly, and the published record itself proves priority, in exchange for giving up the option to keep the finding secret. The Philosophical Transactions is often cited as the first journal to also use external review by Fellows before publication, foreshadowing peer review.',
    startYear: 1665,
    endYear: 1665,
    dateDisplay: '1665',
    approximateDate: false,
    latitude: 51.5072,
    longitude: -0.1276,
    places: [{ name: 'London', latitude: 51.5072, longitude: -0.1276 }],
    transregional: false,
    people: ['henry-oldenburg'],
    cultures: ['German', 'English'],
    disciplines: ['scientific publishing'],
    themes: ['open-science', 'institutions-and-funding'],
    philosophicalQuestions: [
      {
        prompt:
          'If publication solves the priority problem by making a public record, what new problems does publication itself create — about who can afford to publish, and who controls the journals?',
        debateId: 'ethics-in-science',
      },
    ],
    historicalSignificance:
      'Founded the model — prompt, dated, reviewed publication — that still underlies how scientific priority and credit are established today.',
    sources: [
      {
        author: 'Marie Boas Hall',
        title: 'Henry Oldenburg: Shaping the Royal Society',
        year: '2002',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['royal-society', 'galileo-anagram-priority', 'open-access-and-inequality'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'human-genome-project-bermuda-principles',
    slug: 'human-genome-project-bermuda-principles',
    title: 'The Human Genome Project and the Bermuda Principles',
    subtitle: 'An unusually radical open-data commitment',
    kind: 'event',
    period: 'environmental-contemporary',
    summary:
      'At a 1996 meeting in Bermuda, leaders of the publicly funded Human Genome Project agreed to release newly generated DNA sequence data into public databases within 24 hours, an unusually fast and radical open-data commitment that shaped the entire subsequent field of genomics.',
    longDescription:
      "The Bermuda Principles were adopted partly in direct response to competition from private genome-sequencing efforts (notably Celera Genomics), on the reasoning that rapid public release would keep the human genome sequence itself a shared public resource rather than allow it to be patented or commercially enclosed. Data flowed into public databases such as GenBank, and the HapMap Project (cataloguing human genetic variation) later extended similar rapid-release norms. The episode is frequently cited as a model for open science precisely because it shows rapid, radical openness is achievable at scale when there is strong institutional and funding commitment to it — while also showing that such commitments can be fragile, contingent on specific competitive and political pressures rather than being science's normal default mode.",
    startYear: 1996,
    endYear: 2003,
    dateDisplay: '1996–2003',
    approximateDate: false,
    latitude: 32.3078,
    longitude: -64.7505,
    places: [{ name: 'Bermuda (1996 strategy meeting)', latitude: 32.3078, longitude: -64.7505 }],
    transregional: false,
    people: [],
    cultures: ['transnational'],
    disciplines: ['genomics', 'science policy'],
    themes: ['open-science', 'assetisation', 'biotechnology'],
    philosophicalQuestions: [
      {
        prompt:
          'If rapid data-sharing in genomics was adopted largely to pre-empt commercial patenting, was that decision driven mainly by a commitment to openness, or by a different kind of competitive strategy?',
        debateId: 'ethics-in-science',
      },
    ],
    historicalSignificance:
      'One of the most consequential open-data commitments in the history of science, shaping norms across genomics and influencing open-data policy well beyond biology.',
    sources: [
      {
        author: 'Robert Cook-Deegan',
        title: 'The Gene Wars: Science, Politics, and the Human Genome',
        year: '1994',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['assetisation-technoscientific-rent', 'open-access-and-inequality'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'open-access-and-inequality',
    slug: 'open-access-and-inequality',
    title: 'Open Access Publishing and Its Inequalities',
    subtitle: '"Open" does not automatically mean equitable',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'Open-access publishing — making research freely readable rather than locked behind subscription paywalls — comes in different forms with very different equity implications: "green" open access (self-archiving a copy), "gold" open access (publishing openly, often funded by an author-paid article-processing charge), and a predatory-publishing industry that exploits the gold model\'s incentives.',
    longDescription:
      'Green open access lets authors deposit a version of their paper in a repository, usually after an embargo period, at no direct cost to the author. Gold open access makes the published version immediately free to read, but commonly funds this through an article-processing charge (APC) paid by the author or their institution — charges that can run into thousands of dollars, creating a new form of inequality in which researchers at well-funded institutions can publish openly while researchers elsewhere cannot afford to, even though both are nominally participating in the "open" system. This incentive structure has also fuelled a predatory-publishing industry: journals that charge publication fees while providing little or no genuine peer review, exploiting researchers under pressure to publish. Together these show that openness is not automatically equitable — the terms on which openness is achieved determine who actually benefits from it.',
    startYear: 2000,
    endYear: 2020,
    dateDisplay: 'c. 2000–present',
    approximateDate: true,
    transregional: true,
    scale: 'globe',
    places: [],
    people: [],
    cultures: ['transnational'],
    disciplines: ['scientific publishing', 'science policy'],
    themes: ['open-science', 'global-knowledge-networks', 'assetisation', 'digital-technology'],
    philosophicalQuestions: [
      {
        prompt:
          'If paying an article-processing charge is the main route to "open" publication, in what sense has access actually been opened, rather than just shifted from the reader to the author?',
        debateId: 'ethics-in-science',
      },
    ],
    historicalSignificance:
      'A central, still-unresolved tension in contemporary science policy between the goal of open knowledge and the economic structures through which openness is actually funded and delivered.',
    sources: [{ author: 'Peter Suber', title: 'Open Access', year: '2012', type: 'secondary' }],
    relatedEntryIds: [
      'henry-oldenburg-philosophical-transactions',
      'trickle-down-science',
      'assetisation-technoscientific-rent',
    ],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'galaxy-zoo-citizen-science',
    slug: 'galaxy-zoo-citizen-science',
    title: 'Galaxy Zoo and Citizen Science',
    subtitle: 'Distributed public participation in real research',
    kind: 'event',
    period: 'environmental-contemporary',
    summary:
      'Launched in 2007, Galaxy Zoo invited members of the public to classify the shapes of galaxies from telescope survey images online, demonstrating that distributed volunteer effort could produce scientifically useful data at a scale and speed no small research team could match alone.',
    longDescription:
      'Faced with roughly a million galaxy images from the Sloan Digital Sky Survey needing morphological classification, astronomers built a simple web interface letting volunteers classify galaxy shapes; the project collected tens of millions of classifications within its first year, and cross-checking multiple volunteers\' classifications of the same image produced reliability comparable to expert classification. The project became a template for later "citizen science" platforms (and the broader Zooniverse platform), demonstrating a genuinely productive, large-scale role for public participation in research — while also raising questions about how much credit, training, and ongoing relationship volunteer contributors should receive for labour that is often unpaid.',
    startYear: 2007,
    endYear: 2007,
    dateDisplay: '2007',
    approximateDate: false,
    latitude: 51.752,
    longitude: -1.2577,
    places: [{ name: 'University of Oxford', latitude: 51.752, longitude: -1.2577 }],
    transregional: false,
    people: ['chris-lintott'],
    cultures: ['British', 'American'],
    disciplines: ['astronomy'],
    themes: [
      'open-science',
      'scientific-practice',
      'citizen-science',
      'digital-technology',
      'communication-and-publics',
    ],
    philosophicalQuestions: [
      {
        prompt:
          'If volunteer citizen-scientists collectively produce data of expert-level reliability, should "who counts as a contributor" to a published paper be rethought?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'A landmark demonstration that large-scale public participation can meet genuine scientific reliability standards, founding an entire citizen-science movement.',
    sources: [
      {
        author: 'Chris J. Lintott et al.',
        title:
          '"Galaxy Zoo: Morphologies Derived from Visual Inspection of Galaxies from the Sloan Digital Sky Survey"',
        year: '2008',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['open-access-and-inequality', 'ai-academic-knowledge'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
]
