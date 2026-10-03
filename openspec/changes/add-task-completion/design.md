# Design

## Context

See proposal.md for motivation. This illustrative task workspace uses a small
in-memory task model, browser task list, and API. No product implementation is
included in this specification store. The change crosses UI and API boundaries.

## Goals / Non-Goals

**Goals:** Keep row state and totals synchronized and make failures recoverable.

**Non-Goals:** Archival, task deletion, audit histories, and completion notifications.

## Decisions

1. Use an explicit boolean update rather than a toggle-only API so retrying a request is idempotent.

2. Disable a row toggle while its update is pending to avoid out-of-order results; independent rows can update together.

3. Recompute counters from confirmed task state instead of incrementing separate mutable counters.

## Risks / Trade-offs

- [Rapid clicks create stale results] → Allow only one pending completion update per task and test repeated input.

## Migration Plan

There is no persistent database migration in this sample design. Implement the
API contract first, then enable the UI controls. Roll back by hiding the controls
and retaining any compatible existing task fields.

## Role specification tracking

Shared product decisions above are unchanged. This requirement uses the local
`role-specs` workflow. Each role feature has its own specification and checklist:

- [SA-REQ-004-completion-contract](specs/SA-REQ-004-completion-contract/spec.md) · [tasks](tasks/SA-REQ-004-completion-contract.md)
- [FE-REQ-004-completion-controls](specs/FE-REQ-004-completion-controls/spec.md) · [tasks](tasks/FE-REQ-004-completion-controls.md)
- [BE-REQ-004-completion-api](specs/BE-REQ-004-completion-api/spec.md) · [tasks](tasks/BE-REQ-004-completion-api.md)
- [QA-REQ-004-completion-regression](specs/QA-REQ-004-completion-regression/spec.md) · [tasks](tasks/QA-REQ-004-completion-regression.md)

Metadata version 2 registers these role specs. Progress comes from each task file;
every registered spec must be complete before its role can complete. The original
planning artifacts remain byte-preserved under `legacy/` and are not active task
sources. Seeded checks remain illustrative rather than implementation evidence.
