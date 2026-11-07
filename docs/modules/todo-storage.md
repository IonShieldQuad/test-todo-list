# Module: todo-storage

## Responsibility
Reads and writes the validated task snapshot in the browser's origin-scoped local storage.

## Public interface
```ts
type Task = {
  id: string;
  title: string;       // trimmed, 1..MAX_TITLE_LENGTH characters
  completed: boolean;
  createdAt: number;   // Unix time in milliseconds
};

type TaskList = Task[];
type StoragePort = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};
type SaveResult = { ok: true } | { ok: false };

loadTasks(storage?: StoragePort): TaskList;
saveTasks(tasks: TaskList, storage?: StoragePort): SaveResult;
```
`Task` and `StoragePort` are the shared contracts for `todo-ui`. These logical module functions are implemented in `app.js` as described by the approved project structure. The default storage is `globalThis.localStorage`, accessed inside the function's error boundary so a blocked `localStorage` getter is handled too.

## State and data owned
The module owns the persisted JSON value at `todo-list:v1`. Its lifecycle is one browser origin; it is read at app startup and replaced after each task-list mutation. No other tab synchronization is promised.

## Dependencies
- Depends on: browser `Storage` API when no test port is supplied.
- Depended on by: `todo-ui` — `loadTasks` initializes UI state and `saveTasks` persists mutations.

## Internal design
- `loadTasks` reads one key, parses JSON, validates the complete array and each `Task` field, and returns `[]` for missing, unreadable, malformed, or schema-invalid data. It does not silently keep a valid prefix of a corrupt list.
- `saveTasks` validates the full list before serializing once and calling `setItem`. It returns `{ok:false}` on invalid data, serialization errors, missing storage, or a storage exception.
- The JSON representation is a plain array of task objects; there is no separate envelope or migration layer in v1.
- Storage operations are synchronous; no lock or cross-tab merge is implemented.

Constants:
- `STORAGE_KEY = "todo-list:v1"` — stable browser key, fixed by ADR-0002.
- `MAX_TITLE_LENGTH = 200` — upper bound used by validation, initial value, re-tune in M1.

## Failure behaviour
| Condition | Behaviour | Observable outcome |
|---|---|---|
| Missing key | Return an empty array. | App renders its empty state. |
| Invalid JSON or invalid task schema | Reject the whole snapshot and return an empty array. | App renders its empty state; no partial list appears. |
| Browser storage getter unavailable | Return `[]` from load; return `{ok:false}` from save. | App remains interactive; a failed mutation displays the unsaved warning through `todo-ui`. |
| Quota or `setItem` error | Return `{ok:false}` and do not throw to the caller. | `todo-ui` retains the in-memory list and announces that it was not saved. |
| Restart / reload | Read the latest successfully written snapshot. | Previously saved task state is restored for this origin. |

## Config surface
| Key | Type | Default | Range | Notes |
|---|---|---|---|---|
| `STORAGE_KEY` | string | `todo-list:v1` | fixed | Change only with a storage migration decision. |
| `MAX_TITLE_LENGTH` | integer | `200` | 1..2000 | Initial value, re-tune in M1; shared validation bound. |

## Test plan
- Unit: valid round-trip preserves task fields, order, and completion state.
- Failing cases: missing key; malformed JSON; non-array value; invalid item shape; duplicate IDs; `getItem` exception; `setItem` exception; unsupported task title length.
- Integration: `todo-ui` receives `[]` on an absent/corrupt key and receives `{ok:false}` on failed writes; use an injected in-memory `StoragePort` for deterministic tests.
- Oracle: `node --test`; tests use a fresh storage stub per case and injected time/id values, so they do not depend on browser state or the clock.

## Open questions
- None.
