/**
 * ERR segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * ERR - Error Segment (HL7 v2.3)
 */
export class ERR extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "ERR";

  constructor() {
    super();
    this.fields = [];
  }

  /** ERR-1 Error Code and Location (chainable). */
  errorCodeAndLocation(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * ERR-2 Error Location (chainable).
   * @param segmentId - ERR-2.1 Segment ID
   * @param segmentSequence - ERR-2.2 Segment Sequence
   * @param fieldPosition - ERR-2.3 Field Position
   * @param fieldRepetition - ERR-2.4 Field Repetition
   * @param componentNumber - ERR-2.5 Component Number
   */
  errorLocation(
    segmentId: string,
    segmentSequence?: string,
    fieldPosition?: string,
    fieldRepetition?: string,
    componentNumber?: string,
  ): this {
    this.fields[1] = this.createComponentsField([
      segmentId,
      segmentSequence || "",
      fieldPosition || "",
      fieldRepetition || "",
      componentNumber || "",
    ]);
    return this;
  }

  /**
   * ERR-3 HL7 Error Code (chainable).
   * @param code - ERR-3.1 Code
   * @param text - ERR-3.2 Text
   * @param codingSystem - ERR-3.3 Coding System
   */
  hl7ErrorCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[2] = this.createComponentsField([code, text || "", codingSystem || ""]);
    return this;
  }

  /** ERR-4 Severity (chainable). */
  severity(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * ERR-5 Application Error Code (chainable).
   * @param code - ERR-5.1 Code
   * @param text - ERR-5.2 Text
   */
  applicationErrorCode(code: string, text?: string): this {
    this.fields[4] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /** ERR-6 Application Error Parameter (chainable). */
  applicationErrorParameter(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** ERR-7 Diagnostic Information (chainable). */
  diagnosticInfo(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** ERR-8 User Message (chainable). */
  userMessage(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** ERR-9 Inform Person Indicator (chainable). */
  informPersonIndicator(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
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
