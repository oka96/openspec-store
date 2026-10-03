# Tasks

> Illustrative sample progress only. Checked boxes seed the demonstration board;
> they do not assert that product implementation or verification has occurred.
> Owners and notes live in `openspec/requirements.json`.

## 1. SA

- [x] 1.1 [SA] Specify link validity and cycle scenarios; verify self-link, missing task, and long-chain cases exist.
- [x] 1.2 [SA] Review graph traversal and atomic update design; verify UI and API contracts agree.

## 2. Frontend

- [ ] 2.1 [Frontend] Add prerequisite selection by task title; verify self-task choices are unavailable and labels are accessible.
- [ ] 2.2 [Frontend] Show unresolved dependencies and save errors; verify completed prerequisites disappear from the warning list.

## 3. Backend

- [x] 3.1 [Backend] Implement reference validation and atomic dependency writes; verify missing-reference and self-link unit tests.
- [ ] 3.2 [Backend] Complete iterative cycle detection and document limits; verify cycles through chains over 100 tasks are rejected.

## 4. QA

- [ ] 4.1 [QA] Run dependency lifecycle acceptance scenarios; record edit and completed-prerequisite integration results.
- [ ] 4.2 [QA] Run long-chain and cyclic graph regression scenarios; record rejection and atomicity evidence.
