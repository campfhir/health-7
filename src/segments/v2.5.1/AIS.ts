import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { AIS as AIS_base } from "../v2.3/AIS";

/**
 * AIS segment (HL7 v2.5.1)
 * Extends v2.3 AIS. Add v2.5.1-specific fields here as needed.
 */
export class AIS extends AIS_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIS> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIS") {
      return { ok: false, err: new Err(`Expected AIS segment, got ${parts[0]}`) };
    }
    const seg = new AIS();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
