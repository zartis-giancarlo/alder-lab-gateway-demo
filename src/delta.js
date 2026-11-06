// Delta check: hold a result for review when it differs too much from the previous result
// of the same patient inside a time window.
//
// Stories ALGW-1 and ALGW-2. NOT BUILT YET: the agent builds this in step 4.
//
// deltaCheck({ previous, current, rule, now }) returns
//   { held: boolean, reason: string | null, trace: string, percent: string | null }
// previous: { value, unit, at } or null. current: { value, unit }.
// rule: { limitPercent, windowDays }. now: an ISO date-time.
export function deltaCheck() {
  return { held: false, reason: null, trace: "NOT_BUILT", percent: null };
}
