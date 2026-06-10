/**
 * AL1 segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { AL1 as AL1_base } from "../v2.3/AL1.ts";

/**
 * AL1 segment (HL7 v2.5.1)
 * Extends v2.3 AL1. Add v2.5.1-specific fields here as needed.
 */
export class AL1 extends AL1_base {
  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AL1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AL1") {
      return { ok: false, err: new Err(`Expected AL1 segment, got ${parts[0]}`) };
    }
    const seg = new AL1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
