# Design and Technical Notes

## Key Decisions

- React state is sufficient for this assignment. A store library would add ceremony without solving a real coordination problem here.
- Filters live in the URL query string through `useTaskFilters`, making search, status, priority, and sort shareable.
- Persistence is isolated in `useTaskStorage` so storage failure and schema migration behavior stay out of presentation components.
- The component library lives under `src/components/ui` and avoids task-specific assumptions.

## Accessibility Notes

- Form controls use explicit labels and `aria-invalid` / `aria-describedby` for validation.
- Modal uses `role="dialog"`, `aria-modal`, first-field focus, Escape close, and Tab focus wrapping.
- Status movement is implemented as a native select, so it works with keyboard and screen readers.

## Next Changes

- Add task deletion with a confirmation modal.
- Add saved assignee suggestions or an assignee filter.
- Add drag-and-drop as a progressive enhancement while keeping the status select as the accessible fallback.
