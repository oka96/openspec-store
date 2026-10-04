# BE — Backend

## Purpose

Define Backend ownership of API contracts, validation and task-model behavior
within independent BE changes. Feature-specific behavior remains in those
changes; these rules describe their planning boundaries and delivery progress.

## Requirements

### Requirement: Backend feature responsibility
A BE change SHALL own its feature's API and data-validation responsibilities
under the requirement derived from its folder name. Its capability specifications
and checklist SHALL describe applicable request, response and model behavior with
verification, while its proposal and design provide that change's planning context.

#### Scenario: Inspect a Backend feature
- **WHEN** BE-REQ-003-labels is selected
- **THEN** its proposal, design, normalization contract and tasks are the selected sources
- **AND** sibling filter or Frontend changes remain separate sources of work

### Requirement: Backend checklist ownership
Untagged tasks in a BE change SHALL inherit Backend ownership. Explicit role
tags SHALL agree with that ownership. Backend completion SHALL derive from all
of its feature changes having complete planning sources and nonempty, fully
checked checklists; optional ownership or state hints SHALL NOT mark unfinished
Backend work complete.

#### Scenario: Track an untagged Backend task
- **WHEN** BE-STORY-12-api has an unchecked validation task without an explicit role tag
- **THEN** the task belongs to Backend and the Backend role remains incomplete

#### Scenario: A Backend source is missing
- **WHEN** a Backend checklist is checked but a required planning source is absent
- **THEN** that change and the Backend role remain incomplete

### Requirement: Backend implementation handoff
After SA completes, incomplete Backend work SHALL keep the requirement in
Implementation unless unfinished blocked work takes precedence. The requirement
SHALL reach QA only when both Frontend and Backend have completed and QA still
has work.

#### Scenario: Both implementation roles finish
- **WHEN** SA, Frontend and Backend are complete but QA still has unfinished work and no change is blocked
- **THEN** the requirement appears in QA
