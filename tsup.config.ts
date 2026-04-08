import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/*.integration.test.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  bundle: false,
  clean: true,
  outDir: "dist",
  sourcemap: false,
});
