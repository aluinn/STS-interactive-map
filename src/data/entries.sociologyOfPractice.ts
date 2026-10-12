import type { Entry } from '../types'

export const sociologyOfPracticeEntries: Entry[] = [
  {
    id: 'sociology-of-scientific-knowledge',
    slug: 'sociology-of-scientific-knowledge',
    title: 'Sociology of Scientific Knowledge',
    subtitle: 'Treating the content of knowledge, not just scientific institutions, as social',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      "From the 1970s, a new sociology of science argued that the actual content of scientific beliefs — not just the conduct of scientists — could be explained sociologically, breaking with Merton's earlier focus on institutional norms.",
    longDescription:
      'Where Robert Merton had studied the norms governing scientific conduct while leaving the truth of scientific claims to philosophers, SSK argued that social factors shape which theories get believed, not only how scientists behave. David Bloor\'s "strong programme" proposed that sociological explanation should apply symmetrically to both true and false beliefs, causally, impartially, and reflexively. This was a deliberate provocation to philosophy of science, and it opened the way for the more fine-grained, practice-focused studies (Edinburgh and Bath schools, laboratory ethnography) that followed.',
    startYear: 1970,
    endYear: 1980,
    dateDisplay: 'c. 1970s–1980s',
    approximateDate: true,
    transregional: true,
    scale: 'network',
    places: [{ name: 'University of Edinburgh', latitude: 55.9445, longitude: -3.1892 }],
    people: [],
    cultures: ['British'],
    disciplines: ['sociology of science'],
    themes: ['scientific-practice', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          "If sociological factors can explain why a belief was accepted, does that undermine the belief's claim to be true — or are explanation and justification simply different questions?",
        debateId: 'demarcation-boundary-work',
      },
    ],
    historicalSignificance:
      'Opened an entire research programme treating scientific knowledge itself, not only scientific institutions, as a proper object of sociological explanation.',
    commonMyth:
      'That the strong programme claims all beliefs are "equally true" or that truth does not exist.',
    historicalComplication:
      'The symmetry principle asks for the same *type* of explanation (social, causal) for both true and false beliefs — it is a methodological stance about explanation, not a claim that truth is meaningless or arbitrary.',
    sources: [
      {
        author: 'David Bloor',
        title: 'Knowledge and Social Imagery',
        year: '1976',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['merton-norms', 'edinburgh-bath-traditions', 'gieryn-boundary-work'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'edinburgh-bath-traditions',
    slug: 'edinburgh-bath-traditions',
    title: 'The Edinburgh and Bath Traditions',
    subtitle: 'Social interests versus negotiation during controversy',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      "Two closely related but distinct British sociology-of-science traditions: Edinburgh's attention to how social interests shape belief, and Bath's close study of how scientists negotiate what counts as a successful experimental replication during live controversies.",
    longDescription:
      'The Edinburgh school (Barry Barnes, David Bloor) emphasised broad social interests — professional, political, institutional — as explanatory resources for why scientists came to hold the beliefs they did. The Bath school (Harry Collins) instead focused closely on specific controversies, showing through case studies (notably disputes over replicating gravitational-wave and parapsychology experiments) that whether an experiment counted as a successful "replication" was itself negotiated, not simply read off the apparatus — Collins named this the "experimenter\'s regress". The two traditions overlap but disagree about how much weight to put on general social interests versus the fine-grained, local work of negotiation.',
    startYear: 1974,
    endYear: 1985,
    dateDisplay: 'c. 1974–1985',
    approximateDate: true,
    transregional: true,
    scale: 'network',
    places: [
      { name: 'University of Edinburgh', latitude: 55.9445, longitude: -3.1892 },
      { name: 'University of Bath', latitude: 51.3781, longitude: -2.3597 },
    ],
    people: [],
    cultures: ['British'],
    disciplines: ['sociology of science'],
    themes: ['scientific-practice', 'society-and-power'],
    philosophicalQuestions: [
      {
        prompt:
          'If whether an experiment "worked" has to be negotiated among scientists, how does any experimental controversy ever actually get settled?',
        debateId: 'entity-realism-hacking',
      },
    ],
    historicalSignificance:
      'Established two influential, still-debated templates for studying science sociologically: through broad social interests, or through the close ethnographic detail of specific controversies.',
    sources: [
      {
        author: 'Harry Collins',
        title: 'Changing Order: Replication and Induction in Scientific Practice',
        year: '1985',
        type: 'primary',
      },
    ],
    relatedEntryIds: [
      'sociology-of-scientific-knowledge',
      'pickering-practice-turn',
      'galileo-telescope',
    ],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'pickering-practice-turn',
    slug: 'pickering-practice-turn',
    title: "Pickering's Practice Turn",
    subtitle: 'From the content of belief to the doing of science',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'Andrew Pickering argued that studying science as practice — the real-time, often improvised work of getting instruments, theories, and phenomena to cooperate — reveals something that studies of belief and social interest alone miss.',
    longDescription:
      'In The Mangle of Practice (1995), Pickering described scientific work as a "dance of agency": researchers try something, meet unexpected resistance from the material world, adjust their theories, instruments, or goals in response, and try again — a temporally extended process of mutual adjustment between theory, apparatus, and phenomena, rather than a theory being logically applied to data that simply waits to confirm or refute it. This shifted attention from the content of scientific belief (SSK\'s focus) toward the material, skilled, often improvisational doing of research itself.',
    startYear: 1992,
    endYear: 1995,
    dateDisplay: '1992–1995',
    approximateDate: false,
    transregional: true,
    scale: 'laboratory',
    places: [],
    people: ['andrew-pickering'],
    cultures: ['British', 'American'],
    disciplines: ['sociology of science'],
    themes: ['scientific-practice'],
    philosophicalQuestions: [
      {
        prompt:
          'If scientific facts emerge from tinkering, resistance, and improvisation rather than a theory being straightforwardly applied, does that make those facts any less real?',
      },
    ],
    historicalSignificance:
      'One of the most influential frameworks for studying science as material practice rather than as a body of propositions, shaping laboratory studies for decades afterward.',
    sources: [
      {
        author: 'Andrew Pickering',
        title: 'The Mangle of Practice: Time, Agency, and Science',
        year: '1995',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['laboratory-ethnography', 'knorr-cetina-epistemic-cultures', 'ian-hacking'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'laboratory-ethnography',
    slug: 'laboratory-ethnography',
    title: 'Laboratory Ethnography',
    subtitle: 'Watching scientists work, like an anthropologist in the field',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      "Bruno Latour and Steve Woolgar spent nearly two years observing a neuroendocrinology laboratory as outside anthropologists, treating scientific fact-making itself — not just scientists' stated beliefs — as something that could be studied in situ.",
    longDescription:
      'Laboratory Life (1979) followed inscriptions — graphs, printouts, assay results — as they were produced, argued over, and gradually stabilised into accepted "facts", stripped of the contingent process that made them. The study showed tacit skills, informal routines, instrument quirks, and experimental failures as integral to how facts get made, not as noise to be filtered out of an idealised scientific method. This founded an entire genre of laboratory studies that treated the workbench, not just the published paper, as the primary site of scientific knowledge production.',
    startYear: 1975,
    endYear: 1979,
    dateDisplay: '1975–1979',
    approximateDate: false,
    transregional: false,
    scale: 'laboratory',
    latitude: 32.8601,
    longitude: -117.2381,
    places: [{ name: 'Salk Institute, La Jolla', latitude: 32.8601, longitude: -117.2381 }],
    people: ['bruno-latour', 'steve-woolgar'],
    cultures: ['French', 'British'],
    disciplines: ['sociology of science'],
    themes: ['scientific-practice'],
    philosophicalQuestions: [
      {
        prompt:
          'If a scientific "fact" only looks inevitable after the contingent process that produced it has been edited out of the published paper, what does that imply about how we should read scientific texts?',
        debateId: 'discovery-invention-progress',
      },
    ],
    historicalSignificance:
      'Founded laboratory ethnography as a method, directly shaping Actor-Network Theory and the broader material-practice turn in science studies.',
    sources: [
      {
        author: 'Bruno Latour and Steve Woolgar',
        title: 'Laboratory Life: The Construction of Scientific Facts',
        year: '1979',
        type: 'primary',
      },
    ],
    relatedEntryIds: [
      'pickering-practice-turn',
      'actor-network-theory',
      'knorr-cetina-epistemic-cultures',
    ],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'knorr-cetina-epistemic-cultures',
    slug: 'knorr-cetina-epistemic-cultures',
    title: "Knorr Cetina's Epistemic Cultures",
    subtitle: 'Different sciences make knowledge in genuinely different ways',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'Karin Knorr Cetina compared high-energy physics and molecular biology laboratories to argue that different scientific fields develop distinct "epistemic cultures" — different arrangements of machines, people, and practices for producing and warranting knowledge.',
    longDescription:
      'Where earlier laboratory studies often treated "the laboratory" as a single generic type of site, Knorr Cetina\'s comparative ethnography showed that a high-energy physics collaboration (large, hierarchical, machine-centred, with experiments planned years in advance) and a molecular biology lab (small, flexible, organism-centred, reactive to daily results) produce knowledge through genuinely different social and material arrangements. This complicated any single, generic account of "how science works," suggesting instead a plurality of epistemic cultures, each with its own logic.',
    startYear: 1999,
    endYear: 1999,
    dateDisplay: '1999',
    approximateDate: false,
    transregional: true,
    scale: 'laboratory',
    places: [],
    people: ['karin-knorr-cetina'],
    cultures: ['Austrian', 'German'],
    disciplines: ['sociology of science'],
    themes: ['scientific-practice'],
    philosophicalQuestions: [
      {
        prompt:
          'If different scientific fields make knowledge through genuinely different practices and logics, is there still one thing called "the scientific method"?',
        debateId: 'demarcation-boundary-work',
      },
    ],
    historicalSignificance:
      'Shifted laboratory studies from treating "the lab" as a generic category toward a comparative study of plural, field-specific epistemic cultures.',
    sources: [
      {
        author: 'Karin Knorr Cetina',
        title: 'Epistemic Cultures: How the Sciences Make Knowledge',
        year: '1999',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['pickering-practice-turn', 'laboratory-ethnography', 'cold-war-big-science'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'actor-network-theory',
    slug: 'actor-network-theory',
    title: 'Actor-Network Theory',
    subtitle: 'Networks of humans and nonhumans, symmetrically described',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'Actor-Network Theory, developed by Bruno Latour, Michel Callon, and John Law, describes scientific and technical achievements as networks holding together both human and nonhuman actors — scientists, funders, microbes, scallops, machines — treated with the same analytic vocabulary.',
    longDescription:
      "Callon's study of scallop domestication in St Brieuc Bay and fishermen's negotiations, and Latour's accounts of Pasteur's microbes and the Pasteurian network, treated nonhuman entities as actors that could resist, enrol, or destabilise a network alongside human ones — a deliberate methodological symmetry between people and things. ANT shifted attention from asking \"what do scientists believe, and why\" toward asking how heterogeneous networks of people, instruments, organisms, and institutions are built, stabilised, and sometimes fall apart. It remains contested: critics ask whether treating microbes and committees with the same vocabulary illuminates or flattens real differences between them.",
    startYear: 1984,
    endYear: 1987,
    dateDisplay: '1984–1987',
    approximateDate: true,
    transregional: true,
    scale: 'network',
    places: [],
    people: ['bruno-latour', 'michel-callon'],
    cultures: ['French'],
    disciplines: ['sociology of science'],
    themes: ['scientific-practice', 'relationality'],
    philosophicalQuestions: [
      {
        prompt:
          'Does describing microbes, machines, and committee members with the same analytic vocabulary illuminate how scientific networks actually hold together, or does it erase real differences between people and things?',
      },
    ],
    historicalSignificance:
      'One of the most widely applied (and widely contested) frameworks in science and technology studies, extending well beyond science into studies of technology, markets, and infrastructure.',
    sources: [
      { author: 'Bruno Latour', title: 'Science in Action', year: '1987', type: 'primary' },
      {
        author: 'Michel Callon',
        title:
          '"Some Elements of a Sociology of Translation: Domestication of the Scallops and the Fishermen of St Brieuc Bay"',
        year: '1986',
        type: 'primary',
      },
    ],
    relatedEntryIds: [
      'laboratory-ethnography',
      'social-construction-of-technology',
      'haraway-cyborg-making-kin',
    ],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'bourdieu-forms-of-capital',
    slug: 'bourdieu-forms-of-capital',
    title: "Bourdieu's Forms of Capital",
    subtitle: 'Economic, cultural, social, and symbolic capital in scientific life',
    kind: 'idea',
    period: 'philosophy-of-science',
    summary:
      'Pierre Bourdieu argued that advantage operates through several convertible forms of capital, not money alone — a framework widely applied to explain unequal access to scientific careers, credibility, and authority.',
    longDescription:
      'Bourdieu distinguished economic capital (money and property) from cultural capital — which can be embodied (dispositions, ways of speaking, "feel" for a field, acquired over years), objectified (books, instruments, credentials-as-objects), or institutionalised (degrees, titles) — from social capital (networks and connections) and symbolic capital (recognition, prestige, honour). Crucially, these forms convert into one another: a prestigious degree (institutionalised cultural capital) opens access to a well-funded laboratory (economic capital) and a well-connected supervisor (social capital), which in turn builds a reputation (symbolic capital) that attracts further funding. Applied to science, this framework helps explain how advantages accumulate and compound across a career, not simply as merit rewarded but as capital converted and reinvested.',
    startYear: 1986,
    endYear: 1986,
    dateDisplay: '1986',
    approximateDate: false,
    transregional: true,
    scale: 'institution',
    places: [],
    people: ['pierre-bourdieu'],
    cultures: ['French'],
    disciplines: ['sociology'],
    themes: ['society-and-power', 'profession-and-identity'],
    philosophicalQuestions: [
      {
        prompt:
          'If scientific authority depends partly on convertible forms of capital rather than on evidence alone, how should we weigh a claim made by someone with little institutional standing?',
        debateId: 'what-makes-a-scientist',
      },
    ],
    historicalSignificance:
      'Provides the conceptual vocabulary behind much later work on unequal access to scientific careers, credentialing, and credit — including discussions of the "leaky pipeline" elsewhere in this atlas.',
    sources: [
      {
        author: 'Pierre Bourdieu',
        title: '"The Forms of Capital"',
        year: '1986',
        type: 'primary',
      },
    ],
    relatedEntryIds: ['professionalisation-of-science', 'assetisation-technoscientific-rent'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'assetisation-technoscientific-rent',
    slug: 'assetisation-technoscientific-rent',
    title: 'Assetisation and Technoscientific Rent',
    subtitle: 'Turning knowledge into a continuing source of income',
    kind: 'idea',
    period: 'environmental-contemporary',
    summary:
      'Scholars of "assetisation" trace how a piece of knowledge or a technical system — a gene sequence, a dataset, an algorithm, a piece of farm equipment — can be turned into a legally and technically controlled asset that generates ongoing income or control for its owner, distinct from ordinary profit from selling a product.',
    longDescription:
      'The basic sequence runs: a thing or resource (a patented molecule, a curated database, a cell line, a piece of software) is made into a legally and technically controlled asset, from which the owner can then extract continuing rent — recurring income or leverage — often for far longer than any one sale would provide. Patents on pharmaceutical compounds, proprietary genomic databases, cell lines used in research, algorithms licensed to other companies, app-store commission structures, and agricultural machinery sold with software locks restricting independent repair are all discussed as cases of technoscientific rent extraction. This differs from ordinary profit, which comes from selling a good or service once; rentiership instead comes from continuing to control access to or use of an asset after it has been created.',
    startYear: 1980,
    endYear: 2020,
    dateDisplay: 'c. 1980s–present',
    approximateDate: true,
    transregional: true,
    scale: 'globe',
    places: [],
    people: [],
    cultures: ['transnational'],
    disciplines: ['science policy', 'economic sociology'],
    themes: ['assetisation', 'society-and-power', 'ethics', 'platform-power'],
    philosophicalQuestions: [
      {
        prompt:
          'When a scientific discovery is turned into a rent-generating asset rather than sold outright or shared openly, who bears the cost of that choice, and who benefits?',
        debateId: 'ethics-in-science',
      },
    ],
    historicalSignificance:
      'Offers a vocabulary for understanding a major recent shift in how scientific and technical knowledge generates economic value — important context for debates over open science, intellectual property, and platform power.',
    sources: [
      {
        author: 'Kean Birch and Fabian Muniesa (eds.)',
        title: 'Assetization: Turning Things into Assets in Technoscientific Capitalism',
        year: '2020',
        type: 'secondary',
      },
    ],
    relatedEntryIds: [
      'bourdieu-forms-of-capital',
      'open-access-and-inequality',
      'human-genome-project-bermuda-principles',
    ],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
]
