# BE-REQ-006-capture-validation · Create title validation

## Purpose

Define the create title validation responsibilities owned by Backend for REQ-006, keyboard quick capture.

## ADDED Requirements

### Requirement: Create title validation
The API SHALL create tasks from trimmed nonempty titles of at most 200 characters, document success and error responses, and reject invalid titles without mutating the task list.

#### Scenario: Trim accepted title
- **WHEN** a valid title has surrounding whitespace
- **THEN** the new task contains the trimmed title

#### Scenario: Reject invalid title
- **WHEN** the title is empty, whitespace-only, or longer than 200 characters
- **THEN** a validation error is returned and no task is added
