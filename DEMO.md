# Demo runbook (29 minutes)

A fictional example of a shift-left delivery flow with GitHub Copilot. The message: the AI drafts at every step, and a person approves at every step. Review and V&V stay with people. All data is synthetic. The feature is not a product feature.

## Links

- Repository: https://github.com/zartis-giancarlo/alder-lab-gateway-demo
- Jira board (project ALGW, Kanban): https://zartis-demos.atlassian.net/jira/software/projects/ALGW/boards/4
- Stories on the board: ALGW-1, ALGW-2 and ALGW-3, all in Backlog, label `demo`. The story you create live gets the next free key (for example ALGW-4).
- Pre-made story texts: `fallback/02-stories.md`.

## Roles and accounts

One presenter can play all roles. Say the role aloud at each approval.

- Product owner (PO) and lab expert (BIO): approve use cases and stories.
- V&V: approves the test cases and reads the test result.
- Developer: reads the code and the pull request.
- Quality manager (QM): approves the documents.
- GitHub account A: the requester. It owns the repository and starts the agent.
- GitHub account B: the second approver. Keep it logged in on a second browser profile. The person who asks the cloud agent for a pull request cannot approve it.

## Before the session

1. Replace the placeholder handles in `.github/CODEOWNERS` with account A and account B. Both need write access to the repository.
2. Create the ruleset (see "Ruleset" at the end). Do it after the rehearsal pull requests exist, because it blocks direct pushes to `main`.
3. Run the baseline once: `npm install`, `npx playwright install chromium`, `npm run test:unit`. It must be red (11 failing). `npm run test:e2e` must fail on case N4.
4. In VS Code: open the repository, sign in to Copilot, and check that `/test-cases` shows in chat (prompt files are a public preview feature). Add the Playwright MCP server in agent mode (`npx @playwright/mcp@latest`) and trust it once.
5. Pick one fixed model, or Auto, and write the choice in your rehearsal notes.
6. Prepare two pull requests for step 6 (see "Prepare the two pull requests").
7. If you plan to show the Jira trigger in step 4: install the GitHub Copilot for Jira app, check that Rovo is on, check that the cloud agent policy is on, and start one run before the session. Test it first: the documentation describes GitHub organisations, not repositories under a personal account.
8. Browser tabs ready: Jira board, repository, a pull request, the ruleset page, the test report. Large font, notifications off.
9. Save every output of the rehearsal in `fallback/` (see `fallback/README.md`).

## Time plan

| Step | Minutes | Topic |
|---|---|---|
| 0 | 1 | Set the screen |
| 1 | 4 | Talk to use cases |
| 2 | 3 | Use cases to Jira stories |
| 3 | 7 | Stories to test cases, then test code |
| 4 | 5 | Build with criteria and tests already defined |
| 5 | 3 | Run the prepared tests |
| 6 | 4 | Review, V&V pass, merge |
| 7 | 2 | Documents |

## Step 0 (1 min): set the screen

- Screen: the Jira board, the repository in a browser tab, `.github/copilot-instructions.md` open in the editor, `talk/valbrume-call.txt` ready.
- Say: "This is a made-up lab system. All data is synthetic. The AI drafts. A person approves at every step. This is a fictional example, not a product feature."

## Step 1 (4 min): from a talk to use cases

- Screen: the file `talk/valbrume-call.txt` next to Copilot Chat in VS Code.
- Do: ask Copilot to read the file and draft use cases and open questions.
- Prompt: `Read #file:talk/valbrume-call.txt. Draft use cases with trigger, flow and open questions. Do not invent numbers. List each missing value as a question.`
- Approval (PO and BIO): edit one line live. If Copilot proposes a default limit, delete it and write "the lab sets the limit per analysis".
- Say: "The AI proposed a number. I removed it. The lab sets the limit."
- If it fails: open `fallback/01-use-cases.md` and say "This output was made before the session."

