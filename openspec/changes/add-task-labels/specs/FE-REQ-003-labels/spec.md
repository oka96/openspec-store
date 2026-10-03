# FE-REQ-003-labels · Label entry and removable chips

## Purpose

Define the label entry and removable chips responsibilities owned by Frontend for REQ-003, labels & quick filters.

## ADDED Requirements

### Requirement: Label entry and removable chips
The UI SHALL offer labeled task label entry and keyboard-removable chips, showing a single preserved display spelling for case-insensitive duplicates.

#### Scenario: Keyboard chip removal
- **WHEN** a keyboard user removes a label chip
- **THEN** the intended label is removed and controls remain accessible

#### Scenario: Duplicate entry
- **WHEN** the user adds Design followed by a spaced design value
- **THEN** one Design chip is displayed after the update succeeds
