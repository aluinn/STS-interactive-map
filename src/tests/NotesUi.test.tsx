import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CollectionSelector } from '../features/notes/ui/CollectionSelector'
import { ImportPanel } from '../features/notes/ui/ImportPanel'
import { NotesEmpty } from '../features/notes/ui/NotesEmpty'
import { provenanceOf } from '../features/notes/provenance'
import { itemToEntry } from '../features/notes/toEntries'
import type { PersonalItem } from '../features/notes/types'

vi.mock('../features/notes/extract/pdf', () => ({ warmPdf: () => Promise.resolve({}) }))

const item: PersonalItem = {
  id: 'my-person-x',
  title: 'X <img src=x onerror=alert(1)>',
  kind: 'person',
  category: 'person',
  summary: '',
  date: { display: 'Date not given in notes', precision: 'uncertain', approximate: false },
  place: { nonGeographical: false },
  disciplines: [],
  topics: [],
  period: 'environmental-contemporary',
  confidence: 'low',
  status: 'needs-review',
  edits: [],
  mentions: [],
  extraction: 'rule-based (local)',
  createdAt: new Date().toISOString(),
}

describe('collection selector', () => {
  it('offers the three collections as a radio group and reports the choice', async () => {
    const onMode = vi.fn()
    render(
      <CollectionSelector
        mode="curated"
        onMode={onMode}
        curatedCount={226}
        mineCount={0}
        collectionName={null}
        onImport={() => {}}
        onManage={() => {}}
      />,
    )
    const group = screen.getByRole('radiogroup')
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'General Notes' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Your Notes' }))
    expect(onMode).toHaveBeenCalledWith('mine')
  })
})

describe('import panel', () => {
  const base = {
    stage: 'select' as const,
    message: '',
    analysisProgress: null,
    onAddFiles: () => {},
    onRemoveFile: () => {},
    onCancel: () => {},
    onReview: () => {},
    headingRef: createRef<HTMLHeadingElement>(),
  }
  it('has a keyboard-reachable file picker and states the privacy position', () => {
    render(<ImportPanel {...base} files={[]} />)
    expect(screen.getByRole('button', { name: 'Choose files…' })).toBeInTheDocument()
    expect(screen.getByText(/processed on this device/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Review extracted material' })).toBeDisabled()
  })
  it('explains a rejected file with a way to remove it, and announces status', () => {
    const file = new File(['x'], 'notes.docx')
    render(
      <ImportPanel
        {...base}
        files={[
          {
            id: 'a',
            file,
            name: 'notes.docx',
            status: 'error',
            progress: 0,
            total: 0,
            error: 'Word files are not supported yet.',
          },
        ]}
      />,
    )
    expect(screen.getByText('Word files are not supported yet.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove notes.docx' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
  it('exposes progress with an accessible value', () => {
    const file = new File(['x'], 'big.pdf')
    render(
      <ImportPanel
        {...base}
        files={[{ id: 'a', file, name: 'big.pdf', status: 'reading', progress: 3, total: 10 }]}
      />,
    )
    const bar = screen.getByRole('progressbar', { name: /page 3 of 10/ })
    expect(bar).toHaveAttribute('value', '3')
    expect(screen.getByRole('button', { name: 'Remove big.pdf' })).toHaveTextContent(
      'Cancel this file',
    )
  })
})

describe('empty state', () => {
  it('offers a drop target on the blank map and passes chosen files on', async () => {
    const onFiles = vi.fn()
    render(
      <NotesEmpty
        reason="no-collection"
        loading={false}
        onImport={() => {}}
        onFiles={onFiles}
        onShowCurated={() => {}}
      />,
    )
    expect(screen.getByText('Drop your notes here to build your own map')).toBeInTheDocument()
    const input = screen.getByLabelText('Choose note files to add') as HTMLInputElement
    await userEvent.upload(input, new File(['Galileo used a telescope in 1609.'], 'a.md'))
    expect(onFiles).toHaveBeenCalledTimes(1)
  })
  it('explains an empty view of existing notes and how to proceed', async () => {
    const onImport = vi.fn()
    render(
      <NotesEmpty
        reason="no-entries-in-view"
        loading={false}
        onImport={onImport}
        onFiles={() => {}}
        onShowCurated={() => {}}
      />,
    )
    expect(screen.getByText('Nothing from your notes in this view')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Add your notes…' }))
    expect(onImport).toHaveBeenCalled()
  })
})

describe('provenance', () => {
  it('names where an entry came from in words', () => {
    const e = itemToEntry(item, 'col-1')
    expect(provenanceOf(e).label).toBe('Your notes · needs review')
    expect(provenanceOf({ ...e, origin: undefined, personal: undefined }).label).toBe(
      'Curated atlas',
    )
  })
  it('keeps hostile text in titles as plain text', () => {
    const e = itemToEntry(item, 'col-1')
    const { container } = render(<h1>{e.title}</h1>)
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toContain('<img src=x')
  })
})
