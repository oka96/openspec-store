# Proposal

## Why

Some tasks cannot proceed until related work finishes. Explicit prerequisites make those relationships visible and help avoid planning cycles.

## What Changes

- Allow tasks to reference existing prerequisite tasks.
- Reject self-dependencies, missing prerequisites, and cycles without partial updates.
- Show unresolved prerequisite titles on affected task rows.

## Capabilities

### New Capabilities

- `SA-REQ-005-dependency-contract`: Dependency graph contract.

### Modified Capabilities

None.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.

## Kanban

- Requirement title: Task dependency links
- Requirement summary: Show prerequisite tasks and prevent dependency cycles before they confuse delivery.
- Spec title: Dependency graph contract
- Owner: Avery · sample
- Role note: Dependency rules and API contract reviewed in this sample.
- State: backlog
- Note: Dependency rules and API contract reviewed in this sample.
