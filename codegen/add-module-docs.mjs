// Inserts a JSDoc module doc at the top of every JSR entrypoint that lacks one.
// Entrypoints are read from deno.json `exports`. The doc text is derived from the
// file's path (segment name / message type / version), so it is deterministic and
// re-runnable (idempotent: files already starting with `/**` are skipped).
//
//   node codegen/add-module-docs.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const exportsMap = JSON.parse(readFileSync(resolve(ROOT, "deno.json"), "utf8")).exports;

// "ADT_A01" -> "ADT^A01" (HL7 trigger-event notation)
const msgType = (name) => name.replace(/_Parser$/, "").replace("_", "^");
const verLabel = (v) => `HL7 ${v.replace(/^v/, "v")}`;

function moduleDoc(relPath) {
  // relPath like "src/segments/v2.5.1/PID.ts" or "src/parsers/v2.3/index.ts"
  const m = relPath.match(/^src\/(segments|parsers|builders)\/(v[\d.]+)\/(.+)\.ts$/);
  if (m) {
    const [, kind, ver, file] = m;
    if (file === "index") {
      const noun = { segments: "segment classes", parsers: "message parsers", builders: "message builders" }[kind];
      return `Barrel re-exporting all ${verLabel(ver)} ${noun}.`;
    }
    if (kind === "segments") return `${file} segment definition for ${verLabel(ver)}.`;
    if (kind === "parsers") return `Parser for ${msgType(file)} messages (${verLabel(ver)}).`;
    if (kind === "builders") return `Builder for ${msgType(file)} messages (${verLabel(ver)}).`;
  }
  return null;
}

// Resolve entrypoint specifiers ("./src/...") to repo-relative paths, dedupe.
const files = [...new Set(Object.values(exportsMap).map((p) => p.replace(/^\.\//, "")))];

let changed = 0, skipped = 0;
for (const rel of files) {
  if (rel === "src/index.ts") continue; // root gets a hand-written package doc
  const abs = resolve(ROOT, rel);
  const src = readFileSync(abs, "utf8");
  if (src.trimStart().startsWith("/**")) { skipped++; continue; } // already documented
  const summary = moduleDoc(rel);
  if (!summary) { skipped++; continue; }
  const doc = `/**\n * ${summary}\n *\n * @module\n */\n`;
  writeFileSync(abs, doc + src);
  changed++;
}
console.log(`module docs added: ${changed}, skipped (already documented / no rule): ${skipped}`);
