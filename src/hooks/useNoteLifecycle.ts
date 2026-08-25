import { useNotes } from './useNotes'
import { useNoteConnections } from './useNoteConnections'
import type { UseNotesResult } from './useNotes'
import type { UseNoteConnectionsResult } from './useNoteConnections'

export type UseNoteLifecycleResult = Omit<UseNotesResult, 'onDelete'> &
  Omit<UseNoteConnectionsResult, 'onNoteDeleted'> & {
    onDelete: (id: string) => void
  }

export function useNoteLifecycle(): UseNoteLifecycleResult {
  const notes = useNotes()
  const connections = useNoteConnections()

  function onDelete(id: string): void {
    notes.onDelete(id)
    connections.onNoteDeleted(id)
  }

  return {
    notes: notes.notes,
    editingNoteId: notes.editingNoteId,
    onCreate: notes.onCreate,
    onUpdate: notes.onUpdate,
    onColorChange: notes.onColorChange,
    onShapeChange: notes.onShapeChange,
    onDrag: notes.onDrag,
    onResize: notes.onResize,
    onBringToFront: notes.onBringToFront,
    onStartEditing: notes.onStartEditing,
    onStopEditing: notes.onStopEditing,
    connections: connections.connections,
    activeNoteId: connections.activeNoteId,
    onActivateNote: connections.onActivateNote,
    onDeactivateNote: connections.onDeactivateNote,
    onCreateConnection: connections.onCreateConnection,
    onDelete,
  }
}
