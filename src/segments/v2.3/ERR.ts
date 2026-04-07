import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * ERR - Error Segment (HL7 v2.3)
 */
export class ERR extends BaseSegment {
  name = "ERR";

  constructor() {
    super();
    this.fields = [];
  }

  /** ERR-1: Error Code and Location (ELD, deprecated in v2.5) */
  errorCodeAndLocation(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** ERR-2: Error Location (ERL) */
  errorLocation(
    segmentId: string,
    segmentSequence?: string,
    fieldPosition?: string,
    fieldRepetition?: string,
    componentNumber?: string,
  ): this {
    this.fields[1] = this.createField([
      [
        segmentId,
        segmentSequence || "",
        fieldPosition || "",
        fieldRepetition || "",
        componentNumber || "",
      ],
    ]);
    return this;
  }

  /** ERR-3: HL7 Error Code (CWE, required) */
  hl7ErrorCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[2] = this.createField([
      [code, text || "", codingSystem || ""],
    ]);
    return this;
  }

  /** ERR-4: Severity (ID, required) - e.g. W=Warning, I=Information, E=Error */
  severity(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** ERR-5: Application Error Code (CWE) */
  applicationErrorCode(code: string, text?: string): this {
    this.fields[4] = this.createField([[code, text || ""]]);
    return this;
  }

  /** ERR-6: Application Error Parameter (ST) */
  applicationErrorParameter(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** ERR-7: Diagnostic Information (TX) */
  diagnosticInfo(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** ERR-8: User Message (TX) */
  userMessage(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** ERR-9: Inform Person Indicator (IS) */
  informPersonIndicator(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ERR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ERR") {
      return {
        ok: false,
        err: new Err(`Expected ERR segment, got ${parts[0]}`),
      };
    }
    const seg = new ERR();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
