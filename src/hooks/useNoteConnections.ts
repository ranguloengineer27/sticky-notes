import { useState } from 'react'
import type { Connection } from '../types/connection'
import {
  loadConnections,
  saveConnections,
} from '../services/connectionsService'
import { useAutoSave } from './useAutoSave'

export interface UseNoteConnectionsResult {
  connections: Connection[]
  activeNoteId: string | null
  onActivateNote: (id: string) => void
  onDeactivateNote: () => void
  onCreateConnection: (sourceNoteId: string, targetNoteId: string) => void
  onNoteDeleted: (noteId: string) => void
}

function loadInitialConnections(): Connection[] {
  try {
    return loadConnections()
  } catch (error) {
    console.error(error)
    return []
  }
}

export function useNoteConnections(): UseNoteConnectionsResult {
  const [connections, setConnections] = useState<Connection[]>(
    loadInitialConnections,
  )
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)

  useAutoSave(connections, saveConnections)

  function onActivateNote(id: string): void {
    setActiveNoteId(id)
  }

  function onDeactivateNote(): void {
    setActiveNoteId(null)
  }

  function onCreateConnection(
    sourceNoteId: string,
    targetNoteId: string,
  ): void {
    if (sourceNoteId !== targetNoteId) {
      setConnections((currentConnections) => {
        const isDuplicate = currentConnections.some(
          (connection) =>
            connection.sourceNoteId === sourceNoteId &&
            connection.targetNoteId === targetNoteId,
        )
        if (isDuplicate) return currentConnections

        const connection: Connection = {
          id: crypto.randomUUID(),
          sourceNoteId,
          targetNoteId,
        }
        return [...currentConnections, connection]
      })
    }

    setActiveNoteId(null)
  }

  function onNoteDeleted(noteId: string): void {
    setConnections((currentConnections) =>
      currentConnections.filter(
        (connection) =>
          connection.sourceNoteId !== noteId &&
          connection.targetNoteId !== noteId,
      ),
    )
    setActiveNoteId((currentActiveNoteId) =>
      currentActiveNoteId === noteId ? null : currentActiveNoteId,
    )
  }

  return {
    connections,
    activeNoteId,
    onActivateNote,
    onDeactivateNote,
    onCreateConnection,
    onNoteDeleted,
  }
}
