# SA-REQ-003-filters · Filter rules and empty state

## Purpose

Define the filter rules and empty state responsibilities owned by SA for REQ-003, labels & quick filters.

## ADDED Requirements

### Requirement: Filter rules and empty state
The filter contract SHALL match labels exactly and case-insensitively across the complete task list, display an explicit empty result state, and restore all tasks when the filter is cleared.

#### Scenario: Exact matching
- **WHEN** the design label filter is active
- **THEN** tasks labeled Design match while tasks labeled Designer do not

#### Scenario: Clear empty filter
- **WHEN** a filter with no matches is cleared
- **THEN** the empty result message disappears and the full task list returns
