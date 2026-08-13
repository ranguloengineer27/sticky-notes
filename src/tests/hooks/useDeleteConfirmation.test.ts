import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation'
import { SKIP_DELETE_CONFIRMATION_STORAGE_KEY } from '../../constants'

beforeEach(() => {
  sessionStorage.clear()
})

describe('useDeleteConfirmation', () => {
  it('opens the confirmation instead of deleting immediately', () => {
    const onDelete = vi.fn()
    const { result } = renderHook(() => useDeleteConfirmation(onDelete))

    act(() => {
      result.current.requestDelete('note-1')
    })

    expect(result.current.isOpen).toBe(true)
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('deletes the pending note and closes when confirmed', () => {
    const onDelete = vi.fn()
    const { result } = renderHook(() => useDeleteConfirmation(onDelete))

    act(() => {
      result.current.requestDelete('note-1')
    })
    act(() => {
      result.current.confirmDelete(false)
    })

    expect(onDelete).toHaveBeenCalledWith('note-1')
    expect(result.current.isOpen).toBe(false)
  })

  it('closes without deleting when cancelled', () => {
    const onDelete = vi.fn()
    const { result } = renderHook(() => useDeleteConfirmation(onDelete))

    act(() => {
      result.current.requestDelete('note-1')
    })
    act(() => {
      result.current.cancelDelete()
    })

    expect(onDelete).not.toHaveBeenCalled()
    expect(result.current.isOpen).toBe(false)
  })

  it('remembers the "don\'t show again" preference when confirming', () => {
    const onDelete = vi.fn()
    const { result } = renderHook(() => useDeleteConfirmation(onDelete))

    act(() => {
      result.current.requestDelete('note-1')
    })
    act(() => {
      result.current.confirmDelete(true)
    })

    expect(sessionStorage.getItem(SKIP_DELETE_CONFIRMATION_STORAGE_KEY)).toBe(
      'true',
    )
  })

  it('deletes immediately without opening once the preference is set', () => {
    sessionStorage.setItem(SKIP_DELETE_CONFIRMATION_STORAGE_KEY, 'true')
    const onDelete = vi.fn()
    const { result } = renderHook(() => useDeleteConfirmation(onDelete))

    act(() => {
      result.current.requestDelete('note-1')
    })

    expect(onDelete).toHaveBeenCalledWith('note-1')
    expect(result.current.isOpen).toBe(false)
  })

  describe('when sessionStorage is unavailable', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('falls back to opening the confirmation when reading the preference fails', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('unavailable')
      })
      const onDelete = vi.fn()
      const { result } = renderHook(() => useDeleteConfirmation(onDelete))

      act(() => {
        result.current.requestDelete('note-1')
      })

      expect(result.current.isOpen).toBe(true)
      expect(onDelete).not.toHaveBeenCalled()
    })

    it('still deletes the note when storing the preference fails', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })
      const onDelete = vi.fn()
      const { result } = renderHook(() => useDeleteConfirmation(onDelete))

      act(() => {
        result.current.requestDelete('note-1')
      })
      act(() => {
        result.current.confirmDelete(true)
      })

      expect(onDelete).toHaveBeenCalledWith('note-1')
      expect(result.current.isOpen).toBe(false)
    })
  })
})
