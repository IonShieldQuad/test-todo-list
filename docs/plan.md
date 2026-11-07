# Plan: To-Do List

Derived from `SPEC.md`, `docs/architecture.md`, `docs/adr/`, and `docs/modules/`.

## Build order
`M0 project skeleton` -> `M1 todo-storage` -> `M2 todo-ui task operations` -> `M3 browser UI and dark-glass styling` -> `M4 acceptance review and publication handover`.

The CSS palette can be prepared in parallel with M1/M2, but integration stays in M3 after the markup contract is stable. M4 depends on all functional work. No external publication or Git push is part of these milestones; M4 prepares the authenticated agent's handover.

## Milestones

### M0 — Establish a static project skeleton and prove the toolchain
- Scope: project structure and commands in `SPEC.md`; smoke-test harness; no feature behavior yet.
- Files: `index.html`, `styles.css`, `app.js`, `tests/smoke.test.js`.
- Exit criteria: `node --check app.js` -> exit code 0; `node --test` -> 1 test passes, 0 fail; start `python -m http.server 8000`, then `python -c "import urllib.request; assert urllib.request.urlopen('http://127.0.0.1:8000/').status == 200"` -> exit code 0.
- Depends on: —
- Risk: Node test discovery or local server setup differs from the documented commands; resolve before feature work.

### M1 — Implement and test the storage contract
- Scope: `todo-storage` module design; `STORAGE_KEY`, task shape validation, load/save behavior; AC-4 persistence foundation.
- Files: `app.js`, `tests/todo-storage.test.js`.
- Exit criteria: `node --check app.js` -> exit code 0; `node --test` -> 7 tests pass, 0 fail (M0 smoke plus 6 storage cases).
- Depends on: M0
- Risk: malformed data must not be partially restored; reject the complete snapshot and keep the UI on its empty state.

### M2 — Implement and test task state transitions
- Scope: `todo-ui` pure operations `createTask`, `toggleTask`, and `deleteTask`; FR-1, FR-2, FR-3 logic; AC-1, AC-2, AC-3 logic checks.
- Files: `app.js`, `tests/todo-ui.test.js`.
- Exit criteria: `node --check app.js` -> exit code 0; `node --test` -> 13 tests pass, 0 fail (M0 + M1 + 6 task-operation cases).
- Depends on: M1
- Risk: do not mutate the prior list; tests use fixed IDs and timestamps to stay deterministic.

### M3 — Connect the accessible browser UI and dark-glass presentation
- Scope: FR-1..FR-5; AC-1..AC-5; semantic markup, event handling, feedback, responsive layout, and selected `dark-glass` tokens.
- Files: `index.html`, `styles.css`, `app.js`, `tests/theme.test.js`.
- Exit criteria: `node --check app.js` -> exit code 0; `node --test` -> 14 tests pass, 0 fail; with `python -m http.server 8000` running, browser checks at 360 px and 1280 px show no horizontal overflow, all actions work by keyboard, add/toggle/delete work, a reload restores saved task state, a storage-write failure announces that the latest change was not saved, and a markup-like task title renders as text; review screenshots at both widths against the local `dark-glass` palette/surface language; verify body contrast >= 7:1 and secondary text >= 4.5:1 using the theme contrast test and inspect the computed palette in the browser.
- Depends on: M2
- Risk: translucent surfaces can change contrast over the mesh; keep the kit colors and test the brightest background region. Re-tune spacing or surface opacity only if AC-5 fails, then repeat the contrast check.

### M4 — Complete review materials and publication handover
- Scope: handoff requirements and final acceptance evidence; no publication action.
- Files: `docs/review-guide.md`, `docs/publication-handover.md`.
- Exit criteria: `node --check app.js` -> exit code 0; `node --test` -> 14 tests pass, 0 fail; review guide contains exact local preview and acceptance steps; publication handover lists the verified file set, current test results, static hosting steps, that this workspace has no Git repository, any destination details the authenticated agent must supply, and a same-origin add/reload smoke check for the final hosted URL, with no credentials.
- Depends on: M3
- Risk: repository/account destination is unspecified; identify it as an input for the publishing agent rather than inventing a URL.

## Verification checkpoints
- M0: verify Node syntax, test discovery, and one local HTTP response before feature implementation.
- M1: rerun the full Node suite after storage changes; each test uses isolated injected storage.
- M2: rerun the full Node suite after state helpers; use fixed IDs and timestamps.
- M3: run the full suite, local browser interaction checks, 360 px / 1280 px layout checks, keyboard-only walkthrough, reload persistence, and contrast test.
- M4: rerun syntax and all 14 tests; cross-check the review guide and publication handover against the actual workspace state.

## Trip wires
| Trip wire (observable signal) | Checked at | Response if it fires |
|---|---|---|
| `localStorage` read/write throws or browser reports an unsaved change | M1 and M3 | Keep current page usable, show the unsaved status, and test the storage stub failure path. |
| `node --test` discovers fewer or more than the planned cases | M0-M3 | Correct test naming or update this plan before proceeding; do not hide skipped tests. |
| Page overflows horizontally at 360 px or keyboard focus is lost | M3 | Fix responsive sizing or event handling; rerun all browser checks. |
| Text contrast is below the thresholds or local screenshots do not read as dark frosted glass | M3 | Compare computed tokens with the local kit; adjust typography/surface composition without replacing the kit palette, then recalculate and repeat both viewport checks. |
| The authenticated agent has no repository destination or the workspace contents cannot be transferred | M4 | Do not invent URLs or claim publication; leave destination fields marked as required input and hand over the complete verified source folder. |
| Saved tasks disappear after reload on the same origin | M3 | Stop handover, inspect the storage key and write result, and repeat the reload scenario with fresh browser storage. |
| Task text is interpreted as markup or a control cannot be used by keyboard | M3 | Render through `textContent`, restore semantic controls/focus behavior, and repeat the injection-string and keyboard walkthrough. |

## Re-tune milestones
| Constant | Provisional value | Re-tune at |
|---|---|---|
| `MAX_TITLE_LENGTH` | 200 characters | M2; keep `todo-storage` validation and input `maxlength` aligned. |
| Minimum viewport | 360 px | M3 after browser layout check. |
| Body text minimum | 12 px | M3 after visual and contrast checks. |
| `STORAGE_KEY` | `todo-list:v1` | Fixed by ADR-0002; change only through a new migration decision. |
