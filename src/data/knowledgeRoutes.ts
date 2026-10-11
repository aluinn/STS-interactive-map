import type { KnowledgeRoute } from '../types'

/**
 * "Ideas on the Move" route layer. Each route traces a larger-scale path
 * that knowledge, texts, or practices travelled along — distinct from the
 * entry-to-entry Relationship graph, which records a single claimed link
 * rather than a journey with waypoints and a date range. Deliberately
 * limited to well-sourced, well-understood cases rather than a route for
 * every entry.
 */
export const knowledgeRoutes: KnowledgeRoute[] = [
  {
    id: 'route-baghdad-translation',
    slug: 'greek-to-arabic-to-latin-translation',
    title: 'Greek Philosophy to Baghdad to Latin Europe',
    kind: 'translation',
    summary:
      'Greek philosophical and scientific texts were translated into Syriac and Arabic in Abbasid Baghdad from the 8th–10th centuries, then, centuries later, translated again from Arabic into Latin in Iberia, re-entering western Europe transformed by generations of Arabic-language commentary.',
    dateDisplay: 'c. 750–1200 CE',
    waypoints: [
      {
        label: 'Alexandria',
        latitude: 31.2001,
        longitude: 29.9187,
        note: 'Hellenistic centre where much of the source material (Aristotle, Galen, Ptolemy) had been preserved and studied.',
      },
      {
        label: 'Baghdad (House of Wisdom)',
        latitude: 33.3152,
        longitude: 44.3661,
        dateDisplay: 'c. 750–900 CE',
        note: 'Abbasid translation effort moving Greek texts into Syriac and Arabic, extended with original commentary and correction rather than passive copying.',
      },
      {
        label: 'Toledo',
        latitude: 39.8628,
        longitude: -4.0273,
        dateDisplay: 'c. 1100–1200 CE',
        note: 'Arabic-to-Latin translation activity in Christian Iberia, often via Castilian as an intermediate step, that reintroduced this material into western Europe.',
      },
    ],
    whatChanged:
      'The texts were not passed along unchanged: Baghdad-era scholars corrected, extended, and argued with Greek sources (notably in astronomy and optics), and the Latin versions that reached European universities were frequently translations of Arabic commentary as much as of the original Greek — a multi-generational, multi-language transformation rather than a single relay.',
    intermediaries: [
      'Syriac Christian translators and scholars',
      'Toledo School of Translators',
    ],
    relatedEntryIds: ['house-of-wisdom', 'baghdad-translation-movement', 'al-khwarizmi', 'ibn-al-haytham'],
    sources: [
      {
        author: 'Dimitri Gutas',
        title: 'Greek Thought, Arabic Culture',
        year: '1998',
        type: 'secondary',
      },
    ],
    confidence: 'established',
  },
  {
    id: 'route-republic-of-letters',
    slug: 'republic-of-letters-correspondence',
    title: 'The Republic of Letters',
    kind: 'correspondence',
    summary:
      'Henry Oldenburg, as secretary of the Royal Society, maintained an extensive personal correspondence network across Europe, collecting, translating, and circulating reports of experiments and observations well before any of it appeared in print.',
    dateDisplay: 'c. 1660–1680s',
    waypoints: [
      { label: 'London', latitude: 51.5072, longitude: -0.1276, note: 'Royal Society, hub of the correspondence network.' },
      { label: 'Paris', latitude: 48.8566, longitude: 2.3522 },
      { label: 'Florence', latitude: 43.7696, longitude: 11.2558 },
      { label: 'Amsterdam', latitude: 52.3676, longitude: 4.9041 },
    ],
    whatChanged:
      "Oldenburg's letters functioned as an early peer-review and priority-registration system before either existed formally — ideas moved as unpublished, informally vetted reports among a trusted correspondence network, which the Philosophical Transactions later formalised into print.",
    intermediaries: ['Henry Oldenburg', 'Royal Society fellows acting as regional correspondents'],
    relatedEntryIds: ['henry-oldenburg-philosophical-transactions', 'royal-society', 'boyle'],
    sources: [
      {
        author: 'Marie Boas Hall',
        title: 'Henry Oldenburg: Shaping the Royal Society',
        year: '2002',
        type: 'secondary',
      },
    ],
    confidence: 'established',
  },
  {
    id: 'route-zheng-he-voyages',
    slug: 'zheng-he-treasure-voyages',
    title: "Zheng He's Treasure Voyages",
    kind: 'expedition',
    summary:
      "The Ming admiral Zheng He led seven large state-sponsored maritime expeditions across the Indian Ocean, gathering geographic, nautical, and diplomatic knowledge on a scale that dwarfed contemporary European voyages, before the programme was abruptly discontinued.",
    dateDisplay: '1405–1433',
    waypoints: [
      { label: 'Nanjing', latitude: 32.0603, longitude: 118.7969, note: 'Departure point and shipyards.' },
      { label: 'Malacca', latitude: 2.1896, longitude: 102.2501 },
      { label: 'Calicut', latitude: 11.2588, longitude: 75.7804 },
      { label: 'Hormuz', latitude: 26.968, longitude: 56.4522 },
      { label: 'Mogadishu', latitude: 2.0469, longitude: 45.3182 },
    ],
    whatChanged:
      "The voyages produced detailed nautical charts and accumulated diplomatic and geographic knowledge of the Indian Ocean world, but this knowledge was not systematically preserved or built upon after the fleet's dissolution in the 1430s — a case where organisational and political decisions, not any lack of capability, determined whether accumulated knowledge persisted.",
    intermediaries: ['Zheng He', 'Ming court interpreters and envoys'],
    relatedEntryIds: ['zheng-he-voyages', 'chinese-astronomy-technology'],
    sources: [
      {
        author: 'Louise Levathes',
        title: 'When China Ruled the Seas',
        year: '1994',
        type: 'secondary',
      },
    ],
    confidence: 'established',
  },
  {
    id: 'route-jesuit-china-exchange',
    slug: 'jesuit-china-scientific-exchange',
    title: 'Jesuit–Chinese Scientific Exchange',
    kind: 'diplomatic',
    summary:
      'Jesuit missionaries carried European mathematics, astronomy, and cartography to the Ming and Qing courts, gaining influence partly through technical skill, while also transmitting Chinese knowledge and texts back to Europe — an exchange shaped by missionary goals on one side and courtly utility on the other.',
    dateDisplay: 'c. 1580–1770',
    waypoints: [
      { label: 'Rome', latitude: 41.9028, longitude: 12.4964 },
      { label: 'Lisbon', latitude: 38.7223, longitude: -9.1393 },
      { label: 'Macau', latitude: 22.1987, longitude: 113.5439, note: 'Staging point for missions into China.' },
      { label: 'Beijing', latitude: 39.9042, longitude: 116.4074, note: 'Qing imperial court, where Jesuits served as astronomers and mapmakers.' },
    ],
    whatChanged:
      'Knowledge moved in both directions and was reshaped by local priorities: the Qing court adopted specific technical tools (calendrical astronomy, cartography) useful to statecraft while largely declining the religious framework they arrived with, and Jesuit reports back to Europe shaped European perceptions of Chinese philosophy and administration.',
    intermediaries: ['Jesuit missionary-scientists', 'Qing court astronomers and translators'],
    relatedEntryIds: ['jesuit-china-exchange', 'qing-gewu'],
    sources: [
      {
        author: 'Benjamin Elman',
        title: 'On Their Own Terms: Science in China, 1550–1900',
        year: '2005',
        type: 'secondary',
      },
    ],
    confidence: 'established',
  },
  {
    id: 'route-origin-of-species-translations',
    slug: 'origin-of-species-global-circulation',
    title: "On the Origin of Species in Translation",
    kind: 'publication',
    summary:
      "Darwin's 1859 book was rapidly translated and debated across Europe and beyond, but its reception was not uniform: translators, reviewers, and local scientific communities adapted, resisted, or redirected its arguments to fit existing national scientific and religious debates.",
    dateDisplay: '1859–1870s',
    waypoints: [
      { label: 'London', latitude: 51.5072, longitude: -0.1276, note: 'First publication, 1859.' },
      { label: 'Berlin', latitude: 52.52, longitude: 13.405, note: 'Rapid German translation and uptake, entangled with existing debates over materialism.' },
      { label: 'Paris', latitude: 48.8566, longitude: 2.3522, note: 'Slower, more contested reception shaped by existing French natural-history traditions.' },
      { label: 'New York', latitude: 40.7128, longitude: -74.006 },
    ],
    whatChanged:
      "Darwin's argument did not travel as a fixed package: German readers often read it through an existing Naturphilosophie lens, while French naturalists weighed it against Lamarckian and Cuvierian traditions already established there — translation was an act of interpretation, not transmission.",
    intermediaries: ['National scientific societies and journal reviewers', 'Translators adapting terminology into local scientific vocabularies'],
    relatedEntryIds: ['origin-of-species', 'darwin', 'alfred-russel-wallace'],
    sources: [
      {
        author: 'Janet Browne',
        title: 'Charles Darwin: The Power of Place',
        year: '2002',
        type: 'secondary',
      },
    ],
    confidence: 'established',
  },
  {
    id: 'route-congo-resource-extraction',
    slug: 'congo-colonial-resource-network',
    title: 'Congo Free State Resource and Knowledge Extraction',
    kind: 'colonial-network',
    summary:
      "Botanical, geological, and ethnographic knowledge about the Congo basin was gathered under conditions of forced labour during Belgian colonial rule, then carried to European institutions where it was credited to European collectors rather than the Congolese communities whose knowledge and labour produced it.",
    dateDisplay: '1885–1908',
    waypoints: [
      { label: 'Congo Basin', latitude: -4.4419, longitude: 15.2663 },
      { label: 'Antwerp', latitude: 51.2194, longitude: 4.4025, note: 'Principal port for Congo rubber and mineral exports.' },
      { label: 'Brussels', latitude: 50.8503, longitude: 4.3517, note: 'Colonial administration and scientific institutions receiving collected specimens and reports.' },
    ],
    whatChanged:
      'What is described in European scientific archives as "collection" or "survey" work depended on Congolese ecological knowledge and forced labour that the resulting publications did not credit, illustrating how colonial science records often erase the very people who made the knowledge-gathering possible.',
    relatedEntryIds: ['congo-resource-extraction'],
    sources: [
      {
        author: 'Adam Hochschild',
        title: "King Leopold's Ghost",
        year: '1998',
        type: 'secondary',
      },
    ],
    confidence: 'established',
  },
  {
    id: 'route-mpesa-mobile-money',
    slug: 'mpesa-mobile-money-diffusion',
    title: 'Mobile Money Across East Africa',
    kind: 'digital-network',
    summary:
      "M-Pesa, launched in Kenya in 2007, diffused across East Africa through existing social and agent networks rather than formal banking infrastructure, and was adapted by users for purposes (savings, informal credit, remittances) its designers had not fully anticipated.",
    dateDisplay: '2007–2010s',
    waypoints: [
      { label: 'Nairobi', latitude: -1.2921, longitude: 36.8219, note: 'Launch site, 2007.' },
      { label: 'Kampala', latitude: 0.3476, longitude: 32.5825 },
      { label: 'Dar es Salaam', latitude: -6.7924, longitude: 39.2083 },
    ],
    whatChanged:
      'Uptake relied on a dense network of local agents rather than bank branches, and usage diversified in the field beyond the original person-to-person transfer design into informal saving and credit practices that researchers only documented after the fact.',
    intermediaries: ['Local M-Pesa agent networks'],
    relatedEntryIds: ['mobile-money-east-africa'],
    sources: [
      {
        author: 'Tavneet Suri and William Jack',
        title: 'The Long-Run Poverty and Gender Impacts of Mobile Money',
        year: '2016',
        type: 'secondary',
      },
    ],
    confidence: 'established',
  },
]
