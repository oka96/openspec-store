# BE-REQ-002-date-validation · Date validation and round trips

## Purpose

Define the date validation and round trips responsibilities owned by Backend for REQ-002, due dates & overdue cues.

## ADDED Requirements

### Requirement: Date validation and round trips
The API SHALL accept only valid calendar dates as YYYY-MM-DD strings or an explicit null clear value, preserve omitted updates, and return date strings without timezone conversion.

#### Scenario: Reject nonexistent dates
- **WHEN** an update supplies February 30 or an invalid leap day
- **THEN** the request fails without changing the saved task

#### Scenario: Stable round trip
- **WHEN** a valid date is written and read in different timezones
- **THEN** the same YYYY-MM-DD string is returned