## Step 2 (3 min): use cases to Jira stories

- Screen: the Jira board with ALGW-1 to ALGW-3 in Backlog, and the Copilot answer in the editor.
- Do: ask Copilot to draft stories. Create the first story in Jira live from the draft (it gets the next free key). Show the other two as already created.
- Prompt: `From UC-1 and UC-2 draft Jira stories: As a ... I want ... so that ... Add acceptance criteria as Given, When, Then. Keep each criterion testable.`
- Approval (PO): approves the stories. AC4 of ALGW-2 is a person decision: the BIO role approves the listed behaviours.
- Say: "The AI wrote the draft. The product owner decides if it says what the lab wants."
- If it fails: show ALGW-1 to ALGW-3 in Jira, or `fallback/02-stories.md`.

## Step 3 (7 min): stories to test cases, then test code

Part 3a (5 min): test cases at story stage.

- Screen: the three stories, then a table in the editor.
- Do: run the prompt file `/test-cases` in chat and name the stories. Show the table. Stop at E2, E3 and E4 and ask the room what the default should be. Write the answer in a decisions note.
- Prompt: `/test-cases` followed by `Stories ALGW-1 to ALGW-3 (see fallback/02-stories.md).` If the prompt file does not load, paste the text of `.github/prompts/test-cases.prompt.md` into chat.
- Approval (V&V): approves the cases. Save the approved table as `tests/cases/ALGW-1.md`.
- Say: "The AI drafts the cases. V&V decides which edge case matters and what the safe default is."
- If it fails: open `fallback/03-test-cases.md`.

Part 3b (2 min): test code from an approved case.

- Do: pick case N2. Ask Copilot to write the Playwright test. Show it. Read the assertions only.
- Prompt: `Using Playwright, write an end-to-end test for test case N2 in tests/cases/ALGW-1.md. Use the seeded sample TEST-0002. Check the badge, the reason text and the percentage.`
- If you run the test through the Playwright tool in agent mode, Copilot asks permission to use the tool. Show the prompt: it is an approval point.
- Approval (developer): reads the test. It must test the case as written and must not copy the code under test.
- If it fails: copy `fallback/03b-playwright-n2.spec.js` to `tests/e2e/worklist.spec.js`.

## Step 4 (5 min): build, with criteria and tests already defined

- Screen: the Jira story, the agent session, the draft pull request.
- Option A (Jira to the cloud agent, needs the set-up in "Before the session" item 7): assign GitHub Copilot to the story, or mention it in a comment. A cloud run takes minutes, so show the pull request of a run you started before the session, and say so.
  - Jira comment: `@GitHub Copilot implement this story in zartis-giancarlo/alder-lab-gateway-demo. The test cases are in tests/cases/ALGW-1.md. Make the tests in tests/ pass. Do not read the folder fallback/.`
- Option B (local agent mode in VS Code, or Copilot CLI): works with the editor features.
  - Prompt: `Implement the stories in fallback/02-stories.md in src/delta.js and src/ruleStore.js. The test cases are in tests/cases/ALGW-1.md. Make npm run test:unit pass. Do not read or copy from the other files in fallback/. Do not edit src/Access/.`
- Show: the instruction file (`.github/copilot-instructions.md`), one story per session (short context), and the restricted area. Say that instructions advise, and CODEOWNERS or a ruleset sends the change to a person. Do not show a hook.
- Approval (developer): reads the pull request or the diff. The cloud agent cannot approve or merge its own work.
- Say: "The tests and the criteria exist first. The agent works against them. A developer reads the result."
- If it fails: copy `fallback/04-solution/src/*` over `src/` and say "This output was made before the session."

## Step 5 (3 min): run the prepared tests

