import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { AIP as AIP_base } from "../v2.3/AIP.ts";

/**
 * AIP segment (HL7 v2.5.1)
 * Extends v2.3 AIP. Add v2.5.1-specific fields here as needed.
 */
export class AIP extends AIP_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIP> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIP") {
      return { ok: false, err: new Err(`Expected AIP segment, got ${parts[0]}`) };
    }
    const seg = new AIP();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
