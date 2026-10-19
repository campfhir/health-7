/**
 * Cross-checks codegen/spec/v2.3-segments.json against HAPI's HL7 v2.3 segment classes.
 *
 * HAPI is dual licensed (MPL 1.1 / GPL). This script reads only the field definitions
 * (datatype, required flag, repeat count, length, name) from HAPI's generated segment classes
 * and reports differences. It does not copy HAPI code into this repository.
 *
 * Usage:
 *   git clone https://github.com/hapifhir/hapi-hl7v2 <dir>   (or any checkout)
 *   node codegen/validate/hapi-v23.mjs <dir>/hapi-structures-v23/src/main/java/ca/uhn/hl7v2/model/v23/segment
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const segmentDir = process.argv[2];
if (!segmentDir) {
  console.error("Pass the HAPI v2.3 segment source directory (see the header comment).");
  process.exit(1);
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const ours = JSON.parse(readFileSync(join(ROOT, "codegen/spec/v2.3-segments.json"), "utf8"));

const ADD = /this\.add\((\w+)\.class,\s*(true|false),\s*(-?\d+),\s*(-?\d+),\s*new Object\[\]\{[^}]*\},\s*"((?:[^"\\]|\\.)*)"\)/g;
const hapi = {};
for (const file of readdirSync(segmentDir).filter((f) => f.endsWith(".java"))) {
  const fields = [...readFileSync(join(segmentDir, file), "utf8").matchAll(ADD)].map((m) => ({
    type: m[1],
    required: m[2] === "true",
    reps: Number(m[3]), // 1 = not repeating; 0 or -1 = unbounded; N = maximum repeats
    length: Number(m[4]),
    name: m[5],
  }));
  if (fields.length) hapi[file.replace(/\.java$/, "")] = fields;
}

// Naming-only differences (legacy 2.3 datatype names) are not reported.
const sameType = (a, b) => {
  const norm = (t) => t.replace(/_\d+$/, "").replace(/^CN$/, "XCN").replace(/^TN$/, "XTN").replace(/^AD$/, "XAD")
    .replace(/^CM_LA1$/, "LA1").replace(/^VARIES$/i, "VARIES");
  return norm(a) === norm(b) || (["LA1", "LA2"].includes(norm(a)) && ["LA1", "LA2"].includes(norm(b)));
};

const report = { count: [], type: [], repeat: [], required: [] };
for (const [code, seg] of Object.entries(ours)) {
  const h = hapi[code];
  if (!h) { report.count.push(`${code}: not in HAPI`); continue; }
  if (h.length !== seg.fields.length) {
    report.count.push(`${code}: spec ${seg.fields.length}, HAPI ${h.length}`);
    continue;
  }
  seg.fields.forEach((f, i) => {
    const hf = h[i];
    const at = `${code}-${f.seq}`;
    if (!sameType(f.type, hf.type)) report.type.push(`${at}: spec ${f.type}, HAPI ${hf.type}`);
    if ((f.rep !== "-") !== (hf.reps !== 1)) report.repeat.push(`${at}: spec ${f.rep}, HAPI reps ${hf.reps}`);
    if ((f.opt === "R") !== hf.required) report.required.push(`${at}: spec ${f.opt}, HAPI required ${hf.required}`);
  });
}

for (const [section, rows] of Object.entries(report)) {
  console.log(`## ${section}: ${rows.length}`);
  for (const row of rows) console.log(`  ${row}`);
}
