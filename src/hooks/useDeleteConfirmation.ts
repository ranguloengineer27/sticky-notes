import { useState } from 'react'
import {
  shouldSkipDeleteConfirmation,
  skipDeleteConfirmation,
} from '../services/deleteConfirmationService'

export interface UseDeleteConfirmationResult {
  isOpen: boolean
  requestDelete: (id: string) => void
  confirmDelete: (dontShowAgain: boolean) => void
  cancelDelete: () => void
}

export function useDeleteConfirmation(
  onDelete: (id: string) => void,
): UseDeleteConfirmationResult {
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null)

  function requestDelete(id: string): void {
    let skipConfirmation = false
    try {
      skipConfirmation = shouldSkipDeleteConfirmation()
    } catch (error) {
      console.error(error)
    }

    if (skipConfirmation) {
      onDelete(id)
      return
    }
    setPendingNoteId(id)
  }

  function confirmDelete(dontShowAgain: boolean): void {
    if (dontShowAgain) {
      try {
        skipDeleteConfirmation()
      } catch (error) {
        console.error(error)
      }
    }
    if (pendingNoteId !== null) {
      onDelete(pendingNoteId)
    }
    setPendingNoteId(null)
  }

  function cancelDelete(): void {
    setPendingNoteId(null)
  }

  return {
    isOpen: pendingNoteId !== null,
    requestDelete,
    confirmDelete,
    cancelDelete,
  }
}
