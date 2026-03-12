import base from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
];
