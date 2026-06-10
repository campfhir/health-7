/**
 * UB2 segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { UB2 as UB2_base } from "../v2.3/UB2.ts";

/**
 * UB2 segment (HL7 v2.5.1)
 * Extends v2.3 UB2. Add v2.5.1-specific fields here as needed.
 */
export class UB2 extends UB2_base {
  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<UB2> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "UB2") {
      return { ok: false, err: new Err(`Expected UB2 segment, got ${parts[0]}`) };
    }
    const seg = new UB2();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
