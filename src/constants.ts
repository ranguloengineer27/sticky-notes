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

export const ONBOARDING_HINT_MIN_VISIBLE_MS = 3500
export const EMPTY_CANVAS_HINT_MESSAGE =
  'Double-click anywhere on the canvas to create a new note'

export const EXIT_EDITING_HINT_VISIBLE_MS = 3000
export const EXIT_EDITING_HINT_MESSAGE =
  'Click outside the note to exit editing mode'

// Must match the --transition-popover duration in Popover.module.scss
export const POPOVER_EXIT_TRANSITION_MS = 220

export const SKIP_DELETE_CONFIRMATION_STORAGE_KEY =
  'sticky-notes-skip-delete-confirmation'
export const DELETE_CONFIRMATION_MESSAGE =
  'Are you sure you want to delete this note? This is a permanent action.'
export const DONT_SHOW_DELETE_CONFIRMATION_AGAIN_LABEL =
  "Don't show me this message again"
export const CANCEL_DELETE_LABEL = 'Cancel'
export const CONFIRM_DELETE_LABEL = 'Delete'

export const EMOJI_OPTIONS = [
  '😀',
  '😂',
  '😍',
  '👍',
  '🎉',
  '❤️',
  '🔥',
  '✅',
  '⭐',
  '😢',
  '🙏',
  '🚀',
] as const

export const EMOJI_PICKER_TOGGLE_LABEL = 'Insert emoji'
export const EMOJI_PICKER_PANEL_LABEL = 'Emoji picker'
// Must match the --space-2 value in global.scss
export const EMOJI_PICKER_PANEL_GAP_PX = 8
