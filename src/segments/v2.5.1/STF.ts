import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { STF as STF_v23 } from "../v2.3/STF";

/**
 * STF - Staff Identification Segment (HL7 v2.5.1)
 *
 * Extends the v2.3 STF. Add v2.5.1-specific fields here as needed,
 * for example:
 *   STF-19: NPI number
 *   STF-25: Death Date and Time
 */
export class STF extends STF_v23 {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<STF, string> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "STF") {
      return {
        ok: false,
        err: new Err(`Expected STF segment, got ${parts[0]}`),
      };
    }
    const stf = new STF();
    for (let i = 1; i < parts.length; i++) {
      stf.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: stf };
  }
}
