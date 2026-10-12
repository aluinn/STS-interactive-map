import type { Debate } from '../types'

export const platformKnowledgeDebates: Debate[] = [
  {
    id: 'who-decides-relevance',
    slug: 'who-decides-relevance',
    question: 'Who decides what knowledge is visible — and can ranking ever be neutral?',
    title: 'Relevance, Ranking and Visibility',
    plainLanguageIntroduction:
      'Search engines, recommendation systems and AI assistants decide what each person sees first. Every ranking embodies judgements about what is relevant, authoritative or interesting, so the question is not whether such judgements are made but who makes them, how they can be inspected and how they can be challenged. Earlier knowledge systems — libraries, encyclopaedias, citation indexes, museums — also classified and ranked, and also faced questions about whose knowledge they included. What is new is the scale, the speed, the commercial incentives and the difficulty of seeing how a given system decides.',
    positions: [
      {
        id: 'neutral-enough',
        name: 'Ranking Can Be Made Reasonably Neutral',
        statement:
          'With careful design, testing and transparent criteria, ranking systems can serve users fairly and avoid systematic bias.',
        thinkers: [],
        argumentsFor: [
          'Systems can be audited, and many biases have been reduced after being identified.',
          'Users usually want relevant results, and relevance can be measured by their behaviour.',
        ],
        objections: [
          'Measures such as clicks reflect existing popularity and prejudice, and "relevance" is not a single measurable thing.',
          'Commercial incentives shape design choices that outsiders cannot inspect.',
        ],
      },
      {
        id: 'ranking-is-value-laden',
        name: 'Every Ranking Embodies Values',
        statement:
          'Ranking always decides what counts; the task is to make these choices visible, contestable and accountable rather than to pretend they are neutral.',
        thinkers: [],
        argumentsFor: [
          'Studies of search results show that stereotypes and gaps in the data can shape what appears.',
          'The same reasoning applies to older classifications in libraries and museums.',
        ],
        objections: [
          'If every choice is value-laden, it is not clear how to compare better and worse systems.',
          'Public accountability may be hard to organise at the scale of global platforms.',
        ],
      },
      {
        id: 'plural-and-public',
        name: 'Plural and Publicly Governed Infrastructure',
        statement:
          'Knowledge infrastructure of public importance should offer alternatives and public oversight, so that no single private ranking dominates.',
        thinkers: [],
        argumentsFor: [
          'Public libraries and archives provide models of non-commercial stewardship.',
          'Competition and interoperability can give users real choice.',
        ],
        objections: [
          'Public bodies can also be biased or subject to political pressure.',
          'Building and sustaining alternatives at global scale is expensive.',
        ],
      },
    ],
    thinkers: [],
    historicalCaseIds: [
      'google-pagerank-search',
      'search-ranking-neutrality',
      'recommender-moderation-custodians',
      'private-control-public-knowledge-infrastructure',
      'museums-collections-classification',
    ],
    contemporaryRelevance:
      'Shapes debates on search regulation, AI assistants, content moderation and the funding of public digital libraries and archives.',
    furtherReading: [
      {
        author: 'Safiya Umoja Noble',
        title: 'Algorithms of Oppression',
        year: '2018',
        type: 'secondary',
      },
      {
        author: 'Tarleton Gillespie',
        title: 'Custodians of the Internet',
        year: '2018',
        type: 'secondary',
      },
    ],
    themes: ['platform-power', 'digital-technology'],
    reflectionQuestion:
      'Think of the last time you searched for something important. What would you want to know about how the results were chosen?',
  },
  {
    id: 'who-governs-platforms',
    slug: 'who-governs-platforms',
    question: 'Who should govern the platforms that shape public knowledge?',
    title: 'Governing Platforms',
    plainLanguageIntroduction:
      'Platforms now influence what people read, buy and believe, yet they are privately owned and operate across many legal systems. Proposals range from leaving matters to firms and markets, to detailed state regulation, to public and user control of key infrastructure. Each approach brings trade-offs among innovation, free expression, safety, competition and democratic accountability. The problems are also not all caused by platforms: news economics, politics and social divisions matter as well.',
    positions: [
      {
        id: 'self-regulation',
        name: 'Market and Self-Regulation',
        statement:
          "Competition and companies' own policies are the best way to govern fast-changing technologies.",
        thinkers: [],
        argumentsFor: [
          'Firms can adapt faster than law, and heavy regulation may favour incumbents.',
          'Government control of speech raises risks for free expression.',
        ],
        objections: [
          'Network effects and lock-in limit real competition.',
          "Companies' incentives do not always align with the public interest.",
        ],
      },
      {
        id: 'state-regulation',
        name: 'Democratic State Regulation',
        statement:
          'Elected governments should set binding rules on competition, transparency and risk, as the EU has begun to do.',
        thinkers: [],
        argumentsFor: [
          'Law can require transparency and independent audit.',
          'Competition law has historically checked concentrated power.',
        ],
        objections: [
          'Rules differ between countries, and enforcement is difficult across borders.',
          'Poorly designed regulation can restrict expression or entrench large firms.',
        ],
      },
      {
        id: 'public-and-user-governance',
        name: 'Public and User Governance',
        statement:
          'Important infrastructure should be run by or with public institutions and user communities, as with libraries or open standards.',
        thinkers: [],
        argumentsFor: [
          'Open standards and public stewardship kept the early web open.',
          'Affected users can help set rules that fit their needs.',
        ],
        objections: [
          'Funding and scale are hard to sustain without commercial revenue.',
          'Participation can be unrepresentative.',
        ],
      },
    ],
    thinkers: [],
    historicalCaseIds: [
      'world-wide-web-cern',
      'eu-digital-services-markets-acts',
      'antitrust-sovereignty-contracts',
      'platform-news-publishers-bargaining',
      'platform-lock-in-rent-fees',
    ],
    contemporaryRelevance:
      'Underlies current debates on competition cases, platform liability, news funding and AI regulation.',
    furtherReading: [
      { author: 'Nick Srnicek', title: 'Platform Capitalism', year: '2016', type: 'secondary' },
    ],
    themes: ['platform-power', 'policy-and-participation'],
    reflectionQuestion:
      'Which decisions about the platforms you use should be made by you, by the company, or by the public?',
  },
]
