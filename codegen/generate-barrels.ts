/**
 * Generates barrel index.ts files for all versioned src directories.
 * Run automatically as the prebuild step.
 *
 * Usage:
 *   pnpm barrels           # generate all index.ts barrel files
 *   pnpm barrels --dry-run # print without writing
 *
 * Segments:  export * (all exports — class names are globally unique)
 * Builders:  export { create* } only (avoids structural type name conflicts)
 * Parsers:   export { parse* } only (same reason)
 */

import { readdirSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "../..");
const DRY_RUN = process.argv.includes("--dry-run");

function sourceFiles(absDir: string): string[] {
  return readdirSync(absDir)
    .filter(
      (f) =>
        f.endsWith(".ts") &&
        !f.endsWith(".test.ts") &&
        !f.endsWith(".integration.test.ts") &&
        !f.endsWith(".d.ts") &&
        f !== "index.ts",
    )
    .map((f) => basename(f, ".ts"))
    .sort();
}

// Relative specifiers carry explicit `.ts` extensions so the barrels resolve
// under Deno / JSR (and Node's native ESM loader), not just bundlers.
function segmentBarrel(absDir: string): string {
  return sourceFiles(absDir)
    .map((name) => `export * from "./${name}.ts";`)
    .join("\n") + "\n";
}

function builderBarrel(absDir: string): string {
  return sourceFiles(absDir)
    .map((name) => `export { create${name} } from "./${name}.ts";`)
    .join("\n") + "\n";
}

function parserBarrel(absDir: string): string {
  return sourceFiles(absDir)
    .map((name) => {
      // ADT_A01_Parser → parseADT_A01
      const fnName = "parse" + name.replace(/_Parser$/, "");
      return `export { ${fnName} } from "./${name}.ts";`;
    })
    .join("\n") + "\n";
}

const DIRS: { dir: string; barrel: (absDir: string) => string }[] = [
  { dir: "src/segments/v2.3",     barrel: segmentBarrel },
  { dir: "src/segments/v2.5.1",   barrel: segmentBarrel },
  { dir: "src/builders/v2.3",     barrel: builderBarrel },
  { dir: "src/builders/v2.5.1",   barrel: builderBarrel },
  { dir: "src/parsers/v2.3",      barrel: parserBarrel  },
  { dir: "src/parsers/v2.5.1",    barrel: parserBarrel  },
];

// JSR module doc for a barrel, derived from its directory (kind + version).
function barrelModuleDoc(dir: string): string {
  const [, kind, ver] = dir.match(/src\/(segments|builders|parsers)\/(v[\d.]+)/)!;
  const noun = { segments: "segment classes", builders: "message builders", parsers: "message parsers" }[
    kind as "segments" | "builders" | "parsers"
  ];
  return `/**\n * Barrel re-exporting all HL7 ${ver} ${noun}.\n *\n * @module\n */\n`;
}

for (const { dir, barrel } of DIRS) {
  const absDir = join(ROOT, dir);
  const content = barrelModuleDoc(dir) + barrel(absDir);
  const indexPath = join(absDir, "index.ts");

  if (DRY_RUN) {
    console.log(`[dry-run] ${dir}/index.ts`);
  } else {
    writeFileSync(indexPath, content, "utf8");
    console.log(`wrote  ${dir}/index.ts`);
  }
}
