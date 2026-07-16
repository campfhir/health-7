/**
 * DRG segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * DRG - Diagnosis Related Group Segment (HL7 v2.3)
 * Communicates the DRG assignment and associated financial information.
 */
export class DRG extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "DRG";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * DRG-1 Diagnostic Related Group (chainable).
   * @param code - DRG-1.1 Code
   * @param text - DRG-1.2 Text
   * @param codingSystem - DRG-1.3 Coding System
   */
  diagnosticRelatedGroup(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[0] = this.createField([code, text || "", codingSystem || ""]);
    return this;
  }

  /** DRG-2 DRG Assigned Date/Time (chainable). */
  drgAssignedDateTime(value: string, format?: never): this;
  /** DRG-2 DRG Assigned Date/Time (chainable). */
  drgAssignedDateTime(value: Date, format?: HL7DateTimeLayout): this;
  drgAssignedDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[1] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** DRG-3 DRG Approval Indicator (chainable). */
  drgApprovalIndicator(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** DRG-4 DRG Grouper Review Code (chainable). */
  drgGrouperReviewCode(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * DRG-5 Outlier Type (chainable).
   * @param code - DRG-5.1 Code
   * @param text - DRG-5.2 Text
   */
  outlierType(code: string, text?: string): this {
    this.fields[4] = this.createField([code, text || ""]);
    return this;
  }

  /** DRG-6 Outlier Days (chainable). */
  outlierDays(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** DRG-7 Outlier Cost (chainable). */
  outlierCost(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** DRG-8 DRG Payor (chainable). */
  drgPayor(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** DRG-9 Outlier Reimbursement (chainable). */
  outlierReimbursement(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** DRG-10 Confidential Indicator (chainable). */
  confidentialIndicator(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** DRG-11 DRG Transfer Type (chainable). */
  drgTransferType(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<DRG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DRG") {
      return {
        ok: false,
        err: new Err(`Expected DRG segment, got ${parts[0]}`),
      };
    }
    const seg = new DRG();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
