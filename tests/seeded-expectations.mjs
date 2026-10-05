export const seededExpectations = [
  {
    "id": "ROOM-001",
    "title": "Meeting room booking",
    "summary": "Choose Atlas or Cedar, book a time, prevent overlaps and cancel a booking.",
    "stage": "Backlog",
    "complete": 0,
    "total": 8,
    "specs": [
      {
        "id": "BE-ROOM-001-booking-api",
        "role": "Backend",
        "title": "Backend booking implementation",
        "owner": "Backend",
        "roleNote": "",
        "state": "backlog",
        "note": "",
        "taskLines": [
          "- [ ] 1.1 Implement rooms and booking APIs with in-memory validation, overlap detection and cancellation; verify the contract with npm test.",
          "- [ ] 1.2 Document npm start on port 3101 and verify a live create, conflict, cancel and rebook sequence."
        ],
        "contractHash": "1e46ca90b2c4bc49fa38bd2cf9866a74e54eda6bc6155c8ba64892a1859ccf69"
      },
      {
        "id": "FE-ROOM-001-booking-ui",
        "role": "Frontend",
        "title": "Frontend booking implementation",
        "owner": "Frontend",
        "roleNote": "",
        "state": "backlog",
        "note": "",
        "taskLines": [
          "- [ ] 1.1 Implement the labeled booking form and room/booking lists; verify loading, empty, success and server-error states with npm test.",
          "- [ ] 1.2 Verify keyboard form submission, visible timezone, conflict feedback and cancellation against the running API in a browser."
        ],
        "contractHash": "089248aa01d8232ed5c92417605f936b6d4920ea0ca79c3831cc0a475c1bcfc8"
      },
      {
        "id": "QA-ROOM-001-booking-regression",
        "role": "QA",
        "title": "QA booking regression",
        "owner": "QA",
        "roleNote": "",
        "state": "backlog",
        "note": "",
        "taskLines": [
          "- [ ] 1.1 Derive automated regression checks from the SA, Backend and Frontend contracts; verify npm test against running services.",
          "- [ ] 1.2 Execute and record the browser regression scenarios for valid booking, invalid input, overlap and cancel/rebook; report product defects to Backend or Frontend."
        ],
        "contractHash": "e83ff555a9a52820013532caabd2ca0896c921d2ebaf86fac53e78bb145aa650"
      },
      {
        "id": "SA-ROOM-001-booking-contract",
        "role": "SA",
        "title": "SA booking contract and handoff",
        "owner": "SA",
        "roleNote": "",
        "state": "backlog",
        "note": "",
        "taskLines": [
          "- [ ] 1.1 Verify the shared API, validation and overlap scenarios are internally consistent across all three impacted applications.",
          "- [ ] 1.2 Verify Backend and Frontend handoffs reference this contract and QA references SA plus both implementation specs."
        ],
        "contractHash": "1e46ca90b2c4bc49fa38bd2cf9866a74e54eda6bc6155c8ba64892a1859ccf69"
      }
    ]
  }
];
