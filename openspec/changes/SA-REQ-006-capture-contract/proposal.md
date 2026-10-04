# Proposal

## Why

Capturing small tasks should not interrupt the user’s workflow. A keyboard-first form makes adding the next task quick and predictable.

## What Changes

- Create tasks from a title field with Enter or an Add button.
- Trim titles, reject empty titles, and enforce a 200-character limit.
- Clear and refocus the field after success while retaining input on errors.

## Capabilities

### New Capabilities

- `SA-REQ-006-capture-contract`: Keyboard capture contract.

### Modified Capabilities

None.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.

## Kanban

- Requirement title: Keyboard quick capture
- Requirement summary: Create a task from the keyboard and return focus to the next piece of work.
- Spec title: Keyboard capture contract
- Owner: Avery · sample
- Role note: Scope and validation reviewed in this sample.
- State: backlog
- Note: Scope and validation reviewed in this sample.
