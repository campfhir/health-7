import type { ParserConfig } from "../types.ts";

/**
 * Generates a thin parser wrapper that extends a base message parser.
 *
 * Used when a message schema sets `baseMessage` — the generated file:
 *  - Imports the base parser class and its Parsed* types
 *  - Re-exports sub-group types unchanged
 *  - Declares `ParsedXxx = ParsedBase` as a type alias
 *  - Subclasses the base parser overriding only `messageName`
 *  - Exports a standalone parse function
 */
export function generateWrapperParser(
  config: ParserConfig,
  baseMsgName: string,
): string {
  const { name, parseFn, exportTypes } = config;
  const msgType = name.replace(/_Parser$/, ""); // e.g. "ADT_A02"
  const baseParsedType = `Parsed${baseMsgName}`;
  const baseParserClass = `${baseMsgName}_Parser`;

  // Sub-group types to re-export (everything except the primary Parsed type for this message)
  const extraTypes = exportTypes.filter((t) => t !== `Parsed${msgType}`);

  const importList = [baseParserClass, baseParsedType, ...extraTypes].join(",\n  ");

  const reExportLine =
    extraTypes.length > 0 ? `export type { ${extraTypes.join(", ")} };\n` : "";

  return `import { Result } from "../../types/result";
import {
  ${importList},
} from "./${baseMsgName}_Parser";

${reExportLine}export type Parsed${msgType} = ${baseParsedType};

export class ${name} extends ${baseParserClass} {
  protected override readonly messageName: string = "${msgType}";
}

export function ${parseFn}(messageString: string): Result<Parsed${msgType}> {
  return new ${name}().parse(messageString);
}
`;
}
