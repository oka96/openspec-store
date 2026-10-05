## Purpose

Derive repeatable regression checks from the SA, Backend and Frontend booking specifications, with test implementation isolated in sample-regression.

## ADDED Requirements

### Requirement: Upstream traceability
The regression specification SHALL reference SA-ROOM-001-booking-contract, BE-ROOM-001-booking-api and FE-ROOM-001-booking-ui. Every scenario SHALL identify the observed API or browser outcome; product failures SHALL be reported to Backend or Frontend rather than repaired in those repositories by QA.

#### Scenario: Derive regression coverage
- **WHEN** QA creates or revises its suite
- **THEN** it reads all three referenced contracts and binds test implementation only to sample-regression

### Requirement: API booking regression
The suite SHALL verify both fixed rooms, a valid booking, invalid room/title/timestamps, end not after start, same-room overlap rejection, adjacency, different-room independence, cancellation, unknown cancellation and cancel/rebook against the upstream API. Failed expectations SHALL fail the run.

#### Scenario: Conflict and released slot
- **WHEN** the suite creates a booking, attempts overlap, cancels and rebooks
- **THEN** it observes 201, 409, 204 and 201 respectively and verifies the booking list after each operation

### Requirement: Browser regression evidence
QA SHALL verify labeled inputs, visible timezone, keyboard submission, loading/empty/error/success states, conflict recovery and cancellation against the running frontend and backend. Browser checks SHALL require recorded browser observations, independently of HTTP-only tests.

#### Scenario: Browser is unavailable
- **WHEN** API checks pass but browser scenarios cannot be executed
- **THEN** QA reports the missing browser evidence and leaves the browser task unchecked

### Requirement: Repeatable isolated test data
The suite SHALL accept BACKEND_URL and FRONTEND_URL, use identifiable test booking titles and cancel only bookings it created. Unreachable services SHALL produce a clear failed or blocked result, never a passing result.

#### Scenario: Preserve other bookings
- **WHEN** regression tests run against a server with pre-existing bookings
- **THEN** teardown deletes only IDs created by that run
