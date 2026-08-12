import { useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

interface DragOrigin {
  pointerId: number
  startX: number
  startY: number
}

export interface UsePointerDragOptions {
  onMove: (deltaX: number, deltaY: number, event: PointerEvent) => void
  onEnd: (event: PointerEvent) => void
}

export interface PointerDragHandlers {
  onPointerDown: (event: ReactPointerEvent) => void
}

export function usePointerDrag({
  onMove,
  onEnd,
}: UsePointerDragOptions): PointerDragHandlers {
  const originRef = useRef<DragOrigin | null>(null)
  const onMoveRef = useRef(onMove)
  const onEndRef = useRef(onEnd)

  useEffect(() => {
    onMoveRef.current = onMove
    onEndRef.current = onEnd
  })

  useEffect(() => {
    function handlePointerMove(event: PointerEvent): void {
      const origin = originRef.current
      if (!origin || origin.pointerId !== event.pointerId) return

      onMoveRef.current(
        event.clientX - origin.startX,
        event.clientY - origin.startY,
        event,
      )
    }

    function handlePointerUp(event: PointerEvent): void {
      const origin = originRef.current
      if (!origin || origin.pointerId !== event.pointerId) return

      originRef.current = null
      onEndRef.current(event)
    }

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)

    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  function onPointerDown(event: ReactPointerEvent): void {
    originRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    }
  }

  return { onPointerDown }
}
