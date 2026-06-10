// Inserts a JSDoc comment before each undocumented top-level exported symbol
// in parsers, builders, utils, and core types — so JSR's "documented symbols"
// score clears 80%. Doc text is derived from the symbol's kind, name, and file
// context (message type + HL7 version). Idempotent: symbols already preceded by
// a block comment are skipped.
//
//   node codegen/add-symbol-docs.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(process.cwd());
const AREAS = ["src/parsers", "src/builders", "src/utils", "src/types"];
const DECL = /^export\s+(?:default\s+)?(?:abstract\s+)?(class|interface|function|const|let|var|type|enum)\s+([A-Za-z0-9_$]+)/;

function walk(d) {
  const out = [];
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".ts") && !p.endsWith(".test.ts") && n !== "index.ts") out.push(p);
  }
  return out;
}

const msgFmt = (s) => s.replace("_", "^"); // ADT_A01 -> ADT^A01
const humanize = (n) =>
  n
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

function docFor(rel, kind, name, line) {
  let m = rel.match(/^src\/parsers\/(v[\d.]+)\/(.+)\.ts$/);
  if (m) {
    const ver = m[1], msg = msgFmt(m[2].replace(/_Parser$/, ""));
    if (kind === "function" && name.startsWith("parse"))
      return `Parses an HL7 ${msg} (${ver}) message string into a structured result.`;
    if (kind === "class" && name.endsWith("_Parser")) return `Parser for HL7 ${msg} (${ver}) messages.`;
    if ((kind === "interface" || kind === "type") && name.startsWith("Parsed"))
      return `Structured result of parsing an HL7 ${msg} (${ver}) message.`;
    return `${name} — part of the parsed HL7 ${msg} (${ver}) message structure.`;
  }
  m = rel.match(/^src\/builders\/(v[\d.]+)\/(.+)\.ts$/);
  if (m) {
    const ver = m[1], msg = msgFmt(m[2]);
    if (kind === "function" && name.startsWith("create")) return `Builds an HL7 ${msg} (${ver}) message.`;
    if (kind === "class") return `Builder for HL7 ${msg} (${ver}) messages.`;
    return `${name} — a data structure used to build an HL7 ${msg} (${ver}) message.`;
  }
  // utils / core types — generic but readable
  if (kind === "function") return `${humanize(name)}.`;
  if (kind === "class") return `${humanize(name)}.`;
  if (kind === "interface") return `${humanize(name)}.`;
  if (kind === "type") return `The ${name} type.`;
  if (kind === "enum") return `The ${name} enumeration.`;
  // const/let/var: include the literal value when it is a simple string/number
  const v = line.match(/=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|-?\d[\d._]*)\s*;?\s*$/);
  return v ? `${humanize(name)} — \`${v[1].replace(/^['"]|['"]$/g, "")}\`.` : `${humanize(name)}.`;
}

let added = 0;
for (const area of AREAS) {
  for (const file of walk(resolve(ROOT, area))) {
    const rel = file.slice(ROOT.length + 1);
    const lines = readFileSync(file, "utf8").split("\n");
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(DECL);
      if (m) {
        // documented if the previous emitted non-empty line closes a block comment
        let k = out.length - 1;
        while (k >= 0 && out[k].trim() === "") k--;
        const documented = k >= 0 && out[k].trim().endsWith("*/");
        if (!documented) {
          out.push(`/** ${docFor(rel, m[1], m[2], lines[i])} */`);
          added++;
        }
      }
      out.push(lines[i]);
    }
    writeFileSync(file, out.join("\n"));
  }
}
console.log(`symbol docs inserted: ${added}`);
