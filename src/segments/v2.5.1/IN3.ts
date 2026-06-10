import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { IN3 as IN3_base } from "../v2.3/IN3.ts";

/**
 * IN3 segment (HL7 v2.5.1)
 * Extends v2.3 IN3. Add v2.5.1-specific fields here as needed.
 */
export class IN3 extends IN3_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<IN3> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "IN3") {
      return { ok: false, err: new Err(`Expected IN3 segment, got ${parts[0]}`) };
    }
    const seg = new IN3();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
