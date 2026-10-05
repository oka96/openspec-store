# SA repository responsibility

## Purpose

Define the SA role boundary and traceable handoff for independently scoped repository work.

## Requirements

### Requirement: SA repository ownership
The SA role SHALL follow this scope: Design only: span all impacted repositories in scope.json. NEVER modify application code or clone code for implementation. Define the API and user scenarios, then hand off to Backend and Frontend. Apply verifies design and handoff checklists only.

#### Scenario: Execute a role action
- **WHEN** the role creates, revises or applies its selected specification
- **THEN** it uses the declared scope.json applications and upstream references and preserves sibling role changes
