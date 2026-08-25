# Unified Sticky Note Menu

**Status:** ready-for-agent

## Problem Statement

Today, changing a sticky note's color and shape requires two separate, inconsistent controls: the four color swatches are always visible along the bottom-left of a note the moment it's hovered, while shape options live behind a separate toggle button in the top-right that must be clicked to reveal a floating panel. As new per-note options get added over time, this pattern doesn't scale — the note surface would accumulate more and more small buttons, each behaving a little differently, making the note feel cluttered and inconsistent rather than clean and predictable.

## Solution

Replace the two separate controls with a single unified menu, accessible through one "⋯" trigger icon that appears on hover (matching the existing edit-pencil affordance) in the note's top-right corner. Clicking the trigger opens one panel containing a Color row and a Shape row, stacked in that order. Each row shows only the note's current value (its current color swatch, or its current shape icon) until the user clicks it, at which point a small floating popover reveals the other options for that row. Only one row can be expanded at a time. Picking a new value collapses that row back down to its new current value but leaves the rest of the menu open, so users can adjust both color and shape in one visit without reopening the trigger. This single, consistent interaction pattern is what any future per-note option will plug into.

## User Stories

1. As a sticky notes user, I want a single "⋯" control on each note, so that I have one predictable place to find all of that note's customization options.
2. As a sticky notes user, I want the "⋯" control to stay hidden until I hover the note, so that notes look uncluttered when I'm not interacting with them.
3. As a sticky notes user, I want clicking "⋯" to open a menu showing my note's current color and current shape at a glance, so that I can see the note's settings without hunting through a long list of options.
4. As a sticky notes user, I want to click the current color swatch to reveal the other available colors, so that I can change the note's color without the row taking up space when I'm not changing it.
5. As a sticky notes user, I want to click the current shape icon to reveal the other available shapes, so that I can change the note's shape the same way I change its color.
6. As a sticky notes user, I want only one of the color or shape options to expand at a time, so that the menu stays compact and I'm not overwhelmed by multiple open panels at once.
7. As a sticky notes user, I want opening the shape options to close the color options if they were open (and vice versa), so that the menu behaves predictably as I move between sections.
8. As a sticky notes user, I want picking a new color to immediately apply it and collapse the color row back to showing that new color, so that I get instant visual feedback without extra clicks.
9. As a sticky notes user, I want picking a new shape to immediately apply it and collapse the shape row back to showing that new shape, so that I get the same immediate feedback as with color.
10. As a sticky notes user, I want the overall menu to stay open after I pick a color or a shape, so that I can adjust both settings in one visit instead of reopening the menu twice.
11. As a sticky notes user, I want to press Escape to close whichever part of the menu is topmost — the expanded color/shape popover first, then the whole menu on a second press — so that closing behaves predictably at each level.
12. As a sticky notes user, I want clicking outside an expanded color/shape popover, but still inside the menu, to collapse just that popover, so that I don't lose my place in the overall menu by accident.
13. As a sticky notes user, I want clicking entirely outside the note to close the whole menu, so that I can dismiss it the same way I already dismiss the shape picker today.
14. As a sticky notes user, I want interacting with the "⋯" trigger, the menu, or its popovers to never start dragging the note, so that opening my note's settings doesn't accidentally move it.
15. As a sticky notes user, I want the edit (pencil) button and resize handles to keep working exactly as they do today, so that this change doesn't regress behavior I already rely on.
16. As a sticky notes user, I want keyboard focus to return to the control I just closed — the color/shape chip on a nested Escape, or the "⋯" trigger on closing the whole menu — so that I can keep navigating by keyboard without losing my place.
17. As a developer maintaining the sticky notes app, I want the color row and shape row to share one small, reusable toggle+popover building block, so that adding a third option later doesn't mean copy-pasting the same open/close/Escape/click-outside logic a third time.
18. As a developer maintaining the sticky notes app, I want that shared building block to also work for the outer trigger-to-panel toggle, so that all three toggle points in this feature behave consistently by construction rather than by convention.

## Implementation Decisions

