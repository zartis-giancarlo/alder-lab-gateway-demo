# Jira stories (project ALGW)

## ALGW-1 Hold large changes from the previous result (delta check)

As a biologist, I want results with a large change from the previous result to be held, so that I review them before release.

- AC1 Given a previous result inside the window, when the relative change is strictly greater than the limit in either direction, then the result is held with reason DELTA_EXCEEDED.
- AC2 Given a change equal to or below the limit, then this rule passes the result.
- AC3 The review worklist shows previous value, previous date and percentage change for each held result.

## ALGW-2 Say when the delta check could not run

As a biologist, I want the screen to say when the delta check could not run, so that silence is never read as "passed".

- AC1 No previous result: the trace shows NO_HISTORY. The result is not held by this rule.
- AC2 Previous result older than the window: the trace shows OUT_OF_WINDOW. Not held by this rule.
- AC3 Previous result in a different unit and no conversion configured: the result is held with UNIT_MISMATCH. No silent comparison.
- AC4 The behaviours AC1 to AC3 are listed in the user guide and were approved by the BIO role. (A person decision.)

## ALGW-3 Limit changes need a second approver and leave a history

As a quality manager, I want limit changes to need a second approver and leave a history, so that parameters are traceable.

- AC1 A proposed limit is "pending approval" and does not change live behaviour.
- AC2 A different authorised user can approve. The proposer cannot approve their own change.
- AC3 The history shows old value, new value, proposer, approver, times and reason.
- AC4 Only users with the "rule approver" role can approve.
