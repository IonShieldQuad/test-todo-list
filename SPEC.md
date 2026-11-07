# To-Do List

## Status
Accepted (reviewed 2026-11-07).

## Objective
Create a polished, responsive, single-page task list for one person. The user can add tasks, mark them complete, remove them, and keep their list after refreshing the same browser. The result should be a small static site suitable for a GitHub repository and GitHub Pages.

## Non-goals
- Accounts, server-side storage, or synchronization between devices/browsers.
- Due dates, priorities, tags, search, collaboration, or notifications.
- A framework, build system, or third-party runtime dependency.
- Pixel-exact reproduction of every kit component; the palette and frosted-glass visual language are in scope, while component-for-component copying is not.

## Tech stack
- HTML5, CSS, and browser JavaScript using ES modules; visual tokens are adapted from `H:/Work/design-kits/kits/dark-glass/` into the project's own stylesheet.
- Node.js 24.x built-in test runner for logic checks; Python 3.11+ standard-library HTTP server for local preview.
- Browser `localStorage` for persistence; no server or runtime dependency.

## Commands
```text
Build: node --check app.js
Test:  node --test
Lint:  node --check app.js
Run:   python -m http.server 8000
```
This is a static site, so there is no compilation step; the build command checks JavaScript syntax. `node --test` runs the built-in tests without installing dependencies. Open `http://localhost:8000` after starting the server. A separate lint tool is not included; the lint command is the available no-dependency syntax check.

## Project structure
```text
index.html       Semantic page structure and task entry point
styles.css       Responsive dark-glass presentation and focus states
app.js           UI events, task state, and localStorage integration
tests/           Built-in Node tests for task and persistence logic
```

## Code style
```js
const STORAGE_KEY = "todo-list:v1";

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
```
Use descriptive camelCase names, 2-space indentation, semicolons, and named constants for storage keys and design values. Keep DOM rendering and persistence in small functions. Avoid dependencies and inline event handlers.

## Requirements
- FR-1: A user can add a non-empty task from the task entry field.
- FR-2: A user can mark a task complete and return it to active.
- FR-3: A user can delete an individual task.
- FR-4: Tasks and completion state persist across page reloads in the same browser.
- FR-5: The interface is responsive, readable, keyboard-operable, and uses the local `dark-glass` kit's palette and frosted-glass visual language.

## Acceptance criteria
- AC-1 (FR-1): Submitting `Buy oat milk` creates exactly one visible task with that label; submitting whitespace creates none. Oracle: `node --test` for input normalization plus browser check at `http://localhost:8000`.
- AC-2 (FR-2): Activating a task's completion control changes its completed state and visible treatment; activating it again restores the active state. Oracle: browser check in the local preview; the matching state-transition unit test must pass under `node --test`.
- AC-3 (FR-3): Activating Delete for one of two tasks removes only that task. Oracle: browser check in the local preview; the matching removal unit test must pass under `node --test`.
- AC-4 (FR-4): After adding two tasks, completing one, and reloading the same origin, both tasks remain and the same one is still complete. Oracle: browser reload check plus persistence unit test under `node --test`; storage key is `todo-list:v1`.
- AC-5 (FR-5): At viewport widths 360 px and 1280 px, the page has no horizontal overflow; all task actions remain usable by keyboard; body copy is at least 12 px and has at least 7:1 contrast, secondary copy at least 4.5:1. Oracle: browser responsive/keyboard check plus contrast calculation using the chosen colors and rendered surface backgrounds.

## Re-tunable defaults (picked sane)
1. `STORAGE_KEY` = `todo-list:v1` — persisted task data format, re-tune in M1 if needed.
2. Minimum supported viewport = 360 px — initial value, re-tune in M1.
3. Body text minimum = 12 px — initial value, re-tune in M1.
4. Task label limit = 200 characters — initial value, re-tune in M1.

## Testing strategy
Use Node's built-in test runner for input handling, completion toggles, deletion, and persistence with a storage stub. Verify the rendered page, keyboard operation, responsive layout, and reload behavior in a browser served locally. Do not introduce an external testing dependency for this small static app.

## Boundaries
- Always: validate and trim task input; use semantic controls and visible keyboard focus; keep storage data versioned under one named key; verify acceptance criteria before handoff.
- Ask first: add a server, account system, third-party dependency, cross-device sync, or a materially different visual direction.
- Never: commit secrets or claim a hosted URL before deployment is confirmed.

## Open questions
- Which repository/account should receive the project is delegated to the publication agent at handoff; it has the required authentication key.

## Milestones
- M0: Create static page skeleton, styles, task state, and persistence.
- M1: Add built-in logic tests and verify the acceptance criteria in a browser.
- M2: Prepare a review guide and a publication handover for Lily's authenticated agent, including the verified build state, exact deployment steps, and any remaining publication inputs.
