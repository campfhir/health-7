// Shared helpers for the release scripts: the publishable workspace packages under packages/*.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const PACKAGES_DIR = join(REPO_ROOT, "packages");

/** Every non-private package under packages/*, sorted by folder name. */
export function listPackages() {
  return readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(PACKAGES_DIR, d.name, "package.json")))
    .map((d) => {
      const dir = join(PACKAGES_DIR, d.name);
      const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
      return {
        folder: d.name,
        relDir: `packages/${d.name}`,
        dir,
        name: pkg.name,
        version: pkg.version,
        private: Boolean(pkg.private),
        exports: pkg.exports,
      };
    })
    .filter((p) => !p.private)
    .sort((a, b) => a.folder.localeCompare(b.folder));
}

/** Resolves a folder name ("hl7"), package name ("@campfhir/hl7") or path ("packages/hl7"). */
export function findPackage(spec) {
  const all = listPackages();
  const wanted = String(spec ?? "").replace(/\/+$/, "");
  const match = all.find((p) => p.folder === wanted || p.name === wanted || p.relDir === wanted);
  if (!match) {
    throw new Error(`Unknown package "${spec}". Known packages: ${all.map((p) => p.folder).join(", ")}`);
  }
  return match;
}
