/** Marker line identifying a file as generated; codegen never overwrites files without it. */
export const REEXPORT_MARKER = "// @generated re-export — replace this file by hand to diverge from the base version";

/**
 * Generates a module that re-exports everything from the same-named module of
 * another version. Used for versions that are identical to their predecessor.
 */
export function generateReexport(
  kind: "segments" | "parsers" | "builders",
  name: string,
  version: string,
  baseVersion: string,
): string {
  const noun = { segments: "segment", parsers: "parser", builders: "builder" }[kind];
  return `/**
 * ${name} ${noun} for HL7 ${version} — identical to ${baseVersion}, re-exported.
 *
 * @module
 */
${REEXPORT_MARKER}
export * from "../${baseVersion}/${name}.ts";
`;
}
