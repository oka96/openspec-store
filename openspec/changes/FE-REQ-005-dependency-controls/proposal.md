# Proposal

## Why

Some tasks cannot proceed until related work finishes. Explicit prerequisites make those relationships visible and help avoid planning cycles.

## What Changes

- Allow tasks to reference existing prerequisite tasks.
- Reject self-dependencies, missing prerequisites, and cycles without partial updates.
- Show unresolved prerequisite titles on affected task rows.

## Capabilities

### New Capabilities

- `FE-REQ-005-dependency-controls`: Prerequisite selection and warnings.

### Modified Capabilities

None.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.

## Kanban

- Requirement title: Task dependency links
- Requirement summary: Show prerequisite tasks and prevent dependency cycles before they confuse delivery.
- Spec title: Prerequisite selection and warnings
- Owner: Maya · sample
- Role note: Waiting for a stable dependency update response.
- State: backlog
- Note: Waiting for a stable dependency update response.
