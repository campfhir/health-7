import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { ROL as ROL_base } from "../v2.3/ROL";

/**
 * ROL segment (HL7 v2.5.1)
 * Extends v2.3 ROL. Add v2.5.1-specific fields here as needed.
 */
export class ROL extends ROL_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ROL> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ROL") {
      return { ok: false, err: new Err(`Expected ROL segment, got ${parts[0]}`) };
    }
    const seg = new ROL();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
