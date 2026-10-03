# Tasks

> Illustrative sample progress only. Checked boxes seed the demonstration board;
> they do not assert that product implementation or verification has occurred.
> Owners and notes live in `openspec/requirements.json`.

## 1. SA

- [x] 1.1 [SA] Define date-only and overdue scenarios; verify due-today, overdue, and completed cases are specified.
- [ ] 1.2 [SA] Review clear versus omitted update semantics; verify the API and UI design use the same contract.

## 2. Frontend

- [ ] 2.1 [Frontend] Add an accessible date field and clear control; verify keyboard entry and clearing work.
- [ ] 2.2 [Frontend] Render overdue text labels; verify due-today and completed tasks do not show overdue.

## 3. Backend

- [ ] 3.1 [Backend] Validate real calendar dates and nullable updates; verify leap-day and invalid-date unit tests.
- [ ] 3.2 [Backend] Return stable date strings in task reads; document the contract and verify round trips do not shift dates.

## 4. QA

- [ ] 4.1 [QA] Run due-date lifecycle acceptance scenarios; record create, clear, and invalid-input outcomes.
- [ ] 4.2 [QA] Check timezone and month-boundary browser cases; record the local-date integration evidence.
