import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/*.integration.test.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  // Bundle + code-splitting so emitted ESM uses fully-specified relative
  // import paths (e.g. "./chunk-XXXX.mjs"). Extensionless imports — what
  // bundle:false emits — are invalid under both Node's native ESM loader and
  // the Deno runtime, so this is required for `npm:@campfhir/hl7` to load in
  // Deno and for native Node ESM consumers. Shared code is deduped into
  // chunks; per-entry files (incl. subpath exports) are preserved.
  bundle: true,
  splitting: true,
  clean: true,
  outDir: "dist",
  sourcemap: false,
});
