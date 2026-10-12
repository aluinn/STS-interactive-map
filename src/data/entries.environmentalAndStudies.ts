import type { Entry } from '../types'

export const environmentalAndStudiesEntries: Entry[] = [
  {
    id: 'rachel-carson-silent-spring',
    slug: 'rachel-carson-silent-spring',
    title: 'Rachel Carson and Silent Spring',
    subtitle: 'Acting on uncertain but serious risk',
    kind: 'text',
    period: 'environmental-contemporary',
    summary:
      "Carson's 1962 book synthesised ecological and toxicological evidence on pesticide harms, especially DDT, into a public argument for precaution that the chemical industry fought fiercely.",
    longDescription:
      'Carson, a trained marine biologist and science writer, argued that pesticide effects moved through food chains in ways agricultural science had largely ignored, and that policy should act on serious, well-grounded risk even before every causal mechanism was settled beyond dispute. Industry-funded critics attacked her credentials and motives rather than engaging primarily with her evidence, a pattern later repeated in other environmental controversies.',
    startYear: 1962,
    endYear: 1962,
    dateDisplay: '1962',
    approximateDate: false,
    latitude: 38.9072,
    longitude: -77.0369,
    places: [{ name: 'Washington, D.C.', latitude: 38.9072, longitude: -77.0369 }],
    transregional: false,
    people: ['rachel-carson'],
    cultures: ['American'],
    disciplines: ['ecology', 'toxicology'],
    themes: ['evidence-and-action', 'ethics'],
    philosophicalQuestions: [
      {
        prompt:
          'How should science respond, and how should policy act, when the evidence of harm is serious but the causal picture is not fully settled?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'Widely credited with catalysing the modern environmental movement and the creation of the US Environmental Protection Agency.',
    commonMyth: 'That Carson called for a total ban on all pesticides regardless of circumstance.',
    historicalComplication:
      "Carson's actual argument was for selective, evidence-based restriction and far greater caution, not blanket prohibition — a nuance often lost in later characterisations by critics.",
    sources: [
      { author: 'Rachel Carson', title: 'Silent Spring', year: '1962', type: 'primary' },
      {
        author: 'Linda Lear',
        title: 'Rachel Carson: Witness for Nature',
        year: '1997',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['climate-science-scepticism'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'climate-science-scepticism',
    slug: 'climate-science-scepticism',
    title: 'Climate Science and Organised Scepticism',
    subtitle: 'Manufacturing doubt about a well-evidenced consensus',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'Despite a strong and long-standing scientific consensus on anthropogenic climate change, a sustained, well-funded campaign has worked to manufacture public doubt, often reusing tactics first developed in defending the tobacco industry.',
    longDescription:
      'Historians of science have traced direct personnel and funding links between groups that defended tobacco against cancer evidence in earlier decades and later groups casting doubt on climate science, despite scientific understanding of the greenhouse effect dating back to the nineteenth century (Fourier, Arrhenius) and a robust modern consensus. The case raises sharp questions about how publics and policymakers should weigh genuine scientific uncertainty against manufactured doubt designed to look like it.',
    startYear: 1970,
    endYear: 2020,
    dateDisplay: 'c. 1970s–present',
    approximateDate: true,
    transregional: true,
    places: [{ name: 'Washington, D.C.', latitude: 38.9072, longitude: -77.0369 }],
    people: [],
    cultures: ['American', 'transnational'],
    disciplines: ['climate science', 'science policy'],
    themes: ['evidence-and-action', 'expertise-and-policy', 'climate', 'communication-and-publics'],
    philosophicalQuestions: [
      {
        prompt:
          'How can the public distinguish legitimate scientific uncertainty from manufactured doubt designed to resemble it?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'A central contemporary case for philosophy and sociology of science concerning expertise, trust, and the politics of uncertainty.',
    sources: [
      { author: 'Naomi Oreskes', title: 'Merchants of Doubt', year: '2010', type: 'secondary' },
    ],
    relatedEntryIds: ['rachel-carson-silent-spring'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'merton-norms',
    slug: 'merton-norms',
    title: "Robert Merton's Scientific Norms",
    subtitle: 'Communalism, universalism, disinterestedness, organised scepticism',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'Sociologist Robert Merton proposed that science functions through a distinctive ethos of shared norms — openness, judging claims regardless of who makes them, disinterested pursuit of truth, and systematic scepticism.',
    longDescription:
      "Merton's 1942 account described an idealised normative structure he argued was functionally necessary for science to operate as a trustworthy, self-correcting institution. Later sociologists of science, especially from the 1970s laboratory-studies tradition, argued that actual scientific practice regularly departs from these norms — through secrecy, priority disputes, and the influence of funding and reputation — without necessarily undermining science's overall reliability.",
    startYear: 1942,
    endYear: 1942,
    dateDisplay: '1942',
    approximateDate: false,
    transregional: true,
    places: [{ name: 'Columbia University, New York', latitude: 40.8075, longitude: -73.9626 }],
    people: ['robert-merton'],
    cultures: ['American'],
    disciplines: ['sociology of science'],
    themes: ['institutions-and-funding', 'objectivity'],
    philosophicalQuestions: [
      {
        prompt:
          'If real scientific practice regularly violates an idealised ethos, does that mean the ethos is wrong, or that practice is falling short of a worthwhile standard?',
        debateId: 'objectivity-values',
      },
      {
        prompt:
          "Disputes over scientific priority and secrecy put Merton's norms in tension with each other: withholding results before publication can be condemned as secrecy, yet defended as protecting credit or ensuring results are checked before release. Which norm should win?",
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'A foundational text for the sociology of science and for later debates about scientific norms, credit, and institutional trust.',
    sources: [
      {
        author: 'Robert Merton',
        title: 'The Sociology of Science',
        year: '1973',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['gieryn-boundary-work'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'gieryn-boundary-work',
    slug: 'gieryn-boundary-work',
    title: 'Thomas Gieryn and "Boundary-Work"',
    subtitle: 'How scientists draw the line around "real" science',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'Sociologist Thomas Gieryn argued that the boundary between "science" and "non-science" is not fixed by logic alone but actively, strategically drawn and redrawn by scientists to claim authority, resources, and autonomy.',
    longDescription:
      "Gieryn's studies showed scientists invoking different, sometimes inconsistent, criteria for what counts as proper science depending on whether they were defending science against religion, against pseudoscience, or against government interference — demonstrating that demarcation functions rhetorically and institutionally as much as philosophically.",
    startYear: 1983,
    endYear: 1999,
    dateDisplay: '1983–1999',
    approximateDate: false,
    transregional: true,
    places: [],
    people: ['thomas-gieryn'],
    cultures: ['American'],
    disciplines: ['sociology of science'],
    themes: ['demarcation', 'profession-and-identity'],
    philosophicalQuestions: [
      {
        prompt:
          'If the line between science and non-science shifts depending on who is defending their turf, can there still be a principled philosophical answer to the demarcation problem?',
        debateId: 'demarcation-boundary-work',
      },
      {
        prompt:
          'Labels like "science" confer authority, funding, and public trust — so who should have the power to decide where the boundary of legitimate science falls, and for what purposes?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'A key bridge between sociology of science and philosophical debates about demarcation.',
    sources: [
      {
        author: 'Thomas Gieryn',
        title: 'Cultural Boundaries of Science',
        year: '1999',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['merton-norms', 'karl-popper', 'lysenkoism-soviet-genetics'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'daston-galison-objectivity',
    slug: 'daston-galison-objectivity',
    title: 'Daston and Galison on the History of Objectivity',
    subtitle: 'Objectivity has changed its meaning over time',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'Historians Lorraine Daston and Peter Galison traced how scientific "objectivity" has meant different things in different periods — truth-to-nature, mechanical objectivity, and trained judgement — rather than a single timeless ideal.',
    longDescription:
      'Through the history of scientific atlases and images, Daston and Galison showed nineteenth-century scientists shifting from idealised "truth-to-nature" illustrations toward "mechanical objectivity" that minimised the observer\'s interpretive role (favouring photography), and later toward "trained judgement" that reintroduced expert interpretation. Their account complicates any simple idea that objectivity is a single fixed virtue science has steadily approached.',
    startYear: 2007,
    endYear: 2007,
    dateDisplay: '2007 (covering 18th–20th century practice)',
    approximateDate: false,
    transregional: true,
    places: [],
    people: ['lorraine-daston', 'peter-galison'],
    cultures: ['American', 'German'],
    disciplines: ['history of science'],
    themes: ['objectivity', 'scientific-images'],
    philosophicalQuestions: [
      {
        prompt:
          'Are scientific images and visualisations neutral records of evidence, or are they always, to some degree, constructed representations?',
        debateId: 'objectivity-values',
      },
      {
        prompt:
          'If what counted as a properly "objective" image changed from idealised type specimens, to raw mechanical reproduction, to trained expert judgement, is there still a single thing called scientific objectivity?',
        debateId: 'scientific-images-objectivity',
      },
    ],
    historicalSignificance:
      'One of the most influential recent works reshaping how historians and philosophers think about scientific objectivity as a historically variable practice, not a fixed ideal.',
    sources: [{ author: 'Lorraine Daston', title: 'Objectivity', year: '2007', type: 'secondary' }],
    relatedEntryIds: ['merton-norms', 'feminist-epistemology-idea', 'galileo-telescope'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'feminist-epistemology-idea',
    slug: 'feminist-epistemology-idea',
    title: 'Feminist Epistemology and Situated Knowledge',
    subtitle: 'Whose standpoint shapes what counts as objective?',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'Feminist philosophers of science, including Sandra Harding, Donna Haraway, and Lorraine Code, argued that knowers are always socially situated, and that acknowledging this can improve rather than undermine scientific objectivity.',
    longDescription:
      'Rather than rejecting objectivity, thinkers like Harding proposed "strong objectivity," arguing that making a researcher\'s social position and assumptions explicit, and including previously excluded standpoints, produces more rigorous, less parochial knowledge than a view that pretends to come from nowhere. Lorraine Code specifically challenged the traditional philosophical picture of an abstract, interchangeable, "featureless" knower — anyone, anywhere, reasoning from nowhere in particular. Code argued that knowers are always embodied and socially situated, and that this position shapes which questions get asked, which evidence gets noticed, and whose testimony gets trusted as credible. This tradition also documented concrete historical cases — including biased primate-behaviour and reproductive-biology research shaped by unexamined gender assumptions — where ignoring standpoint produced worse science.',
    startYear: 1986,
    endYear: 1991,
    dateDisplay: '1986–1991',
    approximateDate: false,
    transregional: true,
    places: [],
    people: ['sandra-harding', 'lorraine-code'],
    cultures: ['American'],
    disciplines: ['philosophy of science'],
    themes: ['objectivity', 'gender'],
    philosophicalQuestions: [
      {
        prompt:
          'Can acknowledging that all knowers are socially situated make science more objective rather than less?',
        debateId: 'feminist-epistemology',
      },
    ],
    historicalSignificance:
      "Reshaped philosophy of science's treatment of objectivity, values, and the social structure of scientific communities.",
    sources: [
      {
        author: 'Sandra Harding',
        title: 'The Science Question in Feminism',
        year: '1986',
        type: 'secondary',
      },
      {
        author: 'Lorraine Code',
        title: 'What Can She Know? Feminist Theory and the Construction of Knowledge',
        year: '1991',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['margaret-cavendish', 'maria-sibylla-merian', 'daston-galison-objectivity'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'ai-academic-knowledge',
    slug: 'ai-academic-knowledge',
    title: 'Generative AI and Academic Knowledge',
    subtitle: 'Authorship, accountability, and accuracy in machine-assisted research',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'The rapid adoption of large language models in research and writing has reopened long-standing questions about authorship, accountability, and evidence in a new, pressing form: who is responsible for a claim partly produced by a machine?',
    longDescription:
      'Generative AI systems can accelerate drafting, summarising, and literature review, but they can also produce fluent, confident, and entirely fabricated citations, and they are trained on data that embeds the biases and gaps of its sources. Their environmental cost and the often-invisible human labour involved in training and moderating them (data labelling, content moderation) rarely appear in the finished output. Unequal access to the most capable tools also raises the same old question of who gets to participate in knowledge production, in a new guise. None of this is entirely new: concerns about hidden labour, biased evidence, and contested authorship recur throughout the history of science. What is new is the scale, speed, and fluency with which an AI system can generate plausible-looking but unverified claims — which is why responsibility for checking and standing behind a claim is widely argued to remain with the named human author, whatever tools they used.',
    startYear: 2020,
    dateDisplay: '2020s–present',
    approximateDate: true,
    transregional: true,
    places: [],
    people: [],
    cultures: ['transnational'],
    disciplines: ['science policy', 'philosophy of science'],
    themes: [
      'ethics',
      'profession-and-identity',
      'objectivity',
      'exclusion-and-access',
      'artificial-intelligence',
      'digital-technology',
    ],
    philosophicalQuestions: [
      {
        prompt:
          'If an AI system drafts a claim or a citation, who is accountable when it turns out to be wrong — the tool, the company that built it, or the person who submitted it under their own name?',
        debateId: 'ethics-in-science',
      },
      {
        prompt:
          'Is using AI assistance a difference in degree from using a calculator, a spell-checker, or a research assistant — or a difference in kind?',
        debateId: 'discovery-invention-progress',
      },
    ],
    historicalSignificance:
      'A live, still-unsettled case that puts long-standing questions about authorship, hidden labour, evidence, and professional accountability under new and significant pressure.',
    commonMyth: 'That these are entirely new problems with no historical precedent.',
    historicalComplication:
      'Questions about uncredited labour (assistants, technicians, data workers), contested authorship, and trust in machine-produced evidence have close historical parallels — but the scale and fluency of generative AI, and the specific problem of confidently fabricated references, are genuinely new complications.',
    sources: [
      {
        author: 'Emily M. Bender, Timnit Gebru, Angelina McMillan-Major, Shmargaret Shmitchell',
        title: 'On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?',
        year: '2021',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['feminist-epistemology-idea', 'merton-norms'],
    confidence: 'established',
    contentStatus: 'complete',
  },
]
