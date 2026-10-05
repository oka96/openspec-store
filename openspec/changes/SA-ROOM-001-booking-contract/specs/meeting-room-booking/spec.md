## Purpose

Provide a simple shared room-booking contract with deterministic conflict and cancellation behavior across three repositories.

## ADDED Requirements

### Requirement: List meeting rooms
The service SHALL return two fixed rooms, Atlas (id atlas, capacity 4) and Cedar (id cedar, capacity 8), from GET /api/rooms as a JSON array.

#### Scenario: View rooms
- **WHEN** a user opens the booking page
- **THEN** both rooms and their capacities are displayed for selection

### Requirement: Create a meeting booking
POST /api/bookings SHALL accept roomId, title, start and end. Title SHALL be trimmed and contain 1 to 100 characters. Times SHALL be ISO 8601 UTC strings ending in Z with start before end. Valid requests SHALL return 201 and the booking with a generated id. Invalid input SHALL return 400 with a JSON error message.

#### Scenario: Book a room
- **WHEN** Atlas is booked for a nonconflicting valid interval
- **THEN** the new booking appears in GET /api/bookings and in the page list

#### Scenario: Reject invalid interval
- **WHEN** end is not later than start or the room is unknown or the title is empty
- **THEN** the API returns 400 and the page displays the error without adding a booking

### Requirement: Prevent overlapping bookings
The service SHALL return 409 for a booking whose interval overlaps an existing booking for the same room. Adjacent intervals SHALL be allowed. Different rooms SHALL be independent. Booking creation SHALL perform validation and insertion atomically within the single process.

#### Scenario: Reject overlap
- **WHEN** Atlas has a 10:00–11:00 UTC booking and another Atlas booking requests 10:30–11:30
- **THEN** the second request returns 409 and existing bookings remain unchanged

#### Scenario: Allow adjacency and separate rooms
- **WHEN** a new Atlas booking starts at 11:00 or a Cedar booking uses 10:00–11:00
- **THEN** the new booking succeeds

### Requirement: Cancel a booking
DELETE /api/bookings/:id SHALL remove an existing booking and return 204, or return 404 for an unknown id. Cancellation SHALL release the room interval. State SHALL be in memory and reset when the backend restarts.

#### Scenario: Cancel and rebook
- **WHEN** a user cancels a booking and books the same interval again
- **THEN** cancellation removes the item and the replacement booking succeeds
