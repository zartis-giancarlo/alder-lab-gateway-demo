// Restricted area. A person who reviews access rules must review every change here.
// Synthetic users only.
const ROLES = {
  "BIO-A": ["biologist", "rule approver"],
  "BIO-B": ["biologist", "rule approver"],
  "QM-A": ["quality manager", "rule approver"],
  "DEV-A": ["developer"],
};

export function hasRole(user, role) {
  return (ROLES[user] ?? []).includes(role);
}

export function canApprove(user) {
  return hasRole(user, "rule approver");
}

export const USERS = Object.keys(ROLES);
