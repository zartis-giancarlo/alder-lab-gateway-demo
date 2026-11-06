# Alder Lab Gateway (demo)

A made-up lab system for a live demo of a shift-left delivery flow with GitHub Copilot. It is a fictional example, not a product feature. All data is synthetic. Limits are test values, not clinical guidance.

The feature in the story: hold a lab result for review when it differs too much from the same patient's previous result inside a time window (a "delta check"). A change to the limit needs two authorised people, and the change leaves a history.

The idea behind the demo: the AI drafts at every step, and a person approves at every step. Review and V&V stay with people.

## Quick start

```
npm install
npx playwright install chromium
npm run test:unit      # red until the delta check and the rule store are built
npm run test:e2e       # red for the same reason (case N4)
npm start              # http://localhost:3410
```

Node.js 24 or later. The app uses plain ES modules and no framework. It listens on port 3410. Playwright starts its own server on that port and never reuses a running one.

## The demo flow

Each step has a person who approves. The fallback file is the output of that step, made before the session.

| Step | What Copilot drafts | Who approves | Where in this repository | Fallback |
|---|---|---|---|---|
| 1. Talk to use cases | Use cases and open questions from a call excerpt | Product owner and the lab expert | `talk/valbrume-call.txt` | `fallback/01-use-cases.md` |
| 2. Use cases to stories | Jira stories with acceptance criteria | Product owner | Jira project `ALGW` | `fallback/02-stories.md` |
| 3a. Stories to test cases | A table of nominal and edge cases | V&V | `.github/prompts/test-cases.prompt.md`, `tests/cases/` | `fallback/03-test-cases.md` |
| 3b. Test case to test code | A Playwright test for case N2 | A developer | `tests/e2e/` | `fallback/03b-playwright-n2.spec.js` |
| 4. Build | `src/delta.js` and `src/ruleStore.js` | A developer reads the pull request | `src/`, `.github/copilot-instructions.md` | `fallback/04-solution/src/` |
| 5. Run the prepared tests | Nothing: the workflow runs them | V&V reads the result | `.github/workflows/vv-uat.yml` | CI run screenshot |
| 6. Review and merge | An optional first review | Developer and V&V, with two accounts | `.github/CODEOWNERS`, ruleset | Merge box screenshots |
| 7. Documents | Release note, trace table, decisions log | Quality manager or V&V | none (drafted in chat) | `fallback/07-docs/` |

## State of this repository

- `src/delta.js` and `src/ruleStore.js` are stubs. The demo builds them from the stories ALGW-1 to ALGW-3.
- `tests/unit/` and `tests/e2e/config.spec.js` are the prepared tests: 11 unit tests (cases N1 to N3 and E1 to E4, plus four rule store tests) and the browser case N4. They fail until the stubs are built.
- `tests/cases/` is empty. The approved test cases go there, for example as `tests/cases/ALGW-1.md`.
- `src/Access/` is the restricted area. The instruction file says "never edit it", and `.github/CODEOWNERS` asks a person to review every change to it.
- `fallback/` holds a working solution and the outputs of the earlier steps. Copy `fallback/04-solution/src/*` over `src/` and `fallback/03b-playwright-n2.spec.js` to `tests/e2e/worklist.spec.js` to turn everything green (11 unit tests and 2 browser tests).

## Repository map

```
.github/
  copilot-instructions.md        project instructions (five lines)
  instructions/tests.instructions.md   applies to tests/**
  prompts/test-cases.prompt.md   prompt file for step 3a
  workflows/vv-uat.yml           the required check, named vv-uat
  CODEOWNERS                     placeholder handles, replace before use
src/
  server.js                      plain http server, JSON API and two pages
  delta.js, ruleStore.js         stubs (the build step)
  Access/roles.js                restricted area
  data/seed.json                 synthetic samples TEST-0001 to TEST-0008
  public/                        worklist page and rule configuration page
tests/                           unit, e2e, cases
talk/                            the invented call excerpt
fallback/                        pre-made outputs per step
```

The workflow `vv-uat.yml` has no path filter, no branch filter and no commit-message skip on purpose. A workflow that is skipped as a whole leaves its required check "Pending" and blocks the merge.

## Set-up before the demo

1. Replace the handles in `.github/CODEOWNERS` with accounts that have write access. A code owner who is also the author of the pull request cannot approve it, so a second account is needed.
2. Create a ruleset on the default branch: require a pull request, require 2 approvals, require the status check `vv-uat`, require review from code owners. Keep the bypass list empty so you can show it.
3. Keep the default that workflows wait for approval on pull requests from the cloud agent.
4. Check the Copilot features you plan to show: agent mode, the prompt file `/test-cases`, the Playwright MCP server (`npx @playwright/mcp@latest`), and the cloud agent policy of the organisation that gives you the seat.
5. For step 4 in Jira: the Jira site needs Rovo and AI features on, and the GitHub Copilot for Jira app must be installed for the GitHub account or organisation that owns this repository.

## Known limits (checked on 2026-11-06)

- This repository is public. Keep real data, real names and customer information out of it, and out of the Jira items that the agent reads. The Jira page warns that the context the agent captures from a Jira work item is added to the pull request and is visible to everyone if the repository is public.
- Rulesets work on a public repository with the GitHub Free plan. On a private repository under a personal Free account the API refuses them.
- The documentation of the Jira integration describes GitHub organisations only. Whether it works with a repository under a personal account is not stated. Test it before you rely on it.
- Prompt files are a public preview feature. Check that `/test-cases` appears in the chat of your editor.
