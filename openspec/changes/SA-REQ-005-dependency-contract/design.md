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

## Role change scope

This change owns SA-REQ-005-dependency-contract (SA) for REQ-005. Its contract is
[specs/SA-REQ-005-dependency-contract/spec.md](specs/SA-REQ-005-dependency-contract/spec.md), and its checklist is
[tasks.md](tasks.md). Shared product decisions above are preserved. Other role
changes remain independent.
