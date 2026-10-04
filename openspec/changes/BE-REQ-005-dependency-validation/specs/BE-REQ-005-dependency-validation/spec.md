# BE-REQ-005-dependency-validation · Atomic reference and cycle validation

## Purpose

Define the atomic reference and cycle validation responsibilities owned by Backend for REQ-005, task dependency links.

## ADDED Requirements

### Requirement: Atomic reference and cycle validation
The API SHALL validate prerequisite existence, self-links, and cycles before replacing any dependency list, including cycles through chains longer than 100 tasks.

#### Scenario: Missing or self reference
- **WHEN** an update references its own task or a missing task
- **THEN** validation fails without changing any saved link

#### Scenario: Long-chain cycle
- **WHEN** an update closes a cycle through more than 100 tasks
- **THEN** the entire update is rejected without partial link changes
