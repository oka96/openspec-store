# Tasks

> Illustrative sample progress only. Checked boxes seed the demonstration board;
> they do not assert that product implementation or verification has occurred.
> Owners and notes live in `openspec/requirements.json`.

## 1. SA

- [x] 1.1 [SA] Specify title normalization and errors; verify length and blank-title boundaries are covered.
- [x] 1.2 [SA] Review keyboard focus and retry behavior; verify design and acceptance scenarios agree.

## 2. Frontend

- [x] 2.1 [Frontend] Implement form submission and pending state; verify Enter and button each create exactly one task.
- [x] 2.2 [Frontend] Implement success focus and error retention; verify keyboard and accessible error rendering.

## 3. Backend

- [x] 3.1 [Backend] Implement trimmed title validation; verify empty, whitespace, overlong, and valid title tests.
- [x] 3.2 [Backend] Document create responses and errors; verify invalid requests do not mutate the task list.

## 4. QA

- [x] 4.1 [QA] Run create, validation, and retry acceptance scenarios; record integrated outcomes.
- [x] 4.2 [QA] Check focus restoration and rapid Enter input; record keyboard regression evidence.
