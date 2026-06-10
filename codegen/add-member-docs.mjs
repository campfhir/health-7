// Adds JSDoc to undocumented class/interface MEMBERS (methods, properties),
// using `deno doc --lint`'s own diagnostics as the exact insertion map — so we
// only touch members JSR considers undocumented, never guess at scope.
//
// Usage:
//   deno doc --lint <entrypoints...> 2>&1 | sed 's/\x1b\[[0-9;]*m//g' > /tmp/docdiag.txt
//   node codegen/add-member-docs.mjs /tmp/docdiag.txt
import { readFileSync, writeFileSync } from "node:fs";

const diag = readFileSync(process.argv[2], "utf8").split("\n");

// Collect file:line for every `missing-jsdoc` diagnostic (ignore other kinds).
const targets = {}; // path -> Set(line)
let kind = null;
for (const l of diag) {
  const k = l.match(/error\[([a-z-]+)\]/);
  if (k) { kind = k[1]; continue; }
  const at = l.match(/-->\s+(\/.+):(\d+):(\d+)\s*$/);
  if (at && kind === "missing-jsdoc") {
    const [, path, line] = at;
    (targets[path] ??= new Set()).add(Number(line));
  }
}

const humanize = (n) =>
  n.replace(/_/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").toLowerCase();

function docFor(raw) {
  const t = raw.trim();
  const m = t.match(/^(?:public |private |protected |static |readonly |override |abstract |declare |get |set |async )*([A-Za-z0-9_$]+)/);
  const name = m?.[1];
  if (!name) return "Member.";
  const isMethod = new RegExp(`${name}\\s*[<(]`).test(t);
  const returnsThis = /\)\s*:\s*this[\s;{]/.test(t) || /:\s*this[\s;{]/.test(t);
  if (name === "parse") return "Parses the input string into a structured instance.";
  if (name === "encode") return "Encodes this message to its HL7 wire string.";
  if (name === "verify") return "Validates the message structure, returning a result.";
  if (name === "build") return "Builds and returns the assembled message.";
  if (name === "name") return "The HL7 segment identifier.";
  if (name === "getEncoding") return "Returns the encoding characters for this segment.";
  if (isMethod && returnsThis) return `Sets the ${humanize(name)} field (chainable).`;
  if (isMethod) return `${humanize(name).replace(/^./, (c) => c.toUpperCase())}.`;
  return `The ${humanize(name)} value.`;
}

let total = 0;
for (const [path, lineSet] of Object.entries(targets)) {
  const lines = readFileSync(path, "utf8").split("\n");
  // insert bottom-up so earlier line numbers stay valid
  for (const ln of [...lineSet].sort((a, b) => b - a)) {
    const idx = ln - 1;
    const raw = lines[idx];
    if (raw == null) continue;
    const indent = raw.match(/^\s*/)[0];
    lines.splice(idx, 0, `${indent}/** ${docFor(raw)} */`);
    total++;
  }
  writeFileSync(path, lines.join("\n"));
}
console.log(`member docs inserted: ${total} across ${Object.keys(targets).length} files`);
