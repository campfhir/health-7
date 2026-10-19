/**
 * QRF segment definition for HL7 v2.3.
 *
 * position-tests: hand-written
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment, type Repeated, repetitions } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * QRF - Original-Style Query Filter Segment (HL7 v2.3)
 * Narrows a query by location, date range, user and other subject filters.
 */
export class QRF extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "QRF";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * QRF-1 Where Subject Filter (chainable, repeating).
   * @param values - One entry per repetition
   */
  whereSubjectFilter(...values: Repeated<string>[]): this {
    this.fields[0] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /** QRF-2 When Data Start Date/Time (chainable). */
  whenDataStartDateTime(value: string, format?: never): this;
  /** QRF-2 When Data Start Date/Time (chainable). */
  whenDataStartDateTime(value: Date, format?: HL7DateTimeLayout): this;
  whenDataStartDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[1] = this.createField(formatHL7Date(value, format ?? DateTimeLayout));
    return this;
  }

  /** QRF-3 When Data End Date/Time (chainable). */
  whenDataEndDateTime(value: string, format?: never): this;
  /** QRF-3 When Data End Date/Time (chainable). */
  whenDataEndDateTime(value: Date, format?: HL7DateTimeLayout): this;
  whenDataEndDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[2] = this.createField(formatHL7Date(value, format ?? DateTimeLayout));
    return this;
  }

  /**
   * QRF-4 What User Qualifier (chainable, repeating).
   * @param values - One entry per repetition
   */
  whatUserQualifier(...values: Repeated<string>[]): this {
    this.fields[3] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /**
   * QRF-5 Other QRY Subject Filter (chainable, repeating).
   * @param values - One entry per repetition
   */
  otherQrySubjectFilter(...values: Repeated<string>[]): this {
    this.fields[4] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /**
   * QRF-6 Which Date/Time Qualifier (chainable, repeating).
   * @param values - One entry per repetition
   */
  whichDateTimeQualifier(...values: Repeated<string>[]): this {
    this.fields[5] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /**
   * QRF-7 Which Date/Time Status Qualifier (chainable, repeating).
   * @param values - One entry per repetition
   */
  whichDateTimeStatusQualifier(...values: Repeated<string>[]): this {
    this.fields[6] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /**
   * QRF-8 Date/Time Selection Qualifier (chainable, repeating).
   * @param values - One entry per repetition
   */
  dateTimeSelectionQualifier(...values: Repeated<string>[]): this {
    this.fields[7] = this.createRepeatingField(repetitions(values).map((v) => this.createField(v)));
    return this;
  }

  /**
   * QRF-9 When Quantity/Timing Qualifier (chainable).
   * Components are written in TQ order; the TQ layout is not yet modelled as named parameters.
   * @param components - TQ components, in order
   */
  whenQuantityTimingQualifier(...components: string[]): this {
    this.fields[8] = this.createComponentsField(components);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<QRF> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "QRF") {
      return {
        ok: false,
        err: new Err(`Expected QRF segment, got ${parts[0]}`),
      };
    }
    const seg = new QRF();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
