# ADR-0001: Serve the To-Do List as a static browser app

## Status
Accepted — approved 2026-11-07.

## Date
2026-11-07

## Context
The assignment needs four local task operations and a polished interface, with a GitHub code link and a working site as a bonus. It does not require accounts, remote APIs, collaboration, or cross-device state. The workspace starts empty, and the delivery should be easy to review and hand over to an agent that can publish it.

## Decision
Build the app as plain HTML, CSS, and browser JavaScript, and target GitHub Pages for static hosting.

## Alternatives considered

### Use a front-end framework and bundler
- Pros: established component patterns, richer ecosystem, and easier future growth.
- Cons: adds package management, a build step, dependencies, and deployment configuration to a four-operation single-page app.
- Rejected because: the current requirements do not justify that extra runtime and tooling surface.

### Build a full-stack app
- Pros: enables accounts, shared lists, and server-side storage.
- Cons: requires a backend, hosting configuration, and an identity/data model.
- Rejected because: none of those capabilities are required; this would increase delivery and maintenance work without improving the requested single-browser flow.

## Consequences
- The app can be previewed and hosted as static files without a build pipeline or application server.
- The project can be reviewed and published through a GitHub repository and GitHub Pages handover.
- Browser JavaScript and browser APIs define the runtime; adding server-backed features later requires a new architecture decision.
- The app cannot provide authentication, sharing, or synchronized state without adding a backend.
