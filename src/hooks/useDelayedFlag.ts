import { useEffect, useState } from 'react'

export function useDelayedFlag(shouldStart: boolean, delayMs: number): boolean {
  const [hasElapsed, setHasElapsed] = useState(false)

  useEffect(() => {
    if (!shouldStart) return

    const timeoutId = window.setTimeout(() => {
      setHasElapsed(true)
    }, delayMs)

    return () => window.clearTimeout(timeoutId)
  }, [shouldStart, delayMs])

  return hasElapsed
}
