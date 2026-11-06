import test from "node:test";
import assert from "node:assert/strict";
import { createRuleStore } from "../../src/ruleStore.js";

const initial = { limitPercent: 25, windowDays: 14 };

test("N4 a limit change stays pending, then goes live after a second person approves", () => {
  const store = createRuleStore(initial);
  store.propose("BIO-A", 30, "Test value", "2026-11-12T10:00:00Z");
  assert.equal(store.current().limitPercent, 25);
  assert.equal(store.pending().limitPercent, 30);
  store.approve("BIO-B", "2026-11-12T10:05:00Z");
  assert.equal(store.current().limitPercent, 30);
  assert.equal(store.pending(), null);
  const [entry] = store.history();
  assert.equal(entry.oldValue, 25);
  assert.equal(entry.newValue, 30);
  assert.equal(entry.proposer, "BIO-A");
  assert.equal(entry.approver, "BIO-B");
  assert.equal(entry.proposedAt, "2026-11-12T10:00:00Z");
  assert.equal(entry.approvedAt, "2026-11-12T10:05:00Z");
});

test("N4 the proposer cannot approve their own change", () => {
  const store = createRuleStore(initial);
  store.propose("BIO-A", 30, "Test value");
  assert.throws(() => store.approve("BIO-A"), { code: "SELF_APPROVAL" });
  assert.equal(store.current().limitPercent, 25);
});

test("N4 only a user with the rule approver role can approve", () => {
  const store = createRuleStore(initial);
  store.propose("BIO-A", 30, "Test value");
  assert.throws(() => store.approve("DEV-A"), { code: "NOT_AUTHORISED" });
  assert.equal(store.current().limitPercent, 25);
});

test("N4 approving with nothing pending is refused", () => {
  const store = createRuleStore(initial);
  assert.throws(() => store.approve("BIO-B"), { code: "NO_PENDING" });
});
