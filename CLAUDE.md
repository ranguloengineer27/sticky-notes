# Sticky Notes

## Product Behavior

- Double-click the canvas to create a note at that position.
- New notes enter editing mode immediately.
- Notes can be edited while in editing mode.
- Notes can be dragged within the canvas.
- Interacting with a note brings it to the front.
- Notes can be resized by dragging any of their four corners.
- Notes can be deleted by dragging them to the trash zone.
- The trash zone provides visual feedback during drag.
- Notes are persisted in localStorage.
- Auto-save occurs 3 seconds after the user's last action.

## Constraints

- No third-party UI component libraries.
- Keep the implementation simple.
- Avoid unnecessary dependencies and abstractions.
- Maintain a minimum test coverage of 85%.

## Development

- Preserve existing behavior when implementing new features.
- Prefer simple, maintainable solutions.
- Add tests for important user-facing behavior when implementing or modifying features.
- Do not make major architectural changes without discussing them first.

## Architecture

Before making any architectural decisions or changes, read the `Architecture`
section in @README.md.

Treat the `Architecture` section in @README.md as the source of truth for
the project's architecture and design decisions.

Do not introduce architectural patterns, layers, abstractions, or technologies
that conflict with the documented architecture without explicitly discussing
them first.

## Tooling & Stack

- Use Conventional Commits for commit messages.
- Install dependencies when needed, provided they comply with the constraints
  defined in this file.
- Before adding a dependency, check whether the functionality can reasonably
  be implemented using existing dependencies or native browser/React APIs.
- Use Prettier for formatting
- EsLint for code quality + React/TS rules
- Vitest & React Testing Library for tests
- React + TypeScript
- Vite as a bundler
- Husky + lint-staged to execute format/lint before every commit

## Coding conventions

- Code should be easy to read and understand at a glance.
- Prefer clear, straightforward code over clever or overly compact solutions.
- Avoid nested ternary operators and extreme micro-optimizations that hurt readability without providing meaningful performance improvements.
- Prefer named exports over default exports.
- Define explicit types for public APIs, component props, services, functions, hooks, and other important boundaries when appropriate.
- Avoid excessive use of `if/else` statements within functions. Prefer early returns to reduce nesting and improve readability.
- Avoid object mutations whenever possible. Prefer immutable updates.
- Prefer React APIs for rendering-related logic whenever possible. For example, use `useRef` to access DOM elements instead of manually querying the DOM with APIs such as `querySelector` or `getElementById`.
- Use semantically meaningful and consistent names for variables and functions.
- Keep React components as clean and focused as possible. Extract complex state-related logic into custom hooks when appropriate.
- Store custom hooks in the `hooks` directory, with each hook defined in its own file named after the hook.
- For non-state-related logic, prefer pure functions and place reusable utilities in the `utils` directory, with each function defined in its own file named after the function.
- Prioritize consistency in styling. Centralize reusable design values in `globals.scss` and expose them as CSS variables. This includes colors, spacing, typography, border radii, and other values that should remain consistent across the application.
- Avoid using `!important` in CSS rules whenever possible. Prefer addressing the underlying specificity or styling issue instead.
- Rely on the React Compiler for automatic memoization. Avoid manual use of `useCallback` and `useMemo` unless there is a specific reason to use them.
- Keep functions small and focused on a single responsibility. Extract logic when a function becomes difficult to understand or maintain.
- Prefer composition over unnecessary abstraction or inheritance.
- Avoid premature abstraction. Prefer simple, local solutions until reuse or complexity clearly justifies an abstraction. As a rule of thumb, extract into a shared hook or utility after the second use, not the first.
- Avoid unnecessary `useEffect`. Prefer deriving values during render or handling logic in event handlers when appropriate.
- Derive values from existing state instead of storing redundant state.
- Avoid premature optimization. Optimize based on measured performance issues rather than speculation.
- Prefer relative imports over absolute/aliased imports.
- Use React's built-in state APIs (`useState`, `useContext`, `useReducer`) for state management. Do not introduce a third-party state management library without discussing it first.
- Use PascalCase for component names and their folders (e.g. `components/StickyNote/StickyNote.tsx`). Use camelCase for hooks, utils, and services (e.g. `hooks/useDraggable.ts`).

## Error handling

- Use `try/catch` around operations that can fail (network requests, parsing, external API calls, etc.).
- When catching an error, throw a new error with a clear, semantic message that describes what operation failed and, when relevant, the context needed to debug it (e.g. an ID, a status code, or the input that caused the failure).
- Avoid swallowing errors silently or re-throwing the original error without added context.
- Error messages should help whoever reads the logs quickly understand what broke and where, not just that "something went wrong."

## Testing

- Focus tests on user-facing behavior: what the user sees and does, not implementation details (e.g. internal state or private functions).
- Write tests around user interactions (clicks, typing, navigation, form submission, etc.) to confirm the application actually works as expected from the user's perspective.
- Avoid testing implementation details that would make tests brittle to refactors that don't change behavior.
- Place all test files in the `tests` directory, mirroring the source structure (e.g. a test for `components/StickyNote/StickyNote.tsx` lives at `tests/components/StickyNote.test.tsx`).
- Name test files after the unit under test, suffixed with `.test.ts`/`.test.tsx`.
- For interactions that depend on real layout or pointer geometry (dragging, resizing from a corner, dragging into the trash zone), simulate the interaction with pointer events (e.g. `pointerdown` → `pointermove` → `pointerup` via Testing Library) and mock `getBoundingClientRect` / element positions as needed, since jsdom does not perform real layout. Assert on the resulting user-visible behavior (note's new position/size, note removed from canvas) rather than on internal drag-state values.
- (End-to-end testing conventions are not defined yet.)

## Folder structure

- `services` — code responsible for external communication and persistence. In this project, that means the localStorage read/write and auto-save logic for notes. Components and hooks should go through `services` rather than calling `localStorage` directly.
- `components` — React components.
- `hooks` — custom hooks, one per file, named after the hook.
- `utils` — pure, reusable utility functions, one per file, named after the function.
- `tests` — all test files.

### Components folder

- Each component gets its own folder inside `components`, named after the component.
- Anything specific to that component lives inside its folder — for example its styles.
- Style files should be CSS Modules named after the component: `ComponentName.module.scss`.
- Tests are the one exception: they always go in the top-level `tests` directory, not inside the component's folder.
