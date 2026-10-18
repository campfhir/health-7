/**
 * HL7 Mapper Code Generator
 *
 * Generates segment wrappers, parser stubs, and builder stubs for all
 * registered HL7 versions. Driven entirely by the schemas/ directory.
 *
 * Usage:
 *   pnpm codegen           # generate everything
 *   pnpm codegen --dry-run # print files without writing
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { VersionConfig, ParserConfig, BuilderConfig } from "./types.ts";
import type {
  VersionSchema,
  MessageSchema,
  SegmentDefinition,
  SegmentGroup,
} from "../src/types/schema.ts";
import { isSegmentGroup } from "../src/types/schema.ts";
import { V2_3 } from "./schemas/v2.3/version.ts";
import { V2_3_1 } from "./schemas/v2.3.1/version.ts";
import { V2_4 } from "./schemas/v2.4/version.ts";
import { V2_5 } from "./schemas/v2.5/version.ts";
import { V2_5_1 } from "./schemas/v2.5.1/version.ts";
import { generateSegment } from "./generators/segment.ts";
import { generateBaseParser } from "./generators/baseParser.ts";
import { generateParser } from "./generators/parser.ts";
import { generateBuilder } from "./generators/builder.ts";
import { generateWrapperParser } from "./generators/wrapperParser.ts";
import { generateWrapperBuilder } from "./generators/wrapperBuilder.ts";
import { generateReexport, REEXPORT_MARKER } from "./generators/reexport.ts";

const ROOT = join(fileURLToPath(import.meta.url), "../..");
const DRY_RUN = process.argv.includes("--dry-run");

// ── Registered versions — order matters (bases before derived) ────────────────

const VERSIONS: VersionSchema[] = [V2_3, V2_3_1, V2_4, V2_5, V2_5_1];

// ── Schema → VersionConfig derivation ────────────────────────────────────────

function toPascalCase(s: string): string {
  return s
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("");
}

function flatUniqueSegments(
  structure: (SegmentDefinition | SegmentGroup)[],
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  function collect(items: (SegmentDefinition | SegmentGroup)[]) {
    for (const item of items) {
      if (isSegmentGroup(item)) {
        collect(item.segments);
      } else if (!seen.has(item.name)) {
        seen.add(item.name);
        result.push(item.name);
      }
    }
  }
  collect(structure);
  return result;
}

/** "ADT_A01" for ADT^A01, or just "ACK" for messages with no trigger event. */
function messageName(schema: Pick<MessageSchema, "messageType" | "triggerEvent">): string {
  return schema.triggerEvent ? `${schema.messageType}_${schema.triggerEvent}` : schema.messageType;
}

function deriveExportTypes(schema: MessageSchema): string[] {
  const msgName = messageName(schema);
  const types = [`Parsed${msgName}`];
  function collectGroups(items: (SegmentDefinition | SegmentGroup)[]) {
    for (const item of items) {
      if (isSegmentGroup(item)) {
        types.push(item.exportTypeName ?? `Parsed${toPascalCase(item.name)}`);
        collectGroups(item.segments);
      }
    }
  }
  collectGroups(schema.structure);
  return types;
}

function schemaToParserConfig(schema: MessageSchema): ParserConfig {
  const msgName = messageName(schema);
  const allSegs = flatUniqueSegments(schema.structure);
  const segments = ["MSH", ...allSegs.filter((s) => s !== "MSH")];
  return {
    name: `${msgName}_Parser`,
    parseFn: `parse${msgName}`,
    exportTypes: deriveExportTypes(schema),
    segments,
    baseMessage: schema.baseMessage,
  };
}

function schemaToBuilderConfig(schema: MessageSchema): BuilderConfig {
  const msgName = messageName(schema);
  const allSegs = flatUniqueSegments(schema.structure);
  return {
    name: msgName,
    segments: allSegs.filter((s) => s !== "MSH"),
    baseMessage: schema.baseMessage,
  };
}

