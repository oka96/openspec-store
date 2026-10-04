# QA — Verification

## Purpose

Define QA ownership of acceptance and regression verification, the four-role
completion gate and visible blocker handling. Checklists in this demonstration
store illustrate progress and do not certify executed product tests.

## Requirements

### Requirement: Traceable verification work
A QA change SHALL describe its feature's acceptance, integration or regression
verification in its own proposal, design, capability specifications and tasks.md.
Untagged checklist tasks SHALL inherit QA ownership; explicit role tags SHALL
agree with it. Optional Kanban ownership and notes MAY describe the responsible
person and verification context without changing folder-derived identity.

#### Scenario: Inspect feature verification
- **WHEN** QA-REQ-003-integration is selected
- **THEN** its integration contract and verification checklist are discoverable alongside its own proposal and design
- **AND** its task progress is attributed to QA for REQ-003

### Requirement: Four-role completion gate
A requirement SHALL be Done only when SA, Frontend, Backend and QA each have at
least one change and every change has complete planning sources and a nonempty,
fully checked checklist. Checked task markers SHALL determine completion; hints
of backlog, in_progress or blocked SHALL NOT override completed work or complete
unfinished work. Missing roles, missing sources and empty checklists SHALL remain
incomplete.

#### Scenario: All four roles complete
- **WHEN** all changes for all four roles have their planning sources and every task is checked
- **THEN** the requirement appears in Done

#### Scenario: QA still has work
- **WHEN** SA, Frontend and Backend are complete but a QA task is unchecked
- **THEN** the requirement is not Done

#### Scenario: A role is absent
- **WHEN** existing changes are fully checked but no QA change exists
- **THEN** the requirement remains incomplete

### Requirement: Visible blockers and delivery phases
The board SHALL expose Backlog, Solution Design, Implementation, QA, Blocked and
Done phases. An unfinished change with a blocked hint SHALL take precedence over
ordinary active phases and show its available blocker note. A fully completed
change's old blocked hint SHALL NOT block the grouped requirement.

#### Scenario: Unfinished Backend blocker
- **WHEN** a Backend change has unfinished work and its optional State is blocked
- **THEN** the requirement appears in Blocked with its available blocker note

#### Scenario: A blocker has completed
- **WHEN** a previously blocked change has complete sources and a fully checked checklist
- **THEN** its blocked hint no longer prevents the requirement from following the remaining roles' progress
