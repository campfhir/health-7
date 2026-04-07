/**
 * HL7 Mapper Code Generator
 *
 * Generates segment wrappers, parser overrides, and builder stubs for a new
 * HL7 version by inheriting from a base version.
 *
 * Usage:
 *   pnpm codegen                          # use default config (v2.5.1 from v2.3)
 *   pnpm codegen --config codegen/my.ts   # use a custom config file
 *   pnpm codegen --dry-run                # print files without writing
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { VersionConfig } from "./types.ts";
import { generateSegment } from "./generators/segment.ts";
import { generateParser } from "./generators/parser.ts";
import { generateBuilder } from "./generators/builder.ts";

const ROOT = join(fileURLToPath(import.meta.url), "../..");
const DRY_RUN = process.argv.includes("--dry-run");

// ── Built-in configs ──────────────────────────────────────────────────────────

const CONFIGS: Record<string, VersionConfig> = {
  "v2.5.1": {
    version: "v2.5.1",
    baseVersion: "v2.3",
    segments: [
      // Core
      "MSH",
      "NTE",
      "SFT",
      // Patient
      "PID",
      "PD1",
      "NK1",
      "AL1",
      "DB1",
      "GT1",
      // Visit
      "PV1",
      "PV2",
      "ROL",
      "EVN",
      "MRG",
      // Clinical
      "DG1",
      "PR1",
      "OBX",
      "OBR",
      "ORC",
      // Insurance / Finance
      "IN1",
      "IN2",
      "IN3",
      "ACC",
      "DRG",
      "UB1",
      "UB2",
      // Messaging
      "MSA",
      "ERR",
      // Pharmacy
      "RXO",
      "RXE",
      "RXD",
      "RXA",
      "RXR",
      // Timing / Specimen
      "TQ1",
      "SPM",
      // Master files / Staff
      "MFI",
      "MFE",
      "STF",
      "PRA",
      // Scheduling
      "SCH",
      "RGS",
      "AIS",
      "AIL",
      "AIG",
      "AIP",
    ],
    parsers: [
      {
        name: "ORU_R01_Parser",
        parseFn: "parseORU_R01",
        exportTypes: [
          "ParsedORU_R01",
          "ParsedPatientResult",
          "ParsedOrderObservation",
        ],
        segments: [
          "MSH",
          "PID",
          "PD1",
          "NK1",
          "NTE",
          "PV1",
          "ORC",
          "OBR",
          "OBX",
        ],
      },
      {
        name: "MFN_M02_Parser",
        parseFn: "parseMFN_M02",
        exportTypes: ["ParsedMFN_M02", "ParsedStaffEntry"],
        segments: ["MSH", "MFI", "MFE", "STF", "PRA"],
      },
    ],
    builders: [
      {
        name: "ORU_R01",
        segments: ["PID", "PD1", "NK1", "NTE", "PV1", "ORC", "OBR", "OBX"],
      },
      {
        name: "MFN_M02",
        segments: ["MFI", "MFE", "STF", "PRA"],
      },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function write(
  filePath: string,
  content: string,
  { skipIfComplete = false } = {},
) {
  if (DRY_RUN) {
    console.log(`[dry-run] ${filePath}`);
    console.log(content);
    return;
  }
  // Builder stubs: don't overwrite a file that's already been completed
  // (i.e. the developer removed the `const _TODO =` guard).
  if (skipIfComplete && existsSync(filePath)) {
    const existing = readFileSync(filePath, "utf8");
    if (!existing.includes("const _TODO =")) {
      console.log(
        `skip   ${filePath.replace(ROOT + "/", "")}  (already completed)`,
      );
      return;
    }
  }
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
  console.log(`wrote  ${filePath.replace(ROOT + "/", "")}`);
}

// ── Generator ─────────────────────────────────────────────────────────────────

function generate(config: VersionConfig) {
  const { version, baseVersion, segments, parsers } = config;
  console.log(`\nGenerating ${version} (base: ${baseVersion})\n`);

  // 1. Segment wrappers
  for (const seg of segments) {
    write(
      join(ROOT, "src/segments", version, `${seg}.ts`),
      generateSegment(seg, version, baseVersion),
    );
  }

  // 2. Parser overrides (skip if the file exists — parsers don't have a TODO guard
  //    so we treat any existing file as intentionally customised)
  for (const parser of parsers) {
    const parserPath = join(ROOT, "src/parsers", version, `${parser.name}.ts`);
    if (existsSync(parserPath)) {
      console.log(
        `skip   ${parserPath.replace(ROOT + "/", "")}  (already exists)`,
      );
      continue;
    }
    write(parserPath, generateParser(parser, version, baseVersion));
  }

  // 3. Builder stubs (only if configured)
  if (config.builders?.length) {
    for (const builder of config.builders) {
      write(
        join(ROOT, "src/builders", version, `${builder.name}.ts`),
        generateBuilder(builder, version, baseVersion),
        { skipIfComplete: true },
      );
    }
  }

  console.log("\nDone.");
}

// ── Main ──────────────────────────────────────────────────────────────────────

const configArg = process.argv
  .find((a) => a.startsWith("--config="))
  ?.split("=")[1];
const versionArg = process.argv
  .find((a) => a.startsWith("--version="))
  ?.split("=")[1];

async function main() {
  let config: VersionConfig;

  if (configArg) {
    // Load external config file
    const mod = await import(join(process.cwd(), configArg));
    config = mod.default ?? mod.config;
  } else if (versionArg) {
    config = CONFIGS[versionArg];
    if (!config) {
      console.error(
        `Unknown version "${versionArg}". Available: ${Object.keys(CONFIGS).join(", ")}`,
      );
      process.exit(1);
    }
  } else {
    // Default: show available configs
    console.log("Available configs:", Object.keys(CONFIGS).join(", "));
    console.log("Usage: pnpm codegen --version=v2.5.1");
    console.log("       pnpm codegen --config=codegen/my-version.ts");
    process.exit(0);
  }

  generate(config);
}

main();
