/**
 * GT1 segment definition for HL7 v2.3.
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
 * GT1 - Guarantor Segment (HL7 v2.3)
 * Contains guarantor (financial responsibility) data for a patient visit.
 */
export class GT1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "GT1";

  constructor() {
    super();
    this.fields = [];
  }

  /** GT1-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * GT1-2 Guarantor Number (chainable).
   * @param id - GT1-2.1 ID Number
   * @param assigningAuthority - GT1-2.4 Assigning Authority
   */
  guarantorNumber(id: string, assigningAuthority?: string): this {
    this.fields[1] = this.createField([[id, "", "", assigningAuthority || ""]]);
    return this;
  }

  /**
   * GT1-3 Guarantor Name (chainable).
   * @param familyName - GT1-3.1 Family Name
   * @param givenName - GT1-3.2 Given Name
   * @param middleName - GT1-3.3 Middle Name
   */
  guarantorName(
    familyName: string,
    givenName?: string,
    middleName?: string,
  ): this {
    this.fields[2] = this.createField([
      [familyName, givenName || "", middleName || ""],
    ]);
    return this;
  }

  /**
   * GT1-4 Guarantor Spouse Name (chainable).
   * @param familyName - GT1-4.1 Family Name
   * @param givenName - GT1-4.2 Given Name
   */
  guarantorSpouseName(familyName: string, givenName?: string): this {
    this.fields[3] = this.createField([[familyName, givenName || ""]]);
    return this;
  }

  /**
   * GT1-5 Guarantor Address (chainable).
   * @param street - GT1-5.1 Street
   * @param city - GT1-5.3 City
   * @param state - GT1-5.4 State
   * @param zip - GT1-5.5 Zip
   * @param country - GT1-5.6 Country
   */
  guarantorAddress(
    street: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[4] = this.createField([
      [street, "", city || "", state || "", zip || "", country || ""],
    ]);
    return this;
  }

  /** GT1-6 Guarantor Phone Number - Home (chainable). */
  guarantorPhoneHome(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** GT1-7 Guarantor Phone Number - Business (chainable). */
  guarantorPhoneBusiness(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** GT1-8 Guarantor Date/Time Of Birth (chainable). */
  guarantorDateOfBirth(value: string, format?: never): this;
  /** GT1-8 Guarantor Date/Time Of Birth (chainable). */
  guarantorDateOfBirth(value: Date, format?: HL7DateLayout): this;
  guarantorDateOfBirth(value: string | Date, format?: HL7DateLayout): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** GT1-9 Guarantor Administrative Sex (chainable). */
  guarantorSex(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** GT1-10 Guarantor Type (chainable). */
  guarantorType(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /**
   * GT1-11 Guarantor Relationship (chainable).
   * @param code - GT1-11.1 Code
   * @param text - GT1-11.2 Text
   */
  guarantorRelationship(code: string, text?: string): this {
    this.fields[10] = this.createField([code, text || ""]);
    return this;
  }

  /** GT1-12 Guarantor SSN (chainable). */
  guarantorSsn(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** GT1-13 Guarantor Date - Begin (chainable). */
  guarantorDateBegin(value: string, format?: never): this;
  /** GT1-13 Guarantor Date - Begin (chainable). */
  guarantorDateBegin(value: Date, format?: HL7DateLayout): this;
  guarantorDateBegin(value: string | Date, format?: HL7DateLayout): this {
    this.fields[12] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** GT1-14 Guarantor Date - End (chainable). */
  guarantorDateEnd(value: string, format?: never): this;
  /** GT1-14 Guarantor Date - End (chainable). */
  guarantorDateEnd(value: Date, format?: HL7DateLayout): this;
  guarantorDateEnd(value: string | Date, format?: HL7DateLayout): this {
    this.fields[13] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** GT1-15 Guarantor Priority (chainable). */
  guarantorPriority(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** GT1-16 Guarantor Employer Name (chainable). */
  guarantorEmployerName(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /**
   * GT1-17 Guarantor Employer Address (chainable).
   * @param street - GT1-17.1 Street
   * @param city - GT1-17.3 City
   * @param state - GT1-17.4 State
   * @param zip - GT1-17.5 Zip
   */
  guarantorEmployerAddress(
    street: string,
    city?: string,
    state?: string,
    zip?: string,
  ): this {
    this.fields[16] = this.createField([
      [street, "", city || "", state || "", zip || ""],
    ]);
    return this;
  }

  /** GT1-19 Guarantor Employee ID Number (chainable). */
  guarantorEmployeeId(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

  /** GT1-20 Guarantor Employment Status (chainable). */
  guarantorEmploymentStatus(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** GT1-21 Guarantor Organization Name (chainable). */
  guarantorOrganizationName(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<GT1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "GT1") {
      return {
        ok: false,
        err: new Err(`Expected GT1 segment, got ${parts[0]}`),
      };
    }
    const seg = new GT1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
