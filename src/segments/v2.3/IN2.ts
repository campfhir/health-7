/**
 * IN2 segment definition for HL7 v2.3.
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
 * IN2 - Insurance Additional Information Segment (HL7 v2.3)
 * Contains additional insurance policy coverage and insured information.
 */
export class IN2 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "IN2";

  constructor() {
    super();
    this.fields = [];
  }

  /** IN2-1 Insured's Employee ID (chainable). */
  insuredEmployeeId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** IN2-2 Insured's Social Security Number (chainable). */
  insuredSsn(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * IN2-3 Insured's Employer's Name and ID (chainable).
   * @param id - IN2-3.1 ID Number
   * @param familyName - IN2-3.2 Family Name
   * @param givenName - IN2-3.3 Given Name
   */
  insuredEmployerName(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    this.fields[2] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** IN2-4 Employer Information Data (chainable). */
  employerInfoData(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** IN2-6 Medicare Health Ins Card Number (chainable). */
  medicareHicNumber(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /**
   * IN2-7 Medicaid Case Name (chainable).
   * @param familyName - IN2-7.1 Family Name
   * @param givenName - IN2-7.2 Given Name
   */
  medicaidCaseName(familyName: string, givenName?: string): this {
    this.fields[6] = this.createField([[familyName, givenName || ""]]);
    return this;
  }

  /** IN2-8 Medicaid Case Number (chainable). */
  medicaidCaseNumber(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** IN2-55 Relationship to the Patient Start Date (chainable). */
  relationshipStartDate(value: string, format?: never): this;
  /** IN2-55 Relationship to the Patient Start Date (chainable). */
  relationshipStartDate(value: Date, format?: HL7DateLayout): this;
  relationshipStartDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[54] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** IN2-56 Relationship to the Patient Stop Date (chainable). */
  relationshipStopDate(value: string, format?: never): this;
  /** IN2-56 Relationship to the Patient Stop Date (chainable). */
  relationshipStopDate(value: Date, format?: HL7DateLayout): this;
  relationshipStopDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[55] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /**
   * IN2-72 Patient's Relationship to Insured (chainable).
   * @param code - IN2-72.1 Code
   * @param text - IN2-72.2 Text
   */
  relationshipToPatient(code: string, text?: string): this {
    this.fields[71] = this.createField([code, text || ""]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<IN2> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "IN2") {
      return {
        ok: false,
        err: new Err(`Expected IN2 segment, got ${parts[0]}`),
      };
    }
    const seg = new IN2();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
