/**
 * Generates a v2.X segment wrapper that extends the base version.
 * The generated class overrides parse() to construct an instance of the new version's class.
 *
 * MSH is special: its parse() takes no encoding arg (it self-extracts encoding),
 * so we just delegate to the base class and re-wrap the result.
 */
export function generateSegment(
  segName: string,
  version: string,
  baseVersion: string,
): string {
  if (segName === "MSH") {
    return `/**
 * MSH segment definition for HL7 ${version}.
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import { MSH as MSH_base } from "../${baseVersion}/MSH.ts";

/**
 * MSH segment (HL7 ${version})
 * Extends ${baseVersion} MSH. Add ${version}-specific fields here as needed.
 */
export class MSH extends MSH_base {
  /** Parses the input string into a structured instance. */
  static override parse(segmentString: string): Result<MSH> {
    return MSH_base.parse(segmentString) as Result<MSH>;
  }
}
`;
  }

  return `/**
 * ${segName} segment definition for HL7 ${version}.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ${segName} as ${segName}_base } from "../${baseVersion}/${segName}.ts";

/**
 * ${segName} segment (HL7 ${version})
 * Extends ${baseVersion} ${segName}. Add ${version}-specific fields here as needed.
 */
export class ${segName} extends ${segName}_base {
  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<${segName}> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "${segName}") {
      return { ok: false, err: new Err(\`Expected ${segName} segment, got \${parts[0]}\`) };
    }
    const seg = new ${segName}();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
`;
}
