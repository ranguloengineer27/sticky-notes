import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StickyNote } from '../../components/StickyNote/StickyNote'
import { buildNote } from '../testUtils'

function renderStickyNote(
  overrides: Partial<Parameters<typeof StickyNote>[0]> = {},
) {
  const props = {
    note: buildNote(),
    isEditing: false,
    onUpdate: vi.fn(),
    onStartEditing: vi.fn(),
    onStopEditing: vi.fn(),
    onBringToFront: vi.fn(),
    ...overrides,
  }
  render(<StickyNote {...props} />)
  return props
}

describe('StickyNote', () => {
  it('renders the title and description as static text when not editing', () => {
    renderStickyNote({
      note: buildNote({
        content: { title: 'Groceries', description: 'Milk, eggs' },
      }),
      isEditing: false,
    })

    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Milk, eggs')).toBeInTheDocument()
    expect(screen.queryByLabelText('Note title')).not.toBeInTheDocument()
  })

  it('starts editing when the static content is double-clicked', async () => {
    const user = userEvent.setup()
    const props = renderStickyNote({ isEditing: false })

    await user.dblClick(screen.getByText(props.note.content.title))

    expect(props.onStartEditing).toHaveBeenCalledWith(props.note.id)
  })

  it('renders editable fields populated with the note content when editing', () => {
    const props = renderStickyNote({
      note: buildNote({
        content: { title: 'Groceries', description: 'Milk, eggs' },
      }),
      isEditing: true,
    })

    expect(screen.getByLabelText('Note title')).toHaveValue(
      props.note.content.title,
    )
    expect(screen.getByLabelText('Note description')).toHaveValue(
      props.note.content.description,
    )
  })

  it('reports the merged content when the title changes', () => {
    const props = renderStickyNote({
      note: buildNote({
        content: { title: 'Groceries', description: 'Milk, eggs' },
      }),
      isEditing: true,
    })

    fireEvent.change(screen.getByLabelText('Note title'), {
      target: { value: 'Errands' },
    })

    expect(props.onUpdate).toHaveBeenCalledWith(props.note.id, {
      title: 'Errands',
      description: 'Milk, eggs',
    })
  })

  it('reports the merged content when the description changes', () => {
    const props = renderStickyNote({
      note: buildNote({
        content: { title: 'Groceries', description: 'Milk, eggs' },
      }),
      isEditing: true,
    })

    fireEvent.change(screen.getByLabelText('Note description'), {
      target: { value: 'Milk, eggs, bread' },
    })

    expect(props.onUpdate).toHaveBeenCalledWith(props.note.id, {
      title: 'Groceries',
      description: 'Milk, eggs, bread',
    })
  })

  it('brings the note to front on pointer down', () => {
    const props = renderStickyNote()

    fireEvent.pointerDown(screen.getByText(props.note.content.title))

    expect(props.onBringToFront).toHaveBeenCalledWith(props.note.id)
  })

  it('stops editing when focus moves outside the note', () => {
    const props = renderStickyNote({ isEditing: true })

    fireEvent.blur(screen.getByLabelText('Note title'), {
      relatedTarget: document.body,
    })

    expect(props.onStopEditing).toHaveBeenCalled()
  })

  it('does not stop editing when focus moves to another field within the note', () => {
    const props = renderStickyNote({ isEditing: true })

    fireEvent.blur(screen.getByLabelText('Note title'), {
      relatedTarget: screen.getByLabelText('Note description'),
    })

    expect(props.onStopEditing).not.toHaveBeenCalled()
  })
})
