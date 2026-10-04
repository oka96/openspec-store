# OpenSpec store

Each feature is an independent OpenSpec change. OpenSpec Kanban groups changes
into requirements directly from their folder names. There is no active
requirement registry to maintain.

This is demonstration data. Checked tasks, ownership and blockers are
illustrative; they do not certify implementation or executed tests. The Kanban
App is in `/Users/oka/Desktop/openhands-apps`, and the configured product
workspace is `/Users/oka/Desktop/openhands-demo`.

## Folder identity

Use `<role>-<requirementPrefix>-<requirementId>-<feature>`:

| Change folder | Role | Requirement |
| --- | --- | --- |
| `SA-REQ-003-labels` | SA | `REQ-003` |
| `FE-REQ-003-filters` | Frontend | `REQ-003` |
| `BE-STORY-12-api` | Backend | `STORY-12` |
| `QA-TASK-0001-checks` | QA | `TASK-0001` |

Roles are SA, FE, BE and QA. A requirement prefix begins with an uppercase letter
and contains uppercase letters or digits. The numeric requirement ID preserves
leading zeroes, so `REQ-003` and `REQ-3` are different requirements. Features use
lowercase kebab case. Full folder names have at most 160 characters.

```text
openspec/
  config.yaml                            # schema: spec-driven
  specs/
    sa/spec.md                           # solution design and role handoff
    fe/spec.md                           # Frontend ownership and progress
    be/spec.md                           # Backend ownership and progress
    qa/spec.md                           # verification and completion gate
  changes/
    SA-REQ-003-labels/
      .openspec.yaml                     # schema: spec-driven
      proposal.md
      design.md
      specs/SA-REQ-003-labels/spec.md
      tasks.md
    FE-REQ-003-filters/
      .openspec.yaml
      proposal.md
      design.md
      specs/FE-REQ-003-filters/spec.md
      tasks.md
```

Every role change owns all four planning artifacts. Multiple capability
contracts may live under `specs/<capability>/spec.md` within one role change.
Adding or removing a canonical change folder changes the board on Refresh.
The board ignores ordinary non-role changes and `archive/`; it rejects malformed
role names and unsafe links. Store limits are 50 requirements, 20 role changes per
requirement, 500 tasks per requirement, 20 capability files per change, and
64 KiB per source file.

The pinned OpenSpec 1.14.0 CLI discovers, inspects, validates and archives these
uppercase change names. Its `new change` command accepts lowercase names only.
For canonical role folders, Kanban Propose safely scaffolds the exact folder
and `.openspec.yaml` before planning. When creating one manually, create the
folder and standard artifacts directly with `schema: spec-driven`.

## Optional presentation context

An ordinary proposal with no extra metadata is enough for discovery. To give the
board titles, ownership or blockers, add this optional Markdown section:

```md
## Kanban

- Requirement title: Labels & quick filters
- Requirement summary: Organize tasks with labels.
  Use exact matching for quick filters.
- Spec title: Quick filters and empty results
- Owner: Maya
- Role note: Waiting for the label contract.
- State: in_progress
- Note: Verify empty results and clearing the filter.
```

These seven labels are optional, case-sensitive display fields. Indent continuation
lines by two spaces to retain multiline values. Titles and owners allow 200
characters; summaries and notes allow 4000. State may be `backlog`,
`in_progress` or `blocked`; completion always comes from tasks and sources.
Metadata never changes a folder's role, requirement or feature identity.

Without this section, the requirement title defaults to its ID, the spec title
comes from the feature name, and the owner is Unassigned. Conflicting requirement
titles or summaries produce warnings; the first nonempty value in change-name
order wins. Role owners and notes aggregate distinct values across sibling changes.

## Progress and actions

Put checklists in each change's `tasks.md`. Untagged tasks inherit the folder's
role. Optional explicit role tags must agree with the folder:

```md
- [ ] 1.1 Build the date editor; verify editing and clearing.
- [ ] 1.2 [Frontend] Verify keyboard focus after saving.
```

Local task numbers must be unique within one change. Source identity is the
change ID plus local task ID. Only `x` or `X` means complete.

A change completes only when all planning sources exist, its checklist is
nonempty, and every task is checked. A role completes when all its changes
complete. All four roles must complete before the grouped requirement reaches
Done. Unfinished blocked changes take precedence; otherwise stages are Backlog,
Solution Design, Implementation, QA and Done. Frontend and Backend share
Implementation.

Kanban previews the selected change's proposal, design, capability contracts and
tasks. The twelve role/skill definitions in `/Users/oka/Desktop/openhands-automation`
support Propose (new role change under the selected requirement), Update (repair
or revise selected planning), and Apply (implement the selected checklist).
Update and Apply preserve sibling changes; Propose needs no registration step.
Loading, refreshing or changing controls never starts an agent.

## Samples

| Requirement | Stage | Seeded tasks | Role changes |
| --- | --- | ---: | ---: |
| REQ-001 · Task descriptions | Backlog | 0/8 | 4 |
| REQ-002 · Due dates & overdue cues | Solution Design | 1/8 | 4 |
| REQ-003 · Labels & quick filters | Implementation | 3/8 | 8 |
| REQ-004 · Complete & reopen tasks | QA | 7/8 | 4 |
| REQ-005 · Task dependency links | Blocked | 3/8 | 4 |
| REQ-006 · Keyboard quick capture | Done | 8/8 | 4 |

REQ-003 has two independent changes per role. The four main role specifications
are [SA](openspec/specs/sa/spec.md), [FE](openspec/specs/fe/spec.md),
[BE](openspec/specs/be/spec.md) and [QA](openspec/specs/qa/spec.md). They define
role responsibilities, traceability, handoffs and the shared completion gate;
feature-specific product contracts live in the 28 independent role changes.

## Validate and inspect

Use Node.js 24 and the pinned CLI:

```sh
npm install
npm test
npm run test:seeded
npm run schema:validate
npm run spec:validate
npx --no-install openspec list --json
npx --no-install openspec list --specs --json
npx --no-install openspec status --change FE-REQ-003-filters --json
npx --no-install openspec instructions apply --change FE-REQ-003-filters --json
```

To use this repository from another workspace, register it once and pass
`--store openspec-store` to the CLI:

```sh
npx --no-install openspec store register . --id openspec-store --yes --json
npm run store:doctor
```

`npm test` checks directory discovery, unsafe and incomplete sources, all four
main roles and 28 changes through native CLI list/status/apply/strict validation,
and native archive in a disposable fixture. It does not dispatch agents. `test:seeded` additionally
checks the six sample requirements, 28 role changes, task counts and six stage
outcomes; it will intentionally fail after real work changes the seeded progress.

Validation reads the current role folders directly. Ownership and board notes
come from each proposal's optional Kanban section, and completion comes from
each change's checklist.
