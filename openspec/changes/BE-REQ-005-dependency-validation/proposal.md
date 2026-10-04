# Proposal

## Why

Some tasks cannot proceed until related work finishes. Explicit prerequisites make those relationships visible and help avoid planning cycles.

## What Changes

- Allow tasks to reference existing prerequisite tasks.
- Reject self-dependencies, missing prerequisites, and cycles without partial updates.
- Show unresolved prerequisite titles on affected task rows.

## Capabilities

### New Capabilities

- `BE-REQ-005-dependency-validation`: Atomic reference and cycle validation.

### Modified Capabilities

None.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.

## Kanban

- Requirement title: Task dependency links
- Requirement summary: Show prerequisite tasks and prevent dependency cycles before they confuse delivery.
- Spec title: Atomic reference and cycle validation
- Owner: Leo · sample
- Role note: Illustrative blocker: long-chain cycle detection is unresolved; complete the algorithm and its regression cases before integration.
- State: blocked
- Note: Illustrative blocker: long-chain cycle detection is unresolved; complete the algorithm and its regression cases before integration.
