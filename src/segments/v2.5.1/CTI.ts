import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { CTI as CTI_base } from "../v2.3/CTI";

/**
 * CTI segment (HL7 v2.5.1)
 * Extends v2.3 CTI. Add v2.5.1-specific fields here as needed.
 */
export class CTI extends CTI_base {
  static override parse(segmentString: string, encoding: EncodingCharacters): Result<CTI> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "CTI") {
      return { ok: false, err: new Err(`Expected CTI segment, got ${parts[0]}`) };
    }
    const seg = new CTI();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
