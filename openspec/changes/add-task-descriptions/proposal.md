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

- `SA-REQ-001-description-contract`: Description contract.
- `FE-REQ-001-description-editor`: Description editor.
- `BE-REQ-001-description-validation`: Description validation.
- `QA-REQ-001-description-acceptance`: Description acceptance.

### Modified Capabilities

None. Role contracts retain the original task-workspace behavior; the original
capability delta remains in `legacy/specs/task-workspace/spec.md` for traceability.

## Impact

Illustrative task editor, task details, create/update API validation, and acceptance
coverage. This store contains sample specification artifacts only; seeded
checkboxes are not product implementation or test evidence. No new services.
