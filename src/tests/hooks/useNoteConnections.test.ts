import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNoteConnections } from '../../hooks/useNoteConnections'
import * as connectionsService from '../../services/connectionsService'
import { buildConnection } from '../testUtils'

describe('useNoteConnections', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(connectionsService, 'saveConnections').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('loads its initial connections from the connections service', () => {
    const initial = [buildConnection({ id: 'a' })]
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue(initial)

    const { result } = renderHook(() => useNoteConnections())

    expect(result.current.connections).toEqual(initial)
  })

  it('falls back to an empty list when loading fails', () => {
    vi.spyOn(connectionsService, 'loadConnections').mockImplementation(() => {
      throw new Error('corrupted data')
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useNoteConnections())

    expect(result.current.connections).toEqual([])
  })

  it('has no active note by default', () => {
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue([])
    const { result } = renderHook(() => useNoteConnections())

    expect(result.current.activeNoteId).toBeNull()
  })

  it('activates and deactivates a note', () => {
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue([])
    const { result } = renderHook(() => useNoteConnections())

    act(() => {
      result.current.onActivateNote('note-a')
    })
    expect(result.current.activeNoteId).toBe('note-a')

    act(() => {
      result.current.onDeactivateNote()
    })
    expect(result.current.activeNoteId).toBeNull()
  })

  it('creates a connection between the given source and target notes and deactivates the source', () => {
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue([])
    const { result } = renderHook(() => useNoteConnections())

    act(() => {
      result.current.onActivateNote('note-a')
    })
    act(() => {
      result.current.onCreateConnection('note-a', 'note-b')
    })

    expect(result.current.connections).toHaveLength(1)
    expect(result.current.connections[0]).toMatchObject({
      sourceNoteId: 'note-a',
      targetNoteId: 'note-b',
    })
    expect(result.current.activeNoteId).toBeNull()
  })

  it('does not create a connection from a note to itself', () => {
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue([])
    const { result } = renderHook(() => useNoteConnections())

    act(() => {
      result.current.onCreateConnection('note-a', 'note-a')
    })

    expect(result.current.connections).toEqual([])
  })

  it('does not create a duplicate connection between the same source and target', () => {
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue([
      buildConnection({
        id: 'a',
        sourceNoteId: 'note-a',
        targetNoteId: 'note-b',
      }),
    ])
    const { result } = renderHook(() => useNoteConnections())

    act(() => {
      result.current.onCreateConnection('note-a', 'note-b')
    })

    expect(result.current.connections.map((c) => c.id)).toEqual(['a'])
  })

  it('removes every connection referencing a deleted note, as either source or target', () => {
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue([
      buildConnection({
        id: 'a',
        sourceNoteId: 'note-1',
        targetNoteId: 'note-2',
      }),
      buildConnection({
        id: 'b',
        sourceNoteId: 'note-3',
        targetNoteId: 'note-1',
      }),
      buildConnection({
        id: 'c',
        sourceNoteId: 'note-3',
        targetNoteId: 'note-4',
      }),
    ])
    const { result } = renderHook(() => useNoteConnections())

    act(() => {
      result.current.onNoteDeleted('note-1')
    })

    expect(result.current.connections.map((c) => c.id)).toEqual(['c'])
  })

  it('clears the active note when the deleted note was active', () => {
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue([])
    const { result } = renderHook(() => useNoteConnections())

    act(() => {
      result.current.onActivateNote('note-1')
    })
    act(() => {
      result.current.onNoteDeleted('note-1')
    })

    expect(result.current.activeNoteId).toBeNull()
  })
})
