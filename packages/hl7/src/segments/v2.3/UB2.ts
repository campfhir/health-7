/**
 * UB2 segment definition for HL7 v2.3.
 *
 * position-tests: hand-written (repeating setters take spread arguments; see its test file)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment, type Repeated, repetitions } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * UB2 - UB92 Locator Segment (HL7 v2.3)
 * Contains UB92 uniform billing data for institutional claims. Supersedes UB1.
 */
export class UB2 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "UB2";

  constructor() {
    super();
    this.fields = [];
  }

  /** UB2-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** UB2-2 Co-Insurance Days (chainable). */
  coInsuranceDays(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** UB2-3 Condition Code (chainable). */
  conditionCode(...values: Repeated<string>[]): this {
    this.fields[2] = this.createRepeatingField(repetitions(values).map((value) => this.createField(value)));
    return this;
  }

  /** UB2-4 Covered Days (chainable). */
  coveredDays(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** UB2-5 Non-Covered Days (chainable). */
  nonCoveredDays(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /**
   * UB2-6 Value Amount and Code (chainable).
   * @param code - UB2-6.1 Code
   * @param amount - UB2-6.2 Amount
   */
  valueAmountCode(...values: Repeated<{ code: string; amount?: string }>[]): this {
    this.fields[5] = this.createRepeatingField(repetitions(values).map(({ code, amount }) => this.createField([code, amount || ""])));
    return this;
  }

  /**
   * UB2-7 Occurrence Code and Date (chainable).
   * @param code - UB2-7.1 Code
   * @param date - UB2-7.2 Date
   */
  occurrenceCodeDate(...values: Repeated<{ code: string; date?: string }>[]): this {
    this.fields[6] = this.createRepeatingField(repetitions(values).map(({ code, date }) => this.createField([code, date || ""])));
    return this;
  }

  /**
   * UB2-8 Occurrence Span Code/Dates (chainable).
   * @param code - UB2-8.1 Code
   * @param startDate - UB2-8.2 Start Date
   * @param endDate - UB2-8.3 End Date
   */
  occurrenceSpanCodeDates(...values: Repeated<{ code: string; startDate?: string; endDate?: string }>[]): this {
    this.fields[7] = this.createRepeatingField(repetitions(values).map(({ code, startDate, endDate }) => this.createField([code, startDate || "", endDate || ""])));
    return this;
  }

  /** UB2-9 UB92 Locator 2 (national) (chainable). */
  ub92Locator2(...values: Repeated<string>[]): this {
    this.fields[8] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /** UB2-10 UB92 Locator 11 (state) (chainable). */
  ub92Locator11(...values: Repeated<string>[]): this {
    this.fields[9] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /** UB2-11 UB92 Locator 31 (national) (chainable). */
  ub92Locator31(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** UB2-12 Document Control Number (chainable). */
  documentControlNumber(...values: Repeated<string>[]): this {
    this.fields[11] = this.createRepeatingField(repetitions(values).map((value) => this.createField(value)));
    return this;
  }

  /** UB2-13 UB92 Locator 49 (national) (chainable). */
  ub92Locator49(...values: Repeated<string>[]): this {
    this.fields[12] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /** UB2-14 UB92 Locator 56 (state) (chainable). */
  ub92Locator56(...values: Repeated<string>[]): this {
    this.fields[13] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /** UB2-15 UB92 Locator 57 (national) (chainable). */
  ub92Locator57(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** UB2-16 UB92 Locator 78 (state) (chainable). */
  ub92Locator78(...values: Repeated<string>[]): this {
    this.fields[15] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /** UB2-17 Special Visit Count (chainable). */
  specialVisitCount(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
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
