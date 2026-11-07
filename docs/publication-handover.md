# Publication handover: To-Do List

Status: ready for Lily's authenticated publication agent; **not published**.

## Destination
- Repository URL: `PENDING — select/create the target repository`
- Hosted site URL: `PENDING — return after GitHub Pages is enabled`
- Target branch: `PENDING — use the destination repository's default branch`
- Local source folder: `H:/Work/test-todo-list`
- Git state: this folder is not a Git repository and has no commit history. Initialize the target clone or copy the full project into it before publishing.

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

## Review files
- `SPEC.md` — scope and acceptance criteria.
- `docs/architecture.md` and `docs/adr/` — design and recorded decisions.
- `docs/modules/` — storage and UI contracts.
- `docs/plan.md`, `docs/premortem.md`, and `docs/review-guide.md` — milestones, risks, and local review steps.
- `tests/` — built-in Node checks.
