import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEmptyCanvasHint } from '../../hooks/useEmptyCanvasHint'
import { EMPTY_CANVAS_HINT_MIN_VISIBLE_MS } from '../../constants'

describe('useEmptyCanvasHint', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is visible when there are no notes', () => {
    const { result } = renderHook(() => useEmptyCanvasHint(false))

    expect(result.current).toBe(true)
  })

  it('is not visible when notes already exist', () => {
    const { result } = renderHook(() => useEmptyCanvasHint(true))

    expect(result.current).toBe(false)
  })

  it('stays visible for the minimum duration even after the first note is created', () => {
    const { result, rerender } = renderHook(
      ({ hasNotes }) => useEmptyCanvasHint(hasNotes),
      { initialProps: { hasNotes: false } },
    )

    rerender({ hasNotes: true })
    expect(result.current).toBe(true)

    act(() => {
      vi.advanceTimersByTime(EMPTY_CANVAS_HINT_MIN_VISIBLE_MS - 1)
    })
    expect(result.current).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe(false)
  })

  it('hides as soon as a note is created once the minimum duration has already elapsed', () => {
    const { result, rerender } = renderHook(
      ({ hasNotes }) => useEmptyCanvasHint(hasNotes),
      { initialProps: { hasNotes: false } },
    )

    act(() => {
      vi.advanceTimersByTime(EMPTY_CANVAS_HINT_MIN_VISIBLE_MS)
    })
    expect(result.current).toBe(true)

    rerender({ hasNotes: true })
    expect(result.current).toBe(false)
  })

  it('remains visible if no note is ever created', () => {
    const { result } = renderHook(() => useEmptyCanvasHint(false))

    act(() => {
      vi.advanceTimersByTime(EMPTY_CANVAS_HINT_MIN_VISIBLE_MS * 5)
    })

    expect(result.current).toBe(true)
  })
})
