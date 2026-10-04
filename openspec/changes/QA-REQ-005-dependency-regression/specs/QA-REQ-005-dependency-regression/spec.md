# QA-REQ-005-dependency-regression · Dependency lifecycle and graph regression

## Purpose

Define the dependency lifecycle and graph regression responsibilities owned by QA for REQ-005, task dependency links.

## ADDED Requirements

### Requirement: Dependency lifecycle and graph regression
Acceptance verification SHALL record dependency editing, completed-prerequisite display, self-link rejection, missing references, and long-chain cycle rejection with atomicity evidence.

#### Scenario: Graph rejection evidence
- **WHEN** self-links and cycles longer than 100 tasks are attempted
- **THEN** evidence shows rejection and unchanged prior graph links

#### Scenario: Prerequisite lifecycle
- **WHEN** a valid dependency is added and its prerequisite is completed
- **THEN** evidence records the link and disappearance of its unresolved warning
