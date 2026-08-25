import { useEffect } from 'react'

export function useEscapeKey(isActive: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!isActive) return

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape') return
      onEscape()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, onEscape])
}
