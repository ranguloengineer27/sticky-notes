import type { Note } from '../types/note'
import type { Point } from './clampNotePosition'

export interface ConnectionPath {
  x1: number
  y1: number
  x2: number
  y2: number
}

interface NoteRect {
  left: number
  top: number
  right: number
  bottom: number
  centerX: number
  centerY: number
}

function toNoteRect(note: Note): NoteRect {
  const left = note.position.x
  const top = note.position.y

  return {
    left,
    top,
    right: left + note.size.width,
    bottom: top + note.size.height,
    centerX: left + note.size.width / 2,
    centerY: top + note.size.height / 2,
  }
}

function clampToRectBorder(
  rect: NoteRect,
  towardX: number,
  towardY: number,
): Point {
  const deltaX = towardX - rect.centerX
  const deltaY = towardY - rect.centerY

  if (deltaX === 0 && deltaY === 0) {
    return { x: rect.centerX, y: rect.centerY }
  }

  const halfWidth = (rect.right - rect.left) / 2
  const halfHeight = (rect.bottom - rect.top) / 2

  const scale = Math.min(
    deltaX !== 0 ? Math.abs(halfWidth / deltaX) : Infinity,
    deltaY !== 0 ? Math.abs(halfHeight / deltaY) : Infinity,
  )

  return {
    x: rect.centerX + deltaX * scale,
    y: rect.centerY + deltaY * scale,
  }
}

export function computeConnectionPath(
  sourceNote: Note,
  targetNote: Note,
): ConnectionPath {
  const sourceRect = toNoteRect(sourceNote)
  const targetRect = toNoteRect(targetNote)

  const start = clampToRectBorder(
    sourceRect,
    targetRect.centerX,
    targetRect.centerY,
  )
  const end = clampToRectBorder(
    targetRect,
    sourceRect.centerX,
    sourceRect.centerY,
  )

  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y }
}
