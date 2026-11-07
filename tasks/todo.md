# To-Do List implementation tasks

## M0 — Static project skeleton

### [x] M0.1 Create the skeleton and smoke check
- Acceptance: the static entrypoint, styles, app script, and one Node smoke test exist; no task behavior is implemented yet.
- Verify: `node --check app.js` -> exit code 0; `node --test` -> 1 test passes, 0 fail; after starting `python -m http.server 8000`, `python -c "import urllib.request; assert urllib.request.urlopen('http://127.0.0.1:8000/').status == 200"` -> exit code 0.
- Files: `index.html`, `styles.css`, `app.js`, `tests/smoke.test.js`.

## M1 — Storage module

### [x] M1.1 Implement localStorage validation and round-trip
- Acceptance: `loadTasks` and `saveTasks` obey `docs/modules/todo-storage.md`, including absent, malformed, invalid, and throwing storage behavior.
- Verify: `node --check app.js` -> exit code 0; `node --test` -> 7 tests pass, 0 fail.
- Files: `app.js`, `tests/todo-storage.test.js`.

## M2 — Task state operations

### [x] M2.1 Add task creation, completion, and deletion helpers
- Acceptance: helpers trim titles, reject blank/over-limit input, toggle only the target task, delete only the target task, and never mutate input arrays.
- Verify: `node --check app.js` -> exit code 0; `node --test` -> 13 tests pass, 0 fail.
- Files: `app.js`, `tests/todo-ui.test.js`.

## M3 — Browser interface and theme

### [x] M3.1 Wire semantic controls and responsive dark-glass styles
- Status: Lily inspected the local preview after the top-margin fix and confirmed it works; browser automation remained unavailable.
- Acceptance: all five FRs and ACs are met; markup-like task titles render as text; keyboard actions and save-failure feedback work; contrast targets are met.
- Verify: `node --check app.js` -> exit code 0; `node --test` -> 14 tests pass, 0 fail; locally serve with `python -m http.server 8000` and complete the browser walkthrough at 360 px and 1280 px, including reload persistence and keyboard-only use.
- Files: `index.html`, `styles.css`, `app.js`, `tests/theme.test.js`.

## M4 — Review and publication handover

### [x] M4.1 Write the verification guide and publisher handover
- Acceptance: a reviewer can launch and verify the app from the guide; the authenticated agent receives current verification results, static publish steps, a same-origin post-deploy reload check, and a note that this workspace has no Git repository, without secrets or invented destination URLs.
- Verify: `node --check app.js` -> exit code 0; `node --test` -> 14 tests pass, 0 fail; manually cross-check both docs against the workspace and M3 browser evidence.
- Files: `docs/review-guide.md`, `docs/publication-handover.md`.
