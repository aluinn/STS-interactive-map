import type { Journey } from '../types'

export const journeys: Journey[] = [
  {
    id: 'babylon-to-cosmology',
    slug: 'babylon-to-cosmology',
    title: 'From Babylonian Astronomy to Modern Cosmology',
    summary:
      'How millennia of celestial record-keeping, starting long before Greece, built the foundations of mathematical astronomy.',
    themes: ['non-western-origins', 'cosmology'],
    stops: [
      {
        entryId: 'babylonian-astronomy',
        caption:
          'Babylonian scribes track planetary motion with pure arithmetic, no physical model required.',
      },
      {
        entryId: 'ptolemy',
        caption:
          'Hellenistic Alexandria inherits and mathematises Babylonian data into a geometric system.',
      },
      {
        entryId: 'copernicus',
        caption: 'A Polish astronomer relocates the Sun to the centre, seeking simpler harmony.',
      },
      {
        entryId: 'kepler',
        caption: "Tycho's precise data lets Kepler trade circles for ellipses.",
      },
      {
        entryId: 'newton',
        caption: 'Gravitation unifies the heavens and the Earth under one law.',
      },
    ],
  },
  {
    id: 'aristotle-to-newton',
    slug: 'aristotle-to-newton',
    title: "From Aristotle's Cosmos to Newton's Universe",
    summary:
      'Two thousand years separate a teleological, qualitative cosmos from a mathematical, mechanical one.',
    themes: ['cosmology', 'scientific-change'],
    stops: [
      {
        entryId: 'aristotle',
        caption: 'A cosmos ordered by purpose, with perfect unchanging heavens.',
      },
      {
        entryId: 'scholasticism',
        caption: 'Medieval scholars quietly stretch Aristotelian physics toward its limits.',
      },
      {
        entryId: 'galileo',
        caption:
          'Telescopic observation and new mechanics directly contradict Aristotelian claims.',
      },
      {
        entryId: 'descartes',
        caption: 'A mechanical philosophy replaces purposive causes with matter in motion.',
      },
      {
        entryId: 'newton',
        caption:
          'A single mathematical law of gravitation replaces the entire Aristotelian cosmos.',
      },
    ],
  },
  {
    id: 'translation-worlds',
    slug: 'translation-worlds',
    title: 'How Knowledge Travelled Through Scholarly Worlds',
    summary:
      'Greek, Islamic, Byzantine, European, and Chinese scholarly worlds each transformed the knowledge that passed through them.',
    themes: ['translation-and-transmission', 'non-western-origins'],
    stops: [
      {
        entryId: 'alexandria-library',
        caption:
          'Hellenistic Alexandria gathers Greek and Egyptian learning under royal patronage.',
      },
      {
        entryId: 'baghdad-translation-movement',
        caption: 'Baghdad scholars translate, correct, and extend Greek texts into Arabic.',
      },
      {
        entryId: 'ibn-al-haytham',
        caption:
          'A new experimental optics emerges from within this translated and extended tradition.',
      },
      {
        entryId: 'medieval-universities',
        caption:
          'Latin Europe receives this knowledge back, transformed, through Islamic Iberia and Sicily.',
      },
      {
        entryId: 'chinese-astronomy-technology',
        caption:
          'Meanwhile, an entirely separate Chinese tradition develops astronomy and technology on its own terms.',
      },
      {
        entryId: 'jesuit-china-exchange',
        caption:
          'Jesuit missionaries and Qing scholars exchange — and contest — astronomical techniques.',
      },
    ],
  },
  {
    id: 'copernican-revolution',
    slug: 'copernican-revolution',
    title: 'Copernicus, Kepler, Galileo, Descartes, and Newton',
    summary:
      'The century-and-a-half reconstruction of physics and cosmology usually called the Scientific Revolution.',
    themes: ['cosmology', 'scientific-change'],
    stops: [
      {
        entryId: 'copernicus',
        caption: 'A heliocentric alternative, argued mainly on grounds of simplicity.',
      },
      {
        entryId: 'tycho-brahe',
        caption: 'Unprecedented observational precision, without full commitment to heliocentrism.',
      },
      {
        entryId: 'kepler',
        caption: "Tycho's data reveals the planets move in ellipses, not circles.",
      },
      {
        entryId: 'galileo',
        caption:
          'The telescope turns circumstantial cosmological evidence into a public controversy.',
      },
      {
        entryId: 'descartes',
        caption: 'A new mechanical vocabulary attempts to explain how any of this motion works.',
      },
      { entryId: 'newton', caption: 'Universal gravitation ties it all together mathematically.' },
    ],
  },
  {
    id: 'what-makes-science-scientific',
    slug: 'what-makes-science-scientific',
    title: 'What Makes Science Scientific?',
    summary:
      'From Baconian induction through falsifiability to paradigms — a century of philosophers asking what separates science from everything else.',
    themes: ['method', 'demarcation'],
    stops: [
      {
        entryId: 'francis-bacon',
        caption: 'Organised collective observation as the route to reliable knowledge.',
      },
      {
        entryId: 'david-hume',
        caption: 'A devastating logical problem: induction cannot justify itself.',
      },
      {
        entryId: 'logical-positivism-vienna-circle',
        caption: 'An attempt to found meaning itself on empirical verification.',
      },
      {
        entryId: 'karl-popper',
        caption: 'Falsifiability, not verification, as the mark of science.',
      },
      {
        entryId: 'thomas-kuhn',
        caption: 'Normal science, crisis, and revolution complicate any single clean criterion.',
      },
      {
        entryId: 'gieryn-boundary-work',
        caption: 'Perhaps the boundary is drawn strategically, not discovered philosophically.',
      },
    ],
  },
  {
    id: 'are-successful-theories-true',
    slug: 'are-successful-theories-true',
    title: 'Are Successful Theories True?',
    summary:
      'The realism debate: does predictive success mean a theory describes reality, or just that it works?',
    themes: ['realism'],
    stops: [
      {
        entryId: 'ptolemy',
        caption: 'A model that predicts well, while its author doubts its literal truth.',
      },
      {
        entryId: 'newton',
        caption: 'Spectacular success, with a mechanism (gravity) nobody could explain.',
      },
      {
        entryId: 'hilary-putnam',
        caption:
          'The no-miracles argument: such success would be a miracle if the theory were not roughly true.',
      },
      {
        entryId: 'larry-laudan',
        caption:
          'A long list of past successful theories later judged false undercuts that argument.',
      },
      {
        entryId: 'bas-van-fraassen',
        caption: 'Perhaps we only need theories to be right about what we can observe.',
      },
      {
        entryId: 'ian-hacking',
        caption:
          'Or perhaps reliably using unobservable entities is evidence enough that they exist.',
      },
    ],
  },
  {
    id: 'who-was-allowed-to-know',
    slug: 'who-was-allowed-to-know',
    title: 'Who Was Allowed to Make Scientific Knowledge?',
    summary:
      'Formal institutions excluded most people from recognised science — yet knowledge was still made outside their walls.',
    themes: ['exclusion-and-access', 'gender'],
    stops: [
      {
        entryId: 'royal-society',
        caption:
          'An institution built on witnessing and credibility — but whose testimony counted?',
      },
      {
        entryId: 'margaret-cavendish',
        caption: 'A published natural philosopher, permitted one visit, never membership.',
      },
      {
        entryId: 'maria-sibylla-merian',
        caption: 'Workshop-trained fieldwork that university science had no place for.',
      },
      {
        entryId: 'mary-somerville',
        caption:
          'A self-taught synthesiser whose work prompted a new word for a role she could never formally hold.',
      },
      {
        entryId: 'feminist-epistemology-idea',
        caption:
          'A later philosophical framework for understanding what this exclusion actually cost.',
      },
    ],
  },
  {
    id: 'craft-instruments-technicians',
    slug: 'craft-instruments-technicians',
    title: 'Craft, Instruments, and Invisible Technicians',
    summary:
      'Behind celebrated discoveries sits unglamorous, often uncredited skill: glassblowers, assistants, instrument-makers, informants.',
    themes: ['craft-and-instruments'],
    stops: [
      {
        entryId: 'ibn-al-haytham',
        caption: 'Careful apparatus, not just theory, makes a new optics possible.',
      },
      {
        entryId: 'galileo-telescope',
        caption:
          'An instrument that had to earn trust before its observations could count as evidence.',
      },
      {
        entryId: 'tycho-brahe',
        caption: 'A large staff, large instruments, and large funding behind "his" observations.',
      },
      {
        entryId: 'james-watt-steam',
        caption: 'Precision metalworking by other hands turns an idea into a usable machine.',
      },
      {
        entryId: 'maria-sibylla-merian',
        caption:
          "Enslaved and Indigenous informants' knowledge, rarely credited by name, underlies published natural history.",
      },
    ],
  },
  {
    id: 'science-and-empire',
    slug: 'science-and-empire',
    title: 'Science and Empire',
    summary:
      'Surveying, cataloguing, and administering empire was itself a major driver — and user — of scientific knowledge.',
    themes: ['empire-and-trade'],
    stops: [
      {
        entryId: 'jesuit-china-exchange',
        caption: 'Missionary science as a tool of access and influence at an imperial court.',
      },
      {
        entryId: 'congo-resource-extraction',
        caption: 'Genuine scientific surveying placed directly in service of violent extraction.',
      },
      {
        entryId: 'bengal-famine-science',
        caption:
          'Colonial statistical infrastructure fails to prevent catastrophe when political priorities override it.',
      },
      {
        entryId: 'colonial-korea-science',
        caption:
          'Agricultural science and infrastructure organised to extract, not to benefit, the colonised population.',
      },
      {
        entryId: 'liebig-fray-bentos',
        caption:
          'Laboratory chemistry reorganises land and labour across an ocean to feed industrial Europe.',
      },
    ],
  },
  {
    id: 'darwin-professionalisation',
    slug: 'darwin-professionalisation',
    title: 'Darwin, Professionalisation, and the Changing Scientist',
    summary:
      'The word "scientist" and the profession it named emerged in the same decades as Darwinian biology.',
    themes: ['profession-and-identity'],
    stops: [
      {
        entryId: 'mary-somerville',
        caption: 'A synthesiser of physical science whose work prompts a new professional label.',
      },
      {
        entryId: 'word-scientist',
        caption: 'Whewell names a role that older vocabulary could no longer capture.',
      },
      {
        entryId: 'darwin',
        caption:
          'A wealthy gentleman naturalist, not yet a salaried professional, builds a career-defining theory.',
      },
      {
        entryId: 'alfred-russel-wallace',
        caption:
          'A field-collecting naturalist of modest means reaches the same theory independently.',
      },
      {
        entryId: 'huxley',
        caption:
          'A combative public defender who also builds biology into a credentialed profession.',
      },
    ],
  },
  {
    id: 'science-in-war',
    slug: 'science-in-war',
    title: 'Science in War',
    summary:
      'Chemistry, physics, and the lives of individual researchers were reshaped by two world wars.',
    themes: ['war-and-science'],
    stops: [
      {
        entryId: 'haber-bosch',
        caption: 'A discovery that feeds nations also frees them to make explosives.',
      },
      {
        entryId: 'haber-chemical-warfare',
        caption: 'The same chemist personally directs the first large-scale gas attacks.',
      },
      {
        entryId: 'moseley',
        caption:
          'A brilliant young physicist is killed in the trenches he should perhaps never have reached.',
      },
      {
        entryId: 'manhattan-project',
        caption: 'Secrecy, scale, and state power reorganise physics entirely.',
      },
      {
        entryId: 'vannevar-bush',
        caption: 'Wartime organisation becomes the template for postwar science funding.',
      },
    ],
  },
  {
    id: 'cold-war-big-science-journey',
    slug: 'cold-war-big-science-journey',
    title: 'Cold War Funding and Big Science',
    summary:
      'Military rivalry funded research whose consequences reached far beyond the battlefield.',
    themes: ['big-science', 'war-and-science'],
    stops: [
      {
        entryId: 'vannevar-bush',
        caption: 'A postwar blueprint for state-funded, university-based basic research.',
      },
      {
        entryId: 'cold-war-big-science',
        caption: 'Money, manpower, machines, media, and the military converge.',
      },
      {
        entryId: 'plate-tectonics',
        caption:
          'Naval survey funding unexpectedly transforms an entirely civilian science: geology.',
      },
      {
        entryId: 'thomas-kuhn',
        caption:
          'A new philosophy of scientific revolution emerges from, and helps explain, episodes like this one.',
      },
    ],
  },
  {
    id: 'objectivity-values-feminist-critique',
    slug: 'objectivity-values-feminist-critique',
    title: 'Objectivity, Values, and Feminist Critique',
    summary:
      'What "objectivity" has meant has changed historically — and whose standpoint it excluded is not incidental to that history.',
    themes: ['objectivity', 'gender'],
    stops: [
      {
        entryId: 'boyle',
        caption:
          'Early experimental "facts" are established through witnessing — but whose testimony counted as credible?',
      },
      {
        entryId: 'margaret-cavendish',
        caption: 'An excluded critic who challenged the very program doing the excluding.',
      },
      {
        entryId: 'daston-galison-objectivity',
        caption:
          'A history showing that "objectivity" itself has changed meaning across centuries.',
      },
      {
        entryId: 'feminist-epistemology-idea',
        caption:
          'A philosophical case that situated knowledge can strengthen, not weaken, objectivity.',
      },
      {
        entryId: 'heather-douglas',
        caption: 'Values are not a contaminant to eliminate but a responsibility to manage well.',
      },
    ],
  },
  {
    id: 'environmental-science-journey',
    slug: 'environmental-science-journey',
    title: 'Environmental Science from Rachel Carson to Climate Controversy',
    summary:
      'A single pattern — acting under uncertainty, and resisting manufactured doubt — recurs across six decades.',
    themes: ['evidence-and-action'],
    stops: [
      {
        entryId: 'rachel-carson-silent-spring',
        caption: 'A case for precaution before every causal mechanism is fully settled.',
      },
      {
        entryId: 'climate-science-scepticism',
        caption:
          'Decades later, the same tactics used to discredit Carson resurface against climate science.',
      },
      {
        entryId: 'heather-douglas',
        caption:
          'A philosophical framework for how values legitimately shape acting under scientific uncertainty.',
      },
    ],
  },
  {
    id: 'experts-disagreement-policy',
    slug: 'experts-disagreement-policy',
    title: 'Experts, Disagreement, and Public Policy',
    summary:
      'When should the public trust scientific consensus, and how can it tell real uncertainty from manufactured doubt?',
    themes: ['expertise-and-policy'],
    stops: [
      {
        entryId: 'john-snow-cholera',
        caption:
          'Acting on strong but mechanistically incomplete evidence, against prevailing expert opinion.',
      },
      {
        entryId: 'bengal-famine-science',
        caption:
          'Even good data and scientific infrastructure can be overridden by political priorities.',
      },
      {
        entryId: 'climate-science-scepticism',
        caption: 'An organised campaign manufactures the appearance of scientific disagreement.',
      },
      {
        entryId: 'gieryn-boundary-work',
        caption:
          'How the boundary between science and non-science gets drawn is itself a contested, strategic act.',
      },
    ],
  },
  {
    id: 'who-gets-to-be-a-scientist',
    slug: 'who-gets-to-be-a-scientist',
    title: 'Who Gets to Be a Scientist?',
    summary:
      "Three answers to one question — a philosopher's method, a historian's professional identity, and a sociologist's community norms — traced through the people and institutions that shaped them.",
    themes: ['profession-and-identity', 'method', 'demarcation'],
    stops: [
      {
        entryId: 'natural-philosophy',
        caption: 'Before "scientist" existed, investigators of nature were natural philosophers.',
      },
      {
        entryId: 'mary-somerville',
        caption: 'A synthesiser of physical science whose work prompted a new professional label.',
      },
      {
        entryId: 'word-scientist',
        caption: 'Whewell names a role that older vocabulary could no longer capture.',
      },
      {
        entryId: 'professionalisation-of-science',
        caption:
          'Paid posts, training, and societies turn a pursuit into a profession — unevenly, and not for everyone.',
      },
      {
        entryId: 'scientific-societies',
        caption:
          'Specialised institutions take over the work of organising and certifying knowledge.',
      },
      {
        entryId: 'merton-norms',
        caption:
          'A sociologist proposes the shared ethos that is supposed to hold the community together.',
      },
      {
        entryId: 'gieryn-boundary-work',
        caption:
          'And another shows that the boundary of "science" is drawn strategically, not just discovered.',
      },
    ],
  },
  {
    id: 'knowledge-to-practice',
    slug: 'knowledge-to-practice',
    title: 'From Scientific Knowledge to Scientific Practice',
    summary:
      'A shift in how science studies itself: from treating knowledge as a body of belief to treating it as a temporal, material, skilled, and often improvised practice.',
    themes: ['scientific-practice'],
    stops: [
      {
        entryId: 'sociology-of-scientific-knowledge',
        caption:
          'A new sociology insists even the content of belief, not just scientific conduct, is explicable.',
      },
      {
        entryId: 'edinburgh-bath-traditions',
        caption:
          'Two schools disagree about whether broad social interests or close negotiation explains belief.',
      },
      {
        entryId: 'pickering-practice-turn',
        caption: 'Attention shifts from what scientists believe to what scientists actually do.',
      },
      {
        entryId: 'laboratory-ethnography',
        caption: 'An anthropologist in the lab watches facts get made, not just reported.',
      },
      {
        entryId: 'knorr-cetina-epistemic-cultures',
        caption: 'Different sciences, it turns out, make knowledge in genuinely different ways.',
      },
      {
        entryId: 'actor-network-theory',
        caption:
          'And finally, networks of humans and nonhumans, described with the same vocabulary.',
      },
    ],
  },
  {
    id: 'who-counts-as-expert',
    slug: 'who-counts-as-expert',
    title: 'Who Gets to Count as an Expert?',
    summary:
      'From an idealised institutional ethos to the lived, contested reality of whose knowledge counts — and whose credit gets recognised.',
    themes: ['expertise-and-activism', 'society-and-power'],
    stops: [
      {
        entryId: 'merton-norms',
        caption: 'A sociologist proposes the ethos that is supposed to make science trustworthy.',
      },
      {
        entryId: 'gieryn-boundary-work',
        caption:
          'But the boundary around legitimate science is drawn strategically, not simply found.',
      },
      {
        entryId: 'brian-wynne-cumbrian-sheep-farmers',
        caption:
          "Farmers' practical knowledge proves more reliable than official models — and is dismissed anyway.",
      },
      {
        entryId: 'aids-activism-treatment-expertise',
        caption:
          'Patients without credentials acquire real expertise and change how research gets designed.',
      },
      {
        entryId: 'patient-organisations-research-in-the-wild',
        caption: 'Patient groups steer research funding and priorities.',
      },
      {
        entryId: 'collins-evans-expertise',
        caption:
          'One framework distinguishes contributory, interactional and experience-based expertise.',
        stageQuestion: 'How can a non-specialist decide whom to trust?',
      },
      {
        entryId: 'flint-water-community-science',
        caption: "Residents' evidence is doubted until outside experts confirm it.",
      },
      {
        entryId: 'franklin-wu-credit-and-exclusion',
        caption:
          'And two women whose experimental work was essential go under-credited all the same.',
      },
    ],
  },
  {
    id: 'can-technology-be-political',
    slug: 'can-technology-be-political',
    title: 'Can Technology Be Political?',
    summary:
      'From a famous theory, through a famous (and disputed) example, to a live case of a controversial technology under review.',
    themes: ['technology-and-politics'],
    stops: [
      {
        entryId: 'social-construction-of-technology',
        caption:
          "A technology's design is shaped by competing social groups, not efficiency alone.",
      },
      {
        entryId: 'winner-artifacts-have-politics',
        caption: 'Winner argues some artefacts actively embody political arrangements.',
      },
      {
        entryId: 'robert-moses-bridges',
        caption: 'His most famous example turns out to be more disputed than its fame suggests.',
      },
      {
        entryId: 'agricultural-mechanization-labour-politics',
        caption:
          'Two mechanisation cases show labour politics embedded in "efficient" technical choices.',
      },
      {
        entryId: 'collingridge-dilemma',
        caption: 'Early control is easy but blind; late control is informed but often too late.',
      },
      {
        entryId: 'spice-geoengineering-project',
        caption:
          'A real project tests whether "responsible innovation" can hold up under commercial pressure.',
      },
    ],
  },
  {
    id: 'discovery-to-asset',
    slug: 'discovery-to-asset',
    title: 'From Discovery to Asset',
    summary:
      'How knowledge becomes property, and property becomes a source of continuing income and control.',
    themes: ['assetisation'],
    stops: [
      {
        entryId: 'bourdieu-forms-of-capital',
        caption:
          'A framework for how advantage accumulates and converts between economic, cultural, and social forms.',
      },
      {
        entryId: 'assetisation-technoscientific-rent',
        caption: 'A thing or resource is made into a controlled asset, generating continuing rent.',
      },
      {
        entryId: 'human-genome-project-bermuda-principles',
        caption:
          'An unusually radical commitment to openness, made partly to pre-empt that very logic.',
      },
      {
        entryId: 'open-access-and-inequality',
        caption: 'Even "open" publishing has its own, differently distributed costs.',
      },
      {
        entryId: 'triple-helix-model',
        caption:
          'And universities themselves start acting entrepreneurially, blurring public knowledge and private gain.',
      },
    ],
  },
  {
    id: 'is-open-science-open',
    slug: 'is-open-science-open',
    title: 'Is Open Science Really Open?',
    summary:
      'From a secret anagram to a citizen-science platform — a history of priority, publication, and who actually gets to participate.',
    themes: ['open-science'],
    stops: [
      {
        entryId: 'galileo-anagram-priority',
        caption: 'Claiming priority while keeping the actual discovery secret.',
      },
      {
        entryId: 'henry-oldenburg-philosophical-transactions',
        caption:
          'Publication offers an alternative: prove priority by publishing openly and promptly.',
      },
      {
        entryId: 'human-genome-project-bermuda-principles',
        caption:
          "A radical twenty-four-hour data-release commitment, unusually fast even by today's standards.",
      },
      {
        entryId: 'open-access-and-inequality',
        caption: 'But paying to publish openly creates a new kind of unevenness.',
      },
      {
        entryId: 'galaxy-zoo-citizen-science',
        caption: 'And ordinary volunteers turn out to produce expert-grade scientific data.',
      },
    ],
  },
  {
    id: 'gender-metaphor-representation',
    slug: 'gender-metaphor-representation',
    title: 'Gender, Metaphor, and Scientific Representation',
    summary:
      'How gendered language and exclusion have shaped both who gets to produce scientific knowledge and how that knowledge gets described.',
    themes: ['gender-and-representation'],
    stops: [
      {
        entryId: 'margaret-cavendish',
        caption: 'A published natural philosopher, excluded from the institution she critiqued.',
      },
      {
        entryId: 'maria-sibylla-merian',
        caption: 'Rigorous fieldwork, pursued entirely outside university science.',
      },
      {
        entryId: 'emily-martin-egg-and-sperm',
        caption:
          "Even cell biology's textbook language turns out to carry gendered cultural assumptions.",
      },
      {
        entryId: 'feminist-epistemology-idea',
        caption:
          'A philosophical case that situated knowledge can make science more rigorous, not less.',
      },
      {
        entryId: 'daston-galison-objectivity',
        caption:
          'And the standards for a trustworthy scientific image turn out to have a history too.',
      },
    ],
  },
  {
    id: 'local-knowledge-global-science',
    slug: 'local-knowledge-global-science',
    title: 'Local Knowledge in a Global Scientific World',
    summary:
      'Technical knowledge that developed outside European institutions, and the uneven networks through which knowledge actually circulates.',
    themes: ['global-knowledge-networks'],
    stops: [
      {
        entryId: 'heterarchical-scientific-networks',
        caption:
          'Knowledge moves through many connected centres, not outward from one — but not evenly.',
      },
      {
        entryId: 'west-african-ironsmithing',
        caption:
          'Sophisticated metallurgical knowledge, transmitted by apprenticeship rather than text.',
      },
      {
        entryId: 'tuareg-salt-production-kawar',
        caption:
          'Technical and navigational knowledge distributed across a trans-Saharan trade network.',
      },
      {
        entryId: 'cotton-cultivation-uganda',
        caption:
          'Colonial agricultural science reorganises, and partly overrides, existing local knowledge.',
      },
      {
        entryId: 'mobile-money-east-africa',
        caption: 'A homegrown digital innovation that matured in East Africa before anywhere else.',
      },
      {
        entryId: 'trickle-down-science',
        caption:
          'And a critical question: does research directed by wealthy institutions automatically benefit everyone else?',
      },
    ],
  },
  {
    id: 'governments-direct-innovation',
    slug: 'governments-direct-innovation',
    title: 'How Governments Try to Direct Innovation',
    summary:
      'Four competing models for how research funding should relate to real-world innovation — and why none of them is a simple, automatic pipeline.',
    themes: ['innovation-policy'],
    stops: [
      {
        entryId: 'linear-model-of-innovation',
        caption:
          'The postwar assumption: fund basic research, and useful applications will follow.',
      },
      {
        entryId: 'mode-2-knowledge-production',
        caption:
          'A challenge: knowledge is increasingly produced in context, across many institutions at once.',
      },
      {
        entryId: 'triple-helix-model',
        caption: "Universities, industry, and government start taking on each other's roles.",
      },
      {
        entryId: 'mission-oriented-innovation',
        caption:
          'A newer approach: let government actively direct investment toward chosen social goals.',
      },
      {
        entryId: 'science-policy-ecology',
        caption:
          'And behind all of it, a fragmented ecology of brokers, each shaping whose evidence gets heard.',
      },
    ],
  },
]
