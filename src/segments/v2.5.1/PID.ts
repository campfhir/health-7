import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { PID as PID_v23 } from "../v2.3/PID";

/**
 * PID - Patient Identification Segment (HL7 v2.5.1)
 * Extends v2.3 PID. Add v2.5.1-specific fields here as needed.
 */
export class PID extends PID_v23 {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PID> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PID") {
      return {
        ok: false,
        err: new Err(`Expected PID segment, got ${parts[0]}`),
      };
    }
    const pid = new PID();
    for (let i = 1; i < parts.length; i++) {
      pid.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: pid };
  }
}
