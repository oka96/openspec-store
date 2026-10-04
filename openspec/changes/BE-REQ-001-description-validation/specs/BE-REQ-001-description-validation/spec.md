# BE-REQ-001-description-validation · Description validation

## Purpose

Define the description validation responsibilities owned by Backend for REQ-001, task descriptions.

## ADDED Requirements

### Requirement: Description validation
The API SHALL default omitted descriptions to an empty string on create, preserve omitted update values, accept strings up to 2,000 Unicode code points, and reject invalid values before mutation.

#### Scenario: Omit and clear
- **WHEN** an update omits description and a later update supplies an empty string
- **THEN** the first preserves the saved value and the second clears it

#### Scenario: Unicode boundary
- **WHEN** a description contains exactly 2,000 Unicode code points including emoji
- **THEN** the request succeeds without truncating the value

#### Scenario: Reject invalid value
- **WHEN** a description is not a string or exceeds 2,000 Unicode code points
- **THEN** the API returns a validation error and all task data remains unchanged
