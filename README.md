# Team Workflow Board

A small React + TypeScript workflow board for managing team tasks across Backlog, In Progress, and Done. It includes a reusable local component library, URL-backed filters, localStorage persistence, validation, dirty-state warnings, and tests.

## Run the Project

```bash
npm install
npm start
```

Open `http://localhost:3000`.

Run verification:

```bash
npm test -- --watchAll=false --runInBand
npm run build
```

`--runInBand` avoids Jest worker spawning issues seen in this Windows sandbox.

## Architecture Overview

Source is organized by shared UI, feature code, hooks, and utilities:

```text
src/
  components/ui/      reusable Button, inputs, Select, Badge, Card, Modal, Toast
  features/tasks/     board, task cards, filters, and task form
  hooks/              localStorage persistence and URL filter state
  utils/              task filtering, sorting, tags, relative time helpers
  types.ts            domain types and shared constants
```

Component hierarchy:

```text
App
  TaskFilters
    TextInput, Select, Button
  TaskBoard
    TaskCard
      Card, Badge, Select, Button
  Modal
    TaskForm
      TextInput, TextArea, Select, Button
  Toast / Alert
```

State is kept in React because the app has a small local data model. `useTaskStorage` owns task persistence and exposes focused mutations. `useTaskFilters` owns query-string parsing/writing so filters are shareable and restored on refresh. Derived task lists are calculated with `useMemo` in `App`.

The UI components are intentionally small and composable. Inputs own label/error wiring, Modal owns focus entry, Escape handling, and a simple focus trap, and feature components provide task-specific behavior.

## Storage Versioning and Migration

Tasks are stored under `team-workflow-board` as:

```json
{
  "schemaVersion": 2,
  "tasks": []
}
```

The migration path simulates upgrading from schema version 1, where tasks only had a minimal shape. When `useTaskStorage` detects version 1, it fills the new fields (`priority`, `assignee`, `tags`, `createdAt`, `updatedAt`), writes version 2 back to localStorage, and shows a non-intrusive toast.

If localStorage cannot be read or written, the app falls back to starter tasks and shows an alert that changes may not persist.

## Refactor and Performance Note

During implementation, task filtering and sorting started inside the board rendering path. I moved that logic into `filterAndSortTasks` and memoized the derived list in `App`, which keeps rendering predictable and easy to test.

I also wrapped `TaskCard` in `React.memo`. That keeps cards from rerendering when unrelated app state changes, such as opening the create modal or changing the dirty flag. In a larger board, the next step would be list virtualization or column-level memoization.

## Tests

Current coverage includes:

- Creating a task through the modal and seeing it on the board.
- Restoring filters from the URL and updating the URL when search changes.

## Known Limitations

- Task movement uses a status dropdown instead of drag-and-drop. This keeps the dependency surface small and remains keyboard-accessible.
- The app uses localStorage only, so data is browser/device scoped.
- There is no delete flow yet.
- Relative timestamps are implemented locally instead of with a date library.

