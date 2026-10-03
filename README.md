# openspec-store

Taskflow is a sample specification store for the OpenHands Apps requirement
board. It shows one requirement moving through **SA → Frontend + Backend → QA**.
Every requirement includes work for all four roles and can reach Done only when
all four role checklists are complete.

**This is demonstration data.** The checked tasks, owners, progress, and blocker
are illustrative. Checked boxes do not claim that a task product was implemented
or that its tests were executed. The product requirements here are samples; the
board that visualizes them lives in `/Users/oka/Desktop/openhands-apps`.

## Sample requirements

| Requirement | Change | Board column | Seeded tasks |
| --- | --- | --- | --- |
| REQ-001 · Task descriptions | `add-task-descriptions` | Backlog | 0/8 |
| REQ-002 · Due dates & overdue cues | `add-task-due-dates` | SA | 1/8 |
| REQ-003 · Labels & quick filters | `add-task-labels` | Implementation | 3/8 |
| REQ-004 · Complete & reopen tasks | `add-task-completion` | QA | 7/8 |
| REQ-005 · Task dependency links | `add-task-dependency-links` | Blocked | 3/8 |
| REQ-006 · Keyboard quick capture | `add-task-quick-capture` | Done | 8/8 |

Each change contains `proposal.md`, `design.md`, `specs/task-workspace/spec.md`,
`tasks.md`, and CLI-created `.openspec.yaml`. The main workflow contract is
[`openspec/specs/task-workspace/spec.md`](openspec/specs/task-workspace/spec.md).
All changes stay active so the full sample remains visible on the board.

## Run OpenSpec

This store pins `@fission-ai/openspec` to **1.14.0**. Use Node.js 24 and run:

```sh
cd /Users/oka/Desktop/openspec-store
npm install
npx --no-install openspec store register . --id openspec-store --yes --json
npx --no-install openspec list --store openspec-store
npm run spec:validate
npm run store:doctor
npm test
```

`npm test` validates the current store, including new requirements and changed
progress. `npm run test:seeded` additionally checks the original six demonstration
phases; use it only before replacing seeded progress with real work.

The OpenHands board's role actions can invoke Propose, Update, and Apply through
definitions in `/Users/oka/Desktop/openhands-automation`. A successful Propose adds
a new requirement with all four roles. Update edits planning artifacts; Apply
works only on the selected role's tasks in the configured code project. Refresh
the board after a run to read the resulting files.

The local registration points `openspec-store` to this repository. It does not
copy files or initialize a new Git history. The original `.git` remains intact.
After moving or cloning the repository, repeat the registration command from
the new root. Never copy another machine's global store registry.

Inspect a sample with:

```sh
npx --no-install openspec show add-task-completion --store openspec-store
npx --no-install openspec status --change add-task-completion --store openspec-store
npx --no-install openspec instructions apply --change add-task-completion --store openspec-store --json
```

## Board metadata contract

[`openspec/requirements.json`](openspec/requirements.json) supplies display
metadata. Its shape is:

```json
{
  "version": 1,
  "name": "Taskflow · Sample spec store",
  "description": "A description of the store",
  "requirements": [
    {
      "id": "REQ-001",
      "title": "Task descriptions",
      "summary": "Capture helpful context in an optional task description.",
      "change": "add-task-descriptions",
      "roles": {
        "SA": { "owner": "Avery · sample", "state": "backlog", "note": "Ready for scope review." },
        "Frontend": { "owner": "Maya · sample", "state": "backlog", "note": "Waiting for SA." },
        "Backend": { "owner": "Leo · sample", "state": "backlog", "note": "Waiting for SA." },
        "QA": { "owner": "Quinn · sample", "state": "backlog", "note": "Acceptance review is queued." }
      }
    }
  ]
}
```

- `id` is stable and unique; `change` exactly matches the OpenSpec change folder.
- Role keys are exactly `SA`, `Frontend`, `Backend`, and `QA`.
- An unfinished role's `state` is `backlog`, `in_progress`, or `blocked`.
- `note` explains the current work or blocker. Blocked roles need a useful note.
- There is no metadata `done` state: completion is derived from the checklist.

## Updating progress

Tasks live in `openspec/changes/<change>/tasks.md`. Use the exact role tags:

```md
- [ ] 1.1 [SA] Define acceptance cases; verify each case has an observable result.
- [x] 2.1 [Frontend] Build the control; verify its keyboard interaction.
- [ ] 3.1 [Backend] Validate the payload; verify invalid input leaves state unchanged.
- [ ] 4.1 [QA] Run the integration scenarios; record the observed results.
```

For real work, check a task only after its implementation and stated verification
succeed. Change role state hints and notes in `requirements.json` to explain work
in progress or a blocker. When all of a role's tasks are checked, the board derives
that role as done even if its unused hint is `backlog`.

The board derives columns from task completion and role hints:

1. All tasks complete, with tasks for every role: **Done**.
2. Any unfinished role blocked: **Blocked**.
3. No completed work and no active role: **Backlog**.
4. SA unfinished after work begins: **SA**.
5. SA complete, with Frontend or Backend unfinished: **Implementation**.
6. SA, Frontend, and Backend complete, with QA unfinished: **QA**.

Frontend and Backend share Implementation so they can progress in parallel.
One completed role cannot complete the requirement. Unchecking a task reopens
its role and moves the requirement back to the corresponding delivery phase.

## Add another sample

```sh
npx --no-install openspec new change add-your-requirement --store openspec-store
npx --no-install openspec instructions proposal --change add-your-requirement --store openspec-store --json
```

Follow the proposal, specs, design, and tasks instructions, then add its metadata
entry. Include at least two verifiable tasks per role for consistency with this
sample. Keep the existing capability path when extending `task-workspace`.
Run the validation commands above and refresh the OpenHands Apps board.
