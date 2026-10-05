## Purpose

Provide an accessible browser interface for the shared SA room-booking contract, implemented only in sample-frontend.

## ADDED Requirements

### Requirement: Room and booking display
The page SHALL load rooms and bookings from the SA-defined API and display room capacity, booking title and local start/end times with a visible timezone. It SHALL show loading, empty and fetch-error states without rendering user text as HTML.

#### Scenario: Initial empty list
- **WHEN** the backend contains no bookings
- **THEN** Atlas and Cedar are selectable and the page explains that there are no bookings

### Requirement: Booking form
The page SHALL provide labeled room, title, start and end controls and a keyboard-operable submit button. It SHALL convert local time inputs to UTC, send the SA-defined request, disable duplicate submissions, and add a successful booking to the list.

#### Scenario: Submit by keyboard
- **WHEN** a user enters valid values and submits with the keyboard
- **THEN** the booking appears and a success message is announced

### Requirement: Recoverable validation and conflicts
The page SHALL display 400 validation errors and 409 conflict messages without adding a false booking. It SHALL retain entered values so users can correct them and retry. Failed network requests SHALL restore usable controls.

#### Scenario: Conflicting interval
- **WHEN** a submitted interval overlaps an existing same-room booking
- **THEN** the page shows the conflict and allows another interval to be entered

### Requirement: Cancel and refresh
Each booking SHALL provide a labeled cancellation action. A successful cancellation SHALL remove the booking and keep keyboard focus usable. A failed cancellation SHALL preserve the item and display an error.

#### Scenario: Cancel and book again
- **WHEN** a user cancels an existing booking and resubmits its interval
- **THEN** the cancelled item disappears and the new booking succeeds
