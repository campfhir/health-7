import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { OBX as OBX_base } from "../v2.3/OBX";

/**
 * OBX segment (HL7 v2.5.1)
 * Extends v2.3 OBX. Add v2.5.1-specific fields here as needed.
 */
export class OBX extends OBX_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<OBX> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "OBX") {
      return { ok: false, err: new Err(`Expected OBX segment, got ${parts[0]}`) };
    }
    const seg = new OBX();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
