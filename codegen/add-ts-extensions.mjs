// One-shot codemod: rewrite relative import/export specifiers in publishable
// source to carry explicit `.ts` extensions, as required by Deno/JSR.
//   - extensionless  "./foo"     -> "./foo.ts"
//   - js-extension    "./foo.js"  -> "./foo.ts"   (only when foo.ts exists)
// Each rewrite is verified against the filesystem, so ambiguous or already
// correct specifiers (".json", real ".js", "/index.ts") are left untouched.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const ROOT = resolve(process.cwd(), "src");
const SPEC_RE = /(\bfrom\s*|\bimport\s*\(\s*)(['"])(\.\.?\/[^'"]+)\2/g;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".ts")) out.push(p);
  }
  return out;
}

function resolveSpec(fileDir, spec) {
  if (/\.(ts|tsx|json)$/.test(spec)) return null; // already explicit
  const base = spec.endsWith(".js") ? spec.slice(0, -3) : spec;
  const abs = resolve(fileDir, base);
  if (existsSync(abs + ".ts")) return base + ".ts";
  if (existsSync(abs + ".tsx")) return base + ".tsx";
  if (existsSync(join(abs, "index.ts"))) return base + "/index.ts";
  if (spec.endsWith(".js") && existsSync(abs + ".js")) return null; // genuine .js
  return undefined; // unresolved
}

let changed = 0, edits = 0;
const warnings = [];
for (const file of walk(ROOT)) {
  const dir = dirname(file);
  const src = readFileSync(file, "utf8");
  const next = src.replace(SPEC_RE, (m, pre, q, spec) => {
    const r = resolveSpec(dir, spec);
    if (r === null) return m;
    if (r === undefined) { warnings.push(`${file}: unresolved ${spec}`); return m; }
    edits++;
    return `${pre}${q}${r}${q}`;
  });
  if (next !== src) { writeFileSync(file, next); changed++; }
}
console.log(`files changed: ${changed}, specifiers rewritten: ${edits}`);
if (warnings.length) { console.log("WARNINGS:"); warnings.forEach((w) => console.log("  " + w)); }
