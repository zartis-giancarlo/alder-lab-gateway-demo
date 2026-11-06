# Test cases for ALGW-1 to ALGW-3

Status: Draft, pending V&V approval. Fixture: rule DELTA-CREA, limit 25 %, window 14 days. "Exceeds" means strictly greater. All values are test values, not clinical guidance.

| ID | Type | Steps | Expected result |
|---|---|---|---|
| N1 | Nominal | TEST-0001: previous 80 three days ago; new 90 (+12.5 %). | Delta check passes. Trace: `DELTA pass +12.5 %`. |
| N2 | Nominal | TEST-0002: previous 80 three days ago; new 110 (+37.5 %). | Result held, `DELTA_EXCEEDED`. Worklist shows previous 80, date, +37.5 %. |
| N3 | Nominal | TEST-0003: previous 120; new 80 (-33.3 %). | Held. A decrease counts. |
| N4 | Nominal | BIO-A proposes limit 30 %; BIO-B approves. | Limit pending, then live at 30 %. History shows both users, old and new value, times. |
| E1 | Edge | TEST-0004: no previous result. | `NO_HISTORY`. Not held by this rule. Shown on screen. |
| E2 | Edge | TEST-0005: previous 80 twenty days ago; new 140. | `OUT_OF_WINDOW`. Not held by this rule. A person confirms this is intended. |
| E3 | Edge | TEST-0006: previous 80; new 100 (exactly +25.0 %). TEST-0008: new 101 (+26.25 %). | 100 passes. 101 is held. |
| E4 | Edge | TEST-0007: previous 0.9 mg/dL; new 80 umol/L; no conversion configured. | Held, `UNIT_MISMATCH`. Never compared silently. A person confirms this default. |

Assumptions to confirm (questions for a person):
- Is the window exactly 14 days, counted from the previous result to the new one?
- Is a big jump outside the window meant to pass this rule alone (E2)?
- Is "hold on a unit mismatch" the safe default (E4)?
