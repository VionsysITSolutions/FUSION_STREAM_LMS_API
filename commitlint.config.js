module.exports = {
  extends: ["@commitlint/cli", "@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // for new feature
        "fix", //  fix bug
        "docs", // documentation
        "style", // css
        "refactor", // for refactoring
        "perf", // performance
        "test", // test
        "revert", // core revert from github
        "build", // project build
        "ci", // ci-cd pipeline
        "chore", //dependency update
      ],
    ],
    "subject-case": [2, "always", "sentence-case"],
  },
};
