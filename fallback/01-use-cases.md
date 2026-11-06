# Use cases (drafted by AI, edited by a person)

Status: Draft, pending PO and BIO approval. Source: `talk/valbrume-call.txt`.

## UC-1 Hold large changes

- Trigger: a new result arrives.
- Flow: the system finds the previous result of the same patient and analysis inside the window, computes the relative change, and compares it with the approved limit. It either passes the delta check or holds the result with a reason, the previous value and the percentage. The biologist sees held results in the review worklist.

## UC-2 Change a limit under two-person approval

- Trigger: a biologist proposes a new limit.
- Flow: the change is saved as pending. The live limit stays. A second authorised user approves or rejects. The history records both users, the old and the new value, the time and the reason.

## Open questions (a person answers; the AI must not invent the answers)

- What is the limit for each analysis? The lab sets it.
- What is the window? The call says "the previous two weeks": is it exactly 14 days?
- What happens when the units differ?
- Who may approve a limit change?