- Replace `StickyNoteMenu`'s current implementation (always-visible color swatches + a separately toggled `ShapesMenu` button) with a unified structure: a single trigger button (e.g. aria-label "Note options") positioned top-right on the note, taking over the old shape-toggle's slot, hover-revealed via the same `.note:hover &` opacity pattern already used for the edit button.
- The trigger opens one panel, visually consistent with today's `ShapesMenu` floating panel (`--color-surface` background, `--color-border` border, `--shadow-note-active`), containing two rows in fixed order: Color, then Shape.
- Each row is its own instance of a new shared toggle+popover hook: open/closed state, click-outside closes it, Escape closes it and returns focus to that row's collapsed chip. This mirrors — and is intended to eventually supersede — the pattern already duplicated by hand between the old `ShapesMenu` toggle and `EmojiPicker`'s own toggle implementation. For this feature, only the Color row, the Shape row, and (ideally) the outer trigger/panel need to use it.
- Row-level accordion state (only one row's popover open at a time) is owned by the parent unified-menu component, not by each row independently: opening one row's popover explicitly closes the other's.
- Collapsed row state shows the note's current value — current color swatch for Color, current shape's icon for Shape — replacing today's generic, non-reflective shapes icon.
- Selecting a value in an expanded row calls the existing `onColorChange` / `onShapeChange` callbacks (contracts unchanged), then collapses only that row; the outer panel and the other row's state are untouched.
- Escape handling is two-layered: with a row popover open, Escape closes only that popover; with no row popover open, Escape closes the outer panel.
- Click-outside handling mirrors that layering: a click outside a row's popover but inside the outer panel collapses that row only; a click outside the whole widget closes the outer panel entirely.
- `NOTE_COLORS`, `SHAPES`, and their existing aria-label conventions (`Set note color to {color}`, `Set note shape to {shape}`) carry over unchanged inside the expanded rows; `ShapesMenu` itself is reused unmodified inside the Shape row's popover.
- No generic/pluggable "menu items" registry — Color and Shape remain two concrete, hand-written rows sharing only the small toggle+popover primitive; nothing more to add until a genuine third option exists.
- The existing edit (pencil) button and the four resize handles are untouched by this change.

## Testing Decisions

- Tests assert on user-facing outcomes — what's rendered/visible via role and accessible name, what callbacks fire with what arguments, and where focus lands — never on internal open-state variables.
- Primary seam: a new `StickyNoteMenu.test.tsx`, mirroring the existing `ShapesMenu.test.tsx` component-level style. Covers: default collapsed state showing current color/shape; expanding a row via click; accordion behavior (expanding one row closes the other); selecting a value fires the corresponding callback and collapses only that row while the panel stays open; two-layer Escape behavior and focus return; two-layer click-outside behavior.
- Secondary seam: trim `StickyNote.test.tsx` to wiring-level checks only — pointer-down on the "⋯" trigger doesn't start a note drag (same pattern as the existing "does not start a drag when the pointer goes down on a color swatch/shapes button" tests), and a selection made through the menu reaches `onColorChange` / `onShapeChange` with the correct note id. Remove the now-duplicated detailed menu-behavior assertions from this file once equivalent coverage exists in `StickyNoteMenu.test.tsx`.
- No dedicated test file for the extracted shared toggle+popover hook — consistent with how `useClickOutside` and `useEscapeKey` are handled today, it's covered indirectly through the component tests that use it.
- `ShapesMenu.test.tsx` continues to test `ShapesMenu` in isolation (option rendering, current-shape marking, `onSelect` reporting) unchanged, since that sub-component is reused as-is inside the new Shape row's popover.

## Out of Scope

- Refactoring `EmojiPicker` to use the newly shared toggle+popover hook. It currently duplicates the same pattern by hand — a good follow-up once the shared hook exists and has proven itself here, but not required for this feature.
- Any concrete new menu options beyond Color and Shape (delete, duplicate, pin, font size, etc.). None were requested; the architecture should stay easy to extend, not be pre-built for options that don't exist yet.
- Touch/non-hover device support for revealing the "⋯" trigger. It stays hover-gated, matching the existing edit-pencil affordance; no always-visible fallback is being added.
- Any change to how notes are created, dragged, resized, deleted, or auto-saved.
- New domain vocabulary or ADRs beyond the one noted below — this is a UI/interaction change to how existing Note attributes (color, shape) are edited, not a change to what those attributes mean.

## Further Notes

- An ADR is recommended once implementation starts, documenting the deliberate choice of per-row floating popovers (nested inside the outer panel) over the simpler default of inline-reflow expansion. This was a considered trade-off — inline reflow was the simpler option — made explicitly to keep visual consistency with the existing `ShapesMenu` panel style and to avoid the outer panel's height shifting as rows expand and collapse. Without that context, a future reader could reasonably "simplify" it back to inline reflow, undoing an intentional decision.
- `EmojiPicker`'s independent reimplementation of the same toggle+popover pattern is a good candidate for a follow-up ticket once the new shared hook exists.
