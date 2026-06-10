import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ERR as ERR_base } from "../v2.3/ERR.ts";

/**
 * ERR segment (HL7 v2.5.1)
 * Extends v2.3 ERR. Add v2.5.1-specific fields here as needed.
 */
export class ERR extends ERR_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ERR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ERR") {
      return { ok: false, err: new Err(`Expected ERR segment, got ${parts[0]}`) };
    }
    const seg = new ERR();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
