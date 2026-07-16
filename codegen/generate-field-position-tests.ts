/**
 * Field-position test generator.
 *
 * Reads each hand-written segment source under src/segments/<version>/, extracts
 * every setter and the `this.fields[N]` index it writes, and emits a
 * PV1.test.ts-style field-position test asserting each value encodes into the
 * correct field. Segments that already have a hand-written <SEG>.test.ts are
 * skipped (so richer hand-written tests like PV1.test.ts are preserved).
 *
 * Usage:
 *   pnpm test:positions            # write test files
 *   pnpm test:positions --dry-run  # list files without writing
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateFieldPositionTest,
  type FieldPositionSetter,
} from "./generators/fieldPositionTest.ts";

const ROOT = join(fileURLToPath(import.meta.url), "../..");
const DRY_RUN = process.argv.includes("--dry-run");

// Versions whose segments are hand-written (have their own setters). Derived
// versions inherit setters from their base, so they need no separate tests.
const VERSIONS = ["v2.3"];

// Method names that are not field setters even though they touch this.fields.
const NON_SETTERS = new Set([
  "if", "for", "while", "switch", "catch", "function", "map", "forEach", "constructor",
]);

const ACRONYMS = new Set([
  "id", "ssn", "dea", "hic", "ub1", "ub2", "ub82", "ub92", "cx", "url", "dob",
]);

/** camelCase method name -> "Title Case" field label. */
function toFieldName(method: string): string {
  return method
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .map((w) => {
      const lower = w.toLowerCase();
      if (ACRONYMS.has(lower)) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ")
    .replace(/\bId\b/g, "ID");
}

/**
 * Given the line index of a `method(` signature, return the number of leading
 * required arguments (params that are not optional `?`, defaulted `=`, or rest
 * `...`). Handles multi-line signatures. Callers pass at least one arg so
 * value-only rest/optional setters still exercise the field.
 */
function requiredArgCount(lines: string[], sigLine: number): number {
  // Accumulate from the first '(' until parens balance to zero.
  let depth = 0;
  let started = false;
  let buf = "";
  for (let i = sigLine; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === "(") {
        depth++;
        started = true;
        if (depth === 1) continue; // skip the outer '('
      } else if (ch === ")") {
        depth--;
        if (depth === 0) {
          started = false;
          break;
        }
      }
      if (started) buf += ch;
    }
    if (started === false && depth === 0 && buf.length) break;
  }
  const paramList = buf.trim();
  if (!paramList) return 0;
  // Split params at top-level commas (depth tracks nested <>, (), [], {}).
  const params: string[] = [];
  let d = 0;
  let cur = "";
  for (const ch of paramList) {
    if ("<([{".includes(ch)) d++;
    else if (">)]}".includes(ch)) d--;
    if (ch === "," && d === 0) {
      params.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) params.push(cur);
  let required = 0;
  for (const p of params) {
    const name = p.split(":")[0].trim();
    const optional = name.endsWith("?") || p.includes("=") || name.startsWith("...");
    if (optional) break; // required params always precede optional ones
    required++;
  }
  return required;
}

/** Extract (method -> fields[index]) setters from a segment source file. */
function extractSetters(src: string, isMSH: boolean): FieldPositionSetter[] {
  const lines = src.split("\n");
  const seen = new Set<string>();
  const setters: FieldPositionSetter[] = [];
  for (let i = 0; i < lines.length; i++) {
    const fm = lines[i].match(/this\.fields\[(\d+)\]\s*=\s*this\.createField/);
    if (!fm) continue;
    const index = Number(fm[1]);
    let method = "";
    let sigLine = -1;
    for (let j = i; j >= Math.max(0, i - 12); j--) {
      const nm = lines[j].match(/^\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\(/);
      if (nm && !NON_SETTERS.has(nm[1])) {
        method = nm[1];
        sigLine = j;
        break;
      }
    }
    if (!method) continue;
    const key = `${method}|${index}`;
    if (seen.has(key)) continue; // if/else branches write the same field twice
    seen.add(key);
    setters.push({
      method,
      index,
      hl7Field: isMSH ? index + 2 : index + 1,
      fieldName: toFieldName(method),
      argCount: Math.max(1, requiredArgCount(lines, sigLine)),
    });
  }
  return setters;
}

let written = 0;
let skipped = 0;
for (const version of VERSIONS) {
  const dir = join(ROOT, "src/segments", version);
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && f !== "index.ts")
    .sort();

  for (const file of files) {
    const segName = file.slice(0, -3);
    const testPath = join(dir, `${segName}.test.ts`);
    if (existsSync(testPath)) {
      console.log(`skip   src/segments/${version}/${segName}.test.ts  (hand-written)`);
      skipped++;
      continue;
    }
    const src = readFileSync(join(dir, file), "utf8");
    const setters = extractSetters(src, segName === "MSH");
    if (setters.length === 0) {
      console.log(`note   ${segName} has no field setters — no test generated`);
      continue;
    }
    const content = generateFieldPositionTest({ segName, version, setters });
    if (DRY_RUN) {
      console.log(`[dry-run] src/segments/${version}/${segName}.test.ts  (${setters.length} setters)`);
      continue;
    }
    writeFileSync(testPath, content, "utf8");
    console.log(`wrote  src/segments/${version}/${segName}.test.ts  (${setters.length} setters)`);
    written++;
  }
}

console.log(`\nDone. ${written} written, ${skipped} skipped.`);
