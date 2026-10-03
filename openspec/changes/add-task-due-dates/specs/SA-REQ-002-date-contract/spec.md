# SA-REQ-002-date-contract · Date contract

## Purpose

Define the date contract responsibilities owned by SA for REQ-002, due dates & overdue cues.

## ADDED Requirements

### Requirement: Task due dates
The workspace SHALL accept an optional valid calendar due date in YYYY-MM-DD format, allow it to be cleared, and mark incomplete tasks overdue only when today is later than that date. Completed tasks SHALL not be marked overdue.

#### Scenario: Due today
- **WHEN** an incomplete task has a due date equal to today
- **THEN** the task shows its due date without an overdue cue

#### Scenario: Overdue task
- **WHEN** an incomplete task has a due date before today
- **THEN** the task shows an overdue label

#### Scenario: Clear or reject a date
- **WHEN** a user clears the due date or submits an invalid calendar date
- **THEN** clearing removes the date, while an invalid date returns an error without changing the task
