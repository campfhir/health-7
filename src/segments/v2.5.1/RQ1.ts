/**
 * RQ1 segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { RQ1 as RQ1_base } from "../v2.5/RQ1.ts";

/**
 * RQ1 segment (HL7 v2.5.1)
 * Extends v2.5 RQ1. Add v2.5.1-specific fields here as needed.
 */
export class RQ1 extends RQ1_base {
  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RQ1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RQ1") {
      return { ok: false, err: new Err(`Expected RQ1 segment, got ${parts[0]}`) };
    }
    const seg = new RQ1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
