# Backend repository responsibility

## Purpose

Define the Backend role boundary and traceable handoff for independently scoped repository work.

## Requirements

### Requirement: Backend repository ownership
The Backend role SHALL follow this scope: Bind exactly one Backend repository in scope.json. Read every referenced SA proposal, design and capability spec before writing this spec. Implement only the bound repository and preserve the SA contract.

#### Scenario: Execute a role action
- **WHEN** the role creates, revises or applies its selected specification
- **THEN** it uses the declared scope.json applications and upstream references and preserves sibling role changes
