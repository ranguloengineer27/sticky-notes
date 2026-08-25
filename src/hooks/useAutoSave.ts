import { useEffect, useRef } from 'react'
import { AUTO_SAVE_DELAY_MS } from '../constants'

export function useAutoSave<T>(
  data: T,
  save: (data: T) => void,
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
        save(data)
      } catch (error) {
        console.error(error)
      }
    }, delayMs)

    return () => window.clearTimeout(timeoutId)
  }, [data, delayMs, save])
}
