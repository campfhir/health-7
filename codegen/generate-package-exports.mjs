// Rewrites the per-version subpath entries of package.json "exports" from the
// version directories under src/. The root entry and utils entries are kept as
// they are. Run via `pnpm exports` (also part of prebuild).
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const pkgPath = resolve(ROOT, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const KINDS = ["segments", "parsers", "builders"];

const entry = (path) => ({
  require: `./dist/${path}.js`,
  import: `./dist/${path}.mjs`,
  types: `./dist/${path}.d.ts`,
});

// Compare versions numerically so v2.5 < v2.5.1 < v2.10.
const versionKey = (v) => v.slice(1).split(".").map(Number);
const byVersion = (a, b) => {
  const [x, y] = [versionKey(a), versionKey(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? -1) - (y[i] ?? -1);
    if (d) return d;
  }
  return 0;
};

const versioned = {};
for (const kind of KINDS) {
  const versions = readdirSync(resolve(ROOT, "src", kind), { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^v\d/.test(e.name))
    .map((e) => e.name)
    .sort(byVersion);
  for (const v of versions) {
    versioned[`./${kind}/${v}`] = entry(`${kind}/${v}/index`);
    versioned[`./${kind}/${v}/*`] = entry(`${kind}/${v}/*`);
  }
}

const isVersioned = (k) => KINDS.some((kind) => k.startsWith(`./${kind}/`));
const kept = Object.entries(pkg.exports).filter(([k]) => !isVersioned(k));
const root = kept.filter(([k]) => k === ".");
const rest = kept.filter(([k]) => k !== ".");
pkg.exports = Object.fromEntries([...root, ...Object.entries(versioned), ...rest]);

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`wrote package.json exports (${Object.keys(pkg.exports).length} entries)`);
