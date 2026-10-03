// Role contracts derived from the original six sample requirements and designs.
// The migration keeps original planning bytes separately; these are active role scopes.
const feature = (slug, title, requirement, scenarios) => ({ slug, title, requirement, scenarios });

export const sampleSpecs = {
  'REQ-001': {
    SA: [feature('description-contract', 'Description contract', null, [])],
    Frontend: [feature('description-editor', 'Description editor',
      'The editor SHALL provide a labeled multiline description field, display saved text literally with whitespace preserved, and retain the draft and previous saved display when saving fails.', [
        ['Literal multiline display', 'a description containing line breaks and markup-like text is saved', 'details display the same text and line breaks without interpreting markup'],
        ['Recover failed save', 'saving a draft fails', 'an accessible error is shown, the draft remains available, and the saved description stays unchanged'],
      ])],
    Backend: [feature('description-validation', 'Description validation',
      'The API SHALL default omitted descriptions to an empty string on create, preserve omitted update values, accept strings up to 2,000 Unicode code points, and reject invalid values before mutation.', [
        ['Omit and clear', 'an update omits description and a later update supplies an empty string', 'the first preserves the saved value and the second clears it'],
        ['Unicode boundary', 'a description contains exactly 2,000 Unicode code points including emoji', 'the request succeeds without truncating the value'],
        ['Reject invalid value', 'a description is not a string or exceeds 2,000 Unicode code points', 'the API returns a validation error and all task data remains unchanged'],
      ])],
    QA: [feature('description-acceptance', 'Description acceptance',
      'Acceptance verification SHALL cover description create, edit, clear, reads, Unicode boundaries, literal rendering, keyboard access, and failure recovery, recording observed outcomes before completing tasks.', [
        ['Lifecycle evidence', 'description lifecycle checks run', 'evidence records initial defaults, edited values after reads, intentional clearing, and preserved line breaks'],
        ['Boundary and failure evidence', 'invalid types, over-limit text, emoji boundaries, markup-like input, and failed saves are exercised', 'evidence records atomic rejection, literal display, keyboard access, and recoverable drafts'],
      ])],
  },
  'REQ-002': {
    SA: [feature('date-contract', 'Date contract', null, [])],
    Frontend: [feature('date-editor', 'Date editor and overdue cues',
      'The UI SHALL expose an accessible date field and clear control and show an overdue text label only for incomplete tasks whose due date precedes the viewer local calendar date.', [
        ['Due today and completed', 'a task is due today or is already completed', 'its due date remains visible without an overdue cue'],
        ['Clear and edit', 'a keyboard user edits or clears a due date', 'the field supports keyboard entry and clearing removes the displayed date after success'],
      ])],
    Backend: [feature('date-validation', 'Date validation and round trips',
      'The API SHALL accept only valid calendar dates as YYYY-MM-DD strings or an explicit null clear value, preserve omitted updates, and return date strings without timezone conversion.', [
        ['Reject nonexistent dates', 'an update supplies February 30 or an invalid leap day', 'the request fails without changing the saved task'],
        ['Stable round trip', 'a valid date is written and read in different timezones', 'the same YYYY-MM-DD string is returned'],
      ])],
    QA: [feature('date-boundaries', 'Date lifecycle and boundary acceptance',
      'Acceptance verification SHALL record due-date create, clear, invalid input, timezone, leap-day, and month-boundary outcomes before date verification tasks are completed.', [
        ['Local calendar boundary', 'due-today, overdue, and completed tasks are tested around a month boundary', 'evidence shows cues follow the local date and completed tasks never appear overdue'],
        ['Date mutation evidence', 'valid, cleared, omitted, and invalid dates are exercised', 'evidence records stable round trips, clearing semantics, and no mutation after invalid input'],
      ])],
  },
  'REQ-003': {
    SA: [
      feature('labels', 'Label rules',
        'The label contract SHALL allow at most five nonempty labels of at most 24 characters, trim for comparison, deduplicate case-insensitively, preserve the first display spelling, and reject invalid changes atomically.', [
          ['Duplicate spelling', 'a user supplies Design and a spaced lowercase design label', 'one label remains with the first display spelling'],
          ['Label limits', 'a task receives more than five distinct labels or a label longer than 24 characters', 'validation fails and previous labels remain unchanged'],
        ]),
      feature('filters', 'Filter rules and empty state',
        'The filter contract SHALL match labels exactly and case-insensitively across the complete task list, display an explicit empty result state, and restore all tasks when the filter is cleared.', [
          ['Exact matching', 'the design label filter is active', 'tasks labeled Design match while tasks labeled Designer do not'],
          ['Clear empty filter', 'a filter with no matches is cleared', 'the empty result message disappears and the full task list returns'],
        ]),
    ],
    Frontend: [
      feature('labels', 'Label entry and removable chips',
        'The UI SHALL offer labeled task label entry and keyboard-removable chips, showing a single preserved display spelling for case-insensitive duplicates.', [
          ['Keyboard chip removal', 'a keyboard user removes a label chip', 'the intended label is removed and controls remain accessible'],
          ['Duplicate entry', 'the user adds Design followed by a spaced design value', 'one Design chip is displayed after the update succeeds'],
        ]),
      feature('filters', 'Quick filters and empty results',
        'The UI SHALL filter the complete task list by exact case-insensitive label, show a clear empty result state, and provide a control that restores all tasks.', [
          ['Matching task list', 'a user activates the design filter', 'only tasks containing that exact label ignoring case appear'],
          ['Restore list', 'a user clears a filter with no matches', 'the full task list reappears'],
        ]),
    ],
    Backend: [
      feature('labels', 'Label normalization and validation',
        'The API SHALL trim label comparisons, deduplicate case-insensitively while keeping the first display spelling, enforce nonempty values and the five-label and 24-character limits, and validate before mutation.', [
          ['Normalized write', 'a request includes Design and a spaced lowercase design label', 'one Design value is stored'],
          ['Invalid write', 'a request includes a blank, overlong, or excess distinct label', 'it is rejected without changing task data'],
        ]),
      feature('filters', 'Exact-match label filter API',
        'The label filter API SHALL use an exact case-insensitive comparison against normalized labels and document its matching and unfiltered behavior.', [
          ['Exact API match', 'the filter query is design', 'Design matches and Designer does not'],
          ['Unfiltered API read', 'the filter is absent', 'all tasks are returned'],
        ]),
    ],
    QA: [
      feature('integration', 'Label edit and filter integration',
        'Acceptance verification SHALL record integrated label editing, duplicate normalization, validation, and exact-match filtering outcomes before integration tasks are completed.', [
          ['Cross-role lifecycle', 'labels are edited and the task list is filtered', 'evidence connects saved API values to visible chips and correct matching results'],
        ]),
      feature('keyboard', 'Empty results and keyboard regression',
        'Browser verification SHALL record accessible label-chip keyboard controls, explicit empty filtered lists, and restoration after clearing a filter.', [
          ['Keyboard and empty results', 'a keyboard user removes chips, selects a filter with no matches, and clears it', 'evidence records accessible controls, an explicit empty state, and the restored complete list'],
        ]),
    ],
  },
  'REQ-004': {
    SA: [feature('completion-contract', 'Completion and reopen contract', null, [])],
    Frontend: [feature('completion-controls', 'Completion controls and feedback',
      'The UI SHALL provide accessible complete/reopen controls, block repeated updates to a pending task, and update state and counts only from successful responses while showing recoverable failures.', [
        ['Confirmed completion', 'a completion or reopen request succeeds', 'the row state and counts reflect the confirmed result'],
        ['Pending and failed update', 'the user repeats a pending toggle or the update fails', 'no second pending update starts and failure preserves the confirmed state and counts with an error'],
      ])],
    Backend: [feature('completion-api', 'Idempotent completion API',
      'The API SHALL create incomplete tasks, accept explicit boolean completion updates idempotently, reject invalid types and missing tasks, and expose counts consistent with confirmed task state.', [
        ['Retry boolean update', 'the same completed boolean is submitted twice', 'the task and completed count reflect one state change'],
        ['Reject invalid target', 'an update uses a non-boolean value or a missing task', 'the API rejects the request without changing tasks or counts'],
      ])],
    QA: [feature('completion-regression', 'Completion lifecycle regression',
      'Acceptance verification SHALL record complete, reopen, failed-update, keyboard, and rapid-toggle behavior, including stable counters and no duplicate pending changes.', [
        ['Lifecycle and retries', 'complete, reopen, failure, and repeated input checks run', 'evidence records correct confirmed state and counts, accessible controls, and preserved state on failure'],
      ])],
  },
  'REQ-005': {
    SA: [feature('dependency-contract', 'Dependency graph contract', null, [])],
    Frontend: [feature('dependency-controls', 'Prerequisite selection and warnings',
      'The UI SHALL allow accessible prerequisite selection by task title, exclude self-task choices, show only unresolved prerequisites in task rows, and retain error feedback after a rejected save.', [
        ['Resolve prerequisite', 'a referenced prerequisite becomes complete', 'it disappears from unresolved warnings while the full link remains visible in editing controls'],
        ['Rejected dependency save', 'a dependency update fails', 'an error appears and the saved prerequisite display stays unchanged'],
      ])],
    Backend: [feature('dependency-validation', 'Atomic reference and cycle validation',
      'The API SHALL validate prerequisite existence, self-links, and cycles before replacing any dependency list, including cycles through chains longer than 100 tasks.', [
        ['Missing or self reference', 'an update references its own task or a missing task', 'validation fails without changing any saved link'],
        ['Long-chain cycle', 'an update closes a cycle through more than 100 tasks', 'the entire update is rejected without partial link changes'],
      ])],
    QA: [feature('dependency-regression', 'Dependency lifecycle and graph regression',
      'Acceptance verification SHALL record dependency editing, completed-prerequisite display, self-link rejection, missing references, and long-chain cycle rejection with atomicity evidence.', [
        ['Graph rejection evidence', 'self-links and cycles longer than 100 tasks are attempted', 'evidence shows rejection and unchanged prior graph links'],
        ['Prerequisite lifecycle', 'a valid dependency is added and its prerequisite is completed', 'evidence records the link and disappearance of its unresolved warning'],
      ])],
  },
  'REQ-006': {
    SA: [feature('capture-contract', 'Keyboard capture contract', null, [])],
    Frontend: [feature('capture-form', 'Capture form and focus recovery',
      'The form SHALL create exactly one task for Enter or Add, prevent duplicate pending submissions, clear and refocus the title after success, and retain text with an accessible error after failure.', [
        ['Successful keyboard submit', 'a valid title is submitted with Enter', 'exactly one task appears and the cleared title input receives focus'],
        ['Failed submission', 'a valid create request fails', 'the original title remains available with an accessible error and submission can be retried'],
      ])],
    Backend: [feature('capture-validation', 'Create title validation',
      'The API SHALL create tasks from trimmed nonempty titles of at most 200 characters, document success and error responses, and reject invalid titles without mutating the task list.', [
        ['Trim accepted title', 'a valid title has surrounding whitespace', 'the new task contains the trimmed title'],
        ['Reject invalid title', 'the title is empty, whitespace-only, or longer than 200 characters', 'a validation error is returned and no task is added'],
      ])],
    QA: [feature('capture-regression', 'Capture acceptance and keyboard regression',
      'Acceptance verification SHALL record create, validation, failure retry, focus restoration, and rapid Enter input outcomes before keyboard capture tasks are completed.', [
        ['Keyboard evidence', 'Enter, button activation, rapid Enter, and failure retry are exercised', 'evidence shows one task per successful submission, restored focus, retained failed text, and accessible errors'],
      ])],
  },
};
