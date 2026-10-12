import type { Relationship } from '../types'

// Relationships for the communication, digital-power, geography and
// earth-observation entries. As elsewhere, an edge records a documented
// connection or explicit response, not mere similarity of topic.

export const timeTravelRelationships: Relationship[] = [
  {
    id: 't1',
    sourceId: 'brian-wynne-cumbrian-sheep-farmers',
    targetId: 'deficit-model-public-understanding',
    type: 'criticised',
    summary:
      "Wynne's study of Cumbrian farmers was a direct critique of the assumption that public doubt reflects missing information.",
    confidence: 'established',
  },
  {
    id: 't2',
    sourceId: 'dialogue-turn-lords-report',
    targetId: 'deficit-model-public-understanding',
    type: 'revised',
    summary:
      'The 2000 report argued that one-way explanation was no longer sufficient and called for dialogue with the public.',
    confidence: 'established',
  },
  {
    id: 't3',
    sourceId: 'bse-crisis-uk',
    targetId: 'dialogue-turn-lords-report',
    type: 'influenced',
    summary:
      "The loss of trust after BSE was among the controversies that prompted the Lords committee's inquiry.",
    confidence: 'established',
  },
  {
    id: 't4',
    sourceId: 'collins-evans-expertise',
    targetId: 'aids-activism-treatment-expertise',
    type: 'applied-to',
    summary:
      "Collins and Evans's categories of contributory and interactional expertise have been used to describe what AIDS activists acquired.",
    confidence: 'likely',
  },
  {
    id: 't5',
    sourceId: 'patient-organisations-research-in-the-wild',
    targetId: 'aids-activism-treatment-expertise',
    type: 'independently-developed',
    summary:
      'French patient organisations and American AIDS activists independently built forms of patient expertise that influenced research agendas.',
    confidence: 'likely',
  },
  {
    id: 't6',
    sourceId: 'manufactured-doubt-tobacco-climate',
    targetId: 'climate-science-scepticism',
    type: 'influenced',
    summary:
      'Oreskes and Conway argued that some tactics and people from the tobacco campaigns reappeared in climate-science disputes.',
    confidence: 'contested',
  },
  {
    id: 't7',
    sourceId: 'frankenstein-science-fiction',
    targetId: 'science-in-film-television-cosmos',
    type: 'influenced',
    summary:
      'Frankenstein supplied images of the scientist and creation that film and television repeatedly reused or reacted against.',
    confidence: 'likely',
  },
  {
    id: 't8',
    sourceId: 'colonial-collecting-human-remains',
    targetId: 'museums-collections-classification',
    type: 'extracted',
    summary:
      "Museum collections of human remains and objects were assembled through colonial extraction, as Baartman's case illustrates.",
    confidence: 'established',
  },
  {
    id: 't9',
    sourceId: 'restitution-sarr-savoy',
    targetId: 'museums-collections-classification',
    type: 'challenged',
    summary:
      'The report challenged the authority of museums to retain collections acquired in colonial contexts.',
    confidence: 'established',
  },
  {
    id: 't10',
    sourceId: 'scientific-racism',
    targetId: 'colonial-collecting-human-remains',
    type: 'influenced',
    summary:
      'Racial classification supplied the scientific rationale for exhibiting and dissecting people such as Sarah Baartman.',
    confidence: 'established',
  },
  {
    id: 't11',
    sourceId: 'citizen-science-power-labour-credit',
    targetId: 'galaxy-zoo-citizen-science',
    type: 'applied-to',
    summary:
      'Typologies of participation are used to place classification projects like Galaxy Zoo among levels of volunteer involvement.',
    confidence: 'likely',
  },
  {
    id: 't12',
    sourceId: 'conspiracy-narratives-mmr',
    targetId: 'news-media-science-media-centre',
    type: 'influenced',
    summary:
      'The MMR controversy was among the episodes that led to the creation of the Science Media Centre in 2002.',
    confidence: 'likely',
  },
  {
    id: 't13',
    sourceId: 'conspiracy-narratives-mmr',
    targetId: 'hpv-vaccine-ireland-regret',
    type: 'influenced',
    summary:
      'Narratives of vaccine harm circulated internationally and shaped the climate in which later controversies unfolded.',
    confidence: 'contested',
  },
  {
    id: 't14',
    sourceId: 'risk-hazard-uncertainty',
    targetId: 'bse-crisis-uk',
    type: 'applied-to',
    summary:
      'The distinctions between risk, uncertainty and ignorance help to explain how BSE reassurance failed.',
    confidence: 'likely',
  },
  {
    id: 't15',
    sourceId: 'wicked-problems-rittel-webber',
    targetId: 'spice-geoengineering-project',
    type: 'applied-to',
    summary:
      'Disputes over geoengineering are often described as wicked problems with contested definitions and no final solution.',
    confidence: 'likely',
  },
  {
    id: 't16',
    sourceId: 'transatlantic-telegraph-cable',
    targetId: 'subsea-cables-and-data-centres',
    type: 'materially-enabled',
    summary:
      'Later subsea cables follow corridors and landing sites first established for telegraph cables.',
    confidence: 'likely',
  },
  {
    id: 't17',
    sourceId: 'arpanet-early-internet',
    targetId: 'world-wide-web-cern',
    type: 'materially-enabled',
    summary: 'The web ran on the internet protocols developed through ARPANET and its successors.',
    confidence: 'established',
  },
  {
    id: 't18',
    sourceId: 'world-wide-web-cern',
    targetId: 'google-pagerank-search',
    type: 'materially-enabled',
    summary: 'A public, openly linkable web provided the material that PageRank ranked.',
    confidence: 'established',
  },
  {
    id: 't19',
    sourceId: 'search-ranking-neutrality',
    targetId: 'google-pagerank-search',
    type: 'criticised',
    summary:
      'Critical studies of search question whether ranking systems such as PageRank are neutral.',
    confidence: 'likely',
  },
  {
    id: 't20',
    sourceId: 'silicon-valley-semiconductors-cold-war',
    targetId: 'homebrew-personal-computing',
    type: 'materially-enabled',
    summary:
      'Semiconductor firms in the Santa Clara Valley produced the chips on which hobbyist and personal computers were built.',
    confidence: 'established',
  },
  {
    id: 't21',
    sourceId: 'cold-war-big-science',
    targetId: 'silicon-valley-semiconductors-cold-war',
    type: 'funded',
    summary:
      "Defence and space contracts bought early integrated circuits and sustained the region's electronics firms.",
    confidence: 'established',
  },
  {
    id: 't22',
    sourceId: 'venture-capital-bay-area',
    targetId: 'genentech-biotech-commercialisation',
    type: 'funded',
    summary: "Venture capital helped to finance Genentech's early development.",
    confidence: 'established',
  },
  {
    id: 't23',
    sourceId: 'asilomar-recombinant-dna-1975',
    targetId: 'genentech-biotech-commercialisation',
    type: 'regulated',
    summary:
      'The safety principles set out at Asilomar fed into guidelines that governed recombinant DNA work, including at new companies.',
    confidence: 'likely',
  },
  {
    id: 't24',
    sourceId: 'genentech-biotech-commercialisation',
    targetId: 'assetisation-technoscientific-rent',
    type: 'applied-to',
    summary:
      'The patenting and licensing around recombinant DNA is a case study in turning research into assets.',
    confidence: 'likely',
  },
  {
    id: 't25',
    sourceId: 'aws-cloud-computing',
    targetId: 'transformers-generative-ai',
    type: 'materially-enabled',
    summary:
      'Large-scale cloud computing supplied the computing power on which large models are trained and run.',
    confidence: 'likely',
  },
  {
    id: 't26',
    sourceId: 'facebook-social-platforms',
    targetId: 'surveillance-capitalism',
    type: 'applied-to',
    summary:
      'Surveillance capitalism is analysed through the business models of platforms such as Facebook.',
    confidence: 'likely',
  },
  {
    id: 't27',
    sourceId: 'platform-lock-in-rent-fees',
    targetId: 'platform-enshittification',
    type: 'influenced',
    summary:
      'Economic work on lock-in and platform rent underlies the proposed pattern of "enshittification".',
    confidence: 'likely',
  },
  {
    id: 't28',
    sourceId: 'iphone-app-ecosystem',
    targetId: 'platform-lock-in-rent-fees',
    type: 'applied-to',
    summary: 'App store fees and restrictions are a standard example of platform rent and lock-in.',
    confidence: 'likely',
  },
  {
    id: 't29',
    sourceId: 'training-data-language-inequality',
    targetId: 'transformers-generative-ai',
    type: 'criticised',
    summary:
      'The stochastic-parrots paper criticised the scaling of language models on uneven web data.',
    confidence: 'established',
  },
  {
    id: 't30',
    sourceId: 'ai-governance-and-safety-institutions',
    targetId: 'transformers-generative-ai',
    type: 'regulated',
    summary:
      'AI safety institutes and regulation have responded to the rapid deployment of generative AI.',
    confidence: 'likely',
  },
  {
    id: 't31',
    sourceId: 'eu-digital-services-markets-acts',
    targetId: 'recommender-moderation-custodians',
    type: 'regulated',
    summary:
      'The Digital Services Act sets transparency and risk-assessment duties for recommendation and moderation systems.',
    confidence: 'established',
  },
  {
    id: 't32',
    sourceId: 'antitrust-sovereignty-contracts',
    targetId: 'google-pagerank-search',
    type: 'regulated',
    summary: 'US competition litigation concerned how the dominant search business was maintained.',
    confidence: 'established',
  },
  {
    id: 't33',
    sourceId: 'platform-news-publishers-bargaining',
    targetId: 'facebook-social-platforms',
    type: 'regulated',
    summary:
      "Australia's bargaining code applied directly to Facebook and Google as distributors of news.",
    confidence: 'established',
  },
  {
    id: 't34',
    sourceId: 'technologies-of-self-algorithmic-identity',
    targetId: 'discourse-identity-subject-formation',
    type: 'influenced',
    summary:
      "Foucault's concepts of subject formation underlie the idea of technologies of the self and algorithmic identity.",
    confidence: 'likely',
  },
  {
    id: 't35',
    sourceId: 'cern-geneva-big-science',
    targetId: 'world-wide-web-cern',
    type: 'materially-enabled',
    summary:
      "CERN's computing needs and open culture provided the setting in which the web was created.",
    confidence: 'established',
  },
  {
    id: 't36',
    sourceId: 'tsmc-hsinchu-semiconductors',
    targetId: 'transformers-generative-ai',
    type: 'materially-enabled',
    summary:
      'Advanced chips made in a few foundries underpin the training and running of large AI models.',
    confidence: 'likely',
  },
  {
    id: 't37',
    sourceId: 'oxford-cambridge-research-corridor',
    targetId: 'human-genome-project-bermuda-principles',
    type: 'collaborated',
    summary:
      'The Sanger Centre near Cambridge was a major contributor to the Human Genome Project and to its open data principles.',
    confidence: 'established',
  },
  {
    id: 't38',
    sourceId: 'ushahidi-crowdmapping-nairobi',
    targetId: 'mobile-money-east-africa',
    type: 'independently-developed',
    summary:
      'Two locally built technologies emerged in Kenya in the same years, from similar mobile-phone infrastructure.',
    confidence: 'likely',
  },
  {
    id: 't39',
    sourceId: 'ptolemy',
    targetId: 'mercator-projection-1569',
    type: 'influenced',
    summary:
      "Ptolemy's Geography, rediscovered in the Renaissance, shaped how later mapmakers thought about coordinates and projections.",
    confidence: 'established',
  },
  {
    id: 't41',
    sourceId: 'keeling-curve-mauna-loa',
    targetId: 'ipcc-assessment-reports',
    type: 'influenced',
    summary:
      'The carbon dioxide record is among the long-term datasets that IPCC assessments draw on.',
    confidence: 'established',
  },
  {
    id: 't42',
    sourceId: 'climate-science-scepticism',
    targetId: 'ipcc-assessment-reports',
    type: 'criticised',
    summary:
      'The IPCC has been a frequent target of criticism from climate sceptics, as well as from some scientists who consider it too cautious.',
    confidence: 'established',
  },
  {
    id: 't43',
    sourceId: 'landsat-earth-observation',
    targetId: 'open-access-and-inequality',
    type: 'applied-to',
    summary:
      "Landsat's free-data policy is an example of how open access changes use of a scientific resource.",
    confidence: 'likely',
  },
]
