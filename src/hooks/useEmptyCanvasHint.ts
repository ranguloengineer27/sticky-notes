import { useEffect, useState } from 'react'
import { EMPTY_CANVAS_HINT_MIN_VISIBLE_MS } from '../constants'

export function useEmptyCanvasHint(hasNotes: boolean): boolean {
  const [wasInitiallyEmpty] = useState(!hasNotes)
  const [hasMinDurationElapsed, setHasMinDurationElapsed] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHasMinDurationElapsed(true)
    }, EMPTY_CANVAS_HINT_MIN_VISIBLE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [])

  return !hasNotes || (wasInitiallyEmpty && !hasMinDurationElapsed)
}
