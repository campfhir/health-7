/**
 * PRA segment definition for HL7 v2.3.
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
 * PRA - Practitioner Detail Segment
 *
 * Provides additional detail about a practitioner (physician, etc.).
 * Optionally follows an STF segment in an MFN^M02 message.
 *
 * HL7 v2.3 Specification
 */
export class PRA extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "PRA";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * PRA-1 Primary Key Value (chainable).
   * @param identifier - PRA-1.1 Identifier
   * @param text - PRA-1.2 Text
   * @param codingSystem - PRA-1.3 Coding System
   */
  primaryKeyValue(
    identifier: string,
    text?: string,
    codingSystem?: string,
  ): this {
    if (text || codingSystem) {
      this.fields[0] = this.createField([
        [identifier, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[0] = this.createField(identifier);
    }
    return this;
  }

  /**
   * PRA-2 Practitioner Group (chainable).
   * @param identifier - PRA-2.1 Identifier
   * @param text - PRA-2.2 Text
   */
  practitionerGroup(identifier: string, text?: string): this {
    if (text) {
      this.fields[1] = this.createField([identifier, text]);
    } else {
      this.fields[1] = this.createField(identifier);
    }
    return this;
  }

  /** PRA-3 Practitioner Category (chainable). */
  practitionerCategory(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** PRA-4 Provider Billing (chainable). */
  providerBilling(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * PRA-5 Specialty (chainable).
   * @param specialtyName - PRA-5.1 Specialty Name
   * @param governingBoard - PRA-5.2 Governing Board
   * @param eligibleOrCertified - PRA-5.3 Eligible Or Certified
   * @param dateOfCertification - PRA-5.4 Date Of Certification
   */
  specialty(
    specialtyName: string,
    governingBoard?: string,
    eligibleOrCertified?: string,
    dateOfCertification?: string,
  ): this {
    const components = [
      specialtyName,
      governingBoard ?? "",
      eligibleOrCertified ?? "",
      dateOfCertification ?? "",
    ];
    this.fields[4] = this.createField(components);
    return this;
  }

  /**
   * PRA-6 Practitioner ID Numbers (chainable).
   * @param idNumber - PRA-6.1 ID Number
   * @param typeOfIdNumber - PRA-6.2 Type Of ID Number
   * @param stateOrQualifying - PRA-6.3 State Or Qualifying
   * @param expireDate - PRA-6.4 Expire Date
   */
  practitionerIdNumbers(
    idNumber: string,
    typeOfIdNumber?: string,
    stateOrQualifying?: string,
    expireDate?: string,
  ): this {
    const components = [
      idNumber,
      typeOfIdNumber ?? "",
      stateOrQualifying ?? "",
      expireDate ?? "",
    ];
    this.fields[5] = this.createField(components);
    return this;
  }

  /** PRA-8 Date Entered Practice (chainable). */
  dateEnteredPractice(value: string, format?: never): this;
  /** PRA-8 Date Entered Practice (chainable). */
  dateEnteredPractice(value: Date, format?: HL7DateLayout): this;
  dateEnteredPractice(value: string | Date, format?: HL7DateLayout): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** Get primary key value. */
  getPrimaryKeyValue(): string {
    return this.fields[0]?.components[0]?.subComponents[0] ?? "";
  }

  /** Get practitioner category. */
  getPractitionerCategory(): string {
    return this.fields[2]?.components[0]?.subComponents[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PRA> {
    const parts = segmentString.split(encoding.fieldSeparator);

    if (parts[0] !== "PRA") {
      return {
        ok: false,
        err: new Err(`Expected PRA segment, got ${parts[0]}`),
      };
    }

    const pra = new PRA();
    for (let i = 1; i < parts.length; i++) {
      pra.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }

    return { ok: true, val: pra };
  }
}
