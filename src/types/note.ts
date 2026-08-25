import {
  NOTE_COLORS,
  RESIZE_CORNERS,
  EMOJI_OPTIONS,
  SHAPES,
} from '../constants'

export type NoteColor = (typeof NOTE_COLORS)[number]
export type ResizeCorner = (typeof RESIZE_CORNERS)[number]
export type Emoji = (typeof EMOJI_OPTIONS)[number]
export type Shape = (typeof SHAPES)[number]

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
  shape?: Shape
}

export type NoteChanges = Partial<
  Pick<Note, 'position' | 'size' | 'color' | 'content' | 'shape'>
>

export interface ResizeBounds {
  x: number
  y: number
  width: number
  height: number
}
