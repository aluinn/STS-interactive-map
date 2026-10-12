/** Content for the interactive comparison of science-communication models. */

export interface CommunicationModel {
  id: 'deficit' | 'dialogue' | 'participation'
  name: string
  entryId: string
  summary: string
  strengths: string
  limitations: string
  suitable: string
  power: string
  history: string
  examples: string
}

export const communicationModels: CommunicationModel[] = [
  {
    id: 'deficit',
    name: 'Deficit',
    entryId: 'deficit-model-public-understanding',
    summary: 'Supply missing scientific information to a supposedly uninformed public.',
    strengths:
      'Simple, quick and sometimes exactly right: a clear safety instruction or a plain explanation really does help when people lack a fact.',
    limitations:
      'Treats the public as one empty container, ignores existing knowledge and trust, and assumes more information settles disagreements about values or interests.',
    suitable:
      'Clear, uncontested facts; emergencies; teaching a method or a result no one disputes.',
    power:
      'Experts define what counts as knowledge and what the problem is; the public is cast as recipient.',
    history:
      'Prominent in British policy after the 1985 Royal Society report; criticised from the late 1980s and 1990s by research in science and technology studies.',
    examples:
      'Press releases, school outreach talks, many health information campaigns; criticised in the Cumbrian farmers case.',
  },
  {
    id: 'dialogue',
    name: 'Dialogue',
    entryId: 'dialogue-turn-lords-report',
    summary: 'Two-way exchange: institutions listen as well as explain, and respond.',
    strengths:
      'Surfaces public concerns and local knowledge early; can rebuild trust when institutions show they have listened.',
    limitations:
      'Can become performative if the agenda, framing or outcome is fixed beforehand; often involves self-selected participants; may not change decisions.',
    suitable:
      'Emerging technologies and contested policy areas where institutions need to understand public values before deciding.',
    power:
      'Institutions still usually set the questions and decide what to do with what they hear.',
    history:
      'Promoted in the UK after BSE and GM controversies, notably in the House of Lords report of 2000.',
    examples:
      "Public dialogues on new technologies, consultations, science cafés, citizens' panels convened by funders or governments.",
  },
  {
    id: 'participation',
    name: 'Participation',
    entryId: 'participation-consensus-conferences',
    summary: 'Publics help define problems, produce knowledge or influence decisions.',
    strengths:
      'Shares authority; can bring in experience-based expertise and make decisions more legitimate and robust.',
    limitations:
      'Slow and costly; small groups cannot represent everyone; participants may have little real power; organisers can still shape the process.',
    suitable:
      'Decisions with wide consequences and real value conflict, or research where communities hold crucial knowledge.',
    power:
      'Decision-making or knowledge-making power is shared, at least in part, but is rarely equal.',
    history:
      "Developed through Danish consensus conferences (from 1987), participatory research and, later, citizens' assemblies.",
    examples:
      "Consensus conferences, citizens' assemblies, community-based research, patient-led research, citizen science.",
  },
]
