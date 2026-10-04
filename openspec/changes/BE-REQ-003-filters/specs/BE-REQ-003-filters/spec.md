# BE-REQ-003-filters · Exact-match label filter API

## Purpose

Define the exact-match label filter api responsibilities owned by Backend for REQ-003, labels & quick filters.

## ADDED Requirements

### Requirement: Exact-match label filter API
The label filter API SHALL use an exact case-insensitive comparison against normalized labels and document its matching and unfiltered behavior.

#### Scenario: Exact API match
- **WHEN** the filter query is design
- **THEN** Design matches and Designer does not

#### Scenario: Unfiltered API read
- **WHEN** the filter is absent
- **THEN** all tasks are returned
