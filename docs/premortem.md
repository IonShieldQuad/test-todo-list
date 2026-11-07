# Premortem: To-Do List

Frame: it is one month from now and this project failed. The app was not useful as a test submission because one or more of these happened: it looked like a generic dark page instead of the requested kit, it appeared to save tasks but lost them after reload, or the source never reached a usable GitHub repository/site because the publication handover lacked essential context.

## Top three killers
1. The visual result misses Lily's dark-glass intent — the early screenshots show opaque charcoal panels or unreadable text — mitigate with two viewport reviews and token/contrast checks in M3.
2. A task appears saved but reload loses it — the write path or origin changed — mitigate with isolated storage failure tests and a same-origin reload walkthrough before handover.
3. The code is complete but publication stalls — this workspace has no Git repository and no destination URL — mitigate with a handover that states this explicitly and gives the authenticated agent the source, checks, and required destination inputs without inventing URLs.

## Failure modes

### The page looks dark but does not use the kit's frosted-glass language
- Category: intent
- Likelihood: M   Impact: H
- Story: A flat charcoal surface with a violet button technically meets the dark theme request but loses the kit's colored mesh, translucency, light edge, and carefully chosen action contrast.
- Trip wire: The first local screenshots at 360 px and 1280 px show opaque-looking panels, low-contrast supporting copy, or white text on the violet primary button.
- Mitigation applied to the plan now: M3 compares screenshots and computed colors with the local `dark-glass` reference and checks body/secondary contrast thresholds before acceptance.
- Contingency if it fires: Restore the kit's translucent surfaces and mesh, keep the dark label on violet, and rerun both viewport/contrast checks; do not replace the palette with a new theme.

### Storage seems to work until refresh or a write fails
- Category: technical
- Likelihood: M   Impact: H
- Story: The UI updates its in-memory list, but the localStorage write throws or writes under a different origin/key; after refresh the list is empty and the user believes the app lost data.
- Trip wire: The storage stub throws during `setItem`, the browser shows an unsaved warning, or AC-4 fails on reload at the same origin.
- Mitigation applied to the plan now: M1 tests read/write failure paths; M3 checks that a failed write is announced and verifies a same-origin reload restores two tasks and completion state before handover.
- Contingency if it fires: Stop the handover, keep in-memory changes visible, fix the key/write path, and repeat the full storage and browser walkthrough. Do not claim the failed change was persisted.

### The task list is exposed to markup injection or keyboard users cannot operate it
- Category: technical
- Likelihood: L   Impact: H
- Story: A title is inserted through `innerHTML`, or action controls are clickable only with a pointer; the visual demo passes while a basic input/accessibility check fails.
- Trip wire: A title such as `<img src=x onerror=alert(1)>` creates an element, or tab/space/enter cannot add, complete, or delete a task.
- Mitigation applied to the plan now: M3 verifies text-only rendering and includes a keyboard-only walkthrough for all task actions.
- Contingency if it fires: Use DOM node creation and `textContent`, restore semantic checkbox/button controls and focus visibility, then rerun the injection and keyboard checks.

### A test-count mismatch is mistaken for a product failure or hidden by editing the count
- Category: process
- Likelihood: M   Impact: M
- Story: A reasonable extra negative case changes the expected count, and an agent either stops on a false alarm or deletes coverage to match the plan.
- Trip wire: `node --test` reports a count different from the current milestone's planned total.
- Mitigation applied to the plan now: The plan identifies what each milestone's expected count includes; update the plan count when adding a valid new test and never remove a failing case to force a match.
- Contingency if it fires: Compare discovered tests to the named scenarios in the module plan, correct test discovery/naming or the expected count, then rerun the full suite.

### Browser verification uses a different origin from the deployed site
- Category: external
- Likelihood: M   Impact: M
- Story: Local `localhost:8000` storage works, but the publishing agent serves the app from a different origin or path, so the published site appears to have no saved tasks.
- Trip wire: The deployed page loads but its first task is not restored after reload on that deployed URL.
- Mitigation applied to the plan now: M4 handover calls out origin-scoped storage and requires the publisher to run the same add/reload smoke check on the final URL after activation.
- Contingency if it fires: Verify the correct final origin and re-run the smoke scenario there; explain that local-origin tasks do not transfer to the hosted origin.

### Publication stalls after implementation
- Category: external
- Likelihood: M   Impact: H
- Story: The app is ready, but the current workspace is not a Git repository and neither the target account/repository nor public-site URL is specified. The publishing agent cannot responsibly guess where to push.
- Trip wire: At M4 the handover has no target repository/account or cannot identify how the agent receives the source folder.
- Mitigation applied to the plan now: M4 explicitly records that no `.git` directory exists, leaves destination values as required inputs, and includes exact verification and static hosting steps for the authenticated agent.
- Contingency if it fires: Deliver the complete handover package without claiming a GitHub/site URL and request the destination from Lily or the authenticated agent before publication.

## Plan deltas applied
- `docs/plan.md`: M3 now requires screenshots at both target widths, visual comparison with the local theme, storage-failure feedback, and a same-origin reload check. M4 now records the absent Git repository. Added explicit trip wires for lost persistence and unsafe/inaccessible task controls.
- `SPEC.md`: no threshold or scope change; existing AC-4 and AC-5 already capture persistence, viewport, keyboard, and contrast requirements.
- `docs/modules/todo-storage.md` and `docs/modules/todo-ui.md`: no contract change; their existing failure behavior and safe text-rendering contracts support the mitigations.

## The bet
The app can meet the assignment with a small static page and origin-scoped browser storage, and the local `dark-glass` tokens are sufficient to reproduce the requested feel without importing the whole kit or adding a framework. The project is betting that a transparent M4 handover is enough for the authenticated agent to publish once the destination is known.
