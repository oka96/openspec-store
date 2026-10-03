# Proposal

## Why

Users need a light way to group related tasks without maintaining separate projects. Labels and a matching filter make large lists easier to navigate.

## What Changes

- Add up to five labels to a task, each at most 24 characters after trimming.
- Deduplicate labels case-insensitively while preserving the first entered spelling.
- Filter task rows by an exact case-insensitive label match.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `task-workspace`: Organize tasks with reusable labels and filter the workspace in one click.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.
