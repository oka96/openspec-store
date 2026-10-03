# QA-REQ-004-completion-regression · Completion lifecycle regression

## Purpose

Define the completion lifecycle regression responsibilities owned by QA for REQ-004, complete & reopen tasks.

## ADDED Requirements

### Requirement: Completion lifecycle regression
Acceptance verification SHALL record complete, reopen, failed-update, keyboard, and rapid-toggle behavior, including stable counters and no duplicate pending changes.

#### Scenario: Lifecycle and retries
- **WHEN** complete, reopen, failure, and repeated input checks run
- **THEN** evidence records correct confirmed state and counts, accessible controls, and preserved state on failure
