import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { PV1 as PV1_base } from "../v2.3/PV1";

/**
 * PV1 segment (HL7 v2.5.1)
 * Extends v2.3 PV1. Add v2.5.1-specific fields here as needed.
 */
export class PV1 extends PV1_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PV1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PV1") {
      return { ok: false, err: new Err(`Expected PV1 segment, got ${parts[0]}`) };
    }
    const seg = new PV1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
