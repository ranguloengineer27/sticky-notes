# Sticky Notes

A convenient app for writing notes while using your desktop device.

# UX Behavior

- Allowed actions:

  - Create a new note by double-clicking on the canvas
  - Edit a note's content
  - Resize a note by dragging any of its corners
  - Move a note by dragging and dropping it within the canvas
  - Delete a note by dragging it to the trash
  - Configure a note's background color

- Notes are automatically saved 3 seconds after the user's last action.

# Architecture

## Data Layer

- LocalStorage is the main source of truth.
- A Notes Service interacts with LocalStorage to perform actions such as creating, updating, and deleting notes.

## UI

- Vite is used as the bundler, with CSR as the rendering strategy.

- The Canvas component acts as the main container and does the following:

  - Contains the Note components.
  - Executes the `useNotes` hook and passes the notes state and event handlers to the Note components via props.

- The `useNotes` hook does the following:

  - Holds the notes state and event handlers such as `onDrag`, `onResize`, `onUpdate`, and `onDelete`.
  - Uses the Notes Service to dispatch actions for creating, updating, and deleting notes.
  - Manages the "bring to top" functionality through a dedicated function.
  - Passes the above data to the Note components.

- Auto-save functionality:

  - Batches user actions using a queue.
  - Executes all queued actions after a 3-second buffer.
  - Saves the resulting data to LocalStorage when the buffer expires.

- Note component:

  - Is a stateless component that receives state data and event handlers from the Canvas component.
  - Belongs to the presentation layer and is primarily responsible for rendering the UI.

  ## Tests

  Relevant tests focused on user interactions are written using React Testing Library and Vitest

  ## Styles

  Styles are addressed using .scss and css modules
