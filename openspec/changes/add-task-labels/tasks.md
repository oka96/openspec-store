# Tasks

> Illustrative sample progress only. Checked boxes seed the demonstration board;
> they do not assert that product implementation or verification has occurred.
> Owners and notes live in `openspec/requirements.json`.

## 1. SA

- [x] 1.1 [SA] Specify count, length, and case rules; verify all limits have acceptance examples.
- [x] 1.2 [SA] Review filter and empty-state behavior; verify design and delta spec agree.

## 2. Frontend

- [x] 2.1 [Frontend] Add label entry and removable chips; verify keyboard removal and duplicate handling.
- [ ] 2.2 [Frontend] Add exact-match filtering and empty results; verify clearing the filter restores all tasks.

## 3. Backend

- [ ] 3.1 [Backend] Implement normalized label validation; verify duplicate, blank, overlong, and over-limit tests.
- [ ] 3.2 [Backend] Implement the label filter contract and document it; verify case-insensitive exact-match API scenarios.

## 4. QA

- [ ] 4.1 [QA] Run label edit/filter acceptance scenarios; record cross-role integration results.
- [ ] 4.2 [QA] Check empty lists and keyboard chip controls; record browser regression evidence.
