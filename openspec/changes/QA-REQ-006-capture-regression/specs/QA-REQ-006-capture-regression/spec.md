# QA-REQ-006-capture-regression · Capture acceptance and keyboard regression

## Purpose

Define the capture acceptance and keyboard regression responsibilities owned by QA for REQ-006, keyboard quick capture.

## ADDED Requirements

### Requirement: Capture acceptance and keyboard regression
Acceptance verification SHALL record create, validation, failure retry, focus restoration, and rapid Enter input outcomes before keyboard capture tasks are completed.

#### Scenario: Keyboard evidence
- **WHEN** Enter, button activation, rapid Enter, and failure retry are exercised
- **THEN** evidence shows one task per successful submission, restored focus, retained failed text, and accessible errors
