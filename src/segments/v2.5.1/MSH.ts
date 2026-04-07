import { Result } from "../../types/result";
import { ParserUtils } from "../../types/parser";
import { MSH as MSH_v23 } from "../v2.3/MSH";

/**
 * MSH - Message Header Segment (HL7 v2.5.1)
 * Extends v2.3 MSH. Add v2.5.1-specific fields here as needed.
 */
export class MSH extends MSH_v23 {
  static override parse(segmentString: string): Result<MSH> {
    const result = MSH_v23.parse(segmentString);
    if (!result.ok || !result.val) return result as Result<MSH>;
    const msh = new MSH();
    msh.fields = result.val.fields;
    msh.setEncoding(result.val.getEncoding());
    return { ok: true, val: msh };
  }
}
