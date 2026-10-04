# Design

## Context

See proposal.md for motivation. This illustrative task workspace uses a small
in-memory task model, browser task list, and API. No product implementation is
included in this specification store. The change crosses UI and API boundaries.

## Goals / Non-Goals

**Goals:** Use one normalization policy for task edits and exact-match filtering.

**Non-Goals:** Nested taxonomies, label administration, fuzzy search, and cross-project aggregation.

## Decisions

1. Use an ordered string list on each task instead of a separate label entity; this preserves the small sample model.

2. Trim and lowercase only for comparison, preserving the first display spelling to respect user-entered names.

3. Apply filtering to the full task list before rendering and show an explicit empty result state so a filter never resembles data loss.

## Risks / Trade-offs

- [Labels differ only in case] → Normalize comparisons in both write validation and filtering.

## Migration Plan

There is no persistent database migration in this sample design. Implement the
API contract first, then enable the UI controls. Roll back by hiding the controls
and retaining any compatible existing task fields.

## Role change scope

This change owns QA-REQ-003-keyboard (QA) for REQ-003. Its contract is
[specs/QA-REQ-003-keyboard/spec.md](specs/QA-REQ-003-keyboard/spec.md), and its checklist is
[tasks.md](tasks.md). Shared product decisions above are preserved. Other role
changes remain independent.
