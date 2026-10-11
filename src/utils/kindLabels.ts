import type { EntryKind } from '../types'

/** Human-readable names for each entry kind. */
export const KIND_LABELS: Record<EntryKind, string> = {
  person: 'Person',
  idea: 'Idea / theory',
  discovery: 'Discovery',
  experiment: 'Experiment',
  instrument: 'Instrument',
  text: 'Text',
  institution: 'Institution',
  event: 'Event',
  debate: 'Debate',
}
