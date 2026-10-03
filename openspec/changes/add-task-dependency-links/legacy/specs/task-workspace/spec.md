# Spec Delta

## ADDED Requirements

### Requirement: Task prerequisite links
The workspace SHALL allow a task to reference existing prerequisite tasks and display unresolved prerequisites. Updates that introduce a self-link, missing reference, or dependency cycle SHALL be rejected atomically.

#### Scenario: Unresolved prerequisite
- **WHEN** task B depends on incomplete task A
- **THEN** task B shows task A as an unresolved prerequisite

#### Scenario: Reject cycle
- **WHEN** task A depends on B and a user attempts to make B depend on A
- **THEN** the update is rejected and both tasks retain their previous links

#### Scenario: Long dependency chain
- **WHEN** a user closes a cycle through a chain of more than 100 tasks
- **THEN** the update is rejected without partial link changes
