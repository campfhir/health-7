import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { ORC as ORC_base } from "../v2.3/ORC";

/**
 * ORC segment (HL7 v2.5.1)
 * Extends v2.3 ORC. Add v2.5.1-specific fields here as needed.
 */
export class ORC extends ORC_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ORC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ORC") {
      return { ok: false, err: new Err(`Expected ORC segment, got ${parts[0]}`) };
    }
    const seg = new ORC();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
