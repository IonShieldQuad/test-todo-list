# Architecture: To-Do List

## Overview
The application is a static, single-page task list. `index.html` loads `app.js` as a browser ES module, `app.js` owns in-memory task state and DOM updates, and `localStorage` stores a versioned JSON snapshot between visits. `styles.css` adapts the local `dark-glass` kit's violet/cyan mesh, translucent surfaces, fine light edges, and typography with system fallbacks. There is no backend; the browser origin is the data boundary.

## Components
| Component | Responsibility (one sentence) | Module id |
|---|---|---|
| Page shell | Provides semantic task form, task-list container, and accessible action controls. | todo-ui |
| Interaction and state | Validates user input, updates task state, renders the list, and wires UI events. | todo-ui |
| Persistence | Reads and writes the versioned task array using browser local storage. | todo-storage |
| Presentation | Adapts the `dark-glass` colors and surface language, with contrast, focus states, and responsive behavior. | todo-ui |
| Logic tests | Checks task transformations and storage behavior with Node's built-in runner. | todo-storage |

## Data flow
1. On page load, `app.js` requests the task array from the storage helper.
2. The storage helper reads `todo-list:v1`; missing or malformed data produces an empty list.
3. `app.js` renders each task with its completion state and delete action.
4. Form submission trims and validates the label, creates a task, updates in-memory state, saves JSON, and rerenders.
5. Completion and deletion controls update the in-memory list, save it, and rerender.
6. On refresh, step 1 restores the last saved list for the same browser origin.

## Interfaces / contracts
Browser state schema:
```ts
type Task = {
  id: string;          // unique id from crypto.randomUUID()
  title: string;       // trimmed; 1..200 characters
  completed: boolean;
  createdAt: number;   // Unix time in milliseconds
};
type TaskList = Task[];
```

Module contracts planned for `app.js`:
```js
loadTasks(storage = window.localStorage) -> Task[]
saveTasks(tasks, storage = window.localStorage) -> void
createTask(title, now = Date.now(), id = crypto.randomUUID()) -> Task | null
toggleTask(tasks, id) -> Task[]
deleteTask(tasks, id) -> Task[]
```
`loadTasks` returns `[]` when the key is absent, JSON cannot be parsed, or the top-level value is not an array. `saveTasks` serializes the complete list to `todo-list:v1`. Mutations return a new array and leave the input array unchanged.

## External dependencies and runtime shape
- No third-party service or runtime package; copy only the small set of needed design tokens into `styles.css`, without importing the kit's lab tooling.
- Font families follow the kit's Sora / Inter / JetBrains Mono roles with system sans/monospace fallbacks; no remote font request is required.
- Static files are served from one origin. Local preview: `python -m http.server 8000`; production target: GitHub Pages.
- Data is origin-scoped and stays in the browser that created it. Clearing browser site data removes the list.

## Cross-cutting concerns
- Config: constants in `app.js` and CSS custom properties in `styles.css`; no environment configuration.
- Logging/observability: no analytics or remote logging; storage failures should be handled without crashing the UI.
- Error handling: invalid input is ignored with a short inline message; malformed persisted JSON is treated as an empty list; a write failure must leave the current page usable and communicate that saving failed.
- Persistence: one JSON array under `todo-list:v1`; each mutation replaces the stored snapshot. Storage is synchronous and scoped to the browser origin.
- Accessibility: semantic form and buttons, task-specific accessible labels, keyboard-visible focus, body text at least 12 px, and text contrast targets of 7:1 for body copy and 4.5:1 for secondary copy.

## Out of scope
- Multi-user access, authentication, cloud backup, and cross-device synchronization.
- Recurrence, reminders, task metadata, filtering, and export/import.
- Offline service worker, analytics, external design frameworks, and server-side rendering.

## Risks
- `localStorage` may be unavailable or full; the UI needs a graceful save-error path.
- A CSS glass effect can reduce contrast; text and controls must remain readable against the darkest and brightest surfaces.
- Translucent surfaces can composite differently over the mesh than against a flat swatch; verify contrast on the brightest mesh regions during implementation.
