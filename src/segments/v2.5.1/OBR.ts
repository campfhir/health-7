import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { OBR as OBR_v23 } from "../v2.3/OBR";

/**
 * OBR - Observation Request Segment (HL7 v2.5.1)
 * Extends v2.3 OBR. Add v2.5.1-specific fields here as needed.
 */
export class OBR extends OBR_v23 {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<OBR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "OBR") {
      return {
        ok: false,
        err: new Err(`Expected OBR segment, got ${parts[0]}`),
      };
    }
    const obr = new OBR();
    for (let i = 1; i < parts.length; i++) {
      obr.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: obr };
  }
}
