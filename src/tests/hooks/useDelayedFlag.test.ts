import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDelayedFlag } from '../../hooks/useDelayedFlag'

describe('useDelayedFlag', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays false until the delay elapses once started', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 1000))

    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe(true)
  })

  it('does not start the timer until shouldStart becomes true', () => {
    const { result, rerender } = renderHook(
      ({ shouldStart }) => useDelayedFlag(shouldStart, 1000),
      { initialProps: { shouldStart: false } },
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current).toBe(false)

    rerender({ shouldStart: true })

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe(true)
  })
})
