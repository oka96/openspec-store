# Spec Delta

## ADDED Requirements

### Requirement: Keyboard task capture
The workspace SHALL create a task from a trimmed nonempty title of at most 200 characters using Enter or the Add button. After success it SHALL clear and refocus the field. On failure it SHALL retain the entered title and show an error.

#### Scenario: Successful keyboard capture
- **WHEN** a user enters a valid title and presses Enter
- **THEN** one task is created and the cleared title field receives focus

#### Scenario: Invalid title
- **WHEN** a user submits a blank or overlong title
- **THEN** no task is created and an accessible validation message is shown

#### Scenario: Server failure
- **WHEN** a valid create request fails
- **THEN** the original title remains available to retry and an error is shown
