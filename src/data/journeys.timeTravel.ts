import type { Journey } from '../types'

// Six journeys for the communication, digital-power and earth-observation
// strands. Each is a short argument, not a complete history.

export const timeTravelJourneys: Journey[] = [
  {
    id: 'print-to-podcasts',
    slug: 'print-to-podcasts',
    title: 'From Print to Podcasts',
    summary:
      'How the media through which science reaches publics changed — from printed journals to platforms — and how audiences have always done their own interpreting.',
    themes: ['media-and-meaning', 'communication-and-publics'],
    stops: [
      {
        entryId: 'henry-oldenburg-philosophical-transactions',
        caption: 'A printed journal creates a record and an audience of readers.',
      },
      {
        entryId: 'frankenstein-science-fiction',
        caption: 'Fiction gives the public a story about scientific ambition.',
      },
      {
        entryId: 'hall-encoding-decoding',
        caption: 'Audiences, a media theorist argues, decode messages in their own ways.',
        stageQuestion: 'Does the same broadcast mean the same thing to every viewer?',
      },
      {
        entryId: 'science-in-film-television-cosmos',
        caption: 'Television carries science into millions of homes.',
      },
      {
        entryId: 'world-wide-web-cern',
        caption: 'The web lets anyone publish — and anyone find.',
      },
      {
        entryId: 'science-podcasts-new-audio-publics',
        caption: 'Podcasts offer long, informal conversation outside broadcasters.',
      },
      {
        entryId: 'platform-news-publishers-bargaining',
        caption: 'And platforms, not publishers, now control much of distribution.',
        stageQuestion:
          'Who pays for public-interest reporting when platforms capture the audience?',
      },
    ],
    whatChanged:
      'The channels widened and the gatekeepers shifted from editors and broadcasters to a few platforms.',
    whatRemainsDisputed:
      'Whether new media made publics better informed, more fragmented, or both, and whether audience interpretation matters more than distribution.',
    reflectionQuestion:
      'Where did you last learn something about science, and who chose to show it to you?',
  },
  {
    id: 'communicating-risk',
    slug: 'communicating-risk',
    title: 'Communicating Risk',
    summary:
      'From the deficit model through BSE to the problem of uncertainty: what honest communication of risk requires, and why more facts do not automatically create trust.',
    themes: ['risk-and-uncertainty', 'communication-and-publics'],
    stops: [
      {
        entryId: 'deficit-model-public-understanding',
        caption: 'The assumption that the public lacks facts.',
      },
      {
        entryId: 'brian-wynne-cumbrian-sheep-farmers',
        caption: "Farmers' local knowledge versus confident official models.",
      },
      {
        entryId: 'bse-crisis-uk',
        caption: 'Reassurance about an uncertain risk collapses when the evidence changes.',
        stageQuestion: 'Is it better to say "no risk" or "we do not yet know"?',
      },
      {
        entryId: 'risk-hazard-uncertainty',
        caption: 'The vocabulary: hazard, risk, probability, uncertainty.',
      },
      {
        entryId: 'trust-trustworthiness-oneill',
        caption: 'Institutions should aim to be trustworthy, not simply trusted.',
      },
      {
        entryId: 'manufactured-doubt-tobacco-climate',
        caption: 'Uncertainty can be real, or it can be used.',
      },
      {
        entryId: 'hpv-vaccine-ireland-regret',
        caption: 'Trust is historical: a vaccine controversy shaped by earlier scandals.',
      },
      {
        entryId: 'wicked-problems-rittel-webber',
        caption: 'Some problems cannot be solved by information alone.',
      },
    ],
    whatChanged:
      'Communicators moved from reassurance towards stating uncertainty and listening to affected people.',
    whatRemainsDisputed:
      'How to communicate uncertainty without losing public confidence, and who should decide acceptable risk.',
    reflectionQuestion:
      'What would an honest "we don\'t know yet" look like in a public statement?',
  },
  {
    id: 'open-web-to-platform-power',
    slug: 'open-web-to-platform-power',
    title: 'From the Open Web to Platform Power',
    summary:
      'A history of public research networks turning into privately run platforms — told without assuming that it had to happen.',
    themes: ['digital-technology', 'platform-power'],
    stops: [
      {
        entryId: 'arpanet-early-internet',
        caption: 'A publicly funded research network.',
      },
      {
        entryId: 'world-wide-web-cern',
        caption: 'An open standard, released into the public domain.',
      },
      {
        entryId: 'google-pagerank-search',
        caption: 'Search ranks the web — and becomes a gateway.',
      },
      {
        entryId: 'facebook-social-platforms',
        caption: 'Profiles and feeds move communication onto private platforms.',
      },
      {
        entryId: 'iphone-app-ecosystem',
        caption: 'A managed marketplace on the phone in your pocket.',
      },
      {
        entryId: 'aws-cloud-computing',
        caption: 'Computing itself becomes a rented service.',
      },
      {
        entryId: 'surveillance-capitalism',
        caption: 'One account of the business model — contested.',
        stageQuestion: 'How much of this was a choice, and whose?',
      },
      {
        entryId: 'platform-lock-in-rent-fees',
        caption: 'Lock-in and fees as another account.',
      },
      {
        entryId: 'eu-digital-services-markets-acts',
        caption: 'And law starts to respond.',
      },
    ],
    whatChanged:
      'Infrastructure and gateways shifted from public research bodies to a small number of firms.',
    whatRemainsDisputed:
      'Whether the shift was inevitable, whether regulation can reverse it, and how much of the harm attributed to platforms is really theirs.',
    reflectionQuestion:
      'What parts of your online life would you want to be run as public infrastructure?',
  },
  {
    id: 'biotechnology-modern-city',
    slug: 'biotechnology-modern-city',
    title: 'Biotechnology and the Modern City',
    summary:
      'How recombinant DNA turned into an industry, and why biotechnology clusters grew in a few cities — and what that means for the people around them.',
    themes: ['biotechnology', 'institutions-and-funding'],
    stops: [
      {
        entryId: 'asilomar-recombinant-dna-1975',
        caption: 'Scientists pause to discuss the risks of their own technique.',
      },
      {
        entryId: 'venture-capital-bay-area',
        caption: 'A particular kind of finance emerges around Sand Hill Road.',
      },
      {
        entryId: 'genentech-biotech-commercialisation',
        caption: 'A company is built on a laboratory technique.',
        stageQuestion: 'What changes when a discovery becomes an asset?',
      },
      {
        entryId: 'human-genome-project-bermuda-principles',
        caption: 'A public project insists that sequence data stay open.',
      },
      {
        entryId: 'boston-cambridge-kendall-square',
        caption: 'A dense cluster forms beside universities and hospitals.',
      },
      {
        entryId: 'oxford-cambridge-research-corridor',
        caption: 'Another corridor links universities, institutes and spin-outs.',
      },
      {
        entryId: 'singapore-biopolis-astar',
        caption: 'A state builds a biomedical campus by design.',
      },
      {
        entryId: 'seoul-hwang-woo-suk-scandal',
        caption: 'And national ambition can also magnify failure.',
      },
    ],
    whatChanged:
      'Biotechnology moved from laboratory benches to companies, clusters and national strategies.',
    whatRemainsDisputed:
      'Who benefits from clusters, how open data and patents should coexist, and what public voice there should be in setting research priorities.',
    reflectionQuestion: 'Who lives in a biotechnology city but does not work in biotechnology?',
  },
  {
    id: 'cartography-to-planetary-observation',
    slug: 'cartography-to-planetary-observation',
    title: 'From Historical Cartography to Planetary Observation',
    summary:
      'How the picture of the Earth changed — from coordinates and chart projections, through colonial surveys, to the view from orbit and the satellite record.',
    themes: ['scientific-images', 'climate'],
    stops: [
      {
        entryId: 'ptolemy',
        caption: 'A system of coordinates and projections from antiquity.',
      },
      {
        entryId: 'mercator-projection-1569',
        caption: 'A chart for sailors that became the default world picture.',
        stageQuestion: 'What does a projection choose to preserve?',
      },
      {
        entryId: 'great-trigonometrical-survey-india',
        caption: 'Mapping as an instrument of empire, done partly by uncredited surveyors.',
      },
      {
        entryId: 'transatlantic-telegraph-cable',
        caption: 'Cables across the seabed link the continents.',
      },
      {
        entryId: 'keeling-curve-mauna-loa',
        caption: "A single instrument measures the planet's atmosphere.",
      },
      {
        entryId: 'earthrise-blue-marble',
        caption: 'The whole Earth appears as one object.',
        stageQuestion:
          'Does seeing the whole Earth help us care for it or imagine we can control it?',
      },
      {
        entryId: 'landsat-earth-observation',
        caption: 'Satellites record the land surface continuously.',
      },
      {
        entryId: 'ipcc-assessment-reports',
        caption: 'Observations are assessed — and negotiated — as a global picture.',
      },
      {
        entryId: 'subsea-cables-and-data-centres',
        caption: 'And the infrastructure that carries the data is itself physical.',
      },
    ],
    whatChanged:
      'The Earth is now observed continuously from orbit and represented as a data-rich globe rather than a chart.',
    whatRemainsDisputed:
      'Who controls observation and data, and whether a view from above supports care for the planet or its management and ownership.',
    reflectionQuestion: 'What parts of the world are hardest to see in the pictures we use most?',
  },
]
