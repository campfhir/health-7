import { Err } from "../../utils/err";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { NK1 as NK1_v23 } from "../v2.3/NK1";
import { Result } from "../../types/result";

/**
 * NK1 - Next of Kin / Associated Parties Segment (HL7 v2.5.1)
 * Extends v2.3 NK1. Add v2.5.1-specific fields here as needed.
 */
export class NK1 extends NK1_v23 {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<NK1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "NK1") {
      return {
        ok: false,
        err: new Err(`Expected NK1 segment, got ${parts[0]}`),
      };
    }
    const nk1 = new NK1();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        nk1.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: nk1 };
  }
}
