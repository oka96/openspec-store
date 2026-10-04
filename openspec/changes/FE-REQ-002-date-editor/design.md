# Design

## Context

See proposal.md for motivation. This illustrative task workspace uses a small
in-memory task model, browser task list, and API. No product implementation is
included in this specification store. The change crosses UI and API boundaries.

## Goals / Non-Goals

**Goals:** Keep date-only values stable between browser and API and clarify overdue boundaries.

**Non-Goals:** Time-of-day reminders, recurring schedules, calendar integration, and notification delivery.

## Decisions

1. Store the date as YYYY-MM-DD rather than a timestamp to avoid timezone shifts; reject nonexistent dates such as February 30.

2. Compute overdue display against the browser local calendar date; server validation is independent of the client clock.

3. Use an explicit clear control and null API value so removing a date cannot be confused with omitting an update field.

## Risks / Trade-offs

- [Client clock changes] → Recompute overdue cues on refresh and document that this sample uses the viewer calendar date.

## Migration Plan

There is no persistent database migration in this sample design. Implement the
API contract first, then enable the UI controls. Roll back by hiding the controls
and retaining any compatible existing task fields.

## Role change scope

This change owns FE-REQ-002-date-editor (Frontend) for REQ-002. Its contract is
[specs/FE-REQ-002-date-editor/spec.md](specs/FE-REQ-002-date-editor/spec.md), and its checklist is
[tasks.md](tasks.md). Shared product decisions above are preserved. Other role
changes remain independent.
