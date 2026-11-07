# ADR-0002: Store tasks in browser localStorage

## Status
Accepted — approved 2026-11-07.

## Date
2026-11-07

## Context
The list must survive page refreshes, but the agreed MVP is for one person using one browser and does not need cross-device synchronization. A small task list needs only a compact set of fields (`id`, `title`, `completed`, `createdAt`). The persistence choice shapes the storage contract and failure behavior.

## Decision
Persist the complete task array as versioned JSON under the origin-scoped key `todo-list:v1` in `localStorage`.

## Alternatives considered

### Keep tasks only in memory
- Pros: simplest state model and no storage failure cases.
- Cons: a reload loses every task.
- Rejected because: it fails the explicit persistence requirement.

### Use IndexedDB
- Pros: handles larger structured data and asynchronous operations.
- Cons: introduces an asynchronous storage API and more lifecycle code for a small list of short strings.
- Rejected because: the expected data volume is tiny and synchronous localStorage is sufficient for this MVP.

### Store tasks on a server
- Pros: supports backup, accounts, and synchronization across devices.
- Cons: requires an API, hosting, authentication, and a data policy.
- Rejected because: these capabilities are outside the assignment and its single-browser scope.

## Consequences
- Mutations replace one JSON snapshot; the same browser and origin restore it after reload.
- A schema key suffix provides a clear point for a future incompatible storage format (`todo-list:v2`).
- Missing or malformed stored data must recover to an empty list, and write failures must not crash the interface.
- Clearing browser site data removes tasks; users do not get backup or cross-device access.
- The UI must account for unavailable or full localStorage and report that the latest change was not saved.
