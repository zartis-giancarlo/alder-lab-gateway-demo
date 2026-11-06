// Rule store: the live limit, one pending proposal and the history of limit changes. Story ALGW-3.
import { canApprove } from "./Access/roles.js";

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

export function createRuleStore(initial) {
  let live = { limitPercent: initial.limitPercent, windowDays: initial.windowDays };
  let pending = null;
  const history = [];
  const now = () => new Date().toISOString();

  return {
    current: () => ({ ...live }),
    pending: () => (pending ? { ...pending } : null),
    history: () => history.map((entry) => ({ ...entry })),

    propose(user, limitPercent, reason, at = now()) {
      if (!Number.isFinite(limitPercent) || limitPercent <= 0) fail("BAD_LIMIT", "The limit must be a number above 0.");
      if (pending) fail("ALREADY_PENDING", "A proposal is already waiting for approval.");
      pending = { proposer: user, limitPercent, reason: reason ?? "", proposedAt: at };
    },

    approve(user, at = now()) {
      if (!pending) fail("NO_PENDING", "There is nothing to approve.");
      if (!canApprove(user)) fail("NOT_AUTHORISED", `${user} does not have the rule approver role.`);
      if (user === pending.proposer) fail("SELF_APPROVAL", "The proposer cannot approve their own change.");
      history.push({
        oldValue: live.limitPercent,
        newValue: pending.limitPercent,
        proposer: pending.proposer,
        approver: user,
        proposedAt: pending.proposedAt,
        approvedAt: at,
        reason: pending.reason,
      });
      live = { ...live, limitPercent: pending.limitPercent };
      pending = null;
    },
  };
}
