# Publication handover: To-Do List

Status: **published** on GitHub Pages and smoke-checked on the hosted origin.

## Destination
- Repository URL: `https://github.com/IonShieldQuad/test-todo-list`
- Hosted site URL: `https://ionshieldquad.github.io/test-todo-list/`
- Target branch: `main` (repository default; Pages serves `/` from it)
- Local source folder: `H:/Work/test-todo-list`
- Git state: initialized here on `main`, remote `origin` set to the repository above, two commits pushed (`feat: publish …`, `fix(a11y): keep keyboard focus inside the list …`).

Lily said the receiving agent has the authentication key and asked for a handover. Use that agent's existing credential store; do not put keys or tokens in this folder, repository, commit messages, or handover.

## Project and runtime
- Static site: `index.html`, `styles.css`, and `app.js` at repository root.
- No build step and no third-party runtime dependencies.
- Configure GitHub Pages to serve the repository root from the chosen branch; the page uses relative CSS/JS paths and needs no base-path rewrite.
- User data is stored in `localStorage` for the site's origin. Tasks created on `localhost` do not transfer to the GitHub Pages origin.
- AI tool used: OpenAI Codex for planning, implementation, and local checks.

## Verified state
- `node --check app.js` -> exit code 0, no output.
- `node --test` -> 14 tests, 14 pass, 0 fail.
- `python -m http.server 8000` was used for local preview; requests to `/`, `/app.js`, and `/styles.css` each returned HTTP 200.
- Lily checked the local preview after the top-margin fix and confirmed it works. The agent could not independently record the full keyboard/viewport/reload walkthrough because the desktop/browser automation runtime was unavailable.

## Publish steps
1. Clone or initialize the destination repository, then copy the complete project source from `H:/Work/test-todo-list` into its root. Keep `SPEC.md`, `docs/`, `tasks/`, and `tests/` with the app so the review material remains available.
2. Run `node --check app.js` and `node --test` from the repository root; expect exit code 0 and 14 passing tests.
3. Commit and push using the destination repository's established branch and the authenticated agent's configured credentials. Do not add credentials to the repository.
4. In GitHub repository settings, enable Pages from the selected branch and the repository root (`/`). Wait for deployment to complete and record the exact repository and site URLs above.
5. On the final hosted URL, add two distinct tasks, mark one complete, reload the same URL, confirm both tasks and the completion state remain, then delete one. Also check the 360 px and 1280 px layouts and use Tab/Enter/Space to add, complete, and delete a task.
6. Return the repository URL, hosted URL, deployment result, and the final-origin smoke-check result to Lily.

## Hosted verification (recorded 2026-11-07)

Checked by the publication agent on `https://ionshieldquad.github.io/test-todo-list/` in Chromium:

- Pages build completed (`status: built`); `/`, `/app.js`, and `/styles.css` each return HTTP 200.
- Added two tasks, completed one, reloaded the same URL: both tasks and the completion state persisted (`todo-list:v1` in `localStorage`). Deleted one task; it stayed deleted after a reload.
- Keyboard only: Tab into the input, type, Enter adds a task; Tab to the checkbox, Space completes it; Tab to the delete button, Enter removes it.
- 360 px and 1280 px: no horizontal overflow (`scrollWidth` equals viewport width at both), no console errors. At 360 px the input placeholder is truncated, and the input font size is 13 px.
- A title of `<img src=x onerror=alert(1)>` renders as text; no element is created from it.
- `node --check app.js` -> exit code 0; `node --test` -> 14 pass, 0 fail (rerun after the fix below).

### Fix made during publication
The list re-renders from scratch on every change, so completing or deleting a task removed the focused control and dropped focus to `<body>` — a keyboard user had to tab in from the top of the page after each toggle. `app.js` now captures the focused control and row before rendering and restores focus afterwards, moving to the neighbouring row when the focused task was deleted. This is the "keyboard focus is lost" risk recorded in `docs/premortem.md`.

## Review files
- `SPEC.md` — scope and acceptance criteria.
- `docs/architecture.md` and `docs/adr/` — design and recorded decisions.
- `docs/modules/` — storage and UI contracts.
- `docs/plan.md`, `docs/premortem.md`, and `docs/review-guide.md` — milestones, risks, and local review steps.
- `tests/` — built-in Node checks.
