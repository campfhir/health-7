import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { PD1 as PD1_v23 } from "../v2.3/PD1";

/**
 * PD1 - Patient Additional Demographic Segment (HL7 v2.5.1)
 * Extends v2.3 PD1. Add v2.5.1-specific fields here as needed.
 */
export class PD1 extends PD1_v23 {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PD1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PD1") {
      return {
        ok: false,
        err: new Err(`Expected PD1 segment, got ${parts[0]}`),
      };
    }
    const pd1 = new PD1();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        pd1.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: pd1 };
  }
}
