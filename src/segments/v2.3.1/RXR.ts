/**
 * RXR segment definition for HL7 v2.3.1.
 *
 * position-tests: hand-written (see RXR.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { RXR as RXR_base } from "../v2.3/RXR.ts";
import { codedParts, components, type CodedInput } from "../../utils/composites.ts";

/**
 * RXR segment (HL7 v2.3.1)
 *
 * Extends v2.3 RXR with RXR-5 Routing Instruction.
 */
export class RXR extends RXR_base {
  /** RXR-5 Routing Instruction (CE) (chainable). Takes a CE, or the `code`/`text`/`codingSystem` shape. */
  routingInstruction(value: CodedInput): this {
    this.fields[4] = this.createField(components(codedParts(value)));
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(segmentString: string, encoding: EncodingCharacters): Result<RXR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXR") {
      return { ok: false, err: new Err(`Expected RXR segment, got ${parts[0]}`) };
    }
    const seg = new RXR();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
