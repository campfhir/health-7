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
    return `import { Result } from "../../types/result";
import { MSH as MSH_base } from "../${baseVersion}/MSH";

/**
 * MSH segment (HL7 ${version})
 * Extends ${baseVersion} MSH. Add ${version}-specific fields here as needed.
 */
export class MSH extends MSH_base {
  static override parse(segmentString: string): Result<MSH> {
    return MSH_base.parse(segmentString) as Result<MSH>;
  }
}
`;
  }

  return `import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { ${segName} as ${segName}_base } from "../${baseVersion}/${segName}";

/**
 * ${segName} segment (HL7 ${version})
 * Extends ${baseVersion} ${segName}. Add ${version}-specific fields here as needed.
 */
export class ${segName} extends ${segName}_base {
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
