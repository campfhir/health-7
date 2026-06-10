import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { GT1 as GT1_base } from "../v2.3/GT1.ts";

/**
 * GT1 segment (HL7 v2.5.1)
 * Extends v2.3 GT1. Add v2.5.1-specific fields here as needed.
 */
export class GT1 extends GT1_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<GT1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "GT1") {
      return { ok: false, err: new Err(`Expected GT1 segment, got ${parts[0]}`) };
    }
    const seg = new GT1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
