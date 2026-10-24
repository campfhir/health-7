import type { ParserConfig } from "../types.ts";

/**
 * Generates a base-version parser stub with full switch-case skeleton.
 *
 * The generated file:
 *  - Imports all segments from the base version
 *  - Has type interface stubs with TODO comments
 *  - Has protected parse method stubs for each segment
 *  - Has a parse() with switch-case for every segment (flat assignments)
 *  - Contains intentional `const _TODO =` syntax errors as compile guards
 *    so the file won't compile until the developer fills it in.
 */
export function generateBaseParser(
  config: ParserConfig,
  version: string,
): string {
  const { name, parseFn, segments } = config;
  const msgType = name.replace("_Parser", ""); // e.g. "ADT_A28"

  // Segment imports
  const segmentImports = segments
    .map((s) => `import { ${s} } from "../../segments/${version}/${s}";`)
    .join("\n");

  // Protected parse methods — MSH takes no encoding arg
  const parseMethods = segments
    .map((seg) => {
      if (seg === "MSH") {
        return `  protected parseMSH(s: string): Result<MSH> {\n    return MSH.parse(s);\n  }`;
      }
      return `  protected parse${seg}(s: string, e: EncodingCharacters): Result<${seg}> {\n    return ${seg}.parse(s, e);\n  }`;
    })
    .join("\n\n");

  // Switch cases for each non-MSH segment
  const switchCases = segments
    .filter((s) => s !== "MSH")
    .map(
      (seg) => `          case "${seg}": {
            const result = this.parse${seg}(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(\`Failed to parse ${seg} segment at line \${i + 1}: \${result.err.message}\`) };
            }
            // TODO: assign result.val
            message.addSegment(result.val);
            break;
          }`,
    )
    .join("\n\n");

  return `// ⚠ GENERATED STUB — complete before use
// Re-run \`pnpm codegen\` to regenerate from scratch.
//
// Steps to complete:
//   1. Fill in the Parsed* type interfaces below (remove \`const _TODO =\` when done).
//   2. Declare state variables above the for-loop and assign in each switch case.
//   3. Finalize the return value at the bottom.
//   4. Remove all \`const _TODO =\` syntax errors when done.

import { Err } from "../../utils/err";
import { Result } from "../../types/result";
${segmentImports}
import { HL7Message } from "../../types/message";
import { EncodingCharacters } from "../../types/encoding";

// TODO: define result type(s) for this message.
// Add sub-group interfaces above Parsed${msgType} as needed, e.g.:
//
//   export interface ParsedSomeGroup {
//     seg1: SEG1;
//     seg2?: SEG2;
//   }
//
export interface Parsed${msgType} {
  message: HL7Message;
  msh: MSH;
  // TODO: add a field for each segment/group
  const _TODO =
}

export class ${name} {
${parseMethods}

  parse(messageString: string): Result<Parsed${msgType}> {
    try {
      const segments = messageString
        .split(/\\r\\n|\\r|\\n/)
        .filter((s) => s.trim().length > 0);

      if (segments.length === 0) {
        return { ok: false, err: new Err("Empty message") };
      }

      const mshSegment = segments[0];
      if (!mshSegment.startsWith("MSH")) {
        return { ok: false, err: new Err("Message must start with MSH segment") };
      }

      const mshResult = this.parseMSH(mshSegment);
      if (!mshResult.ok || !mshResult.val) {
        return { ok: false, err: new Err(mshResult.err.message || "Failed to parse MSH segment") };
      }

      const msh = mshResult.val;
      const encoding = msh.getEncoding();
      const message = new HL7Message(encoding);
      message.addSegment(msh);

      // TODO: declare state variables for building the result, e.g.:
      //   let evn: EVN | undefined;
      //   const nk1List: NK1[] = [];
      const _TODO =

      for (let i = 1; i < segments.length; i++) {
        const segmentStr = segments[i];
        const segmentType = segmentStr.substring(0, 3);

        switch (segmentType) {
${switchCases}

          default:
            console.warn(\`Skipping unsupported segment type '\${segmentType}' at line \${i + 1}\`);
            break;
        }
      }

      // TODO: finalize result — replace \`{}\` with actual fields
      return { ok: true, val: { message, msh } };
    } catch (error) {
      return { ok: false, err: new Err(\`Failed to parse ${msgType} message: \${error}\`) };
    }
  }
}

export function ${parseFn}(messageString: string): Result<Parsed${msgType}> {
  return new ${name}().parse(messageString);
}
`;
}
