import type { Entry } from '../../types'

export interface Provenance {
  key: 'curated' | 'confirmed' | 'imported' | 'unreviewed'
  label: string
  description: string
}

/** Where an entry came from, in words (colour and shape are never the only cue). */
export function provenanceOf(entry: Entry): Provenance {
  if (entry.origin !== 'personal' || !entry.personal) {
    return {
      key: 'curated',
      label: 'Curated atlas',
      description: 'Part of the atlas’s sourced, curated content.',
    }
  }
  switch (entry.personal.status) {
    case 'user-confirmed':
      return {
        key: 'confirmed',
        label: 'Your notes · confirmed by you',
        description:
          'Built from your own notes and confirmed by you. It has not been checked against published sources.',
      }
    case 'imported':
      return {
        key: 'imported',
        label: 'Your notes · imported',
        description:
          'Built from your own notes and accepted in bulk. It has not been individually reviewed or checked against published sources.',
      }
    default:
      return {
        key: 'unreviewed',
        label: 'Your notes · needs review',
        description:
          'A suggestion found in your notes that you have not reviewed yet. Treat it as unverified.',
      }
  }
}
