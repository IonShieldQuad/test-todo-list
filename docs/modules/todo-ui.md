# Module: todo-ui

## Responsibility
Turns user actions into task-list state transitions and renders that state through the accessible page controls.

## Public interface
```ts
type Task = todo-storage.Task;
type StoragePort = todo-storage.StoragePort;

createTask(title: string, now?: number, id?: string): Task | null;
toggleTask(tasks: Task[], id: string): Task[];
deleteTask(tasks: Task[], id: string): Task[];
initTodoApp(root?: Document, storagePort?: StoragePort): boolean;
```
Markup contract consumed by `initTodoApp`:
```html
<form id="task-form">
  <label for="task-input">New task</label>
  <input id="task-input" maxlength="200" required>
  <button type="submit">Add task</button>
</form>
<p id="task-feedback" role="status" aria-live="polite"></p>
<p id="empty-state">No tasks yet</p>
<ul id="task-list"></ul>
```
`#task-list` receives one item per task with a labeled checkbox and a Delete button. The IDs and controls are owned by `index.html`; the app returns `false` without throwing if a required root element is absent.

## State and data owned
The module owns the current in-memory `Task[]` for the lifetime of the loaded page. It initializes from `todo-storage.loadTasks`, replaces state on add/toggle/delete, then calls `todo-storage.saveTasks`. Persisted data and its schema are owned by `todo-storage`.

## Dependencies
- Depends on: `todo-storage` — `loadTasks` and `saveTasks` contracts in `docs/modules/todo-storage.md`.
- Depended on by: `index.html` — loads `app.js` as a module and supplies the markup contract above.

## Internal design
- Export the pure `createTask`, `toggleTask`, and `deleteTask` functions from `app.js`; only initialize the DOM when `initTodoApp` is called. This allows the Node test runner to import task logic without a DOM.
- `createTask` trims input, returns `null` for blank or over-limit titles, and uses injected time/id values when provided; production defaults are `Date.now()` and `crypto.randomUUID()`.
- Toggle and delete return new arrays, do not mutate the previous array, and leave it equivalent when the requested ID is not present.
- Bind one submit handler and delegate checkbox/delete clicks from `#task-list`; resolve an action using the task ID stored as a DOM data attribute.
- Render with DOM node creation and `textContent`, never interpolate a task title into `innerHTML`. Update the empty state, task list, and feedback region after each state change.
- On save failure, retain the new in-memory state, render it, and announce that the change is not saved; a later successful save clears that warning.
- Use semantic checkboxes and buttons, task-specific accessible names, visible focus, and the CSS class for completed tasks.

Constants:
- `MAX_TITLE_LENGTH = 200` — input bound shared with `todo-storage`, initial value, re-tune in M1.
- `STORAGE_NOTICE` — short message that the latest change remains visible but could not be saved; wording is an implementation detail.

## Failure behaviour
| Condition | Behaviour | Observable outcome |
|---|---|---|
| Blank or over-limit title | Do not create a task; retain focus in the input. | Feedback explains that a task needs 1..200 characters. |
| Required markup missing | Do not bind partial handlers; return `false`. | No uncaught error; page remains rendered as authored. |
| Unknown task ID in an action | Keep the list semantically unchanged. | No unrelated task changes or errors appear. |
| Storage write failure | Keep the current page state and render the user action. | `#task-feedback` announces the unsaved state; reload may lose that change. |
| Reload | Reinitialize from `todo-storage.loadTasks`. | Only the last successfully persisted snapshot returns. |

## Config surface
| Key | Type | Default | Range | Notes |
|---|---|---|---|---|
| `MAX_TITLE_LENGTH` | integer | `200` | 1..2000 | Initial value, re-tune in M1; must match `todo-storage`. |
| `STORAGE_NOTICE` | string | Human-readable unsaved warning | non-empty | Initial wording, re-tune in M1. |

## Test plan
- Unit: trimmed creation, blank/over-limit rejection, completion toggle in both directions, deletion of only the requested ID, unknown ID stability, and no input-array mutation.
- Failing cases: empty input, whitespace input, 201-character title, failed persistence announcement, and missing DOM roots.
- Integration: browser form/checkbox/delete events call the pure transforms, update DOM, call storage, and survive reload after successful writes.
- Oracle: `node --test` for pure functions with fixed IDs/timestamps and a storage stub; browser checks against the served app for DOM/accessibility behavior, storage failure UI, and reload persistence.

## Open questions
- None.
