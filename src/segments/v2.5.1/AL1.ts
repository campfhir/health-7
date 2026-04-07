import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { AL1 as AL1_base } from "../v2.3/AL1";

/**
 * AL1 segment (HL7 v2.5.1)
 * Extends v2.3 AL1. Add v2.5.1-specific fields here as needed.
 */
export class AL1 extends AL1_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AL1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AL1") {
      return { ok: false, err: new Err(`Expected AL1 segment, got ${parts[0]}`) };
    }
    const seg = new AL1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
