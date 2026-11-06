import test from "node:test";
import assert from "node:assert/strict";
import { deltaCheck } from "../../src/delta.js";

const rule = { limitPercent: 25, windowDays: 14 };
const now = "2026-11-12T10:00:00Z";
const threeDaysAgo = "2026-11-09T09:00:00Z";
const twentyDaysAgo = "2026-10-23T09:00:00Z";
const prev = (value, unit = "umol/L", at = threeDaysAgo) => ({ value, unit, at });
const cur = (value, unit = "umol/L") => ({ value, unit });
const check = (previous, current) => deltaCheck({ previous, current, rule, now });

test("N1 a change of +12.5 % passes the delta check", () => {
  const r = check(prev(80), cur(90));
  assert.equal(r.held, false);
  assert.equal(r.reason, null);
  assert.equal(r.trace, "DELTA pass +12.5 %");
});

test("N2 a change of +37.5 % is held with DELTA_EXCEEDED", () => {
  const r = check(prev(80), cur(110));
  assert.equal(r.held, true);
  assert.equal(r.reason, "DELTA_EXCEEDED");
  assert.equal(r.percent, "+37.5 %");
});

test("N3 a decrease of 33.3 % is held too", () => {
  const r = check(prev(120), cur(80));
  assert.equal(r.held, true);
  assert.equal(r.reason, "DELTA_EXCEEDED");
  assert.equal(r.percent, "-33.3 %");
});

test("E1 no previous result: NO_HISTORY, not held by this rule", () => {
  const r = check(null, cur(85));
  assert.equal(r.held, false);
  assert.equal(r.trace, "NO_HISTORY");
});

test("E2 previous result outside the window: OUT_OF_WINDOW, not held by this rule", () => {
  const r = check(prev(80, "umol/L", twentyDaysAgo), cur(140));
  assert.equal(r.held, false);
  assert.equal(r.trace, "OUT_OF_WINDOW");
});

test("E3 a change of exactly +25.0 % passes, +26.25 % is held (strictly greater)", () => {
  const atLimit = check(prev(80), cur(100));
  assert.equal(atLimit.held, false);
  const over = check(prev(80), cur(101));
  assert.equal(over.held, true);
  assert.equal(over.reason, "DELTA_EXCEEDED");
});

test("E4 a unit mismatch is held with UNIT_MISMATCH and never compared", () => {
  const r = check(prev(0.9, "mg/dL"), cur(80, "umol/L"));
  assert.equal(r.held, true);
  assert.equal(r.reason, "UNIT_MISMATCH");
});
