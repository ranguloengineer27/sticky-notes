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
    vi.unstubAllGlobals()
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

  it('keeps a newly created note within the canvas bounds', () => {
    vi.stubGlobal('innerWidth', 1000)
    vi.stubGlobal('innerHeight', 800)
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([])
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onCreate(980, 780)
    })

    expect(result.current.notes[0].position).toMatchObject({ x: 800, y: 620 })
  })

  it('clamps notes loaded from storage that fall outside the current canvas bounds', () => {
    vi.stubGlobal('innerWidth', 1000)
    vi.stubGlobal('innerHeight', 800)
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({
        id: 'a',
        position: { x: 1500, y: 1200, zIndex: 3 },
        size: { width: 200, height: 150 },
      }),
    ])
    const { result } = renderHook(() => useNotes())

    expect(result.current.notes[0].position).toEqual({
      x: 800,
      y: 650,
      zIndex: 3,
    })
  })

  it('re-clamps existing notes when the window is resized smaller', () => {
    vi.stubGlobal('innerWidth', 1000)
    vi.stubGlobal('innerHeight', 800)
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({
        id: 'a',
        position: { x: 700, y: 600, zIndex: 1 },
        size: { width: 200, height: 150 },
      }),
    ])
    const { result } = renderHook(() => useNotes())

    act(() => {
      vi.stubGlobal('innerWidth', 500)
      vi.stubGlobal('innerHeight', 400)
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.notes[0].position).toEqual({
      x: 300,
      y: 250,
      zIndex: 1,
    })
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

  it('resizes a note from the bottom-right and clamps below the minimum size', () => {
    const notes = [buildNote({ id: 'a', position: { x: 0, y: 0, zIndex: 2 } })]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onResize('a', 'bottom-right', {
        x: 5,
        y: 6,
        width: 10,
        height: 10,
      })
    })

    expect(result.current.notes[0]).toMatchObject({
      position: { x: 5, y: 6, zIndex: 2 },
      size: { width: MIN_NOTE_WIDTH, height: MIN_NOTE_HEIGHT },
    })
  })

  it('keeps the bottom-right corner anchored when a top-left resize clamps to the minimum size', () => {
    const notes = [
      buildNote({
        id: 'a',
        position: { x: 100, y: 100, zIndex: 2 },
        size: { width: 200, height: 150 },
      }),
    ]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onResize('a', 'top-left', {
        x: 350,
        y: 350,
        width: -50,
        height: -100,
      })
    })

    expect(result.current.notes[0]).toMatchObject({
      position: { x: 180, y: 150 },
      size: { width: MIN_NOTE_WIDTH, height: MIN_NOTE_HEIGHT },
    })
  })

  it('keeps the bottom-left corner anchored when a top-right resize clamps to the minimum height', () => {
    const notes = [
      buildNote({
        id: 'a',
        position: { x: 100, y: 100, zIndex: 2 },
        size: { width: 200, height: 150 },
      }),
    ]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onResize('a', 'top-right', {
        x: 100,
        y: 350,
        width: 450,
        height: -100,
      })
    })

    expect(result.current.notes[0]).toMatchObject({
      position: { x: 100, y: 150 },
      size: { width: 450, height: MIN_NOTE_HEIGHT },
    })
  })

  it('keeps the top-right corner anchored when a bottom-left resize clamps to the minimum width', () => {
    const notes = [
      buildNote({
        id: 'a',
        position: { x: 100, y: 100, zIndex: 2 },
        size: { width: 200, height: 150 },
      }),
    ]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onResize('a', 'bottom-left', {
        x: 350,
        y: 100,
        width: -50,
        height: 400,
      })
    })

    expect(result.current.notes[0]).toMatchObject({
      position: { x: 180, y: 100 },
      size: { width: MIN_NOTE_WIDTH, height: 400 },
    })
  })

  it('keeps a dragged note within the canvas bounds', () => {
    vi.stubGlobal('innerWidth', 1000)
    vi.stubGlobal('innerHeight', 800)
    const notes = [
      buildNote({
        id: 'a',
        position: { x: 0, y: 0, zIndex: 1 },
        size: { width: 200, height: 150 },
      }),
    ]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onDrag('a', 5000, -5000)
    })

    expect(result.current.notes[0].position).toMatchObject({ x: 800, y: 0 })
  })

  it('caps a resized note to the canvas bounds instead of overflowing it', () => {
    vi.stubGlobal('innerWidth', 1000)
    vi.stubGlobal('innerHeight', 800)
    const notes = [
      buildNote({
        id: 'a',
        position: { x: 0, y: 0, zIndex: 1 },
        size: { width: 200, height: 150 },
      }),
    ]
    vi.spyOn(notesService, 'loadNotes').mockReturnValue(notes)
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.onResize('a', 'top-left', {
        x: -5000,
        y: -5000,
        width: 5200,
        height: 5150,
      })
    })

    expect(result.current.notes[0]).toMatchObject({
      position: { x: 0, y: 0 },
      size: { width: 1000, height: 800 },
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
