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