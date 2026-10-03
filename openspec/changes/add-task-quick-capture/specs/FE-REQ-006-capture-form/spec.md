# FE-REQ-006-capture-form · Capture form and focus recovery

## Purpose

Define the capture form and focus recovery responsibilities owned by Frontend for REQ-006, keyboard quick capture.

## ADDED Requirements

### Requirement: Capture form and focus recovery
The form SHALL create exactly one task for Enter or Add, prevent duplicate pending submissions, clear and refocus the title after success, and retain text with an accessible error after failure.

#### Scenario: Successful keyboard submit
- **WHEN** a valid title is submitted with Enter
- **THEN** exactly one task appears and the cleared title input receives focus

#### Scenario: Failed submission
- **WHEN** a valid create request fails
- **THEN** the original title remains available with an accessible error and submission can be retried
