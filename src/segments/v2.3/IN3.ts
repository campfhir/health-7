/**
 * IN3 segment definition for HL7 v2.3.
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
  type HL7DateLayout,
  DateTimeLayout,
  type HL7DateTimeLayout,
  DateLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * IN3 - Insurance Additional Information, Certification Segment (HL7 v2.3)
 * Communicates certification and pre-authorization information for insurance coverage.
 */
export class IN3 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "IN3";

  constructor() {
    super();
    this.fields = [];
  }

  /** IN3-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** IN3-2 Certification Number (chainable). */
  certificationNumber(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * IN3-3 Certified By (chainable).
   * @param id - IN3-3.1 ID Number
   * @param familyName - IN3-3.2 Family Name
   * @param givenName - IN3-3.3 Given Name
   */
  certifiedBy(id: string, familyName?: string, givenName?: string): this {
    this.fields[2] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** IN3-4 Certification Required (chainable). */
  certificationRequired(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** IN3-5 Penalty (chainable). */
  penalty(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** IN3-6 Certification Date/Time (chainable). */
  certificationDateTime(value: string, format?: never): this;
  /** IN3-6 Certification Date/Time (chainable). */
  certificationDateTime(value: Date, format?: HL7DateTimeLayout): this;
  certificationDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** IN3-7 Certification Modify Date/Time (chainable). */
  certificationModifyDateTime(value: string, format?: never): this;
  /** IN3-7 Certification Modify Date/Time (chainable). */
  certificationModifyDateTime(value: Date, format?: HL7DateTimeLayout): this;
  certificationModifyDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * IN3-8 Operator (chainable).
   * @param id - IN3-8.1 ID Number
   * @param familyName - IN3-8.2 Family Name
   * @param givenName - IN3-8.3 Given Name
   */
  operator(id: string, familyName?: string, givenName?: string): this {
    this.fields[7] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** IN3-9 Certification Begin Date (chainable). */
  certificationBeginDate(value: string, format?: never): this;
  /** IN3-9 Certification Begin Date (chainable). */
  certificationBeginDate(value: Date, format?: HL7DateLayout): this;
  certificationBeginDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[8] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** IN3-10 Certification End Date (chainable). */
  certificationEndDate(value: string, format?: never): this;
  /** IN3-10 Certification End Date (chainable). */
  certificationEndDate(value: Date, format?: HL7DateLayout): this;
  certificationEndDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[9] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** IN3-11 Days (chainable). */
  days(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * IN3-12 Non-Concur Code/Description (chainable).
   * @param code - IN3-12.1 Code
   * @param text - IN3-12.2 Text
   */
  nonConcurCodeDescription(code: string, text?: string): this {
    this.fields[11] = this.createField([code, text || ""]);
    return this;
  }

  /** IN3-13 Non-Concur Effective Date/Time (chainable). */
  nonConcurEffectiveDateTime(value: string, format?: never): this;
  /** IN3-13 Non-Concur Effective Date/Time (chainable). */
  nonConcurEffectiveDateTime(value: Date, format?: HL7DateTimeLayout): this;
  nonConcurEffectiveDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[12] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * IN3-14 Physician Reviewer (chainable).
   * @param id - IN3-14.1 ID Number
   * @param familyName - IN3-14.2 Family Name
   * @param givenName - IN3-14.3 Given Name
   */
  physicianReviewer(id: string, familyName?: string, givenName?: string): this {
    this.fields[13] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** IN3-15 Certification Contact (chainable). */
  certificationContact(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** IN3-16 Certification Contact Phone Number (chainable). */
  certificationContactPhone(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /**
   * IN3-17 Appeal Reason (chainable).
   * @param code - IN3-17.1 Code
   * @param text - IN3-17.2 Text
   */
  appealReason(code: string, text?: string): this {
    this.fields[16] = this.createField([code, text || ""]);
    return this;
  }

  /**
   * IN3-18 Certification Agency (chainable).
   * @param code - IN3-18.1 Code
   * @param text - IN3-18.2 Text
   */
  certificationAgency(code: string, text?: string): this {
    this.fields[17] = this.createField([code, text || ""]);
    return this;
  }

  /** IN3-19 Certification Agency Phone Number (chainable). */
  certificationAgencyPhone(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

  /** IN3-20 Pre-Certification Required (chainable). */
  preCertificationRequired(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** IN3-21 Case Manager (chainable). */
  caseManager(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** IN3-22 Second Opinion Date (chainable). */
  secondOpinionDate(value: string, format?: never): this;
  /** IN3-22 Second Opinion Date (chainable). */
  secondOpinionDate(value: Date, format?: HL7DateLayout): this;
  secondOpinionDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[21] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** IN3-23 Second Opinion Status (chainable). */
  secondOpinionStatus(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /** IN3-24 Second Opinion Documentation Received (chainable). */
  secondOpinionDocumentationReceived(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }

  /**
   * IN3-25 Second Opinion Physician (chainable).
   * @param id - IN3-25.1 ID Number
   * @param familyName - IN3-25.2 Family Name
   * @param givenName - IN3-25.3 Given Name
   */
  secondOpinionPhysician(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    this.fields[24] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<IN3> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "IN3") {
      return {
        ok: false,
        err: new Err(`Expected IN3 segment, got ${parts[0]}`),
      };
    }
    const seg = new IN3();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
