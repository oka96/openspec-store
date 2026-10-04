# FE — Frontend

## Purpose

Define Frontend ownership of interface behavior and client interaction planning
within independent FE changes. Feature-specific UI contracts remain in those
changes; these rules describe their traceability and delivery progress.

## Requirements

### Requirement: Frontend feature responsibility
An FE change SHALL own its feature's interface behavior and client interactions
under the requirement derived from its folder name. Its capability specifications
and checklist SHALL describe the applicable UI outcomes and their verification,
while its proposal and design provide that change's planning context.

#### Scenario: Inspect a Frontend feature
- **WHEN** FE-REQ-003-filters is selected
- **THEN** its proposal, design, filter contract and tasks are the selected sources
- **AND** sibling label or Backend changes remain separate sources of work

### Requirement: Frontend checklist ownership
Untagged tasks in an FE change SHALL inherit Frontend ownership. Explicit role
tags SHALL agree with that ownership. Frontend completion SHALL derive from all
of its feature changes having complete planning sources and nonempty, fully
checked checklists; optional owner labels or state hints SHALL NOT substitute
for checked work.

#### Scenario: Track an untagged Frontend task
- **WHEN** FE-REQ-003-filters has an unchecked task without an explicit role tag
- **THEN** the task belongs to Frontend and the Frontend role remains incomplete

#### Scenario: Another Frontend feature remains
- **WHEN** one Frontend change is fully checked but a sibling FE change has unfinished tasks
- **THEN** Frontend remains incomplete for the grouped requirement

### Requirement: Shared implementation phase
After SA completes, incomplete Frontend work SHALL keep the requirement in
Implementation unless unfinished blocked work takes precedence. Completing
Frontend alone SHALL NOT advance the requirement to QA while Backend remains
incomplete.

#### Scenario: Frontend finishes before Backend
- **WHEN** SA and Frontend are complete but Backend has unfinished work and no change is blocked
- **THEN** the requirement remains in Implementation