function fromVersionSchema(vs: VersionSchema): VersionConfig {
  return {
    version: vs.version,
    baseVersion: vs.baseVersion,
    segments: vs.segments,
    parsers: vs.messages.map(schemaToParserConfig),
    builders: vs.messages.map(schemaToBuilderConfig),
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function write(filePath: string, content: string) {
  if (DRY_RUN) {
    console.log(`[dry-run] ${filePath.replace(ROOT + "/", "")}`);
    return;
  }
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
  console.log(`wrote  ${filePath.replace(ROOT + "/", "")}`);
}

// ── Generator ─────────────────────────────────────────────────────────────────

// Builds a set of "MessageType_TriggerEvent" names for a given version schema.
// Includes messages inherited through re-export versions.
function messageNameSet(vs: VersionSchema, all: Map<string, VersionSchema>): Set<string> {
  const names = new Set(vs.messages.map(messageName));
  const base = vs.baseVersion ? all.get(vs.baseVersion) : undefined;
  if (vs.reexport && base) {
    for (const n of messageNameSet(base, all)) names.add(n);
  }
  return names;
}

// Module names (no extension, no tests, no barrel) in a src/<kind>/<version> dir.
function moduleNames(kind: string, version: string): string[] {
  const dir = join(ROOT, "src", kind, version);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !/\.(\w+\.)?test\.ts$/.test(f) && f !== "index.ts")
    .map((f) => f.slice(0, -3))
    .sort();
}

// Re-export version: mirror every module of the base version, except those
// hand-written for this version (`ownSegments`).
function generateReexportVersion(vs: VersionSchema) {
  const baseVersion = vs.baseVersion!;
  console.log(`\n── ${vs.version} (re-exports ${baseVersion}) ──\n`);
  const own = new Set(vs.ownSegments ?? []);
  for (const kind of ["segments", "parsers", "builders"] as const) {
    for (const name of moduleNames(kind, baseVersion)) {
      if (kind === "segments" && own.has(name)) continue;
      const target = join(ROOT, "src", kind, vs.version, `${name}.ts`);
      if (existsSync(target) && !readFileSync(target, "utf8").includes(REEXPORT_MARKER)) {
        console.log(`skip   ${target.replace(ROOT + "/", "")}  (hand-written)`);
        continue;
      }
      write(target, generateReexport(kind, name, vs.version, baseVersion));
    }
  }
  for (const seg of own) {
    const p = join(ROOT, "src/segments", vs.version, `${seg}.ts`);
    if (!existsSync(p) && !DRY_RUN) {
      throw new Error(`${vs.version}: ownSegments lists ${seg} but ${p} does not exist`);
    }
  }
}

function generate(config: VersionConfig, baseSchema?: VersionSchema, allVersions = new Map<string, VersionSchema>()) {
  const { version, baseVersion, segments, parsers, builders } = config;

  if (!baseVersion) {
    // Base version — generate parser stubs and builder stubs only.
    // Segments are hand-written.
    console.log(`\n── ${version} (base) ──\n`);

    for (const parser of parsers) {
      const parserPath = join(ROOT, "src/parsers", version, `${parser.name}.ts`);
      if (existsSync(parserPath)) {
        console.log(`skip   ${parserPath.replace(ROOT + "/", "")}  (already exists)`);
        continue;
      }
      if (parser.baseMessage) {
        write(parserPath, generateWrapperParser(parser, parser.baseMessage));
      } else {
        write(parserPath, generateBaseParser(parser, version));
      }
    }
    for (const builder of builders ?? []) {
      const builderPath = join(ROOT, "src/builders", version, `${builder.name}.ts`);
      if (existsSync(builderPath)) {
        console.log(`skip   ${builderPath.replace(ROOT + "/", "")}  (already exists)`);
        continue;
      }
      if (builder.baseMessage) {
        write(builderPath, generateWrapperBuilder(builder, builder.baseMessage));
      } else {
        write(builderPath, generateBuilder(builder, version, version));
      }
    }
  } else {
    // Derived version — generate segment wrappers, parser overrides, builder stubs.
    console.log(`\n── ${version} (extends ${baseVersion}) ──\n`);

    // Messages that exist in the base version can use derived overrides.
    // Messages new to this version need standalone base stubs instead.
    const baseMessages = baseSchema ? messageNameSet(baseSchema, allVersions) : new Set<string>();

    for (const seg of segments) {
      const segPath = join(ROOT, "src/segments", version, `${seg}.ts`);
      if (existsSync(segPath)) {
        console.log(`skip   ${segPath.replace(ROOT + "/", "")}  (already exists)`);
        continue;
      }
      write(segPath, generateSegment(seg, version, baseVersion));
    }

    for (const parser of parsers) {
      const parserPath = join(ROOT, "src/parsers", version, `${parser.name}.ts`);
      if (existsSync(parserPath)) {
        console.log(`skip   ${parserPath.replace(ROOT + "/", "")}  (already exists)`);
        continue;
      }
      const msgName = parser.name.replace(/_Parser$/, "");
      if (parser.baseMessage) {
        // Wrapper: extend the same-version base parser
        write(parserPath, generateWrapperParser(parser, parser.baseMessage));
      } else if (baseMessages.has(msgName)) {
        // Standard derived override: override parse methods to use this version's segments
        write(parserPath, generateParser(parser, version, baseVersion));
      } else {
        console.log(`note   ${parser.name} is new in ${version} — generating base stub`);
        write(parserPath, generateBaseParser(parser, version));
      }
    }

    for (const builder of builders ?? []) {
      const builderPath = join(ROOT, "src/builders", version, `${builder.name}.ts`);
      if (existsSync(builderPath)) {
        console.log(`skip   ${builderPath.replace(ROOT + "/", "")}  (already exists)`);
        continue;
      }
      if (builder.baseMessage) {
        write(builderPath, generateWrapperBuilder(builder, builder.baseMessage));
      } else if (baseMessages.has(builder.name)) {
        write(builderPath, generateBuilder(builder, version, baseVersion));
      } else {
        console.log(`note   ${builder.name} is new in ${version} — generating base stub`);
        write(builderPath, generateBuilder(builder, version, version));
      }
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

// Build a version lookup so each derived version can find its base schema.
const versionMap = new Map<string, VersionSchema>(VERSIONS.map((vs) => [vs.version, vs]));

for (const vs of VERSIONS) {
  const baseSchema = vs.baseVersion ? versionMap.get(vs.baseVersion) : undefined;
  if (vs.reexport) {
    generateReexportVersion(vs);
  } else {
    generate(fromVersionSchema(vs), baseSchema, versionMap);
  }
}
console.log("\nDone.");
