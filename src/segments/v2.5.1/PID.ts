import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { PID as PID_base } from "../v2.3/PID.ts";

/**
 * PID segment (HL7 v2.5.1)
 * Extends v2.3 PID. Add v2.5.1-specific fields here as needed.
 */
export class PID extends PID_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PID> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PID") {
      return { ok: false, err: new Err(`Expected PID segment, got ${parts[0]}`) };
    }
    const seg = new PID();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
