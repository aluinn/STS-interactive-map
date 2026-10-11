import type { Entry } from '../types'

// Each entry here follows the same discipline: what the idea claimed, why it
// was plausible at the time, what evidence supported it, what anomalies or
// alternatives appeared, and whether it was rejected, transformed, or
// partially retained — resisting a simple "ignorant past" narrative.
export const overturnedIdeasEntries: Entry[] = [
  {
    id: 'humoral-medicine',
    slug: 'humoral-medicine',
    title: 'Humoral Medicine',
    subtitle: 'Health as a balance of four bodily fluids',
    kind: 'idea',
    period: 'classical',
    summary:
      'For roughly two millennia, European and Islamic medicine explained health and illness through the balance of four humours — blood, phlegm, yellow bile, and black bile — a framework coherent enough to guide diagnosis and treatment for centuries.',
    longDescription:
      'Associated with Hippocratic and later Galenic medicine, humoralism held that each humour corresponded to qualities (hot, cold, wet, dry), a temperament, and a season, and that illness arose from humoral imbalance, treatable by diet, bloodletting, purging, or other means of restoring equilibrium. The theory was plausible because it fit visible evidence (fevers felt hot, phlegm appeared during colds, bile was visibly present in vomit and stool) and offered a unified, individualised account connecting body, environment, and temperament — genuinely useful for organising clinical observation even without modern physiology. It persisted because alternative frameworks (early germ theory, cellular pathology) did not mature until the nineteenth century, and because bloodletting and purging, though now known to be often harmful, sometimes produced short-term symptomatic relief that reinforced belief in the system.',
    startYear: -400,
    endYear: 1850,
    dateDisplay: 'c. 400 BCE – 19th century CE',
    approximateDate: true,
    transregional: true,
    scale: 'body',
    places: [{ name: 'Alexandria', latitude: 31.2001, longitude: 29.9187 }],
    people: [],
    cultures: ['Greek', 'Islamic', 'European'],
    disciplines: ['medicine'],
    themes: ['overturning-authority', 'scientific-change'],
    theoryStatus: 'rejected',
    theoryStatusNote:
      'Humoralism as a physiological theory was rejected with the rise of cellular pathology and germ theory in the nineteenth century, though some humoral-adjacent ideas (the body as a dynamic system seeking balance, the influence of diet and environment on health) persist in modified form in other traditions.',
    evidenceStatus: 'well-established',
    evidenceStatusNote:
      'That humoralism dominated Western and Islamic medicine for roughly two millennia, and was superseded by germ theory and cellular pathology, is well documented historically.',
    philosophicalQuestions: [
      {
        prompt:
          'Humoral medicine organised clinical observation coherently for two thousand years — what should that longevity tell us about how to judge a currently dominant medical theory?',
        debateId: 'pessimistic-meta-induction-laudan',
      },
    ],
    historicalSignificance:
      'The dominant medical framework across two civilisations for longer than modern scientific medicine has yet existed, useful for resisting any assumption that scientific consensus is simply a recent, steadily accumulating truth.',
    commonMyth:
      'That pre-modern physicians were simply ignorant or unscientific by the standards of their own era.',
    historicalComplication:
      'Humoral medicine was internally coherent, responsive to observation, and the basis of serious clinical reasoning — its replacement reflects a change in explanatory framework and available evidence (microscopy, pathology), not simply the correction of carelessness.',
    sources: [
      {
        author: 'Vivian Nutton',
        title: 'Ancient Medicine',
        year: '2004',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['aristotle', 'john-snow-cholera', 'miasma-theory'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'geocentrism',
    slug: 'geocentrism',
    title: 'Geocentrism',
    subtitle: 'An Earth-centred cosmos, mathematically refined for over a thousand years',
    kind: 'idea',
    period: 'classical',
    summary:
      'The theory that the Earth sits motionless at the centre of the cosmos, with the Sun, Moon, planets, and stars revolving around it, dominated astronomy from antiquity until the Copernican and Galilean challenges of the sixteenth and seventeenth centuries.',
    longDescription:
      "Geocentrism matched everyday observation directly: the ground beneath one's feet feels stationary, and the sky visibly appears to rotate overhead. Aristotle supplied physical reasoning for why heavy Earth would sit at the centre, and Ptolemy supplied a mathematically sophisticated predictive model (epicycles and equants) capable of forecasting planetary positions with useful accuracy — it was not a naive or careless theory but a serious achievement, refined by Islamic and European astronomers for centuries. Copernicus's heliocentric alternative was initially no more accurate and required giving up intuitive physical reasoning about weight and motion; it took Galileo's telescopic evidence, Kepler's elliptical orbits, and ultimately Newtonian mechanics to make heliocentrism both more accurate and physically coherent, a process that took roughly a century and a half, not a single decisive moment.",
    startYear: -400,
    endYear: 1687,
    dateDisplay: 'c. 400 BCE – 1687 CE',
    approximateDate: true,
    latitude: 37.9838,
    longitude: 23.7275,
    places: [{ name: 'Athens', latitude: 37.9838, longitude: 23.7275 }],
    transregional: false,
    people: [],
    cultures: ['Greek'],
    disciplines: ['astronomy'],
    themes: ['cosmology', 'overturning-authority', 'scientific-change'],
    theoryStatus: 'rejected',
    theoryStatusNote:
      "Geocentrism was rejected as a physical account of the cosmos, though Ptolemy's mathematical techniques and much of his observational data were absorbed and refined, not simply discarded, by the astronomers who replaced his cosmology.",
    evidenceStatus: 'well-established',
    philosophicalQuestions: [
      {
        prompt:
          'If geocentrism matched everyday sensory experience better than heliocentrism did for most observers, what does that suggest about how much weight direct observation alone should carry in theory choice?',
        debateId: 'induction-problem',
      },
    ],
    historicalSignificance:
      'The longest-standing cosmological framework in the Western and Islamic traditions, and the central case study for how an empirically productive, internally coherent theory can still ultimately be replaced.',
    commonMyth:
      'That geocentrism was a simple error corrected the moment Copernicus proposed heliocentrism.',
    historicalComplication:
      "Copernicus's original model was not more accurate than Ptolemy's, and heliocentrism remained a minority, contested position for roughly a century after 1543 — the transition was gradual and contingent, not a single triumphant correction.",
    sources: [
      { author: 'Liba Taub', title: "Ptolemy's Universe", year: '1993', type: 'secondary' },
    ],
    relatedEntryIds: ['ptolemy', 'aristotle', 'copernicus', 'kepler'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'phlogiston-theory',
    slug: 'phlogiston-theory',
    title: 'Phlogiston Theory',
    subtitle: 'A fire-substance released during combustion',
    kind: 'idea',
    period: 'enlightenment',
    summary:
      'Seventeenth- and eighteenth-century chemists explained combustion and rusting as the release of "phlogiston," a substance contained within combustible materials — a theory that organised a great deal of chemical practice before Lavoisier\'s oxygen theory replaced it.',
    longDescription:
      "Proposed by Johann Joachim Becher and developed by Georg Ernst Stahl, phlogiston theory explained why burning materials lost mass (phlogiston escaping) and why some burned more readily than others (more phlogiston content) — a genuinely productive organising framework for eighteenth-century chemistry, used to classify substances and interpret experiments. The theory ran into a serious anomaly: some substances (notably metals forming calxes, or rust) gained mass when burned, which should have been impossible if burning simply released a substance. Some phlogiston theorists proposed phlogiston had negative weight to explain this, a patch that worked mathematically but strained the theory's coherence. Antoine Lavoisier's careful quantitative experiments in the 1770s–80s showed combustion involved combining with a gas (which he named oxygen) rather than releasing a substance, and his new framework, tied to the law of conservation of mass, gradually displaced phlogiston theory over roughly two decades.",
    startYear: 1667,
    endYear: 1800,
    dateDisplay: 'c. 1667–1800',
    approximateDate: true,
    latitude: 52.52,
    longitude: 13.405,
    places: [{ name: 'Berlin', latitude: 52.52, longitude: 13.405 }],
    transregional: true,
    people: [],
    cultures: ['German', 'French'],
    disciplines: ['chemistry'],
    themes: ['overturning-authority', 'scientific-change', 'realism'],
    theoryStatus: 'rejected',
    theoryStatusNote:
      "Phlogiston as a substance was rejected outright, but the problem it organised — what happens during combustion — was successfully re-explained, not abandoned, by Lavoisier's oxygen theory and the conservation of mass.",
    evidenceStatus: 'well-established',
    philosophicalQuestions: [
      {
        prompt:
          "Phlogiston theory successfully organised decades of chemical practice despite being fundamentally wrong about what exists — what should that suggest about how much practical success alone can tell us about a theory's truth?",
        debateId: 'pessimistic-meta-induction-laudan',
      },
    ],
    historicalSignificance:
      'The standard textbook case in philosophy of science for discussing theory change, incommensurability, and the pessimistic meta-induction against scientific realism.',
    commonMyth:
      'That phlogiston theory was obviously absurd and its adherents were simply confused.',
    historicalComplication:
      "Phlogiston theory successfully predicted and organised a wide range of chemical phenomena for over a century; its chief failure (the weight-gain anomaly) was known and debated by phlogiston theorists themselves well before Lavoisier's alternative was available.",
    sources: [
      {
        author: 'Hasok Chang',
        title: 'Is Water H2O? Evidence, Realism and Pluralism',
        year: '2012',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['luminiferous-ether', 'spontaneous-generation-theory'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'spontaneous-generation-theory',
    slug: 'spontaneous-generation-theory',
    title: 'Spontaneous Generation',
    subtitle: 'Life arising directly from non-living matter',
    kind: 'idea',
    period: 'early-modern',
    summary:
      "The belief that living organisms — maggots from rotting meat, mice from grain, microbes from broth — could arise directly from non-living matter was widely accepted from antiquity through the mid-nineteenth century, when Louis Pasteur's experiments decisively refuted it for the cases then in dispute.",
    longDescription:
      "The theory was plausible because the relevant causal processes (insect eggs, airborne spores, microbial contamination) were invisible without adequate instruments, so maggots genuinely appeared to arise \"from nothing\" in rotting meat left exposed. Francesco Redi's 1668 experiments, covering meat to exclude flies, showed maggots did not appear without fly access, substantially narrowing but not eliminating belief in spontaneous generation, which persisted especially for microorganisms. Pasteur's 1859–64 swan-neck flask experiments — which kept air flowing to a sterilised broth while trapping dust and microbes in a curved neck — showed broth remained sterile indefinitely unless the trap was broken, providing decisive evidence against spontaneous generation even at the microbial scale and establishing germ theory on a firmer experimental footing. Maria Sibylla Merian's detailed direct observation of insect metamorphosis, decades before Pasteur, had already independently undermined spontaneous-generation claims about insects specifically.",
    startYear: -350,
    endYear: 1864,
    dateDisplay: 'c. 350 BCE – 1864 CE',
    approximateDate: true,
    latitude: 48.8566,
    longitude: 2.3522,
    places: [{ name: 'Paris', latitude: 48.8566, longitude: 2.3522 }],
    transregional: true,
    people: ['louis-pasteur', 'francesco-redi'],
    cultures: ['Greek', 'Italian', 'French'],
    disciplines: ['biology'],
    themes: ['overturning-authority', 'scientific-change', 'instruments-and-method'],
    theoryStatus: 'rejected',
    theoryStatusNote:
      'Spontaneous generation was decisively rejected for the organisms and conditions Pasteur tested; the broader underlying question of how life first originated from non-living chemistry (abiogenesis) remains a distinct, still-active area of origin-of-life research, not simply a revival of the old theory.',
    evidenceStatus: 'well-established',
    philosophicalQuestions: [
      {
        prompt:
          "Pasteur's refutation depended on carefully designed apparatus (the swan-neck flask) that made an invisible causal process visible — how much of settling a long-running scientific dispute depends on inventing the right instrument, rather than new theory?",
        debateId: 'entity-realism-hacking',
      },
    ],
    historicalSignificance:
      'A textbook case of a long-held belief overturned by carefully designed experimental apparatus, and the foundation of modern germ theory and sterile technique.',
    commonMyth:
      'That spontaneous generation was a fringe superstition rather than a serious, widely held scientific position.',
    historicalComplication:
      "Spontaneous generation was defended by serious scientists (notably Félix Pouchet, Pasteur's main opponent) using their own careful experiments; the dispute was resolved through competing experimental design and scrutiny of possible contamination, not by one side simply being unscientific.",
    sources: [
      {
        author: 'John Farley',
        title: 'The Spontaneous Generation Controversy from Descartes to Oparin',
        year: '1977',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['maria-sibylla-merian', 'laboratory-ethnography'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'miasma-theory',
    slug: 'miasma-theory',
    title: 'Miasma Theory',
    subtitle: '"Bad air" as the cause of epidemic disease',
    kind: 'idea',
    period: 'industrial-imperial',
    summary:
      'For centuries, the dominant explanation for epidemic diseases such as cholera and plague was that they were caused by miasma — noxious "bad air" arising from decaying organic matter, sewage, and filth — a theory gradually displaced by germ theory over the second half of the nineteenth century.',
    longDescription:
      "Miasma theory was plausible because disease outbreaks correlated strongly, if imperfectly, with foul smells, overcrowding, and poor sanitation — correlations that were real even though the causal mechanism miasma theorists proposed (airborne poisonous vapour) was wrong. It motivated genuinely effective public health interventions (improved sewerage, waste removal, ventilation) because many of the same conditions that produced bad smells also spread waterborne and airborne pathogens, meaning miasma-driven reforms often worked for reasons their proponents did not understand — Bazalgette's London sewer system, built on miasma reasoning, also removed the contaminated water later shown to spread cholera. John Snow's 1854 Broad Street investigation built a strong circumstantial case for waterborne transmission specifically, but miasma theory was not abandoned by the wider medical establishment until Robert Koch's and others' germ-theory evidence accumulated through the 1870s–1880s.",
    startYear: 1600,
    endYear: 1880,
    dateDisplay: 'c. 1600–1880',
    approximateDate: true,
    latitude: 51.5072,
    longitude: -0.1276,
    places: [{ name: 'London', latitude: 51.5072, longitude: -0.1276 }],
    transregional: true,
    people: [],
    cultures: ['European'],
    disciplines: ['medicine', 'public health'],
    themes: ['overturning-authority', 'scientific-change', 'evidence-and-action'],
    theoryStatus: 'rejected',
    theoryStatusNote:
      'Miasma theory was rejected as a causal account of disease transmission, but many public health interventions it motivated (sanitation, sewerage, ventilation, waste removal) remained effective and were retained, since they also addressed causes germ theory later identified.',
    evidenceStatus: 'well-established',
    philosophicalQuestions: [
      {
        prompt:
          'If public health action built on a wrong causal theory (miasma) nonetheless produced genuinely effective results, what does that say about how much correct theory is actually required for successful intervention?',
        debateId: 'expertise-trust-policy',
      },
    ],
    historicalSignificance:
      'A central case for understanding how effective public health action and mistaken causal theory can coexist, directly complementing the John Snow and Great Stink entries already in this atlas.',
    sources: [
      {
        author: 'Anthony Wohl',
        title: 'Endangered Lives: Public Health in Victorian Britain',
        year: '1983',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['john-snow-cholera', 'great-stink-bazalgette', 'humoral-medicine'],
    confidence: 'established',
    contentStatus: 'complete',
  },
  {
    id: 'luminiferous-ether',
    slug: 'luminiferous-ether',
    title: 'The Luminiferous Ether',
    subtitle: 'A medium for light to wave through',
    kind: 'idea',
    period: 'industrial-imperial',
    summary:
      'Nineteenth-century physicists, having established that light behaves as a wave, reasoned that waves require a medium to propagate through, and so posited a pervasive, undetectable "luminiferous ether" filling all space — a theory dismantled by the Michelson-Morley experiment and ultimately unnecessary under Einstein\'s special relativity.',
    longDescription:
      "Every other known wave (sound, water) required a medium, so a wave theory of light made the ether hypothesis a reasonable, almost forced, inference, and much of nineteenth-century optics and electromagnetism (including Maxwell's equations) was formulated with an ether in mind. The 1887 Michelson-Morley experiment attempted to detect Earth's motion through the ether by measuring tiny expected differences in light speed in different directions, and found none — a null result that proved deeply puzzling, prompting ad hoc rescue attempts (ether dragging, length contraction proposed independently by FitzGerald and Lorentz) before Einstein's 1905 special relativity removed the need for an ether altogether by showing the speed of light is constant for all observers regardless of relative motion. The Lorentz-FitzGerald contraction proposed to save the ether theory turned out to be mathematically identical to a piece of relativity's own structure — an instance of a discarded theory's mathematics surviving inside its replacement.",
    startYear: 1800,
    endYear: 1905,
    dateDisplay: '1800–1905',
    approximateDate: false,
    latitude: 41.8781,
    longitude: -87.6298,
    places: [
      {
        name: 'Cleveland, Ohio (Michelson-Morley experiment)',
        latitude: 41.4993,
        longitude: -81.6944,
      },
    ],
    transregional: true,
    people: ['albert-michelson', 'edward-morley', 'albert-einstein'],
    cultures: ['American', 'German'],
    disciplines: ['physics'],
    themes: ['overturning-authority', 'scientific-change', 'realism'],
    theoryStatus: 'rejected',
    theoryStatusNote:
      'The ether as a physical medium was rejected following special relativity, though the mathematics some ether theorists developed to explain the null result (Lorentz-FitzGerald contraction) reappeared, reinterpreted, inside the replacement theory.',
    evidenceStatus: 'well-established',
    philosophicalQuestions: [
      {
        prompt:
          "If a discarded theory's mathematics (Lorentz-FitzGerald contraction) turns out to be preserved, reinterpreted, inside its replacement (relativity), does that count as evidence for structural realism — that mathematical structure, not the specific entities, is what survives theory change?",
        debateId: 'pessimistic-meta-induction-laudan',
      },
    ],
    historicalSignificance:
      'A canonical case in philosophy of science for discussing theory change, null results, and what (if anything) survives when a well-established theoretical entity is abandoned.',
    commonMyth:
      'That the Michelson-Morley null result immediately and obviously refuted the ether, prompting instant acceptance of relativity.',
    historicalComplication:
      "The null result was followed by nearly two decades of serious attempts to rescue the ether theory before special relativity's alternative gained wide acceptance — theory change here was gradual and contested, not an immediate correction.",
    sources: [
      {
        author: 'Peter Galison',
        title: "Einstein's Clocks, Poincaré's Maps: Empires of Time",
        year: '2003',
        type: 'secondary',
      },
    ],
    relatedEntryIds: ['newton', 'phlogiston-theory'],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
  {
    id: 'scientific-racism',
    slug: 'scientific-racism',
    title: 'Scientific Racism',
    subtitle: 'Pseudoscientific hierarchies given the appearance of biological authority',
    kind: 'idea',
    period: 'industrial-imperial',
    summary:
      'From the eighteenth through the mid-twentieth century, prominent scientists developed and promoted racial-hierarchy theories — craniometry, polygenism, eugenics — that claimed biological authority for pre-existing social and colonial hierarchies, now understood as pseudoscience shaped by the political interests of its practitioners rather than sound method.',
    longDescription:
      "Figures including Samuel Morton (craniometry, measuring skull capacity to claim racial intelligence rankings), Francis Galton (eugenics), and many others presented racial-hierarchy claims using the methods and institutional authority of contemporary science — journals, measurement, statistics — lending them an appearance of objectivity. Stephen Jay Gould's re-analysis of Morton's own skull-measurement data found that Morton's conclusions did not follow from his own numbers, suggesting unconscious bias shaped data selection and interpretation (though some of Gould's specific re-analysis has itself been disputed by later researchers who partially re-examined Morton's skulls). This case is treated here not as a simple matter of long-settled science that happened to be false, but as a case that remains actively studied and discussed because of its direct historical role in justifying slavery, colonialism, forced sterilisation, and genocide — a moral and political dimension alongside, not separate from, the scientific one.",
    startYear: 1750,
    endYear: 1945,
    dateDisplay: 'c. 1750–1945',
    approximateDate: true,
    transregional: true,
    scale: 'nation',
    places: [
      { name: "Philadelphia (Morton's collection)", latitude: 39.9526, longitude: -75.1652 },
    ],
    people: ['samuel-morton', 'francis-galton'],
    cultures: ['American', 'British', 'European'],
    disciplines: ['anthropology', 'biology'],
    themes: ['ethics', 'society-and-power', 'exclusion-and-access'],
    theoryStatus: 'rejected',
    theoryStatusNote:
      'Scientific racism is rejected both empirically (modern genetics shows human genetic variation does not support the discrete racial hierarchies these theories claimed) and as a matter of the scientific method actually practised, which numerous later analyses have shown involved motivated reasoning in data collection and interpretation.',
    evidenceStatus: 'historical-details-contested',
    evidenceStatusNote:
      "That these theories were pseudoscientific and caused serious harm is not in dispute; specific later re-analyses of individual historical datasets (such as Gould's 1978 study of Morton's skulls) have themselves been contested by subsequent researchers on points of measurement detail, which this entry flags rather than glosses over.",
    philosophicalQuestions: [
      {
        prompt:
          'If a theory used the institutional forms of science (journals, measurement, statistics) while its conclusions were shaped by the pre-existing interests of its practitioners, what does that suggest about how reliably institutional form alone can mark something as "scientific"?',
        debateId: 'demarcation-boundary-work',
      },
    ],
    historicalSignificance:
      'A central case for understanding how scientific authority can be mobilised in service of political and colonial power, with direct historical consequences still being reckoned with.',
    commonMyth:
      'That scientific racism was a marginal, obviously fringe position rejected by the mainstream science of its time.',
    historicalComplication:
      'Scientific racism was mainstream, institutionally supported science for much of the period covered, published in respected journals and taught at major universities — its rejection required a combination of better genetics, better statistical scrutiny, and sustained political and ethical challenge, not merely additional data.',
    sources: [
      {
        author: 'Stephen Jay Gould',
        title: 'The Mismeasure of Man',
        year: '1981',
        type: 'secondary',
      },
    ],
    relatedEntryIds: [
      'congo-resource-extraction',
      'feminist-epistemology-idea',
      'daston-galison-objectivity',
    ],
    confidence: 'established',
    contentStatus: 'complete',
    isJourneyStop: true,
  },
]
