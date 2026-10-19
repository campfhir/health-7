/**
 * TQ2 segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { TQ2 as TQ2_base } from "../v2.5/TQ2.ts";

/**
 * TQ2 segment (HL7 v2.5.1)
 * Extends v2.5 TQ2. Add v2.5.1-specific fields here as needed.
 */
export class TQ2 extends TQ2_base {
  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<TQ2> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "TQ2") {
      return { ok: false, err: new Err(`Expected TQ2 segment, got ${parts[0]}`) };
    }
    const seg = new TQ2();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
