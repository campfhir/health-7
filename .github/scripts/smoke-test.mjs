// Loads every built entry point of each package (or of the packages named as arguments) with
// both CommonJS require() and native ESM import(), so a broken "exports" map or an
// extensionless ESM import fails CI instead of a consumer.
//
//   node .github/scripts/smoke-test.mjs [package ...]
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { findPackage, listPackages } from "./packages.mjs";

const selected = process.argv.slice(2);
const packages = selected.length ? selected.map(findPackage) : listPackages();

let failures = 0;
for (const pkg of packages) {
  const require = createRequire(join(pkg.dir, "package.json"));
  let loaded = 0;
  for (const [subpath, target] of Object.entries(pkg.exports ?? {})) {
    if (subpath.includes("*")) continue; // wildcard entries are covered by the barrels
    const entries = typeof target === "string" ? { require: target } : target;
    for (const [condition, rel] of Object.entries(entries)) {
      if (condition === "types") continue;
      const file = join(pkg.dir, rel);
      try {
        if (!existsSync(file)) throw new Error("file is missing (did the build run?)");
        if (condition === "require") require(file);
        else if (condition === "import") await import(pathToFileURL(file).href);
        else continue;
        loaded++;
      } catch (err) {
        failures++;
        console.error(`FAIL ${pkg.name} ${subpath} (${condition} -> ${rel}): ${err.message}`);
      }
    }
  }
  console.log(`${pkg.name}: loaded ${loaded} entry points`);
}
if (failures) {
  console.error(`${failures} entry point(s) failed to load`);
  process.exit(1);
}
