# OpenSpec store

This specification store supplies the **OpenSpec Kanban** app. Each `REQ-xxx`
requirement contains SA, Frontend, Backend, and QA ownership and can contain
several independent feature specs for each role.

**This is demonstration data.** Checked tasks, owners, progress, and blockers are
illustrative. They do not certify product implementation or executed tests. The
Kanban app lives in `/Users/oka/Desktop/openhands-apps`; the configured product
workspace is `/Users/oka/Desktop/openhands-demo`.

## Requirement and spec identity

Keep the requirement's existing lowercase OpenSpec change directory. Use these
canonical spec IDs, including uppercase prefixes and requirement ID:

| Role | Pattern | Example |
| --- | --- | --- |
| SA | `SA-REQ-xxx-<feature>` | `SA-REQ-003-labels` |
| Frontend | `FE-REQ-xxx-<feature>` | `FE-REQ-003-filters` |
| Backend | `BE-REQ-xxx-<feature>` | `BE-REQ-003-labels` |
| QA | `QA-REQ-xxx-<feature>` | `QA-REQ-003-keyboard` |

Requirement numbers contain at least three digits. Feature suffixes use lowercase
kebab case. IDs must match their exact requirement and role, be unique across the
store, and contain at most 160 characters. A requirement supports at most 20 specs
and 500 tasks. An empty role is allowed during planning but cannot complete.

```text
openspec/changes/add-task-labels/
  .openspec.yaml                         # schema: role-specs
  proposal.md                           # shared requirement context
  design.md                             # shared design
  specs/FE-REQ-003-labels/spec.md
  specs/FE-REQ-003-filters/spec.md
  tasks/FE-REQ-003-labels.md
  tasks/FE-REQ-003-filters.md
  ...                                   # SA, Backend, QA specs/tasks
  legacy/                               # original migration references
```

The local [`role-specs` schema](openspec/schemas/role-specs/schema.yaml) defines
proposal, specs, design, and task artifacts and tracks `tasks/*.md`. OpenSpec
1.14.0 discovers the literal uppercase spec paths. Its new change names remain
lowercase; a spec ID is a capability ID inside the existing change.

## Metadata version 2

[`openspec/requirements.json`](openspec/requirements.json) registers the source
files and supplies presentation context. A requirement retains `id`, `title`,
`summary`, `change`, and the exact four role keys. Each role contains:

```json
{
  "owner": "Maya · sample",
  "note": "Label chips are illustrated complete; filter interaction is next.",
  "specs": [
    {
      "id": "FE-REQ-003-labels",
      "title": "Label entry and removable chips",
      "state": "in_progress",
      "note": "Label chips are illustrated complete; filter interaction is next."
    },
    {
      "id": "FE-REQ-003-filters",
      "title": "Quick filters and empty results",
      "state": "in_progress",
      "note": "Label chips are illustrated complete; filter interaction is next."
    }
  ]
}
```

Spec hints are `backlog`, `in_progress`, or `blocked`; use the note to explain a
blocker when available. Role state and completion are derived, so there is no independent
role `state` field and no metadata `done` value. Owners stay on the role; blocker
and active-work notes can differ between specs.

Each `tasks/<ID>.md` contains numbered checkboxes with the exact owning role tag:

```md
- [ ] 1.1 [Frontend] Build the date editor; verify keyboard editing and clearing.
```

Use numbered tasks as the schema recommends. Numbers must be unique within their
spec; the same `1.1` is valid in another spec. Role-first task numbering is also
readable; a numberless task receives a `line-<number>` local identity. Source
identity is `(spec ID, local task ID)`. Only `x` or `X` means complete.
Check tasks only after their implementation and stated verification succeed.

## Progress and role actions

A spec completes when its source files exist and its nonempty checklist is fully
checked. A role completes only when it has specs and all are complete. All four
roles must complete before the requirement reaches Done. Unfinished blocked specs
take precedence; otherwise the board follows Backlog → Solution Design →
Implementation → QA → Done. Frontend and Backend share Implementation.

Missing specs, missing task files, and empty checklists stay incomplete. The store
validator rejects missing registered source files and unregistered spec/task files
so CLI and Kanban cannot silently track different work. Consumers can show missing
source warnings while a requirement is being prepared.

Kanban provides a separate source preview and task list for every named spec.
Role actions use the fixed twelve role/skill definitions in
`/Users/oka/Desktop/openhands-automation`:

- **Propose** adds a feature spec to the selected requirement and role.
- **Update** revises the selected spec and its task planning.
- **Apply** implements and verifies the selected spec's tasks.

Shared proposal/design, sibling specs, metadata unrelated to the action, and
legacy references remain outside a spec-scoped edit. Conversations identify the
selected spec as `[Role] <spec ID>` and include a spec tag. Refresh reads current
files; loading or refreshing the board does not start agents.

## Sample requirements

| Requirement | Change | Stage | Seeded tasks | Specs |
| --- | --- | --- | --- | ---: |
| REQ-001 · Task descriptions | `add-task-descriptions` | Backlog | 0/8 | 4 |
| REQ-002 · Due dates & overdue cues | `add-task-due-dates` | Solution Design | 1/8 | 4 |
| REQ-003 · Labels & quick filters | `add-task-labels` | Implementation | 3/8 | 8 |
| REQ-004 · Complete & reopen tasks | `add-task-completion` | QA | 7/8 | 4 |
| REQ-005 · Task dependency links | `add-task-dependency-links` | Blocked | 3/8 | 4 |
| REQ-006 · Keyboard quick capture | `add-task-quick-capture` | Done | 8/8 | 4 |

REQ-003 demonstrates two specs for every role. The main
[`task-workspace` specification](openspec/specs/task-workspace/spec.md) and sample
product behavior remain unchanged.

## Validate and inspect

Use Node.js 24 and the pinned CLI:

```sh
npm install
npx --no-install openspec store register . --id openspec-store --yes --json
npm test
npm run test:seeded
npm run schema:validate
npm run spec:validate
npm run store:doctor
npx --no-install openspec status --change add-task-labels --store openspec-store
npx --no-install openspec instructions apply --change add-task-labels --store openspec-store --json
```

`npm test` validates current metadata and source consistency, validator edge cases,
native CLI discovery, migration idempotence, and preserved original bytes.
`test:seeded` additionally requires all original sample task lines, ownership,
notes, and stage outcomes; use it before replacing illustrative progress with real
work. Native apply JSON includes each task's source path and line. Its returned
task IDs are CLI sequence numbers, so use source paths to identify the spec.

## Migration and rollback

The repeatable `npm run migrate:role-specs` migrates only the original six v1
samples. It splits their original 48 task lines without changing descriptions,
numbers, or checkbox markers; moves role hints into per-spec hints; and preserves
the six stage outcomes, including REQ-002 in Solution Design.

Each change's `legacy/` retains byte-for-byte original proposal, design, task
checklist, capability delta, and `.openspec.yaml`. Original metadata and config,
plus a SHA-256 manifest of all 32 originals, live under
[`openspec/migrations/role-specs-v1/`](openspec/migrations/role-specs-v1/).
Legacy files are outside active schema globs, so they never double-count progress.
SA contracts retain the original product acceptance requirements; other role
contracts describe the corresponding existing UI, API, and verification scope.

The migration preflights writes, refuses conflicting content, writes metadata
last, and can recover an interrupted v1 migration from its preserved originals.
On v2 it validates and exits without rewriting source or resetting progress.
Do not rerun it to reset samples. Roll back the coordinated store, app, and
automation changes together through Git; retained originals permit manual recovery
and should never replace newer active work without review.
