# Proposal

## Why

Task titles often omit useful context about the work. An optional plain-text
description lets people keep that context with the task while retaining a short title.

## What Changes

- Add an optional description of up to 2,000 Unicode code points to each task.
- Show the description in task details and support editing or clearing it.
- Preserve plain text and line breaks; reject invalid values without changing the task.

## Capabilities

### New Capabilities

- `FE-REQ-001-description-editor`: Description editor.

### Modified Capabilities

None.

## Impact

Illustrative task editor, task details, create/update API validation, and acceptance
coverage. This store contains sample specification artifacts only; seeded
checkboxes are not product implementation or test evidence. No new services.

## Kanban

- Requirement title: Task descriptions
- Requirement summary: Capture helpful context in an optional task description.
- Spec title: Description editor
- Owner: Maya · sample
- Role note: Waiting for the description editor contract.
- State: backlog
- Note: Waiting for the description editor contract.
