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

    const titleInput = screen.getByLabelText('Note title')
    const noteElement = titleInput.closest(
      '[data-testid="sticky-note"]',
    ) as HTMLElement
    expect(noteElement.style.left).toBe('100px')
    expect(noteElement.style.top).toBe('100px')
  })

  it('does not create a new note when double-clicking an existing note', () => {
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({ id: 'a' }),
    ])
    render(<Canvas />)

    fireEvent.doubleClick(screen.getByText('Title'))

    expect(screen.getAllByTestId('sticky-note')).toHaveLength(1)
  })
})
