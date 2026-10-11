import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClusterPanel } from '../features/atlas/ClusterPanel'
import { entries } from '../data'

const members = ['newton', 'boyle', 'royal-society', 'galileo', 'thales', 'natural-philosophy'].map(
  (id) => entries.find((e) => e.id === id)!,
)

function setup(overrides: Partial<React.ComponentProps<typeof ClusterPanel>> = {}) {
  const props = {
    entries: members,
    onClose: vi.fn(),
    onShowOnMap: vi.fn(),
    getRelatedEntries: () => [],
    isSaved: () => false,
    onToggleSave: vi.fn(),
    ...overrides,
  }
  render(<ClusterPanel {...props} />)
  return props
}

describe('ClusterPanel', () => {
  it('states entries and countries separately, not as a bare number', () => {
    setup()
    expect(
      screen.getByRole('heading', { level: 2, name: '6 entries across 3 countries' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: /6 entries across 3 countries/ })).toBeInTheDocument()
  })

  it('moves focus into the panel and closes on Escape', async () => {
    const { onClose } = setup()
    expect(screen.getByRole('heading', { level: 2 })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('expands and collapses country groups with aria-expanded', async () => {
    setup()
    const toggle = screen.getByRole('button', { name: /Italy/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Galileo Galilei')).toBeInTheDocument()
  })

  it('searches within the cluster, shows an empty state, and clears', async () => {
    setup()
    await userEvent.type(screen.getByLabelText('Search within this cluster'), 'newton')
    expect(screen.getByText('Isaac Newton')).toBeInTheDocument()
    expect(screen.queryByText('Robert Boyle')).not.toBeInTheDocument()
    await userEvent.clear(screen.getByLabelText('Search within this cluster'))
    await userEvent.type(screen.getByLabelText('Search within this cluster'), 'zzzz')
    expect(screen.getByText(/No entries in this cluster match/)).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('button', { name: /clear/i })[0])
    expect(screen.getByText('Isaac Newton')).toBeInTheDocument()
  })

  it('sorts chronologically within a country', async () => {
    setup()
    await userEvent.selectOptions(screen.getByLabelText('Sort'), 'chronological')
    const group = screen.getByRole('button', { name: /United Kingdom/ }).closest('section')!
    const titles = within(group)
      .getAllByRole('button')
      .slice(1)
      .map((b) => b.querySelector('span')?.textContent)
    expect(titles).toEqual(
      ['Robert Boyle', 'The Royal Society of London', 'Isaac Newton'].sort(
        (a, b) =>
          entries.find((e) => e.title === a)!.startYear -
          entries.find((e) => e.title === b)!.startYear,
      ),
    )
  })

  it('opens the shared entry detail, offers Show on map and a back button', async () => {
    const { onShowOnMap } = setup()
    await userEvent.click(screen.getByRole('button', { name: /Isaac Newton/ }))
    expect(screen.getByRole('heading', { name: 'Isaac Newton' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /show on map/i }))
    expect(onShowOnMap).toHaveBeenCalledWith('newton')
    await userEvent.click(screen.getByRole('button', { name: /back to list/i }))
    expect(screen.getByLabelText('Search within this cluster')).toBeInTheDocument()
  })

  it('hides the category filter when the cluster has a single category', () => {
    setup({ entries: members.filter((e) => e.kind === 'person') })
    expect(screen.queryByLabelText('Category')).not.toBeInTheDocument()
  })
})
