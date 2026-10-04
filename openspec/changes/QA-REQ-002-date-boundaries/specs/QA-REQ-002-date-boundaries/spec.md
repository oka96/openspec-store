# QA-REQ-002-date-boundaries · Date lifecycle and boundary acceptance

## Purpose

Define the date lifecycle and boundary acceptance responsibilities owned by QA for REQ-002, due dates & overdue cues.

## ADDED Requirements

### Requirement: Date lifecycle and boundary acceptance
Acceptance verification SHALL record due-date create, clear, invalid input, timezone, leap-day, and month-boundary outcomes before date verification tasks are completed.

#### Scenario: Local calendar boundary
- **WHEN** due-today, overdue, and completed tasks are tested around a month boundary
- **THEN** evidence shows cues follow the local date and completed tasks never appear overdue

#### Scenario: Date mutation evidence
- **WHEN** valid, cleared, omitted, and invalid dates are exercised
- **THEN** evidence records stable round trips, clearing semantics, and no mutation after invalid input
