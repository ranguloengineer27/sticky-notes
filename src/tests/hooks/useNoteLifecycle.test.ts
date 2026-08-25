import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNoteLifecycle } from '../../hooks/useNoteLifecycle'
import * as notesService from '../../services/notesService'
import * as connectionsService from '../../services/connectionsService'
import { buildNote, buildConnection } from '../testUtils'

describe('useNoteLifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(notesService, 'saveNotes').mockImplementation(() => {})
    vi.spyOn(connectionsService, 'saveConnections').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('deletes the note and removes its connections in a single call', () => {
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({ id: 'note-1' }),
      buildNote({ id: 'note-2' }),
    ])
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue([
      buildConnection({
        id: 'connection-1',
        sourceNoteId: 'note-1',
        targetNoteId: 'note-2',
      }),
    ])
    const { result } = renderHook(() => useNoteLifecycle())

    act(() => {
      result.current.onDelete('note-1')
    })

    expect(result.current.notes.map((note) => note.id)).toEqual(['note-2'])
    expect(result.current.connections).toEqual([])
  })

  it('clears the active note when the deleted note was active', () => {
    vi.spyOn(notesService, 'loadNotes').mockReturnValue([
      buildNote({ id: 'note-1' }),
    ])
    vi.spyOn(connectionsService, 'loadConnections').mockReturnValue([])
    const { result } = renderHook(() => useNoteLifecycle())

    act(() => {
      result.current.onActivateNote('note-1')
    })
    act(() => {
      result.current.onDelete('note-1')
    })

    expect(result.current.activeNoteId).toBeNull()
  })
})
