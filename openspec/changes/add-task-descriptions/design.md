# Design

## Context

See proposal.md for motivation. This illustrative task workspace uses a small
in-memory task model, task details, and a create/edit form. No implementation is
included in this specification store. The field crosses UI and API boundaries.

## Goals / Non-Goals

**Goals:** Preserve description text across editing and reads while keeping its
size bounded and its display safe.

**Non-Goals:** Rich-text editing, attachments, or collaborative editing.

## Decisions

1. Store a string with an empty create-time default. Omitting it during an update
   leaves the description unchanged; an empty string clears it. This distinguishes
   partial updates from an intentional clear without a second flag.
2. Accept at most 2,000 Unicode code points and preserve whitespace and line breaks.
   Count code points consistently in client and server validation rather than
   JavaScript string code units so emoji are handled predictably.
3. Use a labeled textarea and render saved text without interpreting markup.
   Plain text avoids a rich-text format or HTML sanitization dependency.
4. Validate before mutating an existing record. Keep the saved display unchanged
   until the server accepts an edit, and retain unsaved input if saving fails.

## Risks / Trade-offs

- [Older tasks omit the field] → Normalize absent descriptions to an empty string on reads.
- [Long text overwhelms the view] → Wrap lines within task details and reject values above the limit.
- [Failed edits lose work] → Retain the editor's draft and show an error while the saved value stays unchanged.

## Migration Plan

No persistent data migration is needed for the sample in-memory design. Add the
empty default before displaying the editor; rollback by removing the optional field UI.

## Role specification tracking

Shared product decisions above are unchanged. This requirement uses the local
`role-specs` workflow. Each role feature has its own specification and checklist:

- [SA-REQ-001-description-contract](specs/SA-REQ-001-description-contract/spec.md) · [tasks](tasks/SA-REQ-001-description-contract.md)
- [FE-REQ-001-description-editor](specs/FE-REQ-001-description-editor/spec.md) · [tasks](tasks/FE-REQ-001-description-editor.md)
- [BE-REQ-001-description-validation](specs/BE-REQ-001-description-validation/spec.md) · [tasks](tasks/BE-REQ-001-description-validation.md)
- [QA-REQ-001-description-acceptance](specs/QA-REQ-001-description-acceptance/spec.md) · [tasks](tasks/QA-REQ-001-description-acceptance.md)

Metadata version 2 registers these role specs. Progress comes from each task file;
every registered spec must be complete before its role can complete. The original
planning artifacts remain byte-preserved under `legacy/` and are not active task
sources. Seeded checks remain illustrative rather than implementation evidence.
