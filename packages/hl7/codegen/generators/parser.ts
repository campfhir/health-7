import type { ParserConfig } from "../types.ts";

/**
 * Generates a version-specific parser that extends the base version's parser and
 * overrides each segment parsing method to use the new version's segment classes.
 */
export function generateParser(
  config: ParserConfig,
  version: string,
  baseVersion: string,
): string {
  const { name, parseFn, exportTypes, segments } = config;

  // Segment imports from new version
  const segmentImports = segments
    .map((s) => `import { ${s} } from "../../segments/${version}/${s}";`)
    .join("\n");

  // Base parser import + re-exported types
  const typeExports =
    exportTypes.length > 0 ? `  ${exportTypes.join(",\n  ")},\n` : "";
  const baseParserImport = `import {\n  ${name} as ${name}_base,\n${typeExports}} from "../${baseVersion}/${name}";`;

  // Re-export types
  const reExports =
    exportTypes.length > 0
      ? `\nexport type { ${exportTypes.join(", ")} };\n`
      : "";

  // Override methods — MSH has no encoding arg, all others do
  const overrides = segments
    .map((seg) => {
      const method = `parse${seg}`;
      if (seg === "MSH") {
        return `  protected override ${method}(s: string): Result<${seg}> {\n    return ${seg}.parse(s);\n  }`;
      }
      return `  protected override ${method}(s: string, e: EncodingCharacters): Result<${seg}> {\n    return ${seg}.parse(s, e);\n  }`;
    })
    .join("\n\n");

  // Infer the parsed result type name from the parser name (e.g. ORU_R01_Parser → ParsedORU_R01)
  const parsedType =
    exportTypes.find((t) => t.startsWith("Parsed")) ?? "unknown";

  return `import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
${segmentImports}
${baseParserImport}
${reExports}
export class ${name} extends ${name}_base {
${overrides}
}

export function ${parseFn}(messageString: string): Result<${parsedType}> {
  return new ${name}().parse(messageString);
}
`;
}
