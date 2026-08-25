# 03: Add Shape row with accordion behavior

**What to build:** The unified panel gains a Shape row beneath Color, collapsed to the current shape's icon by default (replacing today's generic shapes icon), expanding via its own floating popover that reuses the existing `ShapesMenu` component. Expanding one row now auto-collapses the other (accordion — only one row's popover open at a time), and the two-layer Escape/click-outside behavior from ticket 02 extends correctly across whichever row is open. The old standalone shape-toggle button (temporarily repositioned in ticket 02) is removed for good, fully replaced by this row.

**Blocked by:** 02

**Status:** ready-for-agent

- [x] Panel shows a Shape row below the Color row, collapsed to the current shape's icon by default
- [x] Clicking the shape chip opens a floating popover reusing `ShapesMenu`, with the existing `Set note shape to {shape}` labeling and current-shape marking
- [x] Selecting a shape calls `onShapeChange` with the note id and shape, collapses the row back to the new current shape, and keeps the outer panel open
- [x] Expanding the Shape row while the Color row's popover is open closes the Color popover, and vice versa (only one row expanded at a time)
- [x] Escape/click-outside layering from ticket 02 behaves correctly regardless of which row is expanded
- [x] Pointer-down on the shape chip or an option in its popover never starts a note drag
- [x] Old shape-toggle button and its standalone popover are removed entirely
- [x] `StickyNoteMenu.test.tsx` covers the Shape row's behavior and the accordion interaction between both rows
- [x] `StickyNote.test.tsx` is trimmed to wiring-only checks (drag-guard + callback wiring for both color and shape); now-duplicated detailed menu-behavior assertions are removed
- [x] `ShapesMenu.test.tsx` remains unchanged and passing
- [x] Typecheck and full test suite pass
