import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * RGS - Resource Group Segment (HL7 v2.3)
 */
export class RGS extends BaseSegment {
  name = "RGS";

  constructor() {
    super();
    this.fields = [];
  }

  /** RGS-1: Set ID (SI, required) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** RGS-2: Segment Action Code (ID) e.g. A=Add, D=Delete, U=Update */
  segmentActionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** RGS-3: Resource Group ID (CE) */
  resourceGroupId(code: string, text?: string): this {
    if (text) {
      this.fields[2] = this.createField([[code, text]]);
    } else {
      this.fields[2] = this.createField(code);
    }
    return this;
  }

  static parse(segmentString: string, encoding: EncodingCharacters): Result<RGS> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RGS") {
      return { ok: false, err: new Err(`Expected RGS segment, got ${parts[0]}`) };
    }
    const seg = new RGS();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
