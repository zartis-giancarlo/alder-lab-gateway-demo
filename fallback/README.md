# Fallback files

Each file is the output of one live step, made before the session. Use it when a live step fails. Say: "This output was made before the session."

- `01-use-cases.md`: step 1, use cases drafted from the call.
- `02-stories.md`: step 2, the three Jira stories (they also exist in Jira).
- `03-test-cases.md`: step 3a, test cases N1 to N4 and E1 to E4. Save the approved table as `tests/cases/ALGW-1.md`.
- `03b-playwright-n2.spec.js`: step 3b, the Playwright test for case N2. Copy it to `tests/e2e/worklist.spec.js`.
- `04-solution/src/`: step 4, a working `delta.js` and `ruleStore.js`. Copy them over `src/` to turn the unit tests green.
- To add after the dry run: `04-*` screenshots (Jira panel, GitHub session, draft pull request), `05-ci-run.png` (step 5, the workflow run), `06-merge-box-blocked.png` and `06-merge-box-ready.png` (step 6), and `07-docs/` (step 7, the three draft documents).

A person reads every file before it is used.
