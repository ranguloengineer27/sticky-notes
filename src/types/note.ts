import { NOTE_COLORS, RESIZE_CORNERS } from '../constants'

export type NoteColor = (typeof NOTE_COLORS)[number]
export type ResizeCorner = (typeof RESIZE_CORNERS)[number]

export interface Position {
  x: number
  y: number
  zIndex: number
}

export interface Size {
  width: number
  height: number
}

export interface Content {
  title: string
  description: string
}

export interface Note {
  id: string
  position: Position
  size: Size
  color: NoteColor
  content: Content
}

export type NoteChanges = Partial<
  Pick<Note, 'position' | 'size' | 'color' | 'content'>
>

export interface ResizeBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface CreateNoteResult {
  notes: Note[]
  note: Note
}
