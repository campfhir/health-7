import js from "@eslint/js";
import tseslint from "typescript-eslint";

// One lint config for every package under packages/*.
export default tseslint.config(
  {
    ignores: [
      "**/dist/",
      "**/node_modules/",
      "**/examples/",
      "**/codegen/",
      ".github/",
      "**/*.config.*",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.test.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
);
