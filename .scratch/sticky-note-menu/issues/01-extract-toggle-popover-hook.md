# 01: Extract shared toggle+popover hook

**What to build:** A reusable hook that bundles the open/closed state, click-outside-to-close, and Escape-to-close-with-focus-return behavior already duplicated by hand across the shapes toggle and `EmojiPicker`. It is a prefactor: nothing user-visible changes in this ticket, and no existing component adopts it yet. It exists so tickets 02 and 03 can build the unified note menu's rows on top of one small, consistent primitive instead of re-copying the open/close/Escape/click-outside wiring a third and fourth time.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] New hook encapsulates an open/closed boolean, a click-outside handler that closes it (built on the existing `useClickOutside`), and an Escape handler that closes it and returns focus to a given trigger element (built on the existing `useEscapeKey`)
- [x] Hook's API is generic enough to back a single row's popover (tickets 02/03) and, later, the outer panel's own toggle
- [x] No existing component's behavior changes as a result of this ticket — the hook is not yet consumed anywhere
- [x] Full existing test suite continues to pass unmodified
- [x] Typecheck passes
