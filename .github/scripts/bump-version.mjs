// Bumps the version in package.json and prints the new version.
//
//   node .github/scripts/bump-version.mjs <patch|minor|major|x.y.z>
//
// package.json is edited in place (two-space indent, trailing newline, like the committed
// file); nothing else is touched, so the stale package-lock.json is left alone.
import { readFileSync, writeFileSync } from "node:fs";

const arg = process.argv[2];
const file = "package.json";
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
else if (arg && /^\d+\.\d+\.\d+$/.test(arg)) next = arg;
else {
  console.error("Usage: bump-version.mjs <patch|minor|major|x.y.z>");
  process.exit(1);
}

if (next === pkg.version) {
  console.error(`Version is already ${next}`);
  process.exit(1);
}

pkg.version = next;
writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
console.log(next);
