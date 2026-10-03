# Spec Delta

## ADDED Requirements

### Requirement: Reversible task completion
The workspace SHALL create tasks as incomplete, allow users to complete or reopen them, and show counts that reflect confirmed task state. Failed updates SHALL retain the last confirmed completion state and display an error.

#### Scenario: Complete task
- **WHEN** a user completes an incomplete task and the update succeeds
- **THEN** the task is marked complete and the completed count increases by one

#### Scenario: Reopen task
- **WHEN** a user reopens a completed task and the update succeeds
- **THEN** the task is marked incomplete and the completed count decreases by one

#### Scenario: Failed update
- **WHEN** a completion update fails
- **THEN** the prior state and counts remain visible with an error message
