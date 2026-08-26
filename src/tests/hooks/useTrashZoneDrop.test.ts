import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTrashZoneDrop } from '../../hooks/useTrashZoneDrop'

const CANVAS_RECT: DOMRect = {
  left: 0,
  top: 0,
  right: 1000,
  bottom: 800,
  width: 1000,
  height: 800,
  x: 0,
  y: 0,
  toJSON: () => {},
}

const TRASH_RECT: DOMRect = {
  left: 900,
  top: 700,
  right: 960,
  bottom: 760,
  width: 60,
  height: 60,
  x: 900,
  y: 700,
  toJSON: () => {},
}

const NOTE_SIZE = { width: 200, height: 150 }

function setUpTrashZoneDrop(requestDelete = vi.fn()) {
  const canvasEl = document.createElement('div')
  vi.spyOn(canvasEl, 'getBoundingClientRect').mockReturnValue(CANVAS_RECT)
  const canvasRef = { current: canvasEl }

  const { result } = renderHook(() =>
    useTrashZoneDrop({ canvasRef, requestDelete }),
  )

  const trashEl = document.createElement('div')
  vi.spyOn(trashEl, 'getBoundingClientRect').mockReturnValue(TRASH_RECT)
  act(() => {
    result.current.trashZoneRef.current = trashEl
  })

  return { result, requestDelete }
}

beforeEach(() => {
  vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(CANVAS_RECT.width)
  vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(CANVAS_RECT.height)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useTrashZoneDrop', () => {
  it('activates the trash zone when a dragged note overlaps it', () => {
    const { result } = setUpTrashZoneDrop()

    act(() => {
      result.current.handleDragOverTrash(850, 650, NOTE_SIZE)
    })

    expect(result.current.isTrashActive).toBe(true)
  })

  it('deactivates the trash zone once the note moves away from it', () => {
    const { result } = setUpTrashZoneDrop()

    act(() => {
      result.current.handleDragOverTrash(850, 650, NOTE_SIZE)
    })
    act(() => {
      result.current.handleDragOverTrash(0, 0, NOTE_SIZE)
    })

    expect(result.current.isTrashActive).toBe(false)
  })

  it('requests deletion when a note is dropped on the trash zone', () => {
    const { result, requestDelete } = setUpTrashZoneDrop()

    act(() => {
      result.current.handleDrop('note-1', 850, 650, NOTE_SIZE)
    })

    expect(requestDelete).toHaveBeenCalledWith('note-1')
    expect(result.current.isTrashActive).toBe(false)
  })

  it('does not request deletion when a note is dropped away from the trash zone', () => {
    const { result, requestDelete } = setUpTrashZoneDrop()

    act(() => {
      result.current.handleDrop('note-1', 0, 0, NOTE_SIZE)
    })

    expect(requestDelete).not.toHaveBeenCalled()
  })

  it('clamps the note position to the canvas bounds before hit-testing', () => {
    const { result, requestDelete } = setUpTrashZoneDrop()

    act(() => {
      result.current.handleDrop('note-1', 5000, 5000, NOTE_SIZE)
    })

    expect(requestDelete).toHaveBeenCalledWith('note-1')
  })

  it('does not activate the trash zone when the canvas has not been measured yet', () => {
    const requestDelete = vi.fn()
    const canvasRef = { current: null }

    const { result } = renderHook(() =>
      useTrashZoneDrop({ canvasRef, requestDelete }),
    )

    act(() => {
      result.current.handleDragOverTrash(850, 650, NOTE_SIZE)
    })

    expect(result.current.isTrashActive).toBe(false)
  })

  it('does not request deletion when the trash zone has not been measured yet', () => {
    const requestDelete = vi.fn()
    const canvasEl = document.createElement('div')
    vi.spyOn(canvasEl, 'getBoundingClientRect').mockReturnValue(CANVAS_RECT)
    const canvasRef = { current: canvasEl }

    const { result } = renderHook(() =>
      useTrashZoneDrop({ canvasRef, requestDelete }),
    )

    act(() => {
      result.current.handleDrop('note-1', 850, 650, NOTE_SIZE)
    })

    expect(requestDelete).not.toHaveBeenCalled()
  })
})
