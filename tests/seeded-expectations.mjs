// Fixed regression expectations for the illustrative sample data.
// Only test:seeded reads this fixture; discovery and ordinary validation derive
// all identities, presentation context and progress from active change folders.
export const seededExpectations = [
  {
    "id": "REQ-001",
    "title": "Task descriptions",
    "summary": "Capture helpful context in an optional task description.",
    "stage": "Backlog",
    "complete": 0,
    "total": 8,
    "specs": [
      {
        "id": "BE-REQ-001-description-validation",
        "role": "Backend",
        "title": "Description validation",
        "owner": "Leo · sample",
        "roleNote": "Waiting for the description validation contract.",
        "state": "backlog",
        "note": "Waiting for the description validation contract.",
        "taskLines": [
          "- [ ] 3.1 [Backend] Implement empty defaults and description updates; verify omitted updates preserve text and empty-string updates clear it.",
          "- [ ] 3.2 [Backend] Validate description type and Unicode length and document the contract; verify invalid requests leave task data unchanged and the 2,000-code-point boundary succeeds."
        ],
        "contractHash": "f3ece5e038afda96e95751abb79fd463613ccd2dab5b9592a8a8075f994bdd52"
      },
      {
        "id": "FE-REQ-001-description-editor",
        "role": "Frontend",
        "title": "Description editor",
        "owner": "Maya · sample",
        "roleNote": "Waiting for the description editor contract.",
        "state": "backlog",
        "note": "Waiting for the description editor contract.",
        "taskLines": [
          "- [ ] 2.1 [Frontend] Add a labeled description editor and literal-text display; verify keyboard access, line breaks, and markup-like text rendering.",
          "- [ ] 2.2 [Frontend] Handle description save errors; verify the draft remains available and the saved display stays unchanged after failure."
        ],
        "contractHash": "e99c6a18dd1ee01443f2c80241f8ec5a984d78a01ae4db0d6b5ff832c755d4fd"
      },
      {
        "id": "QA-REQ-001-description-acceptance",
        "role": "QA",
        "title": "Description acceptance",
        "owner": "Quinn · sample",
        "roleNote": "Acceptance scenarios drafted; delivery has not started.",
        "state": "backlog",
        "note": "Acceptance scenarios drafted; delivery has not started.",
        "taskLines": [
          "- [ ] 4.1 [QA] Run description lifecycle acceptance scenarios; verify create, edit, clear, and reload preserve the expected text.",
          "- [ ] 4.2 [QA] Check Unicode boundaries, markup-like input, keyboard access, and failed saves; record browser and API integration evidence."
        ],
        "contractHash": "ed496141765a645a34f2b8a60fa4d9562e7d74efa3e805d2f9644986c8fd77cc"
      },
      {
        "id": "SA-REQ-001-description-contract",
        "role": "SA",
        "title": "Description contract",
        "owner": "Avery · sample",
        "roleNote": "Ready for scope review.",
        "state": "backlog",
        "note": "Ready for scope review.",
        "taskLines": [
          "- [ ] 1.1 [SA] Define description limits and omitted/empty semantics; verify the delta covers create, edit, clear, and invalid values.",
          "- [ ] 1.2 [SA] Review the description UI/API contract; verify proposal, design, and scenarios agree on plain text and Unicode length."
        ],
        "contractHash": "433d2828189f20b19c44dc26ac275ffc734df5e754a2b120c2bdaf43315705b0"
      }
    ]
  },
  {
    "id": "REQ-002",
    "title": "Due dates & overdue cues",
    "summary": "Give each task an optional due date and make overdue work visible.",
    "stage": "Solution Design",
    "complete": 1,
    "total": 8,
    "specs": [
      {
        "id": "BE-REQ-002-date-validation",
        "role": "Backend",
        "title": "Date validation and round trips",
        "owner": "Leo · sample",
        "roleNote": "Waiting for date normalization decisions.",
        "state": "backlog",
        "note": "Waiting for date normalization decisions.",
        "taskLines": [
          "- [ ] 3.1 [Backend] Validate real calendar dates and nullable updates; verify leap-day and invalid-date unit tests.",
          "- [ ] 3.2 [Backend] Return stable date strings in task reads; document the contract and verify round trips do not shift dates."
        ],
        "contractHash": "0d1dbf5ce78818f588246b88ed0f7886796bcdb6c4ae09f861b05e97af0cec12"
      },
      {
        "id": "FE-REQ-002-date-editor",
        "role": "Frontend",
        "title": "Date editor and overdue cues",
        "owner": "Maya · sample",
        "roleNote": "Waiting for SA date-field sign-off.",
        "state": "backlog",
        "note": "Waiting for SA date-field sign-off.",
        "taskLines": [
          "- [ ] 2.1 [Frontend] Add an accessible date field and clear control; verify keyboard entry and clearing work.",
          "- [ ] 2.2 [Frontend] Render overdue text labels; verify due-today and completed tasks do not show overdue."
        ],
        "contractHash": "f10990b8e31ccc56969f07c7a603c3e12f193b9dbffb32ad0712da8583e1c44e"
      },
      {
        "id": "QA-REQ-002-date-boundaries",
        "role": "QA",
        "title": "Date lifecycle and boundary acceptance",
        "owner": "Quinn · sample",
        "roleNote": "Prepare month-boundary and leap-day examples.",
        "state": "backlog",
        "note": "Prepare month-boundary and leap-day examples.",
        "taskLines": [
          "- [ ] 4.1 [QA] Run due-date lifecycle acceptance scenarios; record create, clear, and invalid-input outcomes.",
          "- [ ] 4.2 [QA] Check timezone and month-boundary browser cases; record the local-date integration evidence."
        ],
        "contractHash": "8b617f1e460538910bd747644dc7a8ea0ea984bd5ce8a0a85c246550753d069c"
      },
      {
        "id": "SA-REQ-002-date-contract",
        "role": "SA",
        "title": "Date contract",
        "owner": "Avery · sample",
        "roleNote": "Reviewing date-only boundaries and overdue wording.",
        "state": "in_progress",
        "note": "Reviewing date-only boundaries and overdue wording.",
        "taskLines": [
          "- [x] 1.1 [SA] Define date-only and overdue scenarios; verify due-today, overdue, and completed cases are specified.",
          "- [ ] 1.2 [SA] Review clear versus omitted update semantics; verify the API and UI design use the same contract."
        ],
        "contractHash": "4a984d90b32ccf3ae7556ef9fa23b53d7af164a8e8ed036daec2d059af748914"
      }
    ]
  },
  {
    "id": "REQ-003",
    "title": "Labels & quick filters",
    "summary": "Organize tasks with reusable labels and filter the workspace in one click.",
    "stage": "Implementation",
    "complete": 3,
    "total": 8,
    "specs": [
      {
        "id": "BE-REQ-003-filters",
        "role": "Backend",
        "title": "Exact-match label filter API",
        "owner": "Leo · sample",
        "roleNote": "Implementing normalization and filter semantics.",
        "state": "in_progress",
        "note": "Implementing normalization and filter semantics.",
        "taskLines": [
          "- [ ] 3.2 [Backend] Implement the label filter contract and document it; verify case-insensitive exact-match API scenarios."
        ],
        "contractHash": "0b5cee45a17b4d9fc22629c561df09b3de2f8ec746517399559457c5b7aba53b"
      },
      {
        "id": "BE-REQ-003-labels",
        "role": "Backend",
        "title": "Label normalization and validation",
        "owner": "Leo · sample",
        "roleNote": "Implementing normalization and filter semantics.",
        "state": "in_progress",
        "note": "Implementing normalization and filter semantics.",
        "taskLines": [
          "- [ ] 3.1 [Backend] Implement normalized label validation; verify duplicate, blank, overlong, and over-limit tests."
        ],
        "contractHash": "9262299af28805257c8308ba84ce5dad445de19a900cfa2c339bf5292095a770"
      },
      {
        "id": "FE-REQ-003-filters",
        "role": "Frontend",
        "title": "Quick filters and empty results",
        "owner": "Maya · sample",
        "roleNote": "Label chips are illustrated complete; filter interaction is next.",
        "state": "in_progress",
        "note": "Label chips are illustrated complete; filter interaction is next.",
        "taskLines": [
          "- [ ] 2.2 [Frontend] Add exact-match filtering and empty results; verify clearing the filter restores all tasks."
        ],
        "contractHash": "eeb65e1085ce5316f3ffeb835a8da9a48d15244bcc0c3991a8b703a389d76510"
      },
      {
        "id": "FE-REQ-003-labels",
        "role": "Frontend",
        "title": "Label entry and removable chips",
        "owner": "Maya · sample",
        "roleNote": "Label chips are illustrated complete; filter interaction is next.",
        "state": "in_progress",
        "note": "Label chips are illustrated complete; filter interaction is next.",
        "taskLines": [
          "- [x] 2.1 [Frontend] Add label entry and removable chips; verify keyboard removal and duplicate handling."
        ],
        "contractHash": "e09fd41a8ddc12fb026cf2baa1698f5020a3c87456c04daa048c5dd530d3c710"
      },
      {
        "id": "QA-REQ-003-integration",
        "role": "QA",
        "title": "Label edit and filter integration",
        "owner": "Quinn · sample",
        "roleNote": "Waiting for the full label/filter integration.",
        "state": "backlog",
        "note": "Waiting for the full label/filter integration.",
        "taskLines": [
          "- [ ] 4.1 [QA] Run label edit/filter acceptance scenarios; record cross-role integration results."
        ],
        "contractHash": "d239bf712eb5b7db64a4dc5fd09935745a1bbf054726efd94616d5ede019e0a8"
      },
      {
        "id": "QA-REQ-003-keyboard",
        "role": "QA",
        "title": "Empty results and keyboard regression",
        "owner": "Quinn · sample",
        "roleNote": "Waiting for the full label/filter integration.",
        "state": "backlog",
        "note": "Waiting for the full label/filter integration.",
        "taskLines": [
          "- [ ] 4.2 [QA] Check empty lists and keyboard chip controls; record browser regression evidence."
        ],
        "contractHash": "5e2b9e7b26e52f0792d4770130ea1b78d87a627b33cf9efa9509ba96db598f89"
      },
      {
        "id": "SA-REQ-003-filters",
        "role": "SA",
        "title": "Filter rules and empty state",
        "owner": "Avery · sample",
        "roleNote": "Scope and matching rules reviewed in this sample.",
        "state": "backlog",
        "note": "Scope and matching rules reviewed in this sample.",
        "taskLines": [
          "- [x] 1.2 [SA] Review filter and empty-state behavior; verify design and delta spec agree."
        ],
        "contractHash": "79e31943dafe2d0dbc580784a334694ef26b7a3955084312fe5570ee632b06a9"
      },
      {
        "id": "SA-REQ-003-labels",
        "role": "SA",
        "title": "Label rules",
        "owner": "Avery · sample",
        "roleNote": "Scope and matching rules reviewed in this sample.",
        "state": "backlog",
        "note": "Scope and matching rules reviewed in this sample.",
        "taskLines": [
          "- [x] 1.1 [SA] Specify count, length, and case rules; verify all limits have acceptance examples."
        ],
        "contractHash": "6d77b81a3788c30a11d5845d39f78574b6d426b4a2537eb6c820d4487366d33e"
      }
    ]
  },
  {
    "id": "REQ-004",
    "title": "Complete & reopen tasks",
    "summary": "Track finished work, reopen it when needed, and keep progress counts accurate.",
    "stage": "QA",
    "complete": 7,
    "total": 8,
    "specs": [
      {
        "id": "BE-REQ-004-completion-api",
        "role": "Backend",
        "title": "Idempotent completion API",
        "owner": "Leo · sample",
        "roleNote": "Boolean updates and counts are illustrated complete.",
        "state": "backlog",
        "note": "Boolean updates and counts are illustrated complete.",
        "taskLines": [
          "- [x] 3.1 [Backend] Implement idempotent boolean completion updates; verify invalid types and missing tasks are rejected.",
          "- [x] 3.2 [Backend] Document completed counts and response shape; verify create/list/update integration tests."
        ],
        "contractHash": "f1a2af9c0ff9e54ba164fb7f5c8376569cc88704409cda2ec2b044930583fe06"
      },
      {
        "id": "FE-REQ-004-completion-controls",
        "role": "Frontend",
        "title": "Completion controls and feedback",
        "owner": "Maya · sample",
        "roleNote": "Toggle and failure feedback are illustrated complete.",
        "state": "backlog",
        "note": "Toggle and failure feedback are illustrated complete.",
        "taskLines": [
          "- [x] 2.1 [Frontend] Add accessible complete/reopen controls; verify label and state update after successful saves.",
          "- [x] 2.2 [Frontend] Show pending and failure feedback; verify failed updates preserve task state and counts."
        ],
        "contractHash": "b83e739e9b68ebb1fc1e24c4c485282567d968e04adb6d49f25e194bd557fb19"
      },
      {
        "id": "QA-REQ-004-completion-regression",
        "role": "QA",
        "title": "Completion lifecycle regression",
        "owner": "Quinn · sample",
        "roleNote": "Final keyboard and rapid-toggle regression review remains.",
        "state": "in_progress",
        "note": "Final keyboard and rapid-toggle regression review remains.",
        "taskLines": [
          "- [x] 4.1 [QA] Run complete, reopen, and failed-update acceptance scenarios; record integration evidence.",
          "- [ ] 4.2 [QA] Check keyboard use and rapid repeated toggles; record the final browser regression results."
        ],
        "contractHash": "36e77eb2900e1dc9d21eed9a19d180d6096e8ed7ece43a651e0568e3b6dd62ba"
      },
      {
        "id": "SA-REQ-004-completion-contract",
        "role": "SA",
        "title": "Completion and reopen contract",
        "owner": "Avery · sample",
        "roleNote": "Completion and reopen contract reviewed in this sample.",
        "state": "backlog",
        "note": "Completion and reopen contract reviewed in this sample.",
        "taskLines": [
          "- [x] 1.1 [SA] Specify complete/reopen and failed-update scenarios; verify counters are included.",
          "- [x] 1.2 [SA] Review the boolean API and pending-state design; verify duplicate requests are safe."
        ],
        "contractHash": "5720b09bfb863c5d709e63d55a6b4defd1d8a07a3436f874d9c939b3a0a0dffb"
      }
    ]
  },
  {
    "id": "REQ-005",
    "title": "Task dependency links",
    "summary": "Show prerequisite tasks and prevent dependency cycles before they confuse delivery.",
    "stage": "Blocked",
    "complete": 3,
    "total": 8,
    "specs": [
      {
        "id": "BE-REQ-005-dependency-validation",
        "role": "Backend",
        "title": "Atomic reference and cycle validation",
        "owner": "Leo · sample",
        "roleNote": "Illustrative blocker: long-chain cycle detection is unresolved; complete the algorithm and its regression cases before integration.",
        "state": "blocked",
        "note": "Illustrative blocker: long-chain cycle detection is unresolved; complete the algorithm and its regression cases before integration.",
        "taskLines": [
          "- [x] 3.1 [Backend] Implement reference validation and atomic dependency writes; verify missing-reference and self-link unit tests.",
          "- [ ] 3.2 [Backend] Complete iterative cycle detection and document limits; verify cycles through chains over 100 tasks are rejected."
        ],
        "contractHash": "6a52c3512a165ad57783203cb073d828ed183f9d0114bf430deaa60809d0c6db"
      },
      {
        "id": "FE-REQ-005-dependency-controls",
        "role": "Frontend",
        "title": "Prerequisite selection and warnings",
        "owner": "Maya · sample",
        "roleNote": "Waiting for a stable dependency update response.",
        "state": "backlog",
        "note": "Waiting for a stable dependency update response.",
        "taskLines": [
          "- [ ] 2.1 [Frontend] Add prerequisite selection by task title; verify self-task choices are unavailable and labels are accessible.",
          "- [ ] 2.2 [Frontend] Show unresolved dependencies and save errors; verify completed prerequisites disappear from the warning list."
        ],
        "contractHash": "9b24d8b740083e7ef6b7a02f136a61cea6c39873f10784266acc2ced9014ccf5"
      },
      {
        "id": "QA-REQ-005-dependency-regression",
        "role": "QA",
        "title": "Dependency lifecycle and graph regression",
        "owner": "Quinn · sample",
        "roleNote": "Long-chain and self-link scenarios are ready for integration.",
        "state": "backlog",
        "note": "Long-chain and self-link scenarios are ready for integration.",
        "taskLines": [
          "- [ ] 4.1 [QA] Run dependency lifecycle acceptance scenarios; record edit and completed-prerequisite integration results.",
          "- [ ] 4.2 [QA] Run long-chain and cyclic graph regression scenarios; record rejection and atomicity evidence."
        ],
        "contractHash": "37ad0b19f7fa3c7beed4c57e2464f33477542de0871c1e70ad05f32e2069b137"
      },
      {
        "id": "SA-REQ-005-dependency-contract",
        "role": "SA",
        "title": "Dependency graph contract",
        "owner": "Avery · sample",
        "roleNote": "Dependency rules and API contract reviewed in this sample.",
        "state": "backlog",
        "note": "Dependency rules and API contract reviewed in this sample.",
        "taskLines": [
          "- [x] 1.1 [SA] Specify link validity and cycle scenarios; verify self-link, missing task, and long-chain cases exist.",
          "- [x] 1.2 [SA] Review graph traversal and atomic update design; verify UI and API contracts agree."
        ],
        "contractHash": "79fab7785737b32839740e4adb9dcba4b1e9bf65a93a2497e26ae8cc0969a4d6"
      }
    ]
  },
  {
    "id": "REQ-006",
    "title": "Keyboard quick capture",
    "summary": "Create a task from the keyboard and return focus to the next piece of work.",
    "stage": "Done",
    "complete": 8,
    "total": 8,
    "specs": [
      {
        "id": "BE-REQ-006-capture-validation",
        "role": "Backend",
        "title": "Create title validation",
        "owner": "Leo · sample",
        "roleNote": "Create contract and normalization illustrated complete.",
        "state": "backlog",
        "note": "Create contract and normalization illustrated complete.",
        "taskLines": [
          "- [x] 3.1 [Backend] Implement trimmed title validation; verify empty, whitespace, overlong, and valid title tests.",
          "- [x] 3.2 [Backend] Document create responses and errors; verify invalid requests do not mutate the task list."
        ],
        "contractHash": "c904a6ef4ff1d16edeb0a2a5edd77bd377d9e582ff396e397833d097e3c4e3a7"
      },
      {
        "id": "FE-REQ-006-capture-form",
        "role": "Frontend",
        "title": "Capture form and focus recovery",
        "owner": "Maya · sample",
        "roleNote": "Keyboard and error-state work illustrated complete.",
        "state": "backlog",
        "note": "Keyboard and error-state work illustrated complete.",
        "taskLines": [
          "- [x] 2.1 [Frontend] Implement form submission and pending state; verify Enter and button each create exactly one task.",
          "- [x] 2.2 [Frontend] Implement success focus and error retention; verify keyboard and accessible error rendering."
        ],
        "contractHash": "c8016d8b686590c1f820e1d51b7bc2fe3343390f1b12107eea43f7bf16e94dbb"
      },
      {
        "id": "QA-REQ-006-capture-regression",
        "role": "QA",
        "title": "Capture acceptance and keyboard regression",
        "owner": "Quinn · sample",
        "roleNote": "All sample acceptance and accessibility tasks illustrated complete.",
        "state": "backlog",
        "note": "All sample acceptance and accessibility tasks illustrated complete.",
        "taskLines": [
          "- [x] 4.1 [QA] Run create, validation, and retry acceptance scenarios; record integrated outcomes.",
          "- [x] 4.2 [QA] Check focus restoration and rapid Enter input; record keyboard regression evidence."
        ],
        "contractHash": "eb63b71f535041ce2c215b7ca52f1736cf626f3525f8abeae042b596af95d02e"
      },
      {
        "id": "SA-REQ-006-capture-contract",
        "role": "SA",
        "title": "Keyboard capture contract",
        "owner": "Avery · sample",
        "roleNote": "Scope and validation reviewed in this sample.",
        "state": "backlog",
        "note": "Scope and validation reviewed in this sample.",
        "taskLines": [
          "- [x] 1.1 [SA] Specify title normalization and errors; verify length and blank-title boundaries are covered.",
          "- [x] 1.2 [SA] Review keyboard focus and retry behavior; verify design and acceptance scenarios agree."
        ],
        "contractHash": "29bdf514c6832d83c199271798d58aa7b6c7b990cb5c51e765c47f28c56bd12f"
      }
    ]
  }
];
