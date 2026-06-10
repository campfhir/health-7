import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { UB1 as UB1_base } from "../v2.3/UB1.ts";

/**
 * UB1 segment (HL7 v2.5.1)
 * Extends v2.3 UB1. Add v2.5.1-specific fields here as needed.
 */
export class UB1 extends UB1_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<UB1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "UB1") {
      return { ok: false, err: new Err(`Expected UB1 segment, got ${parts[0]}`) };
    }
    const seg = new UB1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
