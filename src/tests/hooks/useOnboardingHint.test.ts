import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOnboardingHint } from '../../hooks/useOnboardingHint'
import {
  ONBOARDING_HINT_MIN_VISIBLE_MS,
  EXIT_EDITING_HINT_VISIBLE_MS,
  EMPTY_CANVAS_HINT_MESSAGE,
  EXIT_EDITING_HINT_MESSAGE,
} from '../../constants'

describe('useOnboardingHint', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the create-note hint when there are no notes', () => {
    const { result } = renderHook(() => useOnboardingHint(false, false))

    expect(result.current).toEqual({
      message: EMPTY_CANVAS_HINT_MESSAGE,
      isOpen: true,
    })
  })

  it('does not show any hint when notes already exist and nothing is being edited', () => {
    const { result } = renderHook(() => useOnboardingHint(true, false))

    expect(result.current.isOpen).toBe(false)
  })

  it('keeps the create-note hint visible for the minimum duration even after the first note is created', () => {
    const { result, rerender } = renderHook(
      ({ hasNotes, isEditingNote }) =>
        useOnboardingHint(hasNotes, isEditingNote),
      { initialProps: { hasNotes: false, isEditingNote: false } },
    )

    rerender({ hasNotes: true, isEditingNote: false })
    expect(result.current).toEqual({
      message: EMPTY_CANVAS_HINT_MESSAGE,
      isOpen: true,
    })

    act(() => {
      vi.advanceTimersByTime(ONBOARDING_HINT_MIN_VISIBLE_MS)
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('switches to the exit-editing hint as soon as editing starts, even mid create-note hint', () => {
    const { result, rerender } = renderHook(
      ({ hasNotes, isEditingNote }) =>
        useOnboardingHint(hasNotes, isEditingNote),
      { initialProps: { hasNotes: false, isEditingNote: false } },
    )

    rerender({ hasNotes: true, isEditingNote: true })

    expect(result.current).toEqual({
      message: EXIT_EDITING_HINT_MESSAGE,
      isOpen: true,
    })
  })

  it('hides the exit-editing hint after its fixed duration even if editing is still in progress', () => {
    const { result, rerender } = renderHook(
      ({ isEditingNote }) => useOnboardingHint(true, isEditingNote),
      { initialProps: { isEditingNote: false } },
    )

    rerender({ isEditingNote: true })
    expect(result.current).toEqual({
      message: EXIT_EDITING_HINT_MESSAGE,
      isOpen: true,
    })

    act(() => {
      vi.advanceTimersByTime(EXIT_EDITING_HINT_VISIBLE_MS - 1)
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('hides the exit-editing hint after its fixed duration when editing ends earlier', () => {
    const { result, rerender } = renderHook(
      ({ isEditingNote }) => useOnboardingHint(true, isEditingNote),
      { initialProps: { isEditingNote: false } },
    )

    rerender({ isEditingNote: true })
    rerender({ isEditingNote: false })
    expect(result.current).toEqual({
      message: EXIT_EDITING_HINT_MESSAGE,
      isOpen: true,
    })

    act(() => {
      vi.advanceTimersByTime(EXIT_EDITING_HINT_VISIBLE_MS)
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('does not show the exit-editing hint again for later edits once it has already been shown', () => {
    const { result, rerender } = renderHook(
      ({ isEditingNote }) => useOnboardingHint(true, isEditingNote),
      { initialProps: { isEditingNote: false } },
    )

    rerender({ isEditingNote: true })
    act(() => {
      vi.advanceTimersByTime(EXIT_EDITING_HINT_VISIBLE_MS)
    })
    expect(result.current.isOpen).toBe(false)

    rerender({ isEditingNote: false })
    rerender({ isEditingNote: true })
    expect(result.current.isOpen).toBe(false)
  })
})
