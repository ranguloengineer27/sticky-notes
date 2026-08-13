# Sticky Notes

A convenient app for writing notes while using your desktop device.

Live app: https://sticky-notes-ivory-kappa.vercel.app/

# UX Behavior

- Allowed actions:

  - Create a new note by double-clicking on the canvas
  - Edit a note's content
  - Resize a note by dragging any of its corners
  - Move a note by dragging and dropping it within the canvas
  - Delete a note by dragging it to the trash
  - Configure a note's background color

- Notes are automatically saved 3 seconds after the user's last action.

# Scripts

All scripts can be run with your package manager of choice, e.g. `npm run <script>`, `pnpm <script>`, or `yarn <script>`.

- `dev` — starts the Vite dev server.
- `build` — type-checks the project (`tsc -b`) and builds it for production with Vite.
- `preview` — serves the production build locally.
- `test` — runs the unit/component test suite once with Vitest.
- `test:watch` — runs the unit/component test suite in watch mode.
- `test:coverage` — runs the unit/component test suite and reports coverage (minimum 85%, see [CLAUDE.md](CLAUDE.md)).
- `test:e2e` — runs the Playwright end-to-end suite (starts the dev server automatically). See [End-to-end tests](#end-to-end-tests).
- `lint` — runs ESLint across the project.
- `format` — formats the project with Prettier.
- `format:check` — checks formatting without writing changes.

# Architecture

## Data Layer

- LocalStorage is the main source of truth.
- A Notes Service interacts with LocalStorage to perform actions such as creating, updating, and deleting notes.

## UI

- Vite is used as the bundler, with CSR as the rendering strategy.

- The Canvas component acts as the main container and does the following:

  - Contains the StickyNote components.
  - Executes the `useNotes` hook and passes the notes state and event handlers to the StickyNote components via props.

- The `useNotes` hook does the following:

  - Holds the notes state and event handlers such as `onDrag`, `onResize`, `onUpdate`, and `onDelete`.
  - Uses the Notes Service to dispatch actions for creating, updating, and deleting notes.
  - Manages the "bring to top" functionality through a dedicated function.
  - Passes the above data to the StickyNote components.

- Auto-save functionality:

  - Batches user actions using a queue.
  - Executes all queued actions after a 3-second buffer.
  - Saves the resulting data to LocalStorage when the buffer expires.

- StickyNote component:

  - Is a stateless component that receives state data and event handlers from the Canvas component.
  - Belongs to the presentation layer and is primarily responsible for rendering the UI.

  ## Tests

  Relevant tests focused on user interactions are written using React Testing Library and Vitest.

  ## End-to-end tests

  End-to-end tests live in the `e2e` directory and are written with Playwright.
  They run against Chrome, Firefox, and Edge, each at a 1024x768 viewport.

  Run them locally with `test:e2e` (starts the dev server automatically).
  A GitHub Actions workflow (`.github/workflows/e2e.yml`) runs the same suite
  across Chrome, Firefox, and Edge on Ubuntu, Windows, and macOS on every push
  and pull request to `main`.

  ## Styles

  Styles are addressed using .scss and css modules
