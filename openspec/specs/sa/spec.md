# SA — Solution design

## Purpose

Define solution-design ownership, requirement identity and the handoff between
the four delivery roles. This store contains illustrative planning and progress;
its checked sample tasks do not certify an implemented product.

## Requirements

### Requirement: Four-role requirement ownership
The store SHALL identify SA, Frontend, Backend and QA work through the SA, FE, BE
and QA prefixes of independent change folders. Changes with the same exact
requirement prefix and numeric ID SHALL belong to the same requirement. A role
MAY have multiple feature changes, and partial role coverage SHALL remain
discoverable without qualifying the requirement as complete.

#### Scenario: Group independent role changes
- **WHEN** SA-REQ-003-labels and FE-REQ-003-filters exist
- **THEN** both changes belong to REQ-003 with their respective SA and Frontend roles
- **AND** the requirement remains incomplete while any of its four roles lacks complete work

### Requirement: Traceable solution planning
Each SA change SHALL describe its feature's scope, decisions and acceptance
contract in its own proposal, design and capability specifications, with a
checklist in tasks.md. The board SHALL expose those artifacts for the selected
change. Optional proposal Kanban fields MAY supply ownership and display notes;
they SHALL NOT determine identity, and absent ownership SHALL display Unassigned.

#### Scenario: Inspect a solution without optional metadata
- **WHEN** SA-STORY-12-contract contains ordinary planning artifacts without a Kanban section
- **THEN** the board identifies it as SA work for STORY-12 and exposes its own artifacts
- **AND** its owner displays Unassigned

### Requirement: Observable solution-design handoff
A requirement whose roles are all in backlog SHALL appear in Backlog. Active
work SHALL remain in Solution Design while SA is incomplete, unless unfinished
blocked work takes precedence. Once SA is complete, unfinished Frontend or
Backend work SHALL place the requirement in Implementation, where those two
roles MAY proceed together.

#### Scenario: Solution design is active
- **WHEN** SA has active or partially checked work and no unfinished change is blocked
- **THEN** the requirement appears in Solution Design

#### Scenario: Hand off to implementation
- **WHEN** all SA changes are complete and Frontend or Backend still has work
- **THEN** the requirement appears in Implementation unless unfinished work is blocked
