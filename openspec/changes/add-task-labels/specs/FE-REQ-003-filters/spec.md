# FE-REQ-003-filters · Quick filters and empty results

## Purpose

Define the quick filters and empty results responsibilities owned by Frontend for REQ-003, labels & quick filters.

## ADDED Requirements

### Requirement: Quick filters and empty results
The UI SHALL filter the complete task list by exact case-insensitive label, show a clear empty result state, and provide a control that restores all tasks.

#### Scenario: Matching task list
- **WHEN** a user activates the design filter
- **THEN** only tasks containing that exact label ignoring case appear

#### Scenario: Restore list
- **WHEN** a user clears a filter with no matches
- **THEN** the full task list reappears
