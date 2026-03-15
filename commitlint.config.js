/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Allow longer subjects for this monorepo (default is 72)
    "subject-max-length": [1, "always", 100],
    // Scope is optional but must be lowercase if used
    "scope-case": [2, "always", "lower-case"],
  },
};
