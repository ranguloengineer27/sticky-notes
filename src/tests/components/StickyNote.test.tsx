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
    onDrag: vi.fn(),
    onResize: vi.fn(),
    onColorChange: vi.fn(),
    onShapeChange: vi.fn(),
    onDragOverTrash: vi.fn(),
    onDrop: vi.fn(),
    onStartEditing: vi.fn(),
    onStopEditing: vi.fn(),
    onBringToFront: vi.fn(),
    ...overrides,
  }
  const { rerender } = render(<StickyNote {...props} />)
  return {
    ...props,
    rerenderWithProps: (
      nextOverrides: Partial<Parameters<typeof StickyNote>[0]>,
    ) => rerender(<StickyNote {...props} {...nextOverrides} />),
  }
}

describe('StickyNote', () => {
  it('renders the description as static text when not editing', () => {
    renderStickyNote({
      note: buildNote({
        content: { title: 'Groceries', description: 'Milk, eggs' },
      }),
      isEditing: false,
    })

    expect(screen.getByText('Milk, eggs')).toBeInTheDocument()
    expect(screen.queryByLabelText('Note description')).not.toBeInTheDocument()
  })

  it('starts editing when the static content is double-clicked', async () => {
    const user = userEvent.setup()
    const props = renderStickyNote({
      note: buildNote({
        content: { title: 'Groceries', description: 'Milk, eggs' },
      }),
      isEditing: false,
    })

    await user.dblClick(screen.getByText(props.note.content.description))

    expect(props.onStartEditing).toHaveBeenCalledWith(props.note.id)
  })

  it('starts editing when the note shape container itself is double-clicked', () => {
    const props = renderStickyNote({ isEditing: false })

    fireEvent.doubleClick(screen.getByTestId('sticky-note-shape'))

    expect(props.onStartEditing).toHaveBeenCalledWith(props.note.id)
  })

  it('does not start editing when a resize handle is double-clicked', () => {
    const props = renderStickyNote({ isEditing: false })

    fireEvent.doubleClick(screen.getByTestId('resize-handle-top-left'))

    expect(props.onStartEditing).not.toHaveBeenCalled()
  })

  it('does not call onStartEditing again when the note is double-clicked while already editing', () => {
    const props = renderStickyNote({ isEditing: true })

    fireEvent.doubleClick(screen.getByTestId('sticky-note'))

    expect(props.onStartEditing).not.toHaveBeenCalled()
  })

  it('starts editing when the edit button is clicked', () => {
    const props = renderStickyNote({ isEditing: false })

    fireEvent.click(screen.getByRole('button', { name: 'Edit note' }))

    expect(props.onStartEditing).toHaveBeenCalledWith(props.note.id)
  })

  it('does not start a drag when the pointer goes down on the edit button', () => {
    const props = renderStickyNote({
      note: buildNote({ position: { x: 40, y: 60, zIndex: 1 } }),
      isEditing: false,
    })
    const editButton = screen.getByRole('button', { name: 'Edit note' })

    fireEvent.pointerDown(editButton, {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    })
    fireEvent.pointerMove(document.body, {
      pointerId: 1,
      clientX: 130,
      clientY: 90,
    })

    expect(props.onDrag).not.toHaveBeenCalled()
  })

  it('focuses the description field automatically when it mounts already in edit mode', () => {
    renderStickyNote({ isEditing: true })

    expect(screen.getByLabelText('Note description')).toHaveFocus()
  })

  it('focuses the description field automatically when transitioning into edit mode', () => {
    const props = {
      note: buildNote(),
      isEditing: false,
      onUpdate: vi.fn(),
      onDrag: vi.fn(),
      onResize: vi.fn(),
      onColorChange: vi.fn(),
      onShapeChange: vi.fn(),
      onDragOverTrash: vi.fn(),
      onDrop: vi.fn(),
      onStartEditing: vi.fn(),
      onStopEditing: vi.fn(),
      onBringToFront: vi.fn(),
    }
    const { rerender } = render(<StickyNote {...props} />)

    rerender(<StickyNote {...props} isEditing />)

    expect(screen.getByLabelText('Note description')).toHaveFocus()
  })

  it('renders the description field populated with the note content when editing', () => {
    const props = renderStickyNote({
      note: buildNote({
        content: { title: 'Groceries', description: 'Milk, eggs' },
      }),
      isEditing: true,
    })

    expect(screen.getByLabelText('Note description')).toHaveValue(
      props.note.content.description,
    )
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
    const props = renderStickyNote({
      note: buildNote({
        content: { title: 'Groceries', description: 'Milk, eggs' },
      }),
    })

    fireEvent.pointerDown(screen.getByText(props.note.content.description))

    expect(props.onBringToFront).toHaveBeenCalledWith(props.note.id)
  })

  it('reports the new position while dragging from the note surface', () => {
    const props = renderStickyNote({
      note: buildNote({ position: { x: 40, y: 60, zIndex: 1 } }),
    })
    const noteElement = screen.getByTestId('sticky-note')

    fireEvent.pointerDown(noteElement, {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    })
    fireEvent.pointerMove(noteElement, {
      pointerId: 1,
      clientX: 130,
      clientY: 90,
    })

    expect(props.onDrag).toHaveBeenCalledWith(props.note.id, 70, 50)
  })

  it('reports the note candidate position over the trash zone while dragging', () => {
    const props = renderStickyNote({
      note: buildNote({ position: { x: 40, y: 60, zIndex: 1 } }),
    })
    const noteElement = screen.getByTestId('sticky-note')

    fireEvent.pointerDown(noteElement, {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    })
    fireEvent.pointerMove(document.body, {
      pointerId: 1,
      clientX: 900,
      clientY: 600,
    })

    expect(props.onDragOverTrash).toHaveBeenCalledWith(
      840,
      560,
      props.note.size,
    )
  })

  it('reports the note candidate position when the drag ends', () => {
    const props = renderStickyNote({
      note: buildNote({ position: { x: 40, y: 60, zIndex: 1 } }),
    })
    const noteElement = screen.getByTestId('sticky-note')

    fireEvent.pointerDown(noteElement, {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    })
    fireEvent.pointerMove(document.body, {
      pointerId: 1,
      clientX: 130,
      clientY: 90,
    })
    fireEvent.pointerUp(document.body, {
      pointerId: 1,
      clientX: 130,
      clientY: 90,
    })

    expect(props.onDrop).toHaveBeenCalledWith(
      props.note.id,
      70,
      50,
      props.note.size,
    )
  })

  it('reports the note current position when the drag ends without any movement', () => {
    const props = renderStickyNote({
      note: buildNote({ position: { x: 40, y: 60, zIndex: 1 } }),
    })
    const noteElement = screen.getByTestId('sticky-note')

    fireEvent.pointerDown(noteElement, {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    })
    fireEvent.pointerUp(document.body, {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    })

    expect(props.onDrop).toHaveBeenCalledWith(
      props.note.id,
      40,
      60,
      props.note.size,
    )
  })

  it('does not report trash position while resizing', () => {
    const props = renderStickyNote({
      note: buildNote({
        position: { x: 40, y: 60, zIndex: 1 },
        size: { width: 200, height: 150 },
      }),
    })
    const handle = screen.getByTestId('resize-handle-bottom-right')

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(document.body, {
      pointerId: 1,
      clientX: 900,
      clientY: 600,
    })
    fireEvent.pointerUp(document.body, {
      pointerId: 1,
      clientX: 900,
      clientY: 600,
    })

    expect(props.onDragOverTrash).not.toHaveBeenCalled()
    expect(props.onDrop).not.toHaveBeenCalled()
  })

  it('reports the selected color when an option in the note menu is picked', () => {
    const props = renderStickyNote({
      note: buildNote({ color: '#DE7373' }),
      isEditing: false,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Note options' }))
    fireEvent.click(screen.getByRole('button', { name: 'Change note color' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Set note color to #87E6AC' }),
    )

    expect(props.onColorChange).toHaveBeenCalledWith(props.note.id, '#87E6AC')
  })

  it('does not start a drag when the pointer goes down on the note menu trigger, its chips, or a popover option', () => {
    const props = renderStickyNote({
      note: buildNote({ position: { x: 40, y: 60, zIndex: 1 } }),
      isEditing: false,
    })

    function expectNoDragOnPointerDown(
      target: HTMLElement,
      pointerId: number,
    ): void {
      fireEvent.pointerDown(target, { pointerId, clientX: 100, clientY: 100 })
      fireEvent.pointerMove(document.body, {
        pointerId,
        clientX: 130,
        clientY: 90,
      })

      expect(props.onDrag).not.toHaveBeenCalled()
    }

    const trigger = screen.getByRole('button', { name: 'Note options' })
    expectNoDragOnPointerDown(trigger, 1)

    fireEvent.click(trigger)
    const colorChip = screen.getByRole('button', { name: 'Change note color' })
    expectNoDragOnPointerDown(colorChip, 2)

    fireEvent.click(colorChip)
    const colorOption = screen.getByRole('button', {
      name: 'Set note color to #FCE477',
    })
    expectNoDragOnPointerDown(colorOption, 3)

    fireEvent.click(colorOption)
    const shapeChip = screen.getByRole('button', { name: 'Change note shape' })
    expectNoDragOnPointerDown(shapeChip, 4)

    fireEvent.click(shapeChip)
    const shapeOption = screen.getByRole('button', {
      name: 'Set note shape to circle',
    })
    expectNoDragOnPointerDown(shapeOption, 5)
  })

  it('does not start a drag when the pointer goes down on an editable field', () => {
    const props = renderStickyNote({
      note: buildNote({ position: { x: 40, y: 60, zIndex: 1 } }),
      isEditing: true,
    })
    const description = screen.getByLabelText('Note description')

    fireEvent.pointerDown(description, {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    })
    fireEvent.pointerMove(screen.getByTestId('sticky-note'), {
      pointerId: 1,
      clientX: 130,
      clientY: 90,
    })

    expect(props.onDrag).not.toHaveBeenCalled()
  })

  it('reports the new bounds while resizing from the bottom-right handle', () => {
    const props = renderStickyNote({
      note: buildNote({
        position: { x: 40, y: 60, zIndex: 1 },
        size: { width: 200, height: 150 },
      }),
    })
    const handle = screen.getByTestId('resize-handle-bottom-right')

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 130, clientY: 90 })

    expect(props.onResize).toHaveBeenCalledWith(props.note.id, 'bottom-right', {
      x: 40,
      y: 60,
      width: 230,
      height: 140,
    })
  })

  it('reports the new bounds while resizing from the top-left handle', () => {
    const props = renderStickyNote({
      note: buildNote({
        position: { x: 40, y: 60, zIndex: 1 },
        size: { width: 200, height: 150 },
      }),
    })
    const handle = screen.getByTestId('resize-handle-top-left')

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 130, clientY: 90 })

    expect(props.onResize).toHaveBeenCalledWith(props.note.id, 'top-left', {
      x: 70,
      y: 50,
      width: 170,
      height: 160,
    })
  })

  it('reports the new bounds while resizing from the top-right handle', () => {
    const props = renderStickyNote({
      note: buildNote({
        position: { x: 40, y: 60, zIndex: 1 },
        size: { width: 200, height: 150 },
      }),
    })
    const handle = screen.getByTestId('resize-handle-top-right')

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 130, clientY: 90 })

    expect(props.onResize).toHaveBeenCalledWith(props.note.id, 'top-right', {
      x: 40,
      y: 50,
      width: 230,
      height: 160,
    })
  })

  it('reports the new bounds while resizing from the bottom-left handle', () => {
    const props = renderStickyNote({
      note: buildNote({
        position: { x: 40, y: 60, zIndex: 1 },
        size: { width: 200, height: 150 },
      }),
    })
    const handle = screen.getByTestId('resize-handle-bottom-left')

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 130, clientY: 90 })

    expect(props.onResize).toHaveBeenCalledWith(props.note.id, 'bottom-left', {
      x: 70,
      y: 60,
      width: 170,
      height: 140,
    })
  })

  it('brings the note to front and does not also start a note drag when resizing', () => {
    const props = renderStickyNote({
      note: buildNote({
        position: { x: 40, y: 60, zIndex: 1 },
        size: { width: 200, height: 150 },
      }),
    })
    const handle = screen.getByTestId('resize-handle-bottom-right')

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 130, clientY: 90 })

    expect(props.onBringToFront).toHaveBeenCalledTimes(1)
    expect(props.onBringToFront).toHaveBeenCalledWith(props.note.id)
    expect(props.onDrag).not.toHaveBeenCalled()
  })

  it('defaults to a square shape when the note has no shape set', () => {
    renderStickyNote({
      note: buildNote({ shape: undefined }),
      isEditing: false,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Note options' }))
    fireEvent.click(screen.getByRole('button', { name: 'Change note shape' }))

    expect(
      screen.getByRole('button', { name: 'Set note shape to square' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('reports the selected shape when an option in the note menu is picked', () => {
    const props = renderStickyNote({
      note: buildNote({ shape: 'square' }),
      isEditing: false,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Note options' }))
    fireEvent.click(screen.getByRole('button', { name: 'Change note shape' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Set note shape to triangle' }),
    )

    expect(props.onShapeChange).toHaveBeenCalledWith(props.note.id, 'triangle')
  })

  it('shows the emoji picker toggle only while editing', () => {
    renderStickyNote({ isEditing: false })

    expect(
      screen.queryByRole('button', { name: 'Insert emoji' }),
    ).not.toBeInTheDocument()
  })

  it('inserts the selected emoji at the end of the description', () => {
    const props = renderStickyNote({
      note: buildNote({ content: { title: 'Groceries', description: 'Milk' } }),
      isEditing: true,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Insert emoji' }))
    fireEvent.click(screen.getByRole('button', { name: 'Insert 😀 emoji' }))

    expect(props.onUpdate).toHaveBeenCalledWith(props.note.id, {
      title: 'Groceries',
      description: 'Milk😀',
    })
  })

  it('inserts the selected emoji at the caret position', () => {
    const props = renderStickyNote({
      note: buildNote({ content: { title: 'Groceries', description: 'Milk' } }),
      isEditing: true,
    })
    const textarea = screen.getByLabelText(
      'Note description',
    ) as HTMLTextAreaElement
    textarea.setSelectionRange(2, 2)

    fireEvent.click(screen.getByRole('button', { name: 'Insert emoji' }))
    fireEvent.click(screen.getByRole('button', { name: 'Insert 😀 emoji' }))

    expect(props.onUpdate).toHaveBeenCalledWith(props.note.id, {
      title: 'Groceries',
      description: 'Mi😀lk',
    })
  })

  it('does not stop editing when the emoji picker toggle is clicked', () => {
    const props = renderStickyNote({ isEditing: true })

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Insert emoji' }))

    expect(props.onStopEditing).not.toHaveBeenCalled()
  })

  it('restores focus and caret position after the emoji is inserted into the description', () => {
    const props = renderStickyNote({
      note: buildNote({ content: { title: 'Groceries', description: 'Milk' } }),
      isEditing: true,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Insert emoji' }))
    fireEvent.click(screen.getByRole('button', { name: 'Insert 😀 emoji' }))

    const updatedContent = vi.mocked(props.onUpdate).mock.calls[0][1]
    props.rerenderWithProps({
      note: { ...props.note, content: updatedContent },
    })

    const textarea = screen.getByLabelText(
      'Note description',
    ) as HTMLTextAreaElement
    expect(textarea).toHaveFocus()
    expect(textarea.selectionStart).toBe(updatedContent.description.length)
    expect(textarea.selectionEnd).toBe(updatedContent.description.length)
  })

  it('stops editing when a pointer goes down outside the note', () => {
    const props = renderStickyNote({ isEditing: true })

    fireEvent.pointerDown(document.body)

    expect(props.onStopEditing).toHaveBeenCalled()
  })

  it('does not stop editing when a pointer goes down inside the note', () => {
    const props = renderStickyNote({ isEditing: true })

    fireEvent.pointerDown(screen.getByLabelText('Note description'))

    expect(props.onStopEditing).not.toHaveBeenCalled()
  })

  it('does not report a stop-editing click while not in edit mode', () => {
    const props = renderStickyNote({ isEditing: false })

    fireEvent.pointerDown(document.body)

    expect(props.onStopEditing).not.toHaveBeenCalled()
  })
})
