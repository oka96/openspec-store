# Tasks

> Illustrative sample progress only. Checked boxes seed the demonstration board;
> they do not assert that product implementation or verification has occurred.
> Owners and notes live in `openspec/requirements.json`.

## 1. SA

- [x] 1.1 [SA] Specify complete/reopen and failed-update scenarios; verify counters are included.
- [x] 1.2 [SA] Review the boolean API and pending-state design; verify duplicate requests are safe.

## 2. Frontend

- [x] 2.1 [Frontend] Add accessible complete/reopen controls; verify label and state update after successful saves.
- [x] 2.2 [Frontend] Show pending and failure feedback; verify failed updates preserve task state and counts.

## 3. Backend

- [x] 3.1 [Backend] Implement idempotent boolean completion updates; verify invalid types and missing tasks are rejected.
- [x] 3.2 [Backend] Document completed counts and response shape; verify create/list/update integration tests.

## 4. QA

- [x] 4.1 [QA] Run complete, reopen, and failed-update acceptance scenarios; record integration evidence.
- [ ] 4.2 [QA] Check keyboard use and rapid repeated toggles; record the final browser regression results.
