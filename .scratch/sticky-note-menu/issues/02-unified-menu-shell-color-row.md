# 02: Unified note menu shell with a working Color row

**What to build:** On any note, hovering reveals a single "⋯" trigger (top-right) that opens one panel. The panel's Color row shows only the note's current color by default; clicking it opens a floating popover of the other colors (reusing `NOTE_COLORS` and the existing `Set note color to {color}` labeling); picking one applies it via `onColorChange`, collapses the row back to the new current color, and leaves the outer panel open. Escape and click-outside are two-layered: they close the color popover first, then (on a subsequent press/click) the outer panel. The old always-visible color swatches are removed. Shape keeps working exactly as it does today — its migration into this panel is ticket 03, so its existing toggle button is temporarily repositioned (behavior unchanged) to make room for the new trigger at top-right.

**Blocked by:** 01

**Status:** ready-for-agent

- [x] "⋯" trigger is hover-revealed in the note's top-right corner (matching the existing edit-button hover pattern) and toggles the panel open/closed
- [x] Panel's Color row shows only the current color by default
- [x] Clicking the current color chip opens a floating popover listing the other colors, using the existing `Set note color to {color}` labeling and current-color marking
- [x] Selecting a color calls `onColorChange` with the note id and color, collapses the row back to the new current color, and keeps the outer panel open
- [x] Escape closes the color popover first (focus returns to the color chip); pressed again with the popover already closed, it closes the outer panel (focus returns to the "⋯" trigger)
- [x] Clicking outside the color popover but inside the panel collapses the row only; clicking entirely outside the note closes the panel
- [x] Pointer-down on the trigger, the color chip, or an option in the popover never starts a note drag
- [x] Old always-visible color swatches UI is removed
- [x] Shape's existing toggle button and popover keep working exactly as today (unchanged behavior), just repositioned to free up the trigger's spot
- [x] An ADR is added documenting the choice of a floating popover (nested inside the outer panel) over inline-reflow expansion for a row's expand behavior
- [x] `StickyNoteMenu.test.tsx` (new) covers the Color row behavior above; `StickyNote.test.tsx`'s color-related tests are updated to match the new trigger → panel → row interaction instead of the old always-visible swatches
- [x] Typecheck and full test suite pass
