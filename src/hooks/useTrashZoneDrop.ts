import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { Size } from '../types/note'
import { doRectsOverlap } from '../utils/doRectsOverlap'
import { clampNotePosition } from '../utils/clampNotePosition'
import { getCanvasBounds } from '../utils/getCanvasBounds'
import { getNoteViewportRect } from '../utils/getNoteViewportRect'

export interface UseTrashZoneDropOptions {
  canvasRef: RefObject<HTMLDivElement | null>
  requestDelete: (id: string) => void
}

export interface UseTrashZoneDropResult {
  trashZoneRef: RefObject<HTMLDivElement | null>
  isTrashActive: boolean
  handleDragOverTrash: (x: number, y: number, size: Size) => void
  handleDrop: (id: string, x: number, y: number, size: Size) => void
}

export function useTrashZoneDrop({
  canvasRef,
  requestDelete,
}: UseTrashZoneDropOptions): UseTrashZoneDropResult {
  const trashZoneRef = useRef<HTMLDivElement>(null)
  const [isTrashActive, setIsTrashActive] = useState(false)

  function isNoteTouchingTrashZone(x: number, y: number, size: Size): boolean {
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    const trashRect = trashZoneRef.current?.getBoundingClientRect()
    if (!canvasRect || !trashRect) return false

    const position = clampNotePosition({ x, y }, size, getCanvasBounds())
    const noteRect = getNoteViewportRect(canvasRect, position, size)
    return doRectsOverlap(noteRect, trashRect)
  }

  function handleDragOverTrash(x: number, y: number, size: Size): void {
    setIsTrashActive(isNoteTouchingTrashZone(x, y, size))
  }

  function handleDrop(id: string, x: number, y: number, size: Size): void {
    setIsTrashActive(false)

    if (isNoteTouchingTrashZone(x, y, size)) {
      requestDelete(id)
    }
  }

  return { trashZoneRef, isTrashActive, handleDragOverTrash, handleDrop }
}
