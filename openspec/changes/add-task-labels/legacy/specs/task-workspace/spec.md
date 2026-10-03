# Spec Delta

## ADDED Requirements

### Requirement: Task labels and matching filter
The workspace SHALL accept at most five nonempty labels of at most 24 characters per task, deduplicate them case-insensitively, and filter tasks by exact case-insensitive label match. Invalid labels SHALL leave the existing task unchanged.

#### Scenario: Normalize duplicates
- **WHEN** a user adds labels "Design" and " design " to the same task
- **THEN** one "Design" label is shown

#### Scenario: Filter tasks
- **WHEN** a user filters by the label "design"
- **THEN** only tasks containing that exact label ignoring case are shown

#### Scenario: Reject excessive labels
- **WHEN** a user submits more than five distinct labels
- **THEN** validation fails and the prior task labels remain unchanged
