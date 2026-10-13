import type { Entry } from '../../types'
import { locationLabel } from './labels'
import type { PersonalCollection, PersonalItem } from './types'

/**
 * Plain-text exports of a personal atlas. They contain only what the user
 * accepted (titles, their own summaries, short supporting passages and
 * source references). Original files are never included.
 */

function ref(m: { fileName: string; page: number }): string {
  return locationLabel(m)
}

function itemLine(i: PersonalItem): string {
  const where = i.place.name && !i.place.nonGeographical ? `, ${i.place.name}` : ''
  const status = i.status === 'user-confirmed' ? '' : ' (not individually reviewed)'
  return `- **${i.title}** — ${i.date.display}${where}${status}`
}

export function markdownReadingList(c: PersonalCollection, curated: Entry[]): string {
  const byId = new Map(curated.map((e) => [e.id, e]))
  const lines: string[] = [
    `# ${c.name}`,
    '',
    `Exported ${new Date().toISOString().slice(0, 10)}. Built on this device from your own notes.`,
    '',
  ]
  const dated = [...c.items].sort((a, b) => (a.date.start ?? Infinity) - (b.date.start ?? Infinity))
  lines.push('## From your notes', '')
  for (const i of dated) {
    lines.push(itemLine(i))
    if (i.summary) lines.push(`  - ${i.summary}`)
    for (const m of i.mentions.slice(0, 2))
      lines.push(`  - “${m.passage}” (${m.docTitle}, ${ref(m)})`)
  }
  if (c.links.length) {
    lines.push('', '## Curated atlas entries your notes mention', '')
    for (const l of c.links) {
      const e = byId.get(l.curatedId)
      lines.push(`- ${e ? e.title : l.curatedId}`)
      for (const m of l.mentions.slice(0, 2))
        lines.push(`  - “${m.passage}” (${m.docTitle}, ${ref(m)})`)
    }
  }
  if (c.relationships.length) {
    lines.push('', '## Relationships from your notes', '')
    const name = (r: string) => {
      if (r.startsWith('item:')) return c.items.find((i) => i.id === r.slice(5))?.title ?? r
      return byId.get(r.slice(8))?.title ?? r
    }
    for (const r of c.relationships) {
      lines.push(
        `- ${name(r.sourceRef)} → ${r.type.replace(/-/g, ' ')} → ${name(r.targetRef)}${r.status === 'proposed' ? ' (proposed, unconfirmed)' : ''}`,
      )
    }
  }
  return lines.join('\n') + '\n'
}

export function sourceList(c: PersonalCollection): string {
  const lines = [`# Sources: ${c.name}`, '']
  for (const d of c.documents) {
    lines.push(
      `- ${d.title} — file “${d.fileName}” (${d.kind.toUpperCase()}, ${d.pageCount} page${d.pageCount === 1 ? '' : 's'}), imported ${d.importedAt.slice(0, 10)}`,
    )
  }
  return lines.join('\n') + '\n'
}

export function entrySummary(c: PersonalCollection): string {
  const header = 'title\tkind\tdate\tplace\tstatus\tsources'
  const rows = c.items.map((i) =>
    [
      i.title,
      i.kind,
      i.date.display,
      i.place.nonGeographical ? '(non-geographical)' : (i.place.name ?? ''),
      i.status,
      [...new Set(i.mentions.map((m) => `${m.docTitle} ${ref(m)}`))].join('; '),
    ]
      .map((x) => x.replace(/[\t\r\n]+/g, ' '))
      .join('\t'),
  )
  return [header, ...rows].join('\n') + '\n'
}

export function unresolvedReport(c: PersonalCollection): string {
  const lines = [`# Unresolved items: ${c.name}`, '']
  const section = (title: string, items: string[]) => {
    lines.push(`## ${title} (${items.length})`, '', ...(items.length ? items : ['- none']), '')
  }
  section(
    'Not individually reviewed',
    c.items.filter((i) => i.status !== 'user-confirmed').map((i) => `- ${i.title}`),
  )
  section(
    'No date',
    c.items.filter((i) => i.date.start === undefined).map((i) => `- ${i.title}`),
  )
  section(
    'No location (and not marked non-geographical)',
    c.items
      .filter((i) => !i.place.nonGeographical && i.place.latitude === undefined)
      .map((i) => `- ${i.title}`),
  )
  section(
    'Unconfirmed relationships',
    c.relationships
      .filter((r) => r.status === 'proposed')
      .map((r) => `- ${r.sourceRef} ${r.type} ${r.targetRef}: “${r.mention.passage}”`),
  )
  return lines.join('\n') + '\n'
}

/** Offers text as a file download. The temporary URL is released straight away. */
export function downloadText(fileName: string, text: string, mime = 'text/plain'): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function safeDownloadName(base: string, ext: string): string {
  const stem =
    base
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'atlas'
  return `${stem}.${ext}`
}
