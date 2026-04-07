import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * UB2 - UB92 Locator Segment (HL7 v2.3)
 * Contains UB92 uniform billing data for institutional claims. Supersedes UB1.
 */
export class UB2 extends BaseSegment {
  name = "UB2";

  constructor() {
    super();
    this.fields = [];
  }

  /** UB2-1: Set ID (SI) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** UB2-2: Co-Insurance Days (NM) - UB92 field 9 */
  coInsuranceDays(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** UB2-3: Condition Code (ID) - UB92 fields 24-30 */
  conditionCode(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** UB2-4: Covered Days (NM) - UB92 field 7 */
  coveredDays(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** UB2-5: Non-Covered Days (NM) - UB92 field 8 */
  nonCoveredDays(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** UB2-6: Value Amount and Code (UVC) - UB92 fields 39-41 */
  valueAmountCode(code: string, amount?: string): this {
    this.fields[5] = this.createField([code, amount || ""]);
    return this;
  }

  /** UB2-7: Occurrence Code and Date (OCD) - UB92 fields 32-35 */
  occurrenceCodeDate(code: string, date?: string): this {
    this.fields[6] = this.createField([code, date || ""]);
    return this;
  }

  /** UB2-8: Occurrence Span Code/Dates (OSP) - UB92 field 36 */
  occurrenceSpanCodeDates(code: string, startDate?: string, endDate?: string): this {
    this.fields[7] = this.createField([code, startDate || "", endDate || ""]);
    return this;
  }

  /** UB2-9: UB92 Locator 2 (national) (ST) */
  ub92Locator2(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** UB2-10: UB92 Locator 11 (state) (ST) */
  ub92Locator11(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** UB2-11: UB92 Locator 31 (national) (ST) */
  ub92Locator31(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** UB2-12: Document Control Number (ST) - UB92 field 37 */
  documentControlNumber(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** UB2-13: UB92 Locator 49 (national) (ST) */
  ub92Locator49(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** UB2-14: UB92 Locator 56 (state) (ST) */
  ub92Locator56(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /** UB2-15: UB92 Locator 57 (national) (ST) */
  ub92Locator57(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** UB2-16: UB92 Locator 78 (state) (ST) */
  ub92Locator78(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** UB2-17: Special Visit Count (NM) */
  specialVisitCount(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  static parse(segmentString: string, encoding: EncodingCharacters): Result<UB2> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "UB2") {
      return { ok: false, err: new Err(`Expected UB2 segment, got ${parts[0]}`) };
    }
    const seg = new UB2();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
