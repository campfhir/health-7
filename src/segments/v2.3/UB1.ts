/**
 * UB1 segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  DateLayout,
  formatHL7Date,
  type HL7DateLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * UB1 - UB82 Data Segment (HL7 v2.3)
 * Contains UB82 uniform billing data for institutional claims. Largely superseded by UB2.
 */
export class UB1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "UB1";

  constructor() {
    super();
    this.fields = [];
  }

  /** UB1-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** UB1-2 Blood Deductible (chainable). */
  bloodDeductible(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** UB1-3 Blood Furnished Pints Of (chainable). */
  bloodFurnishedPints(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** UB1-4 Blood Replaced Pints (chainable). */
  bloodReplacedPints(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** UB1-5 Blood Not Replaced Pints (chainable). */
  bloodNotReplacedPints(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** UB1-6 Co-Insurance Days (chainable). */
  coInsuranceDays(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** UB1-7 Condition Code (chainable). */
  conditionCode(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** UB1-8 Covered Days (chainable). */
  coveredDays(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** UB1-9 Non Covered Days (chainable). */
  nonCoveredDays(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * UB1-10 Value Amount and Code (chainable).
   * @param code - UB1-10.1 Code
   * @param amount - UB1-10.2 Amount
   */
  valueAmountCode({ code, amount }: { code: string; amount?: string }): this {
    this.fields[9] = this.createField([code, amount || ""]);
    return this;
  }

  /** UB1-11 Number Of Grace Days (chainable). */
  numberOfGraceDays(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * UB1-12 Special Program Indicator (chainable).
   * @param code - UB1-12.1 Code
   * @param text - UB1-12.2 Text
   */
  specialProgramIndicator({ code, text }: { code: string; text?: string }): this {
    this.fields[11] = this.createField([code, text || ""]);
    return this;
  }

  /** UB1-13 PSRO/UR Approval Indicator (chainable). */
  psroUrApprovalIndicator(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** UB1-14 PSRO/UR Approved Stay-Fm (chainable). */
  psroUrApprovedStayFrom(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /** UB1-15 PSRO/UR Approved Stay-To (chainable). */
  psroUrApprovedStayTo(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** UB1-16 Occurrence (chainable). */
  occurrence(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** UB1-17 Occurrence Span (chainable). */
  occurrenceSpan(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** UB1-18 Occur Span Start Date (chainable). */
  occurSpanStartDate(value: string, format?: never): this;
  /** UB1-18 Occur Span Start Date (chainable). */
  occurSpanStartDate(value: Date, format?: HL7DateLayout): this;
  occurSpanStartDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[17] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** UB1-19 Occur Span End Date (chainable). */
  occurSpanEndDate(value: string, format?: never): this;
  /** UB1-19 Occur Span End Date (chainable). */
  occurSpanEndDate(value: Date, format?: HL7DateLayout): this;
  occurSpanEndDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[18] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** UB1-20 UB-82 Locator 2 (chainable). */
  ub82Locator2(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** UB1-21 UB-82 Locator 9 (chainable). */
  ub82Locator9(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** UB1-22 UB-82 Locator 27 (chainable). */
  ub82Locator27(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /** UB1-23 UB-82 Locator 45 (chainable). */
  ub82Locator45(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<UB1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "UB1") {
      return {
        ok: false,
        err: new Err(`Expected UB1 segment, got ${parts[0]}`),
      };
    }
    const seg = new UB1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
