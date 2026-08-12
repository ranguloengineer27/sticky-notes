import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotes } from '../../hooks/useNotes'
import * as notesService from '../../services/notesService'
import { buildNote } from '../testUtils'
import { MIN_NOTE_WIDTH, MIN_NOTE_HEIGHT } from '../../constants'

describe('useNotes', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(notesService, 'saveNotes').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('loads its initial notes from the notes service', () => {
    const initial = [buildNote({ id: 'a' })]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(initial)

    const { result } = renderHook(() => useNotes())

    expect(result.current.notes).toEqual(initial)
  })

  it('falls back to an empty list when loading fails', () => {
    vi.spyOn(notesService, 'loadNotes').mockImplementation(() => {
      throw new Error('corrupted data')
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useNotes())

    expect(result.current.notes).toEqual([])
  })

  it('creates a note and immediately marks it as being edited', () => {
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([])
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onCreate(50, 60)
    })

    expect(result.current.notes).toHaveLength(1)
    const created = result.current.notes[0]
    expect(created.position).toMatchObject({ x: 50, y: 60 })
    expect(result.current.editingNoteId).toBe(created.id)
  })

  it('updates only the content of the targeted note', () => {
    const notes = [buildNote({ id: 'a' }), buildNote({ id: 'b' })]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onUpdate('a', {
        title: 'New title',
        description: 'New body',
      })
    })

    expect(
      result.current.notes.find((note) => note.id === 'a')?.content,
    ).toEqual({
      title: 'New title',
      description: 'New body',
    })
    expect(result.current.notes.find((note) => note.id === 'b')).toEqual(
      notes[1],
    )
  })

  it('updates only the color of the targeted note', () => {
    const notes = [buildNote({ id: 'a', color: '#DE7373' })]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onColorChange('a', '#87E6AC')
    })

    expect(result.current.notes[0].color).toBe('#87E6AC')
  })

  it('moves a note while preserving its zIndex', () => {
    const notes = [buildNote({ id: 'a', position: { x: 0, y: 0, zIndex: 7 } })]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onDrag('a', 120, 130)
    })

    expect(result.current.notes[0].position).toEqual({
      x: 120,
      y: 130,
      zIndex: 7,
    })
  })

  it('resizes a note and clamps below the minimum size', () => {
    const notes = [buildNote({ id: 'a', position: { x: 0, y: 0, zIndex: 2 } })]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onResize('a', { x: 5, y: 6, width: 10, height: 10 })
    })

    expect(result.current.notes[0]).toMatchObject({
      position: { x: 5, y: 6, zIndex: 2 },
      size: { width: MIN_NOTE_WIDTH, height: MIN_NOTE_HEIGHT },
    })
  })

  it('deletes a note and clears editing state if it was being edited', () => {
    const notes = [buildNote({ id: 'a' })]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onStartEditing('a')
    })
    act(() => {
      result.current.onDelete('a')
    })

    expect(result.current.notes).toEqual([])
    expect(result.current.editingNoteId).toBeNull()
  })

  it('brings the target note above every other note on interaction', () => {
    const notes = [
      buildNote({ id: 'a', position: { x: 0, y: 0, zIndex: 1 } }),
      buildNote({ id: 'b', position: { x: 0, y: 0, zIndex: 5 } }),
    ]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onBringToFront('a')
    })

    const zIndexA = result.current.notes.find((note) => note.id === 'a')
      ?.position.zIndex
    const zIndexB = result.current.notes.find((note) => note.id === 'b')
      ?.position.zIndex
    expect(zIndexA).toBeGreaterThan(zIndexB!)
  })

  it('toggles editing state via onStartEditing/onStopEditing', () => {
    const notes = [buildNote({ id: 'a' })]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onStartEditing('a')
    })
    expect(result.current.editingNoteId).toBe('a')

    act(() => {
      result.current.onStopEditing()
    })
    expect(result.current.editingNoteId).toBeNull()
  })
})
