# Design

## Context

See proposal.md for motivation. This illustrative task workspace uses a small
in-memory task model, browser task list, and API. No product implementation is
included in this specification store. The change crosses UI and API boundaries.

## Goals / Non-Goals

**Goals:** Preserve graph consistency while keeping prerequisite display understandable.

**Non-Goals:** Automatic scheduling, critical-path calculations, and blocking completion automatically.

## Decisions

1. Store prerequisite task identifiers instead of embedded snapshots so titles and completion state always reflect current records.

2. Validate all references and cycles before replacing the prerequisite list; use iterative graph traversal to avoid recursion depth limits.

3. Show only unresolved prerequisites in the task row, with the full list in editing controls, to reduce visual clutter.

## Risks / Trade-offs

- [Large chains expose incomplete cycle detection] → Test chains longer than 100 nodes and enforce atomic updates. This is the seeded illustrative blocker.

## Migration Plan

There is no persistent database migration in this sample design. Implement the
API contract first, then enable the UI controls. Roll back by hiding the controls
and retaining any compatible existing task fields.

## Role specification tracking

Shared product decisions above are unchanged. This requirement uses the local
`role-specs` workflow. Each role feature has its own specification and checklist:

- [SA-REQ-005-dependency-contract](specs/SA-REQ-005-dependency-contract/spec.md) · [tasks](tasks/SA-REQ-005-dependency-contract.md)
- [FE-REQ-005-dependency-controls](specs/FE-REQ-005-dependency-controls/spec.md) · [tasks](tasks/FE-REQ-005-dependency-controls.md)
- [BE-REQ-005-dependency-validation](specs/BE-REQ-005-dependency-validation/spec.md) · [tasks](tasks/BE-REQ-005-dependency-validation.md)
- [QA-REQ-005-dependency-regression](specs/QA-REQ-005-dependency-regression/spec.md) · [tasks](tasks/QA-REQ-005-dependency-regression.md)

Metadata version 2 registers these role specs. Progress comes from each task file;
every registered spec must be complete before its role can complete. The original
planning artifacts remain byte-preserved under `legacy/` and are not active task
sources. Seeded checks remain illustrative rather than implementation evidence.
