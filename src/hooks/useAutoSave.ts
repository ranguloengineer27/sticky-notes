import { useEffect, useRef } from 'react'
import type { Note } from '../types/note'
import { saveNotes } from '../services/notesService'
import { AUTO_SAVE_DELAY_MS } from '../constants'

export function useAutoSave(
  notes: Note[],
  delayMs: number = AUTO_SAVE_DELAY_MS,
): void {
  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    const timeoutId = window.setTimeout(() => {
      try {
        saveNotes(notes)
      } catch (error) {
        console.error(error)
      }
    }, delayMs)

    return () => window.clearTimeout(timeoutId)
  }, [notes, delayMs])
}
