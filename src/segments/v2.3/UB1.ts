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

  /** UB1-1: Set ID (SI) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** UB1-2: Blood Deductible (NM) - UB82 field 8 */
  bloodDeductible(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** UB1-3: Blood Furnished Pints Of (NM) - UB82 field 9a */
  bloodFurnishedPints(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** UB1-4: Blood Replaced Pints (NM) - UB82 field 9b */
  bloodReplacedPints(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** UB1-5: Blood Not Replaced Pints (NM) - UB82 field 9c */
  bloodNotReplacedPints(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** UB1-6: Co-Insurance Days (NM) - UB82 field 12 */
  coInsuranceDays(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** UB1-7: Condition Code (ID) - UB82 fields 24-30 */
  conditionCode(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** UB1-8: Covered Days (NM) - UB82 field 23 */
  coveredDays(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** UB1-9: Non Covered Days (NM) - UB82 field 24 */
  nonCoveredDays(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** UB1-10: Value Amount and Code (UVC) - UB82 fields 39-41 */
  valueAmountCode(code: string, amount?: string): this {
    this.fields[9] = this.createField([code, amount || ""]);
    return this;
  }

  /** UB1-11: Number Of Grace Days (NM) - UB82 field 90 */
  numberOfGraceDays(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** UB1-12: Special Program Indicator (CE) - UB82 field 44 */
  specialProgramIndicator(code: string, text?: string): this {
    this.fields[11] = this.createField([code, text || ""]);
    return this;
  }

  /** UB1-13: PSRO/UR Approval Indicator (ID) - UB82 field 87 */
  psroUrApprovalIndicator(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** UB1-14: PSRO/UR Approved Stay-Fm (DT) - UB82 field 88 */
  psroUrApprovedStayFrom(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /** UB1-15: PSRO/UR Approved Stay-To (DT) - UB82 field 88 */
  psroUrApprovedStayTo(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** UB1-16: Occurrence (OCD) - UB82 fields 32-35 */
  occurrence(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** UB1-17: Occurrence Span (OSP) - UB82 field 36 */
  occurrenceSpan(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** UB1-18: Occur Span Start Date (DT) - UB82 field 36 */
  occurSpanStartDate(value: string, format?: never): this;
  /** Sets the occur span start date field (chainable). */
  occurSpanStartDate(value: Date, format?: HL7DateLayout): this;
  occurSpanStartDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[17] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** UB1-19: Occur Span End Date (DT) - UB82 field 36 */
  occurSpanEndDate(value: string, format?: never): this;
  /** Sets the occur span end date field (chainable). */
  occurSpanEndDate(value: Date, format?: HL7DateLayout): this;
  occurSpanEndDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[18] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** UB1-20: UB-82 Locator 2 (ST) */
  ub82Locator2(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** UB1-21: UB-82 Locator 9 (ST) */
  ub82Locator9(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** UB1-22: UB-82 Locator 27 (ST) */
  ub82Locator27(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /** UB1-23: UB-82 Locator 45 (ST) */
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
