/**
 * Generates the HL7 v2.3 segment classes that have no hand-written implementation yet.
 *
 * The field lists come from codegen/spec/v2.3-segments.json (the Caristix HL7 v2.3 segment
 * tables). Every file that already exists in src/segments/v2.3/ is left alone, so a segment
 * can be replaced by a hand-written class at any time and the generator will not touch it again.
 *
 * Generated setters take raw HL7 values (SegmentFieldValue). Repeating fields take one argument per repetition (or an array of them).
 * one entry per repetition. Composite and coded types are not modelled beyond that; they can be
 * given hand-written helpers later.
 *
 * Usage:
 *   npx tsx codegen/generate-v23-segments.ts [--dry-run]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

interface SpecField {
  seq: number;
  name: string;
  length: string;
  type: string;
  opt: string;
  rep: string;
  table: string;
}
interface SpecSegment {
  title: string;
  fields: SpecField[];
}

const ROOT = join(fileURLToPath(import.meta.url), "../..");
const SEG_DIR = join(ROOT, "src/segments/v2.3");
const DRY_RUN = process.argv.includes("--dry-run");

const spec: Record<string, SpecSegment> = JSON.parse(
  readFileSync(join(ROOT, "codegen/spec/v2.3-segments.json"), "utf8"),
);

/** Names a class already uses for its own members. A field with one of these names gets `field<seq>`. */
const RESERVED = new Set(["name", "fields", "encode", "parse", "constructor", "encoding"]);

const OPT: Record<string, string> = { R: "required", O: "optional", C: "conditional", B: "backward compatibility" };

/** Drops a leading or trailing " - SEG" label from a spec field name. */
function plainName(fieldName: string): string {
  return fieldName
    .replace(/^[A-Z][A-Z0-9]{1,3}\s*-\s*/, "")
    .replace(/\s*-\s*[A-Z][A-Z0-9]{1,3}$/, "");
}

/** Turns a spec field name into a camelCase setter name. */
export function setterName(fieldName: string, seq: number): string {
  const stripped = plainName(fieldName);
  const words = stripped.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length === 0) return `field${seq}`;
  const [first, ...rest] = words;
  let name =
    first.toLowerCase() + rest.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
  if (/^\d/.test(name)) name = `f${name}`;
  if (RESERVED.has(name)) name = `field${seq}`;
  return name;
}

function assignSetterNames(fields: SpecField[]): Map<number, string> {
  const names = new Map<number, string>();
  const seen = new Set<string>();
  for (const f of fields) {
    let name = setterName(f.name, f.seq);
    if (seen.has(name)) name = `${name}${f.seq}`;
    seen.add(name);
    names.set(f.seq, name);
  }
  return names;
}

function isRepeating(f: SpecField): boolean {
  return f.rep !== "-" && f.rep !== "";
}

/**
 * Composite datatypes with a typed component object in utils/composites.ts. A string passed for one of
 * these sets the first component; the typed object sets each component in its HL7 position.
 */
const COMPOSITES: Record<string, { type: string; parts: string }> = {
  CE: { type: "CE", parts: "ceParts" },
  CWE: { type: "CodedElement", parts: "cweParts" },
  CX: { type: "CX", parts: "cxParts" },
  XCN: { type: "XCN", parts: "xcnParts" },
  XPN: { type: "XPN", parts: "xpnParts" },
  XAD: { type: "XAD", parts: "xadParts" },
  XTN: { type: "XTN", parts: "xtnParts" },
  EI: { type: "EI", parts: "eiParts" },
  PI: { type: "PI", parts: "piParts" },
  PL: { type: "PL", parts: "plParts" },
  CP: { type: "CP", parts: "cpParts" },
  PLN: { type: "PLN", parts: "plnParts" },
  LA2: { type: "LA2", parts: "la2Parts" },
};

/** The argument type and the field expression for one value of this field. */
function valueOf(f: SpecField, arg: string): { type: string; field: string } {
  const c = COMPOSITES[f.type];
  if (!c) return { type: "string", field: arg };
  return {
    type: `string | ${c.type}`,
    field: `typeof ${arg} === "string" ? ${arg} : components(${c.parts}(${arg}))`,
  };
}

function setterFor(code: string, f: SpecField, method: string): string {
  const index = f.seq - 1;
  const repeat = isRepeating(f) ? ", repeating" : "";
  const doc = `  /** ${code}-${f.seq} ${plainName(f.name)} (${f.type}, max ${f.length}, ${OPT[f.opt] ?? f.opt}${repeat}) (chainable). */`;
  if (isRepeating(f)) {
    const v = valueOf(f, "v");
    return `${doc}
  ${method}(...values: Repeated<${v.type}>[]): this {
    this.fields[${index}] = this.createRepeatingField(repetitions(values).map((v) => this.createField(${v.field})));
    return this;
  }`;
  }
  const v = valueOf(f, "value");
  return `${doc}
  ${method}(value: ${v.type}): this {
    this.fields[${index}] = this.createField(${v.field});
    return this;
  }`;
}

function classSource(code: string, seg: SpecSegment): string {
  const names = assignSetterNames(seg.fields);
  const repeats = seg.fields.some(isRepeating);
  const importNames = ["BaseSegment", ...(repeats ? ["repetitions", "type Repeated"] : [])].slice(1).map((n) => `, ${n}`).join("");
  const setters = seg.fields.map((f) => setterFor(code, f, names.get(f.seq)!)).join("\n\n");
  // Composite helpers this class uses: the part builders, their types, and components().
  const used = [...new Set(seg.fields.map((f) => COMPOSITES[f.type]).filter(Boolean))];
  const compositeNames = used.length
    ? [...new Set(["components", ...used.map((c) => c.parts), ...used.map((c) => `type ${c.type}`)])]
    : [];
  const compositeImport = compositeNames.length
    ? `import { ${compositeNames.join(", ")} } from "../../utils/composites.ts";`
    : "";
  return `/**
 * ${code} segment definition for HL7 v2.3.
 *
 * Generated by codegen/generate-v23-segments.ts from codegen/spec/v2.3-segments.json. A composite
 * field takes a string (sets its first component) or the typed object from utils/composites.ts.
 * Replace this file with a hand-written class to add typed helpers, and the generator will leave it alone.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment${importNames} } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
${compositeImport}

/**
 * ${code} - ${seg.title} (HL7 v2.3)
 */
export class ${code} extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "${code}";

  constructor() {
    super();
    this.fields = [];
  }

${setters}

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<${code}> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "${code}") {
      return { ok: false, err: new Err(\`Expected ${code} segment, got \${parts[0]}\`) };
    }
    const seg = new ${code}();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
`;
}

// The segments the generator must create are the spec segments with no file in src/segments/v2.3.
const created: string[] = [];
for (const [code, seg] of Object.entries(spec)) {
  const file = join(SEG_DIR, `${code}.ts`);
  if (existsSync(file)) continue;
  created.push(code);
  if (DRY_RUN) {
    console.log(`would write ${code}.ts`);
    continue;
  }
  writeFileSync(file, classSource(code, seg));
  console.log(`wrote   src/segments/v2.3/${code}.ts`);
}
console.log(`\n${DRY_RUN ? "Would create" : "Created"} ${created.length} segment(s).`);
