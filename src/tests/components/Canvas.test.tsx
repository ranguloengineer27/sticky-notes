import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Canvas } from '../../components/Canvas/Canvas'
import * as notesService from '../../services/notesService'
import { buildNote } from '../testUtils'

describe('Canvas', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([])
    vi.spyOn(notesService, 'saveNotes').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('creates a new note positioned relative to the canvas and enters edit mode', () => {
    const { container } = render(<Canvas />)
    const canvas = container.firstChild as HTMLElement
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 50,
      top: 20,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 50,
      y: 20,
      toJSON() {},
    } as DOMRect)

    fireEvent.doubleClick(canvas, { clientX: 150, clientY: 120 })

    const descriptionField = screen.getByLabelText('Note description')
    const noteElement = descriptionField.closest(
      '[data-testid="sticky-note"]',
    ) as HTMLElement
    expect(noteElement.style.left).toBe('100px')
    expect(noteElement.style.top).toBe('100px')
  })

  it('does not create a new note when double-clicking an existing note', () => {
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({
        id: 'a',
        content: { title: 'Title', description: 'Description' },
      }),
    ])
    render(<Canvas />)

    fireEvent.doubleClick(screen.getByText('Description'))

    expect(screen.getAllByTestId('sticky-note')).toHaveLength(1)
  })

  function mockTrashZoneRect() {
    const trashZone = screen.getByRole('img', { name: 'Trash zone' })
    vi.spyOn(trashZone, 'getBoundingClientRect').mockReturnValue({
      left: 900,
      top: 600,
      right: 960,
      bottom: 660,
      width: 60,
      height: 60,
      x: 900,
      y: 600,
      toJSON() {},
    } as DOMRect)
    return trashZone
  }

  it('activates the trash zone while a note is dragged over it, and deactivates it once the drag ends', () => {
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({ id: 'a', position: { x: 0, y: 0, zIndex: 1 } }),
    ])
    render(<Canvas />)
    const trashZone = mockTrashZoneRect()
    const noteElement = screen.getByTestId('sticky-note')

    fireEvent.pointerDown(noteElement, {
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    })
    fireEvent.pointerMove(document.body, {
      pointerId: 1,
      clientX: 930,
      clientY: 630,
    })

    expect(trashZone.className).toMatch(/trashZoneActive/)

    fireEvent.pointerUp(document.body, {
      pointerId: 1,
      clientX: 930,
      clientY: 630,
    })

    expect(screen.queryByTestId('sticky-note')).not.toBeInTheDocument()
  })

  it('deactivates the trash zone when the drag ends away from it', () => {
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({ id: 'a', position: { x: 0, y: 0, zIndex: 1 } }),
    ])
    render(<Canvas />)
    const trashZone = mockTrashZoneRect()
    const noteElement = screen.getByTestId('sticky-note')

    fireEvent.pointerDown(noteElement, {
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    })
    fireEvent.pointerMove(document.body, {
      pointerId: 1,
      clientX: 930,
      clientY: 630,
    })
    fireEvent.pointerMove(document.body, {
      pointerId: 1,
      clientX: 20,
      clientY: 20,
    })

    expect(trashZone.className).not.toMatch(/trashZoneActive/)
  })

  it('does not delete the note when it is dropped away from the trash zone', () => {
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({ id: 'a', position: { x: 0, y: 0, zIndex: 1 } }),
    ])
    render(<Canvas />)
    mockTrashZoneRect()
    const noteElement = screen.getByTestId('sticky-note')

    fireEvent.pointerDown(noteElement, {
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    })
    fireEvent.pointerUp(document.body, {
      pointerId: 1,
      clientX: 50,
      clientY: 50,
    })

    expect(screen.getByTestId('sticky-note')).toBeInTheDocument()
  })

  it('changes a note color when a swatch is clicked', () => {
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({ id: 'a', color: '#DE7373' }),
    ])
    render(<Canvas />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Set note color to #BFBAFF' }),
    )

    expect(screen.getByTestId('sticky-note')).toHaveStyle({
      backgroundColor: '#BFBAFF',
    })
  })
})
