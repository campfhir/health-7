import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { SPM as SPM_base } from "../v2.3/SPM";

/**
 * SPM segment (HL7 v2.5.1)
 * Extends v2.3 SPM. Add v2.5.1-specific fields here as needed.
 */
export class SPM extends SPM_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<SPM> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "SPM") {
      return { ok: false, err: new Err(`Expected SPM segment, got ${parts[0]}`) };
    }
    const seg = new SPM();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
