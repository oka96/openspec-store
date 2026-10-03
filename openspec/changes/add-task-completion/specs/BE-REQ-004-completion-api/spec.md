# BE-REQ-004-completion-api · Idempotent completion API

## Purpose

Define the idempotent completion api responsibilities owned by Backend for REQ-004, complete & reopen tasks.

## ADDED Requirements

### Requirement: Idempotent completion API
The API SHALL create incomplete tasks, accept explicit boolean completion updates idempotently, reject invalid types and missing tasks, and expose counts consistent with confirmed task state.

#### Scenario: Retry boolean update
- **WHEN** the same completed boolean is submitted twice
- **THEN** the task and completed count reflect one state change

#### Scenario: Reject invalid target
- **WHEN** an update uses a non-boolean value or a missing task
- **THEN** the API rejects the request without changing tasks or counts
