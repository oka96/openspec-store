# FE-REQ-005-dependency-controls · Prerequisite selection and warnings

## Purpose

Define the prerequisite selection and warnings responsibilities owned by Frontend for REQ-005, task dependency links.

## ADDED Requirements

### Requirement: Prerequisite selection and warnings
The UI SHALL allow accessible prerequisite selection by task title, exclude self-task choices, show only unresolved prerequisites in task rows, and retain error feedback after a rejected save.

#### Scenario: Resolve prerequisite
- **WHEN** a referenced prerequisite becomes complete
- **THEN** it disappears from unresolved warnings while the full link remains visible in editing controls

#### Scenario: Rejected dependency save
- **WHEN** a dependency update fails
- **THEN** an error appears and the saved prerequisite display stays unchanged
