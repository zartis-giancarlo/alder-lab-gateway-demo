// Delta check: hold a result for review when it differs too much from the previous result
// of the same patient inside a time window. Stories ALGW-1 and ALGW-2.
const DAY_MS = 24 * 60 * 60 * 1000;

function formatPercent(percent) {
  const sign = percent < 0 ? "-" : "+";
  return `${sign}${Math.abs(percent).toFixed(1)} %`;
}

export function deltaCheck({ previous, current, rule, now }) {
  if (!previous) {
    return { held: false, reason: null, trace: "NO_HISTORY", percent: null };
  }
  const ageDays = (Date.parse(now) - Date.parse(previous.at)) / DAY_MS;
  if (ageDays > rule.windowDays) {
    return { held: false, reason: null, trace: "OUT_OF_WINDOW", percent: null };
  }
  if (previous.unit !== current.unit) {
    // Never compare values in different units without a configured conversion.
    return { held: true, reason: "UNIT_MISMATCH", trace: "UNIT_MISMATCH", percent: null };
  }
  const difference = current.value - previous.value;
  const percent = previous.value === 0 ? null : (difference / previous.value) * 100;
  const text = percent === null ? null : formatPercent(percent);
  // "Exceeds" means strictly greater. This test avoids a division, so a value exactly at the limit passes.
  const exceeds = Math.abs(difference) * 100 > rule.limitPercent * Math.abs(previous.value);
  if (exceeds) {
    return { held: true, reason: "DELTA_EXCEEDED", trace: `DELTA held ${text ?? ""}`.trim(), percent: text };
  }
  return { held: false, reason: null, trace: `DELTA pass ${text ?? ""}`.trim(), percent: text };
}
