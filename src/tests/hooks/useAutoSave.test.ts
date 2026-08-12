import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAutoSave } from '../../hooks/useAutoSave'
import * as notesService from '../../services/notesService'
import { buildNote } from '../testUtils'

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(notesService, 'saveNotes').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('does not save on initial mount', () => {
    renderHook(() => useAutoSave([buildNote()], 3000))

    vi.advanceTimersByTime(3000)

    expect(notesService.saveNotes).not.toHaveBeenCalled()
  })

  it('saves once, 3 seconds after the notes change', () => {
    const { rerender } = renderHook(({ notes }) => useAutoSave(notes, 3000), {
      initialProps: { notes: [buildNote()] },
    })

    const updated = [
      buildNote({ content: { title: 'Updated', description: '' } }),
    ]
    rerender({ notes: updated })

    vi.advanceTimersByTime(2999)
    expect(notesService.saveNotes).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(notesService.saveNotes).toHaveBeenCalledTimes(1)
    expect(notesService.saveNotes).toHaveBeenCalledWith(updated)
  })

  it('coalesces a burst of changes into a single save of the final state', () => {
    const { rerender } = renderHook(({ notes }) => useAutoSave(notes, 3000), {
      initialProps: { notes: [buildNote()] },
    })

    const first = [buildNote({ content: { title: 'First', description: '' } })]
    rerender({ notes: first })
    vi.advanceTimersByTime(1000)

    const second = [
      buildNote({ content: { title: 'Second', description: '' } }),
    ]
    rerender({ notes: second })
    vi.advanceTimersByTime(2999)
    expect(notesService.saveNotes).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(notesService.saveNotes).toHaveBeenCalledTimes(1)
    expect(notesService.saveNotes).toHaveBeenCalledWith(second)
  })

  it('cancels the pending save when unmounted before the delay elapses', () => {
    const { rerender, unmount } = renderHook(
      ({ notes }) => useAutoSave(notes, 3000),
      {
        initialProps: { notes: [buildNote()] },
      },
    )

    rerender({
      notes: [buildNote({ content: { title: 'Updated', description: '' } })],
    })
    unmount()

    vi.advanceTimersByTime(3000)
    expect(notesService.saveNotes).not.toHaveBeenCalled()
  })
})
