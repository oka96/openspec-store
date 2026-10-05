# OpenSpec store: meeting-room booking

One requirement (`ROOM-001`) demonstrates four role schemas and three repositories.
The active change folders are the source of requirement identity; there is no
requirement registry. The previous demo, including uncommitted spec edits, is
recoverable from `recovery/2026-10-06-before-meeting-room-reset.tar.gz`.

| Role / schema | Change | Repository scope | Required references |
| --- | --- | --- | --- |
| SA / `sa` | `SA-ROOM-001-booking-contract` | All three impacted apps; design only | None |
| Backend / `backend` | `BE-ROOM-001-booking-api` | `oka96/sample-backend` | SA |
| Frontend / `frontend` | `FE-ROOM-001-booking-ui` | `oka96/sample-frontend` | SA |
| QA / `qa` | `QA-ROOM-001-booking-regression` | `oka96/sample-regression` | SA, Frontend, Backend |

SA never implements application code. Backend and frontend derive their own
specifications from SA, then implement only their bound repository. QA derives
regression scenarios from all three upstream specs and changes only its test repo.
Each role may have several changes, each with its own scope and checklist.

## Repository scope

Every role change has `.openspec.yaml` selecting its schema, `proposal.md`,
`design.md`, `specs/<capability>/spec.md`, `tasks.md`, and `scope.json`:

```json
{
  "version": 1,
  "applications": [{
    "id": "sample-backend",
    "name": "Meeting room API",
    "role": "Backend",
    "repository": "https://github.com/oka96/sample-backend.git"
  }],
  "references": ["SA-ROOM-001-booking-contract"]
}
```

SA may list 1–20 applications; every downstream spec lists exactly one. App IDs
use lowercase kebab case and names are display text. Repositories are explicit
HTTPS GitHub clone URLs without credentials. All upstream IDs must identify
active changes in the same requirement and have the required roles. Downstream
bindings must match a referenced SA application. QA's implementation sources must
share a referenced SA contract. No paths or repository URLs come from event inputs.

Use canonical change names `<SA|FE|BE|QA>-<PREFIX>-<digits>-<feature>`; preserve
leading zeroes. Optional `## Kanban` fields in proposal.md set Requirement title,
Requirement summary, Spec title, Owner, Role note, State and Note. State is
`backlog`, `in_progress` or `blocked`; completion comes from verified tasks.

## Demo contract

The backend lists Atlas and Cedar, creates bookings, rejects overlapping bookings
for the same room, lists bookings and cancels them. Adjacent times and different
rooms are allowed. State is in memory and resets on restart. The frontend uses
labeled room/title/time inputs and shows errors and bookings. QA verifies the API
and records the browser scenarios. See the SA capability spec for exact endpoints,
status codes and boundary cases, and each role's design for ports and commands.

Demo tasks start unchecked. Specifications do not certify implementation or tests.
SA design/handoff completion can be verified without any product code changes.

## Workspaces and Kanban

OpenSpec Kanban and the four role Apps live in `../openhands-apps`. They load
impacted applications and upstream references from each spec. Refresh is read-only.
The twelve role automations live in `../openhands-automation`; explicit submission
creates/reuses `workspaces/<change>/<application>` and clones that single repository.
SA gets `workspaces/<change>/planning` and never clones code. Existing matching
checkouts retain uncommitted work. Git origin mismatch or clone failure prevents
conversation startup. Planning and SA code changes fail the post-run scope audit.
These are workflow controls, not OS isolation.

## Validate

Use Node.js 24 and the pinned OpenSpec CLI:

```sh
npm test
npm run test:seeded
npm run schema:validate
npm run spec:validate
npx --no-install openspec status --change BE-ROOM-001-booking-api --store openspec-store --json
npx --no-install openspec instructions apply --change BE-ROOM-001-booking-api --store openspec-store --json
```

`test:seeded` verifies the initial 0/8 checklist snapshot and will intentionally
fail once verified work changes progress. Generic legacy changes remain readable,
but automation requires a matching role schema and a valid scope before execution.

To recover the old demo, extract the recovery archive into a separate directory
for inspection first. Do not overwrite current work without preserving it.
