import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { IN1 as IN1_base } from "../v2.3/IN1";

/**
 * IN1 segment (HL7 v2.5.1)
 * Extends v2.3 IN1. Add v2.5.1-specific fields here as needed.
 */
export class IN1 extends IN1_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<IN1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "IN1") {
      return { ok: false, err: new Err(`Expected IN1 segment, got ${parts[0]}`) };
    }
    const seg = new IN1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
