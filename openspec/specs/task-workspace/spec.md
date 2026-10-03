# Task workspace

## Purpose

Describe a small task workspace and its requirement delivery workflow. The store
is a demonstration dataset for the OpenHands Apps requirement board. Requirement
checklists show illustrative progress and do not certify an implemented product.

## Requirements

### Requirement: Four-role ownership
Every tracked requirement SHALL include implementation tasks for each of the
four roles: SA, Frontend, Backend, and QA. Each role SHALL have an owner label and
at least one checkbox task whose description includes that exact role tag.

#### Scenario: Complete role coverage
- **WHEN** a requirement is read from the store
- **THEN** its tasks include `[SA]`, `[Frontend]`, `[Backend]`, and `[QA]` tags
- **AND** its metadata identifies the owner and note for each role

### Requirement: Checklist completion gate
A requirement SHALL be complete only when every task is checked and every role
has at least one task. A completed role SHALL derive its completion from checked
tasks; an unfinished role MAY use backlog, in_progress, or blocked metadata hints.

#### Scenario: All roles complete
- **WHEN** all tasks for SA, Frontend, Backend, and QA are checked
- **THEN** the requirement is shown as Done

#### Scenario: QA still has work
- **WHEN** SA, Frontend, and Backend tasks are checked but a QA task is unchecked
- **THEN** the requirement is not Done

### Requirement: Observable delivery phases
The requirement board SHALL make the delivery phases Backlog, SA, Implementation,
QA, Blocked, and Done visible. Unfinished blocked work SHALL take precedence over
ordinary active phases. Frontend and Backend work MAY proceed together after SA.

#### Scenario: Active delivery handoff
- **WHEN** SA is complete and Frontend or Backend still has tasks
- **THEN** the requirement is in Implementation unless unfinished work is blocked

#### Scenario: Explicit blocker
- **WHEN** an unfinished role is marked blocked
- **THEN** the board shows the requirement as Blocked with the role's blocker note

### Requirement: Specification traceability
Each board requirement SHALL link its stable identifier to one OpenSpec change
containing a proposal, design, delta spec, and role-tagged checklist.

#### Scenario: Inspect a requirement
- **WHEN** a requirement is selected on the board
- **THEN** its OpenSpec change and all four planning artifacts are discoverable
