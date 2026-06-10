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

  /** GT1-1: Set ID (SI) - Sequence number of this segment */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** GT1-2: Guarantor Number (CX) - Identifier for the guarantor */
  guarantorNumber(id: string, assigningAuthority?: string): this {
    this.fields[1] = this.createField([[id, "", "", assigningAuthority || ""]]);
    return this;
  }

  /** GT1-3: Guarantor Name (XPN) - Name of the guarantor */
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

  /** GT1-4: Guarantor Spouse Name (XPN) - Name of the guarantor's spouse */
  guarantorSpouseName(familyName: string, givenName?: string): this {
    this.fields[3] = this.createField([[familyName, givenName || ""]]);
    return this;
  }

  /** GT1-5: Guarantor Address (XAD) - Address of the guarantor */
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

  /** GT1-6: Guarantor Phone Number - Home (XTN) */
  guarantorPhoneHome(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** GT1-7: Guarantor Phone Number - Business (XTN) */
  guarantorPhoneBusiness(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** GT1-8: Guarantor Date/Time Of Birth (TS) */
  guarantorDateOfBirth(value: string, format?: never): this;
  /** Sets the guarantor date of birth field (chainable). */
  guarantorDateOfBirth(value: Date, format?: HL7DateLayout): this;
  guarantorDateOfBirth(value: string | Date, format?: HL7DateLayout): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** GT1-9: Guarantor Administrative Sex (IS) - e.g. M/F/U */
  guarantorSex(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** GT1-10: Guarantor Type (IS) */
  guarantorType(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** GT1-11: Guarantor Relationship (CE) - Relationship to patient */
  guarantorRelationship(code: string, text?: string): this {
    this.fields[10] = this.createField([code, text || ""]);
    return this;
  }

  /** GT1-12: Guarantor SSN (ST) - Social Security Number */
  guarantorSsn(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** GT1-13: Guarantor Date - Begin (DT) */
  guarantorDateBegin(value: string, format?: never): this;
  /** Sets the guarantor date begin field (chainable). */
  guarantorDateBegin(value: Date, format?: HL7DateLayout): this;
  guarantorDateBegin(value: string | Date, format?: HL7DateLayout): this {
    this.fields[12] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** GT1-14: Guarantor Date - End (DT) */
  guarantorDateEnd(value: string, format?: never): this;
  /** Sets the guarantor date end field (chainable). */
  guarantorDateEnd(value: Date, format?: HL7DateLayout): this;
  guarantorDateEnd(value: string | Date, format?: HL7DateLayout): this {
    this.fields[13] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** GT1-15: Guarantor Priority (NM) */
  guarantorPriority(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** GT1-16: Guarantor Employer Name (XPN) */
  guarantorEmployerName(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** GT1-17: Guarantor Employer Address (XAD) */
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

  /** GT1-19: Guarantor Employee ID Number (CX) */
  guarantorEmployeeId(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

  /** GT1-20: Guarantor Employment Status (IS) */
  guarantorEmploymentStatus(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** GT1-21: Guarantor Organization Name (XON) */
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
