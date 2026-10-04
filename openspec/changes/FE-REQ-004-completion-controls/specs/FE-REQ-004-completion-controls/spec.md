# FE-REQ-004-completion-controls · Completion controls and feedback

## Purpose

Define the completion controls and feedback responsibilities owned by Frontend for REQ-004, complete & reopen tasks.

## ADDED Requirements

### Requirement: Completion controls and feedback
The UI SHALL provide accessible complete/reopen controls, block repeated updates to a pending task, and update state and counts only from successful responses while showing recoverable failures.

#### Scenario: Confirmed completion
- **WHEN** a completion or reopen request succeeds
- **THEN** the row state and counts reflect the confirmed result

#### Scenario: Pending and failed update
- **WHEN** the user repeats a pending toggle or the update fails
- **THEN** no second pending update starts and failure preserves the confirmed state and counts with an error
