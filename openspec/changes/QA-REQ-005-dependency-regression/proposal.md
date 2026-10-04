# Proposal

## Why

Some tasks cannot proceed until related work finishes. Explicit prerequisites make those relationships visible and help avoid planning cycles.

## What Changes

- Allow tasks to reference existing prerequisite tasks.
- Reject self-dependencies, missing prerequisites, and cycles without partial updates.
- Show unresolved prerequisite titles on affected task rows.

## Capabilities

### New Capabilities

- `QA-REQ-005-dependency-regression`: Dependency lifecycle and graph regression.

### Modified Capabilities

None.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.

## Kanban

- Requirement title: Task dependency links
- Requirement summary: Show prerequisite tasks and prevent dependency cycles before they confuse delivery.
- Spec title: Dependency lifecycle and graph regression
- Owner: Quinn · sample
- Role note: Long-chain and self-link scenarios are ready for integration.
- State: backlog
- Note: Long-chain and self-link scenarios are ready for integration.
