# BE-REQ-003-labels · Label normalization and validation

## Purpose

Define the label normalization and validation responsibilities owned by Backend for REQ-003, labels & quick filters.

## ADDED Requirements

### Requirement: Label normalization and validation
The API SHALL trim label comparisons, deduplicate case-insensitively while keeping the first display spelling, enforce nonempty values and the five-label and 24-character limits, and validate before mutation.

#### Scenario: Normalized write
- **WHEN** a request includes Design and a spaced lowercase design label
- **THEN** one Design value is stored

#### Scenario: Invalid write
- **WHEN** a request includes a blank, overlong, or excess distinct label
- **THEN** it is rejected without changing task data
