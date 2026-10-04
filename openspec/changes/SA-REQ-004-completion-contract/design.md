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

## Role change scope

This change owns SA-REQ-004-completion-contract (SA) for REQ-004. Its contract is
[specs/SA-REQ-004-completion-contract/spec.md](specs/SA-REQ-004-completion-contract/spec.md), and its checklist is
[tasks.md](tasks.md). Shared product decisions above are preserved. Other role
changes remain independent.
