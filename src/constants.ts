export const STORAGE_KEY = 'sticky-notes'
export const AUTO_SAVE_DELAY_MS = 3000

export const DEFAULT_NOTE_WIDTH = 200
export const DEFAULT_NOTE_HEIGHT = 180
export const MIN_NOTE_WIDTH = 120
export const MIN_NOTE_HEIGHT = 100

export const NOTE_COLORS = ['#DE7373', '#FCE477', '#87E6AC', '#BFBAFF'] as const
export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0]

export const RESIZE_CORNERS = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const

export const EMPTY_CANVAS_HINT_MIN_VISIBLE_MS = 3500
export const EMPTY_CANVAS_HINT_MESSAGE =
  'Double-click anywhere on the canvas to create a new note'

// Must match the --transition-popover duration in Popover.module.scss
export const POPOVER_EXIT_TRANSITION_MS = 220
