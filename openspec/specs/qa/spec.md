# QA repository responsibility

## Purpose

Define the QA role boundary and traceable handoff for independently scoped repository work.

## Requirements

### Requirement: QA repository ownership
The QA role SHALL follow this scope: Bind exactly one QA regression repository in scope.json. Read referenced SA, Frontend and Backend specs before deriving regression scenarios. Write regression code only in the bound QA repository; report product failures to the implementation roles.

#### Scenario: Execute a role action
- **WHEN** the role creates, revises or applies its selected specification
- **THEN** it uses the declared scope.json applications and upstream references and preserves sibling role changes
