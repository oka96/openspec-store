# Design

## Context

See proposal.md for motivation. This illustrative task workspace uses a small
in-memory task model, browser task list, and API. No product implementation is
included in this specification store. The change crosses UI and API boundaries.

## Goals / Non-Goals

**Goals:** Prevent duplicate submissions and keep focus predictable across success and failure.

**Non-Goals:** Global keyboard shortcuts, natural-language parsing, and bulk imports.

## Decisions

1. Use a native form submit event for both Enter and button activation; separate key handlers can accidentally create duplicates.

2. Validate trimmed titles on the server as well as in the form so all clients share the same contract.

3. Disable submission while pending and restore it on error, leaving the original text intact for retry.

## Risks / Trade-offs

- [Double submission creates duplicate tasks] → Guard the pending state and verify rapid Enter input creates one task.

## Migration Plan

There is no persistent database migration in this sample design. Implement the
API contract first, then enable the UI controls. Roll back by hiding the controls
and retaining any compatible existing task fields.

## Role specification tracking

Shared product decisions above are unchanged. This requirement uses the local
`role-specs` workflow. Each role feature has its own specification and checklist:

- [SA-REQ-006-capture-contract](specs/SA-REQ-006-capture-contract/spec.md) · [tasks](tasks/SA-REQ-006-capture-contract.md)
- [FE-REQ-006-capture-form](specs/FE-REQ-006-capture-form/spec.md) · [tasks](tasks/FE-REQ-006-capture-form.md)
- [BE-REQ-006-capture-validation](specs/BE-REQ-006-capture-validation/spec.md) · [tasks](tasks/BE-REQ-006-capture-validation.md)
- [QA-REQ-006-capture-regression](specs/QA-REQ-006-capture-regression/spec.md) · [tasks](tasks/QA-REQ-006-capture-regression.md)

Metadata version 2 registers these role specs. Progress comes from each task file;
every registered spec must be complete before its role can complete. The original
planning artifacts remain byte-preserved under `legacy/` and are not active task
sources. Seeded checks remain illustrative rather than implementation evidence.
