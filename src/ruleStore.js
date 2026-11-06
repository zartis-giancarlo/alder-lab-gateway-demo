// Rule store: the live limit, one pending proposal and the history of limit changes.
//
// Story ALGW-3. NOT BUILT YET: the agent builds this in step 4.
//
// createRuleStore(initial) returns { current, pending, history, propose, approve }.
export function createRuleStore(initial) {
  const notBuilt = () => {
    const error = new Error("The rule store is not built yet (story ALGW-3).");
    error.code = "NOT_BUILT";
    throw error;
  };
  return {
    current: () => ({ limitPercent: initial.limitPercent, windowDays: initial.windowDays }),
    pending: () => null,
    history: () => [],
    propose: notBuilt,
    approve: notBuilt,
  };
}
