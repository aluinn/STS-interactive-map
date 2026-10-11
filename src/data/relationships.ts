import type { Relationship } from '../types'

// Every relationship here is grounded in documented historical connection,
// transmission, or explicit philosophical response. We deliberately do NOT
// draw a line just because two entries share a topic or period — see
// CONTENT_GUIDE.md. Thematic-only similarity is expressed through shared
// `themes`/`relatedEntryIds` on entries, not through a Relationship edge.

export const relationships: Relationship[] = [
  {
    id: 'r1',
    sourceId: 'babylonian-astronomy',
    targetId: 'ptolemy',
    type: 'influenced',
    summary:
      'Ptolemy incorporated Babylonian numerical parameters and eclipse records into the Almagest.',
    confidence: 'established',
  },
  {
    id: 'r2',
    sourceId: 'copernicus',
    targetId: 'ptolemy',
    type: 'challenged',
    summary:
      "Copernicus set out explicitly to replace Ptolemy's geocentric geometry with a heliocentric alternative.",
    confidence: 'established',
  },
  {
    id: 'r3',
    sourceId: 'pythagoras',
    targetId: 'copernicus',
    type: 'influenced',
    summary:
      "Copernicus's preference for simplicity and harmonious order drew on a Pythagorean intellectual inheritance.",
    confidence: 'likely',
  },
  {
    id: 'r4',
    sourceId: 'copernicus',
    targetId: 'kepler',
    type: 'influenced',
    summary: 'Kepler began as a committed Copernican, seeking to refine the heliocentric model.',
    confidence: 'established',
  },
  {
    id: 'r5',
    sourceId: 'tycho-brahe',
    targetId: 'kepler',
    type: 'taught',
    summary:
      "Kepler worked as Tycho's assistant and inherited his unmatched observational data after Tycho's death.",
    confidence: 'established',
  },
  {
    id: 'r6',
    sourceId: 'pythagoras',
    targetId: 'kepler',
    type: 'influenced',
    summary: "Kepler's search for cosmic harmony explicitly drew on Pythagorean number-mysticism.",
    confidence: 'established',
  },
  {
    id: 'r7',
    sourceId: 'kepler',
    targetId: 'copernicus',
    type: 'replaced',
    summary:
      "Kepler's elliptical orbits superseded the uniform circular motion Copernicus had retained.",
    confidence: 'established',
  },
  {
    id: 'r8',
    sourceId: 'galileo',
    targetId: 'aristotle',
    type: 'challenged',
    summary:
      "Galileo's telescopic findings and mechanics directly contradicted Aristotelian claims about the heavens and motion.",
    confidence: 'established',
  },
  {
    id: 'r9',
    sourceId: 'aristotle',
    targetId: 'democritus',
    type: 'criticised',
    summary:
      "Aristotle rejected atomism's void and lack of purposive causation in his own Physics.",
    confidence: 'established',
  },
  {
    id: 'r10',
    sourceId: 'ibn-al-haytham',
    targetId: 'galileo-telescope',
    type: 'influenced',
    summary:
      "Ibn al-Haytham's experimental optics and camera obscura studies underlie the later European optical tradition that made the telescope possible.",
    confidence: 'likely',
  },
  {
    id: 'r11',
    sourceId: 'ibn-al-haytham',
    targetId: 'baghdad-translation-movement',
    type: 'travelled',
    summary:
      'Ibn al-Haytham moved between Basra, Baghdad, and Cairo within the wider world the translation movement had helped create.',
    confidence: 'likely',
  },
  {
    id: 'r12',
    sourceId: 'baghdad-translation-movement',
    targetId: 'medieval-universities',
    type: 'translated',
    summary:
      'Latin translations of Arabic versions and commentaries on Greek texts, often via Islamic Iberia and Sicily, supplied the core curriculum of early European universities.',
    confidence: 'established',
  },
  {
    id: 'r13',
    sourceId: 'alexandria-library',
    targetId: 'baghdad-translation-movement',
    type: 'preserved',
    summary:
      'Manuscripts descending from the Alexandrian scholarly tradition were among the texts translated and critically extended in Baghdad.',
    confidence: 'likely',
  },
  {
    id: 'r14',
    sourceId: 'house-of-wisdom',
    targetId: 'al-khwarizmi',
    type: 'funded',
    summary:
      "Caliphal patronage associated with the House of Wisdom supported al-Khwarizmi's astronomical and mathematical work.",
    confidence: 'contested',
  },
  {
    id: 'r15',
    sourceId: 'house-of-wisdom',
    targetId: 'baghdad-translation-movement',
    type: 'institutionalised',
    summary:
      'The House of Wisdom is traditionally described as providing an institutional home for the wider translation movement, though historians debate how formal that institution really was.',
    confidence: 'contested',
  },
  {
    id: 'r16',
    sourceId: 'baghdad-translation-movement',
    targetId: 'aristotle',
    type: 'translated',
    summary:
      "Scholars in Baghdad translated and critically annotated most of Aristotle's surviving corpus into Arabic.",
    confidence: 'established',
  },
  {
    id: 'r17',
    sourceId: 'baghdad-translation-movement',
    targetId: 'ptolemy',
    type: 'translated',
    summary:
      'The Almagest was translated into Arabic and became the basis for centuries of Islamic astronomical refinement.',
    confidence: 'established',
  },
  {
    id: 'r18',
    sourceId: 'medieval-universities',
    targetId: 'aristotle',
    type: 'institutionalised',
    summary:
      'Aristotelian natural philosophy became the core institutionalised curriculum of medieval European universities.',
    confidence: 'established',
  },
  {
    id: 'r19',
    sourceId: 'medieval-universities',
    targetId: 'scholasticism',
    type: 'institutionalised',
    summary:
      'Universities provided the institutional setting — faculties, disputation, degrees — in which scholastic method developed.',
    confidence: 'established',
  },
  {
    id: 'r20',
    sourceId: 'aristotle',
    targetId: 'scholasticism',
    type: 'influenced',
    summary:
      'Scholastic natural philosophy worked within, and against, an inherited Aristotelian framework.',
    confidence: 'established',
  },
  {
    id: 'r21',
    sourceId: 'scholasticism',
    targetId: 'galileo',
    type: 'influenced',
    summary:
      'Scholastic impetus theory, developed by Buridan and Oresme, anticipated elements of the inertial thinking Galileo later developed.',
    confidence: 'likely',
  },
  {
    id: 'r22',
    sourceId: 'leonardo-da-vinci',
    targetId: 'vesalius',
    type: 'influenced',
    summary:
      "Leonardo's dissection-based anatomical drawings were part of the broader turn toward direct observational anatomy that Vesalius brought to maturity.",
    confidence: 'likely',
  },
  {
    id: 'r23',
    sourceId: 'galileo',
    targetId: 'descartes',
    type: 'influenced',
    summary:
      "Galileo's mechanics fed directly into Descartes's mechanical philosophy of matter in motion.",
    confidence: 'established',
  },
  {
    id: 'r24',
    sourceId: 'democritus',
    targetId: 'descartes',
    type: 'influenced',
    summary:
      "Descartes's mechanical philosophy revived, in modified form, the ancient atomist project of explaining nature through matter and motion alone.",
    confidence: 'likely',
  },
  {
    id: 'r25',
    sourceId: 'margaret-cavendish',
    targetId: 'descartes',
    type: 'corresponded',
    summary:
      'Cavendish engaged critically with Cartesian and Hobbesian mechanical philosophy through published exchanges and the correspondence networks of her circle.',
    confidence: 'likely',
  },
  {
    id: 'r26',
    sourceId: 'descartes',
    targetId: 'boyle',
    type: 'influenced',
    summary:
      "Boyle's corpuscular chemistry developed within a broadly Cartesian mechanical framework, even as he departed from Descartes on method.",
    confidence: 'established',
  },
  {
    id: 'r27',
    sourceId: 'royal-society',
    targetId: 'boyle',
    type: 'institutionalised',
    summary:
      "The Royal Society institutionalised Boyle's experimental program as a model for collective scientific witnessing.",
    confidence: 'established',
  },
  {
    id: 'r28',
    sourceId: 'royal-society',
    targetId: 'newton',
    type: 'institutionalised',
    summary:
      'Newton served as President of the Royal Society, which published and championed the Principia.',
    confidence: 'established',
  },
  {
    id: 'r29',
    sourceId: 'royal-society',
    targetId: 'margaret-cavendish',
    type: 'excluded',
    summary:
      'Cavendish was permitted a single celebrated visit in 1667 but, as a woman, was never eligible for fellowship.',
    confidence: 'established',
  },
  {
    id: 'r30',
    sourceId: 'royal-society',
    targetId: 'margaret-cavendish',
    type: 'appropriated',
    summary:
      'The Society publicised her visit to enhance its own prestige while never extending her the institutional standing of a fellow.',
    confidence: 'contested',
  },
  {
    id: 'r31',
    sourceId: 'francis-bacon',
    targetId: 'royal-society',
    type: 'influenced',
    summary:
      "Bacon's vision of organised, collaborative natural history directly inspired the Royal Society's founders.",
    confidence: 'established',
  },
  {
    id: 'r32',
    sourceId: 'galileo',
    targetId: 'newton',
    type: 'influenced',
    summary:
      "Newton's laws of motion built directly on Galileo's work on inertia and falling bodies.",
    confidence: 'established',
  },
  {
    id: 'r33',
    sourceId: 'kepler',
    targetId: 'newton',
    type: 'influenced',
    summary:
      "Newton derived universal gravitation partly by showing it entailed Kepler's three laws of planetary motion.",
    confidence: 'established',
  },
  {
    id: 'r34',
    sourceId: 'newton',
    targetId: 'descartes',
    type: 'challenged',
    summary:
      "Newton's Principia argued that Cartesian vortex theory could not account for planetary motion as accurately as universal gravitation.",
    confidence: 'established',
  },
  {
    id: 'r35',
    sourceId: 'newton',
    targetId: 'laplace',
    type: 'influenced',
    summary:
      "Laplace's celestial mechanics extended Newtonian gravitation to resolve apparent long-term orbital instabilities.",
    confidence: 'established',
  },
  {
    id: 'r36',
    sourceId: 'chinese-astronomy-technology',
    targetId: 'zheng-he-voyages',
    type: 'supported',
    summary:
      "Chinese navigational and astronomical expertise underpinned the scale and precision of Zheng He's fleets.",
    confidence: 'likely',
  },
  {
    id: 'r37',
    sourceId: 'chinese-astronomy-technology',
    targetId: 'qing-gewu',
    type: 'influenced',
    summary:
      'Qing administrative science continued and adapted older Chinese astronomical and technical traditions.',
    confidence: 'likely',
  },
  {
    id: 'r38',
    sourceId: 'jesuit-china-exchange',
    targetId: 'qing-gewu',
    type: 'collaborated',
    summary:
      "Jesuit astronomers worked alongside Qing officials on calendar reform and cartography, each evaluating the other's methods.",
    confidence: 'likely',
  },
  {
    id: 'r39',
    sourceId: 'jesuit-china-exchange',
    targetId: 'chinese-astronomy-technology',
    type: 'extracted',
    summary:
      'Jesuit missionaries transmitted Chinese astronomical records and techniques back to Europe, often without full acknowledgement of their Chinese origin.',
    confidence: 'contested',
  },
  {
    id: 'r40',
    sourceId: 'petersburg-academy',
    targetId: 'lomonosov',
    type: 'funded',
    summary:
      'The state-funded Academy employed and supported Lomonosov, while he pushed it to admit more Russian-born scholars.',
    confidence: 'established',
  },
  {
    id: 'r41',
    sourceId: 'mary-somerville',
    targetId: 'whewell',
    type: 'influenced',
    summary:
      'Whewell\'s review of Somerville\'s On the Connexion of the Physical Sciences directly prompted his coining of "scientist."',
    confidence: 'established',
  },
  {
    id: 'r42',
    sourceId: 'mary-somerville',
    targetId: 'word-scientist',
    type: 'influenced',
    summary:
      "Somerville's synthetic, cross-disciplinary work was the immediate occasion for the new word.",
    confidence: 'established',
  },
  {
    id: 'r43',
    sourceId: 'whewell',
    targetId: 'darwin',
    type: 'influenced',
    summary:
      'Darwin explicitly framed the Origin\'s argument using Whewell\'s concept of a "consilience of inductions."',
    confidence: 'established',
  },
  {
    id: 'r44',
    sourceId: 'darwin',
    targetId: 'alfred-russel-wallace',
    type: 'independently-developed',
    summary:
      'Darwin and Wallace arrived at strikingly similar theories of natural selection independently, prompting a joint 1858 announcement.',
    confidence: 'established',
  },
  {
    id: 'r45',
    sourceId: 'darwin',
    targetId: 'huxley',
    type: 'influenced',
    summary:
      "Darwin's theory gave Huxley the scientific cause around which he built his public and institutional campaigns.",
    confidence: 'established',
  },
  {
    id: 'r46',
    sourceId: 'huxley',
    targetId: 'darwin',
    type: 'supported',
    summary:
      "Huxley became Darwin's most prominent public defender, debating critics on his behalf.",
    confidence: 'established',
  },
  {
    id: 'r47',
    sourceId: 'john-snow-cholera',
    targetId: 'great-stink-bazalgette',
    type: 'supported',
    summary:
      "Snow's waterborne-transmission evidence was largely sidelined at the time, but the sewer system Bazalgette built for other reasons also removed the contamination Snow had identified.",
    confidence: 'likely',
  },
  {
    id: 'r48',
    sourceId: 'haber-bosch',
    targetId: 'haber-chemical-warfare',
    type: 'influenced',
    summary:
      "The same chemical and industrial expertise, and much the same state backing, underlay both Haber's fertiliser process and his wartime gas program.",
    confidence: 'established',
  },
  {
    id: 'r49',
    sourceId: 'moseley',
    targetId: 'manhattan-project',
    type: 'influenced',
    summary:
      "Moseley's work establishing atomic number as physically fundamental was foundational to the nuclear physics the Manhattan Project later relied on.",
    confidence: 'likely',
  },
  {
    id: 'r50',
    sourceId: 'vannevar-bush',
    targetId: 'manhattan-project',
    type: 'funded',
    summary:
      "Bush's wartime Office of Scientific Research and Development initiated and coordinated the research that became the Manhattan Project.",
    confidence: 'established',
  },
  {
    id: 'r51',
    sourceId: 'vannevar-bush',
    targetId: 'cold-war-big-science',
    type: 'influenced',
    summary: "Bush's postwar report shaped the funding model underlying Cold War Big Science.",
    confidence: 'established',
  },
  {
    id: 'r52',
    sourceId: 'cold-war-big-science',
    targetId: 'plate-tectonics',
    type: 'funded',
    summary:
      'Naval and military funding for submarine warfare and nuclear test detection paid for the sea-floor surveys that produced the evidence for plate tectonics.',
    confidence: 'established',
  },
  {
    id: 'r53',
    sourceId: 'thomas-kuhn',
    targetId: 'plate-tectonics',
    type: 'influenced',
    summary:
      "Historians of geology have used Kuhn's framework of anomaly, crisis, and revolution to interpret the plate tectonics episode.",
    confidence: 'likely',
  },
  {
    id: 'r54',
    sourceId: 'gieryn-boundary-work',
    targetId: 'merton-norms',
    type: 'challenged',
    summary:
      "Gieryn argued that Merton's idealised scientific norms function more as rhetorical boundary-markers than as accurate descriptions of practice.",
    confidence: 'established',
  },
  {
    id: 'r55',
    sourceId: 'gieryn-boundary-work',
    targetId: 'karl-popper',
    type: 'challenged',
    summary:
      "Gieryn's sociological account complicates the idea that a single philosophical criterion like falsifiability can settle what counts as science.",
    confidence: 'likely',
  },
  {
    id: 'r56',
    sourceId: 'feminist-epistemology-idea',
    targetId: 'daston-galison-objectivity',
    type: 'supported',
    summary:
      'Feminist philosophy of science and the historicised account of objectivity developed as mutually reinforcing critiques of a single, fixed scientific objectivity.',
    confidence: 'likely',
  },
  {
    id: 'r57',
    sourceId: 'feminist-epistemology-idea',
    targetId: 'margaret-cavendish',
    type: 'supported',
    summary:
      "Feminist historians of science cite Cavendish's exclusion as early evidence for how institutional structures, not just ability, shaped who could participate.",
    confidence: 'likely',
  },
  {
    id: 'r58',
    sourceId: 'feminist-epistemology-idea',
    targetId: 'maria-sibylla-merian',
    type: 'supported',
    summary:
      "Feminist history of science uses Merian's workshop-trained, fieldwork-based career to question university-centred definitions of scientific legitimacy.",
    confidence: 'likely',
  },
  {
    id: 'r59',
    sourceId: 'francis-bacon',
    targetId: 'david-hume',
    type: 'influenced',
    summary:
      "Hume's empiricism developed within the broader British empiricist tradition Bacon had helped establish.",
    confidence: 'likely',
  },
  {
    id: 'r60',
    sourceId: 'david-hume',
    targetId: 'karl-popper',
    type: 'influenced',
    summary:
      "Popper presented falsificationism explicitly as a response to Hume's problem of induction.",
    confidence: 'established',
  },
  {
    id: 'r61',
    sourceId: 'david-hume',
    targetId: 'logical-positivism-vienna-circle',
    type: 'influenced',
    summary:
      "The Vienna Circle saw themselves as continuing and formalising Hume's empiricist program.",
    confidence: 'established',
  },
  {
    id: 'r62',
    sourceId: 'karl-popper',
    targetId: 'logical-positivism-vienna-circle',
    type: 'challenged',
    summary:
      'Popper argued verificationism could not work as a criterion of meaning or of science, proposing falsifiability instead.',
    confidence: 'established',
  },
  {
    id: 'r63',
    sourceId: 'pierre-duhem',
    targetId: 'karl-popper',
    type: 'challenged',
    summary:
      "Duhem's holism implies that no single hypothesis can be decisively falsified in isolation, complicating simple falsificationism.",
    confidence: 'established',
  },
  {
    id: 'r64',
    sourceId: 'pierre-duhem',
    targetId: 'quine',
    type: 'influenced',
    summary:
      "Quine generalised Duhem's point about auxiliary assumptions into the broader Duhem–Quine thesis.",
    confidence: 'established',
  },
  {
    id: 'r65',
    sourceId: 'quine',
    targetId: 'thomas-kuhn',
    type: 'influenced',
    summary:
      "Quine's holistic picture of theory and evidence fed into Kuhn's account of paradigm change.",
    confidence: 'likely',
  },
  {
    id: 'r66',
    sourceId: 'thomas-kuhn',
    targetId: 'karl-popper',
    type: 'challenged',
    summary:
      "Kuhn argued that normal science does not proceed by continuous attempted falsification, challenging Popper's picture of scientific rationality.",
    confidence: 'established',
  },
  {
    id: 'r67',
    sourceId: 'thomas-kuhn',
    targetId: 'paul-feyerabend',
    type: 'influenced',
    summary:
      "Feyerabend extended Kuhn's historicised, anti-rule-bound picture of science into a more radical methodological pluralism.",
    confidence: 'established',
  },
  {
    id: 'r68',
    sourceId: 'paul-feyerabend',
    targetId: 'thomas-kuhn',
    type: 'supported',
    summary:
      "Feyerabend defended and radicalised Kuhn's challenge to a single fixed scientific method.",
    confidence: 'likely',
  },
  {
    id: 'r69',
    sourceId: 'larry-laudan',
    targetId: 'hilary-putnam',
    type: 'challenged',
    summary:
      "Laudan's pessimistic meta-induction directly targets Putnam's no-miracles argument for realism.",
    confidence: 'established',
  },
  {
    id: 'r70',
    sourceId: 'larry-laudan',
    targetId: 'bas-van-fraassen',
    type: 'supported',
    summary:
      "Laudan's historical case against realism bolsters the case for van Fraassen's more modest constructive empiricism.",
    confidence: 'likely',
  },
  {
    id: 'r71',
    sourceId: 'ian-hacking',
    targetId: 'bas-van-fraassen',
    type: 'challenged',
    summary:
      "Hacking argued that reliable experimental manipulation of unobservable entities makes van Fraassen's agnosticism about their existence hard to sustain.",
    confidence: 'established',
  },
  {
    id: 'r72',
    sourceId: 'ian-hacking',
    targetId: 'nancy-cartwright',
    type: 'influenced',
    summary:
      "Hacking's focus on experimental practice fed into Cartwright's attention to how models and laws actually function in real physics.",
    confidence: 'likely',
  },
  {
    id: 'r73',
    sourceId: 'nancy-cartwright',
    targetId: 'heather-douglas',
    type: 'influenced',
    summary:
      "Cartwright's attention to idealisation and the gap between models and the world informs Douglas's account of value-laden judgement under uncertainty.",
    confidence: 'likely',
  },
  {
    id: 'r74',
    sourceId: 'heather-douglas',
    targetId: 'daston-galison-objectivity',
    type: 'supported',
    summary:
      "Douglas's critique of the value-free ideal builds on a historicised understanding of objectivity as a constructed achievement, not a fixed given.",
    confidence: 'likely',
  },
  {
    id: 'r75',
    sourceId: 'heather-douglas',
    targetId: 'feminist-epistemology-idea',
    type: 'supported',
    summary:
      "Douglas's work on values in science is frequently read alongside feminist epistemology's critique of value-free objectivity.",
    confidence: 'likely',
  },
  {
    id: 'r76',
    sourceId: 'ibn-al-haytham',
    targetId: 'galileo',
    type: 'influenced',
    summary:
      "Latin translations of Ibn al-Haytham's optics shaped the European optical theory Galileo relied on for his telescope.",
    confidence: 'likely',
  },
  {
    id: 'r77',
    sourceId: 'vesalius',
    targetId: 'royal-society',
    type: 'influenced',
    summary:
      "Vesalius's insistence on direct dissection over textual authority anticipated the experiential, witness-based evidential culture the Royal Society later formalised.",
    confidence: 'likely',
  },
  {
    id: 'r78',
    sourceId: 'professionalisation-of-science',
    targetId: 'natural-philosophy',
    type: 'replaced',
    summary:
      'Specialised, paid, professional science gradually displaced the older unified category of natural philosophy over the nineteenth century.',
    confidence: 'established',
  },
  {
    id: 'r79',
    sourceId: 'royal-society',
    targetId: 'natural-philosophy',
    type: 'institutionalised',
    summary:
      "The Royal Society's founding charter and early culture institutionalised natural philosophy as a collective, experimental pursuit.",
    confidence: 'established',
  },
  {
    id: 'r80',
    sourceId: 'whewell',
    targetId: 'professionalisation-of-science',
    type: 'influenced',
    summary:
      'Whewell\'s coining of "scientist" and his writing on the inductive sciences helped articulate and legitimate the emerging professional identity.',
    confidence: 'likely',
  },
  {
    id: 'r81',
    sourceId: 'merton-norms',
    targetId: 'lysenkoism-soviet-genetics',
    type: 'challenged',
    summary:
      'Lysenkoism is frequently cited in sociology of science as a case where political pressure overrode the universalism and organised scepticism Merton described as core scientific norms.',
    confidence: 'likely',
  },
  {
    id: 'r82',
    sourceId: 'gieryn-boundary-work',
    targetId: 'lysenkoism-soviet-genetics',
    type: 'supported',
    summary:
      "Historians and sociologists of science have used Gieryn's boundary-work framework to analyse how Lysenkoism redrew the boundary of legitimate Soviet biology for political ends.",
    confidence: 'likely',
  },
  {
    id: 'r83',
    sourceId: 'daston-galison-objectivity',
    targetId: 'galileo-telescope',
    type: 'supported',
    summary:
      "Daston and Galison's account of historically varying standards of objectivity helps explain why Galileo's telescopic images needed active argument before they counted as evidence.",
    confidence: 'likely',
  },
  {
    id: 'r84',
    sourceId: 'royal-society',
    targetId: 'scientific-societies',
    type: 'influenced',
    summary:
      "The Royal Society's early model of collective, published, peer-witnessed research influenced the wider wave of scientific societies founded across Europe afterward.",
    confidence: 'likely',
  },
  {
    id: 'r85',
    sourceId: 'sociology-of-scientific-knowledge',
    targetId: 'merton-norms',
    type: 'challenged',
    summary:
      "SSK's strong programme challenged Merton's focus on institutional norms, arguing sociology should explain the content of belief itself, not just scientific conduct.",
    confidence: 'established',
  },
  {
    id: 'r86',
    sourceId: 'pickering-practice-turn',
    targetId: 'sociology-of-scientific-knowledge',
    type: 'challenged',
    summary:
      "Pickering's practice turn shifted attention from the social causes of belief (SSK's focus) toward the material, temporal doing of scientific work.",
    confidence: 'established',
  },
  {
    id: 'r87',
    sourceId: 'laboratory-ethnography',
    targetId: 'actor-network-theory',
    type: 'influenced',
    summary:
      "Latour and Woolgar's laboratory ethnography directly fed into Latour's subsequent development of Actor-Network Theory.",
    confidence: 'established',
  },
  {
    id: 'r88',
    sourceId: 'actor-network-theory',
    targetId: 'sociology-of-scientific-knowledge',
    type: 'challenged',
    summary:
      "ANT's symmetry between human and nonhuman actors challenged SSK's explanations of scientific belief purely in terms of human social interests.",
    confidence: 'likely',
  },
  {
    id: 'r89',
    sourceId: 'knorr-cetina-epistemic-cultures',
    targetId: 'pickering-practice-turn',
    type: 'supported',
    summary:
      "Knorr Cetina's comparative laboratory ethnography extended and reinforced Pickering's practice-centred approach to studying science.",
    confidence: 'likely',
  },
  {
    id: 'r90',
    sourceId: 'sociology-of-scientific-knowledge',
    targetId: 'edinburgh-bath-traditions',
    type: 'influenced',
    summary:
      "SSK's strong programme directly shaped the Edinburgh and Bath traditions that developed and specified its approach through detailed case studies.",
    confidence: 'established',
  },
  {
    id: 'r91',
    sourceId: 'bourdieu-forms-of-capital',
    targetId: 'professionalisation-of-science',
    type: 'influenced',
    summary:
      "Bourdieu's account of convertible forms of capital supplies much of the conceptual vocabulary later historians use to analyse how scientific professionalisation distributed advantage unevenly.",
    confidence: 'likely',
  },
  {
    id: 'r92',
    sourceId: 'human-genome-project-bermuda-principles',
    targetId: 'assetisation-technoscientific-rent',
    type: 'contested',
    summary:
      "The Bermuda Principles' radical commitment to rapid open data release was explicitly designed to contest and pre-empt commercial patenting and rent extraction from the human genome.",
    confidence: 'likely',
  },
  {
    id: 'r93',
    sourceId: 'derek-de-solla-price',
    targetId: 'cold-war-big-science',
    type: 'influenced',
    summary:
      'Price\'s quantitative study of science\'s exponential growth gave the concept of "Big Science" its first rigorous empirical grounding.',
    confidence: 'established',
  },
  {
    id: 'r94',
    sourceId: 'alvin-weinberg-big-science-critique',
    targetId: 'cold-war-big-science',
    type: 'criticised',
    summary:
      'Weinberg warned from within that Big Science risked "journalitis," "moneyitis," and "administratitis" overtaking genuine scientific judgement.',
    confidence: 'established',
  },
  {
    id: 'r95',
    sourceId: 'mode-2-knowledge-production',
    targetId: 'linear-model-of-innovation',
    type: 'challenged',
    summary:
      "Mode 2 knowledge production explicitly challenged the linear model's one-directional, discipline-bound picture of how research leads to innovation.",
    confidence: 'established',
  },
  {
    id: 'r96',
    sourceId: 'mode-2-knowledge-production',
    targetId: 'triple-helix-model',
    type: 'influenced',
    summary:
      "Mode 2's emphasis on distributed, application-oriented knowledge production directly fed into the Triple Helix model of university-industry-government interaction.",
    confidence: 'likely',
  },
  {
    id: 'r97',
    sourceId: 'mission-oriented-innovation',
    targetId: 'linear-model-of-innovation',
    type: 'challenged',
    summary:
      "Mission-oriented innovation policy explicitly rejects the linear model's separation of funding basic research from directing it toward social goals.",
    confidence: 'likely',
  },
  {
    id: 'r98',
    sourceId: 'science-policy-ecology',
    targetId: 'spice-geoengineering-project',
    type: 'regulated',
    summary:
      "The UK's distributed science-policy ecology — research councils, review panels, and public-engagement bodies — formally regulated SPICE's progress through a staged review process.",
    confidence: 'likely',
  },
  {
    id: 'r99',
    sourceId: 'heterarchical-scientific-networks',
    targetId: 'trickle-down-science',
    type: 'challenged',
    summary:
      'Describing global science as a heterarchical network of uneven but multi-directional exchange directly challenges the assumption that benefit only flows one way, downward from wealthy funders.',
    confidence: 'likely',
  },
  {
    id: 'r100',
    sourceId: 'sociotechnical-imaginaries',
    targetId: 'cold-war-big-science',
    type: 'co-produced',
    summary:
      'Cold War Big Science and national imaginaries of prestige, security, and technological destiny were co-produced, each justifying and reinforcing the other.',
    confidence: 'likely',
  },
  {
    id: 'r101',
    sourceId: 'henry-oldenburg-philosophical-transactions',
    targetId: 'galileo-anagram-priority',
    type: 'replaced',
    summary:
      "Oldenburg's model of prompt, dated publication gradually replaced anagram-style secret priority-claiming as the accepted way to establish who discovered something first.",
    confidence: 'likely',
  },
  {
    id: 'r102',
    sourceId: 'scientific-societies',
    targetId: 'henry-oldenburg-philosophical-transactions',
    type: 'materially-enabled',
    summary:
      "The Royal Society's institutional infrastructure — correspondence networks, meeting records, fellows willing to referee reports — materially enabled Oldenburg's journal as a sustained operation.",
    confidence: 'established',
  },
  {
    id: 'r103',
    sourceId: 'robert-moses-bridges',
    targetId: 'winner-artifacts-have-politics',
    type: 'contested',
    summary:
      'Historians, notably Bernward Joerges, contested the specific evidentiary basis of the Long Island bridges story Winner used as his central illustration.',
    confidence: 'established',
  },
  {
    id: 'r104',
    sourceId: 'social-construction-of-technology',
    targetId: 'winner-artifacts-have-politics',
    type: 'challenged',
    summary:
      "SCOT scholars challenged Winner's claim that some technologies are inherently politically compatible with certain authority structures, arguing that compatibility is itself socially constructed.",
    confidence: 'likely',
  },
  {
    id: 'r105',
    sourceId: 'winner-artifacts-have-politics',
    targetId: 'agricultural-mechanization-labour-politics',
    type: 'influenced',
    summary:
      "Winner's framework for how artefacts can embody political arrangements directly shaped later readings of agricultural mechanisation cases like McCormick's moulding machines and the tomato harvester.",
    confidence: 'likely',
  },
  {
    id: 'r106',
    sourceId: 'collingridge-dilemma',
    targetId: 'spice-geoengineering-project',
    type: 'influenced',
    summary:
      "The Collingridge dilemma's logic of early, flexible intervention directly shaped the stage-gate review design built into the SPICE project.",
    confidence: 'likely',
  },
  {
    id: 'r107',
    sourceId: 'brian-wynne-cumbrian-sheep-farmers',
    targetId: 'hpv-vaccine-ireland-regret',
    type: 'influenced',
    summary:
      "Wynne's argument that public distrust can reflect legitimate institutional experience, not just an information deficit, directly shapes later analyses of vaccine-confidence controversies like Ireland's HPV case.",
    confidence: 'likely',
  },
  {
    id: 'r108',
    sourceId: 'franklin-wu-credit-and-exclusion',
    targetId: 'bourdieu-forms-of-capital',
    type: 'supported',
    summary:
      "The Franklin and Wu cases are frequently used to illustrate Bourdieu's point that symbolic and institutional capital, not contribution alone, governs who receives scientific credit.",
    confidence: 'likely',
  },
  {
    id: 'r109',
    sourceId: 'hpv-vaccine-ireland-regret',
    targetId: 'discourse-identity-subject-formation',
    type: 'represented',
    summary:
      'Media testimony in the REGRET campaign represented affected families in emotionally powerful ways that shaped public identification with the controversy.',
    confidence: 'likely',
  },
  {
    id: 'r110',
    sourceId: 'emily-martin-egg-and-sperm',
    targetId: 'daston-galison-objectivity',
    type: 'supported',
    summary:
      "Martin's case extends Daston and Galison's point that scientific representation is historically and culturally shaped into the specific terrain of gendered reproductive biology.",
    confidence: 'likely',
  },
  {
    id: 'r111',
    sourceId: 'mobile-money-east-africa',
    targetId: 'trickle-down-science',
    type: 'challenged',
    summary:
      "Mobile money's East African origin and later study elsewhere directly challenges the assumption that transformative innovation flows outward from wealthy countries to poorer ones.",
    confidence: 'likely',
  },
  {
    id: 'r112',
    sourceId: 'mobile-money-east-africa',
    targetId: 'assetisation-technoscientific-rent',
    type: 'commercialised',
    summary:
      'M-Pesa commercialised an informal practice of trading mobile airtime into a regulated, fee-generating financial-services product.',
    confidence: 'likely',
  },
  {
    id: 'r113',
    sourceId: 'haraway-cyborg-making-kin',
    targetId: 'actor-network-theory',
    type: 'supported',
    summary:
      "Haraway's cyborg figure and ANT's symmetry between human and nonhuman actors developed in close dialogue, each reinforcing the other's challenge to rigid nature/culture boundaries.",
    confidence: 'likely',
  },
  {
    id: 'r114',
    sourceId: 'co-production',
    targetId: 'daston-galison-objectivity',
    type: 'supported',
    summary:
      "Jasanoff's co-production idiom and Daston and Galison's historicised account of objectivity developed as mutually reinforcing ways of showing that scientific standards and social order are made together.",
    confidence: 'likely',
  },
  {
    id: 'r115',
    sourceId: 'imre-lakatos',
    targetId: 'karl-popper',
    type: 'revised',
    summary:
      "Lakatos revised Popper's falsificationism into a methodology of research programmes, preserving its concern with testability and progress while allowing scientists to rationally persist with a theory through anomalies so long as the surrounding programme kept being progressive.",
    confidence: 'established',
  },
  {
    id: 'r116',
    sourceId: 'paul-feyerabend',
    targetId: 'imre-lakatos',
    type: 'challenged',
    summary:
      "Feyerabend argued that Lakatos's distinction between 'progressive' and 'degenerating' research programmes could only ever be drawn with the benefit of hindsight, and so offered scientists no real guidance in the moment.",
    confidence: 'likely',
  },
  {
    id: 'r117',
    sourceId: 'thomas-kuhn',
    targetId: 'imre-lakatos',
    type: 'influenced',
    summary:
      "Kuhn's historical demonstration that scientists do not abandon a theory at its first failed prediction directly shaped Lakatos's decision to build tolerance for anomaly into the research-programme framework itself.",
    confidence: 'established',
  },
  {
    id: 'r118',
    sourceId: 'imre-lakatos',
    targetId: 'origin-of-species',
    type: 'applied-to',
    summary:
      'Lakatos and later philosophers of biology applied the research-programme framework to Darwinian evolutionary theory, treating natural selection as a hard core defended across generations of revised auxiliary hypotheses about mechanisms of inheritance.',
    confidence: 'likely',
  },
  {
    id: 'r119',
    sourceId: 'louis-pasteur',
    targetId: 'spontaneous-generation-theory',
    type: 'challenged',
    summary:
      "Pasteur's swan-neck flask experiments were designed specifically to refute spontaneous generation, and their wide acceptance was central to its decline as a live scientific theory.",
    confidence: 'established',
  },
  {
    id: 'r120',
    sourceId: 'louis-pasteur',
    targetId: 'john-snow-cholera',
    type: 'supported',
    summary:
      "Pasteur's laboratory-based germ theory gave a specific causal mechanism that later strengthened acceptance of the kind of waterborne-transmission reasoning Snow had argued for epidemiologically a generation earlier.",
    confidence: 'likely',
  },
  {
    id: 'r121',
    sourceId: 'ai-governance-and-safety-institutions',
    targetId: 'science-policy-ecology',
    type: 'applied-to',
    summary:
      'AI safety institutes applied long-standing science-policy questions about expert access and regulatory capture to a new, commercially dominated and fast-moving technology.',
    confidence: 'likely',
  },
  {
    id: 'r122',
    sourceId: 'scientific-racism',
    targetId: 'strong-programme-symmetry',
    type: 'applied-to',
    summary:
      "The strong programme's symmetry principle — explaining both 'true' and 'false' beliefs through the same kinds of social causes — has been applied by historians to scientific racism to explain its persistence among otherwise rigorous researchers without treating it as a simple failure of method.",
    confidence: 'likely',
  },
]
