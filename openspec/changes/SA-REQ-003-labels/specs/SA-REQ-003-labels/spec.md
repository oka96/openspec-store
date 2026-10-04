# SA-REQ-003-labels · Label rules

## Purpose

Define the label rules responsibilities owned by SA for REQ-003, labels & quick filters.

## ADDED Requirements

### Requirement: Label rules
The label contract SHALL allow at most five nonempty labels of at most 24 characters, trim for comparison, deduplicate case-insensitively, preserve the first display spelling, and reject invalid changes atomically.

#### Scenario: Duplicate spelling
- **WHEN** a user supplies Design and a spaced lowercase design label
- **THEN** one label remains with the first display spelling

#### Scenario: Label limits
- **WHEN** a task receives more than five distinct labels or a label longer than 24 characters
- **THEN** validation fails and previous labels remain unchanged
