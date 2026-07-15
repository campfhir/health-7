// Generates deno.json for JSR publishing. The JSR `exports` map mirrors the
// public subpaths declared in package.json, but JSR does not support npm-style
// wildcard exports, so every group barrel and per-segment/parser/builder module
// is enumerated explicitly. Re-run after adding new segments/parsers/builders:
//   node codegen/generate-deno-json.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));

const GROUPS = [
  "segments/v2.3",
  "segments/v2.5.1",
  "parsers/v2.3",
  "parsers/v2.5.1",
  "builders/v2.3",
  "builders/v2.5.1",
];

// Individually exported utils. Not the whole utils/ directory — only modules
// intended as public API get a subpath (e.g. err.ts stays internal).
const UTILS = ["dateUtils"];

const exportsMap = { ".": "./src/index.ts" };
for (const group of GROUPS) {
  exportsMap[`./${group}`] = `./src/${group}/index.ts`;
  const dir = resolve(ROOT, "src", group);
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts" && !f.endsWith(".test.ts"))
    .sort();
  for (const f of files) {
    const name = f.slice(0, -3);
    exportsMap[`./${group}/${name}`] = `./src/${group}/${f}`;
  }
}
for (const name of UTILS) {
  exportsMap[`./utils/${name}`] = `./src/utils/${name}.ts`;
}

const denoJson = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  license: pkg.license,
  exports: exportsMap,
  publish: {
    // dist/ and node_modules/ are already excluded via .gitignore.
    exclude: [
      "**/*.test.ts",
      "**/*.integration.test.ts",
      "__tests__",
      "examples",
      "codegen",
      "docs",
      "logs",
      "excel-to-hl7",
      "*.tgz",
    ],
  },
};

writeFileSync(resolve(ROOT, "deno.json"), JSON.stringify(denoJson, null, 2) + "\n");
console.log(`deno.json written: ${Object.keys(exportsMap).length} export entries`);
