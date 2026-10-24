// Bumps the version of one workspace package and prints the new version.
//
//   node .github/scripts/bump-version.mjs <package> <patch|minor|major|x.y.z>
//
// <package> is the folder under packages/ (e.g. "hl7") or the npm name (e.g. "@campfhir/hl7").
// Only that package's package.json is edited (two-space indent, trailing newline).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findPackage } from "./packages.mjs";

const [spec, arg] = process.argv.slice(2);
if (!spec || !arg) {
  console.error("Usage: bump-version.mjs <package> <patch|minor|major|x.y.z>");
  process.exit(1);
}

const file = join(findPackage(spec).dir, "package.json");
const pkg = JSON.parse(readFileSync(file, "utf8"));
const current = /^(\d+)\.(\d+)\.(\d+)$/.exec(pkg.version);
if (!current) {
  console.error(`Unsupported current version "${pkg.version}" (expected x.y.z)`);
  process.exit(1);
}
const [major, minor, patch] = current.slice(1).map(Number);

let next;
if (arg === "patch") next = `${major}.${minor}.${patch + 1}`;
else if (arg === "minor") next = `${major}.${minor + 1}.0`;
else if (arg === "major") next = `${major + 1}.0.0`;
else if (/^\d+\.\d+\.\d+$/.test(arg)) next = arg;
else {
  console.error("Usage: bump-version.mjs <package> <patch|minor|major|x.y.z>");
  process.exit(1);
}

if (next === pkg.version) {
  console.error(`${pkg.name} is already at ${next}`);
  process.exit(1);
}

pkg.version = next;
writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
console.log(next);
