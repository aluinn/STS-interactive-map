import type { DataBundle, Entry } from '../types'
import { ancientEntries } from './entries.ancient'
import { medievalEntries } from './entries.medieval'
import { renaissanceEntries } from './entries.renaissance'
import { globalEntries } from './entries.global'
import { modernEntries } from './entries.modern'
import { warAndColdWarEntries } from './entries.warAndColdWar'
import { environmentalAndStudiesEntries } from './entries.environmentalAndStudies'
import { philosophyEntries } from './entries.philosophy'
import { sociologyOfPracticeEntries } from './entries.sociologyOfPractice'
import { sociotechnicalLensesEntries } from './entries.sociotechnicalLenses'
import { innovationAndPolicyEntries } from './entries.innovationAndPolicy'
import { globalAndAfricanEntries } from './entries.globalAndAfrican'
import { cultureGenderDiscourseEntries } from './entries.cultureGenderDiscourse'
import { technologyPoliticsEntries } from './entries.technologyPolitics'
import { expertiseAndActivismEntries } from './entries.expertiseAndActivism'
import { openScienceEntries } from './entries.openScience'
import { vaccineTrustAndDigitalEntries } from './entries.vaccineTrustAndDigital'
import { overturnedIdeasEntries } from './entries.overturnedIdeas'
import { newFiguresEntries } from './entries.newFigures'
import { communicationPublicsEntries } from './entries.communicationPublics'
import { digitalPowerEntries } from './entries.digitalPower'
import { modernGeographyEntries } from './entries.modernGeography'
import { cartographyEarthObservationEntries } from './entries.cartographyEarthObservation'
import { relationships as baseRelationships } from './relationships'
import { timeTravelRelationships } from './relationships.timeTravel'
import { debates as baseDebates } from './debates'
import { platformKnowledgeDebates } from './debates.platformKnowledge'
import { journeys as baseJourneys } from './journeys'
import { timeTravelJourneys } from './journeys.timeTravel'
import { knowledgeRoutes } from './knowledgeRoutes'

export const entries: Entry[] = [
  ...ancientEntries,
  ...medievalEntries,
  ...renaissanceEntries,
  ...globalEntries,
  ...modernEntries,
  ...warAndColdWarEntries,
  ...environmentalAndStudiesEntries,
  ...philosophyEntries,
  ...sociologyOfPracticeEntries,
  ...sociotechnicalLensesEntries,
  ...innovationAndPolicyEntries,
  ...globalAndAfricanEntries,
  ...cultureGenderDiscourseEntries,
  ...technologyPoliticsEntries,
  ...expertiseAndActivismEntries,
  ...openScienceEntries,
  ...vaccineTrustAndDigitalEntries,
  ...overturnedIdeasEntries,
  ...newFiguresEntries,
  ...communicationPublicsEntries,
  ...digitalPowerEntries,
  ...modernGeographyEntries,
  ...cartographyEarthObservationEntries,
]

export const relationships = [...baseRelationships, ...timeTravelRelationships]
export const debates = [...baseDebates, ...platformKnowledgeDebates]
export const journeys = [...baseJourneys, ...timeTravelJourneys]

export const routes = knowledgeRoutes

export const dataBundle: DataBundle = {
  entries,
  relationships,
  debates,
  journeys,
  routes,
}
