# SA-REQ-001-description-contract · Description contract

## Purpose

Define the description contract responsibilities owned by SA for REQ-001, task descriptions.

## ADDED Requirements

### Requirement: Task description lifecycle
The workspace SHALL accept an optional plain-text description up to 2,000 Unicode
code points. Omitted descriptions SHALL default to an empty string at creation
and remain unchanged on updates. Users SHALL be able to edit or clear descriptions.
Saved text SHALL retain whitespace and line breaks and display as literal text.

#### Scenario: New task without a description
- **WHEN** a user creates a task without a description
- **THEN** task reads expose an empty description and task details remain usable

#### Scenario: Edit multiline context
- **WHEN** a user saves a valid multiline description containing markup-like text
- **THEN** task details and subsequent task reads preserve the entered text and line breaks
- **AND** the displayed text does not execute or interpret markup

#### Scenario: Clear or preserve a description
- **WHEN** an update omits the description
- **THEN** the saved description remains unchanged
- **AND** a later update with an empty string clears the saved description

### Requirement: Description validation feedback
The workspace SHALL reject non-string descriptions and descriptions longer than
2,000 Unicode code points with a validation error and no task mutation. A failed
save SHALL keep the editor's draft available and leave the saved display unchanged.

#### Scenario: Invalid type or excessive length
- **WHEN** a request supplies a non-string description or one exceeding 2,000 Unicode code points
- **THEN** the request returns a validation error and all saved task data remains unchanged

#### Scenario: Description boundary
- **WHEN** a user saves a description containing exactly 2,000 Unicode code points, including emoji
- **THEN** the save succeeds and task details show the full description

#### Scenario: Save failure
- **WHEN** saving a valid description fails
- **THEN** the editor shows an error and retains the draft for retry
- **AND** the saved description remains unchanged
