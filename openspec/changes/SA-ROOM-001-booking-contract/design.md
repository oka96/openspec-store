# SA design

## Context
The sample repositories initially contain only README files. All product state lives in the backend process.

## Goals / Non-Goals
Design only: span all impacted repositories in scope.json. NEVER modify application code or clone code for implementation. Define the API and user scenarios, then hand off to Backend and Frontend. Apply verifies design and handoff checklists only.
Scope is intentionally limited to two fixed rooms and a simple booking list; no users, recurring meetings or persistence.

## Decisions
- Backend: Node.js 24 built-in HTTP on 3101, in-memory arrays, crypto.randomUUID for booking IDs. Responses use JSON; errors use {"error":"message"}. Allow browser access from http://127.0.0.1:3100, including OPTIONS preflight. Export server creation for isolated tests.
- Frontend: plain HTML/CSS/JavaScript served on 3100; API base http://127.0.0.1:3101. Labeled room/title/start/end inputs; datetime-local values convert to UTC; local timezone shown. Inline loading, empty, error and success states. Disable duplicate submissions, render text safely and keep focus usable after cancellation.
- QA: Node.js built-in test runner against BACKEND_URL and FRONTEND_URL; include a browser scenario checklist for labels, keyboard use, validation, conflicts and cancel/rebook. Do not claim browser checks passed from HTTP tests alone.
- Booking intervals are half-open [start,end); overlap is start < existing.end and end > existing.start. No past-date restriction in this minimal demo.
- GET /api/bookings returns an array of all bookings. No sorting guarantee. Booking object: id, roomId, title, start, end; timestamps normalized to ISO UTC. Unknown routes return 404. Malformed JSON returns 400.

## Upstream references
None: this is the shared solution contract.

## Handoff
Backend implements only sample-backend; Frontend implements only sample-frontend. QA derives checks from SA plus both implementation specs and changes only sample-regression. SA supplies the contract and never implements code.

## Verification
Check room listing; valid creation; invalid title/room/timestamps; reversed/empty intervals; same-room overlap; adjacency; different rooms; cancellation; missing cancellation id; cancel/rebook. Run backend and frontend locally before integration regression. Restart the backend for a clean demo.
