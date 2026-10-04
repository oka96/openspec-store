# FE-REQ-002-date-editor · Date editor and overdue cues

## Purpose

Define the date editor and overdue cues responsibilities owned by Frontend for REQ-002, due dates & overdue cues.

## ADDED Requirements

### Requirement: Date editor and overdue cues
The UI SHALL expose an accessible date field and clear control and show an overdue text label only for incomplete tasks whose due date precedes the viewer local calendar date.

#### Scenario: Due today and completed
- **WHEN** a task is due today or is already completed
- **THEN** its due date remains visible without an overdue cue

#### Scenario: Clear and edit
- **WHEN** a keyboard user edits or clears a due date
- **THEN** the field supports keyboard entry and clearing removes the displayed date after success
