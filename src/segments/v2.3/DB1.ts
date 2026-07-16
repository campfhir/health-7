/**
 * DB1 segment definition for HL7 v2.3.
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
 * DB1 - Disability Information Segment (HL7 v2.3)
 * Contains information about a person's disability status and related dates.
 */
export class DB1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "DB1";

  constructor() {
    super();
    this.fields = [];
  }

  /** DB1-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** DB1-2 Disabled Person Code (chainable). */
  disabledPersonCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** DB1-3 Disabled Person Identifier (chainable). */
  disabledPersonIdentifier(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** DB1-4 Disability Indicator (chainable). */
  disabilityIndicator(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** DB1-5 Disability Start Date (chainable). */
  disabilityStartDate(value: string, format?: never): this;
  /** DB1-5 Disability Start Date (chainable). */
  disabilityStartDate(value: Date, format?: HL7DateLayout): this;
  disabilityStartDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[4] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** DB1-6 Disability End Date (chainable). */
  disabilityEndDate(value: string, format?: never): this;
  /** DB1-6 Disability End Date (chainable). */
  disabilityEndDate(value: Date, format?: HL7DateLayout): this;
  disabilityEndDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** DB1-7 Disability Return to Work Date (chainable). */
  disabilityReturnToWorkDate(value: string, format?: never): this;
  /** DB1-7 Disability Return to Work Date (chainable). */
  disabilityReturnToWorkDate(value: Date, format?: HL7DateLayout): this;
  disabilityReturnToWorkDate(
    value: string | Date,
    format?: HL7DateLayout,
  ): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** DB1-8 Disability Unable to Work Date (chainable). */
  disabilityUnableToWorkDate(value: string, format?: never): this;
  /** DB1-8 Disability Unable to Work Date (chainable). */
  disabilityUnableToWorkDate(value: Date, format?: HL7DateLayout): this;
  disabilityUnableToWorkDate(
    value: string | Date,
    format?: HL7DateLayout,
  ): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<DB1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DB1") {
      return {
        ok: false,
        err: new Err(`Expected DB1 segment, got ${parts[0]}`),
      };
    }
    const seg = new DB1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