- Screen: the pull request, the checks list, the test report.
- Do: if the pull request comes from the cloud agent, a person with write access clicks "Approve and run workflows". The workflow `vv-uat` runs the unit tests and the Playwright tests. Open the report. V&V reads the result. Optionally run `npm start` and open http://localhost:3410 to show TEST-0002 held with its reason.
- Say two things: (1) By default the workflow waits for a person when the pull request comes from the cloud agent. (2) These Playwright tests run in the workflow as normal test code. This is not the agent's own Playwright tool.
- Approval: a person starts the run, and V&V reads the result.
- If it fails: show the screenshot `fallback/05-ci-run.png` (add it after the rehearsal).

## Step 6 (4 min): review, V&V pass, merge

- Screen: two prepared pull requests. PR 1 is green. PR 2 has a failing required check and a missing approval.
- Do: optionally request a Copilot code review as a first pass. Show the merge box of PR 2: blocked. Show PR 1: after the V&V approval alone it is still blocked. Approve with account B. The check is green and the ruleset asks for two approvals in all. Merge.
- Show the ruleset and its empty bypass list. Say that an administrator can bypass a ruleset and can merge. A gate on GitHub is a setting.
- Leave Copilot approvals off. If someone asks whether a Copilot approval counts toward required reviews, say that two official pages differ, and read both.
- Approval: the developer and V&V.
- If it fails: show `fallback/06-merge-box-blocked.png` and `fallback/06-merge-box-ready.png` (add them after the rehearsal).

## Step 7 (2 min): documents

- Do: ask Copilot to draft three documents. Show the status line "Draft, pending V&V approval". Open the trace table.
- Prompt: `From UC-1, UC-2, ALGW-1 to ALGW-3, test cases N1 to E4 and the merged pull request, draft: a release note in English, a requirement trace table (clause, story, test case, pull request, status) and a decisions log. Mark each as Draft. List only what was built and tested. Do not claim conformity to any standard.`
- Approval (QM or V&V): approves each document.
- Say that this step is the demo design, not a documented feature.
- If it fails: open `fallback/07-docs/` (add it after the rehearsal).

## Close

Say: "AI drafted at every step. A person approved at every step. Review and V&V stayed with people. This was a fictional example, not a product feature."

## Do not say

- Do not say that the demo, Copilot, the generated tests or the documents comply with, meet or prove conformity to any standard or law.
- Do not say that the demo is "validated", or that AI output replaces verification, validation or acceptance testing.
- Do not say that a limit, a window or a rule is correct or recommended. They are test values.
- Do not say "zero effort", "no human needed", "fully automatic" or "AI approves".
- Do not show a pass rate, a time saving or a cost figure.
- No real patient data, names, instrument exports or customer information, in prompts, fixtures, screenshots or Jira items. This repository is public.

## Prepare the two pull requests

PR 1 (green):

```
git checkout -b demo/delta-check
cp fallback/04-solution/src/*.js src/
cp fallback/03b-playwright-n2.spec.js tests/e2e/worklist.spec.js
git add -A && git commit -m "Delta check and rule store" && git push -u origin demo/delta-check
```

PR 2 (red): start from the same branch and change the comparison in `src/delta.js` from `>` to `>=` (the line with `rule.limitPercent`). The unit test E3 then fails, because exactly +25.0 % must pass. Push it as `demo/broken-limit` and open a pull request.

Open both pull requests against `main`. Create the ruleset after both pull requests exist.

## Ruleset

Create it with the GitHub CLI:

```
gh api -X POST repos/zartis-giancarlo/alder-lab-gateway-demo/rulesets --input .github/rulesets/main-gate.json
```

It requires a pull request with 2 approvals and a code owner review, requires the status check `vv-uat`, and keeps the bypass list empty. With one account nobody can merge, so add account B first.

## Reset between rehearsals

- Delete the demo branches and close the pull requests.
- Put `src/delta.js`, `src/ruleStore.js` and `tests/e2e/` back to the state of `main`, and empty `tests/cases/`.
- In Jira, keys never repeat: a story created in a rehearsal keeps its key. Say "the story" in the live prompts, or use ALGW-1.
