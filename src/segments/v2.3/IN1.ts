/**
 * IN1 segment definition for HL7 v2.3.
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
 * IN1 - Insurance Segment (HL7 v2.3)
 * Contains insurance policy coverage information necessary for billing.
 */
export class IN1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "IN1";

  constructor() {
    super();
    this.fields = [];
  }

  /** IN1-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * IN1-2 Insurance Plan ID (chainable).
   * @param code - IN1-2.1 Code
   * @param text - IN1-2.2 Text
   * @param codingSystem - IN1-2.3 Coding System
   */
  insurancePlanId(code: string, text?: string, codingSystem?: string): this {
    this.fields[1] = this.createField([code, text || "", codingSystem || ""]);
    return this;
  }

  /**
   * IN1-3 Insurance Company ID (chainable).
   * @param id - IN1-3.1 ID Number
   * @param assigningAuthority - IN1-3.4 Assigning Authority
   */
  insuranceCompanyId(id: string, assigningAuthority?: string): this {
    this.fields[2] = this.createField([[id, "", "", assigningAuthority || ""]]);
    return this;
  }

  /** IN1-4 Insurance Company Name (chainable). */
  insuranceCompanyName(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * IN1-5 Insurance Company Address (chainable).
   * @param street - IN1-5.1 Street
   * @param city - IN1-5.3 City
   * @param state - IN1-5.4 State
   * @param zip - IN1-5.5 Zip
   */
  insuranceCompanyAddress(
    street: string,
    city?: string,
    state?: string,
    zip?: string,
  ): this {
    this.fields[4] = this.createField([
      [street, "", city || "", state || "", zip || ""],
    ]);
    return this;
  }

  /**
   * IN1-6 Insurance Co Contact Person (chainable).
   * @param familyName - IN1-6.1 Family Name
   * @param givenName - IN1-6.2 Given Name
   */
  insuranceContactPerson(familyName: string, givenName?: string): this {
    this.fields[5] = this.createField([[familyName, givenName || ""]]);
    return this;
  }

  /** IN1-7 Insurance Co Phone Number (chainable). */
  insurancePhoneNumber(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** IN1-8 Group Number (chainable). */
  groupNumber(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** IN1-9 Group Name (chainable). */
  groupName(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** IN1-10 Insured's Group Emp ID (chainable). */
  insuredGroupEmpId(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** IN1-11 Insured's Group Emp Name (chainable). */
  insuredGroupEmpName(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** IN1-12 Plan Effective Date (chainable). */
  planEffectiveDate(value: string, format?: never): this;
  /** IN1-12 Plan Effective Date (chainable). */
  planEffectiveDate(value: Date, format?: HL7DateLayout): this;
  planEffectiveDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[11] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** IN1-13 Plan Expiration Date (chainable). */
  planExpirationDate(value: string, format?: never): this;
  /** IN1-13 Plan Expiration Date (chainable). */
  planExpirationDate(value: Date, format?: HL7DateLayout): this;
  planExpirationDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[12] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /**
   * IN1-14 Authorization Information (chainable).
   * @param authorizationNumber - IN1-14.1 Authorization Number
   * @param date - IN1-14.2 Date
   * @param source - IN1-14.3 Source
   */
  authorizationInfo(
    authorizationNumber: string,
    date?: string,
    source?: string,
  ): this {
    this.fields[13] = this.createField([
      [authorizationNumber, date || "", source || ""],
    ]);
    return this;
  }

  /** IN1-15 Plan Type (chainable). */
  planType(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /**
   * IN1-16 Name Of Insured (chainable).
   * @param familyName - IN1-16.1 Family Name
   * @param givenName - IN1-16.2 Given Name
   * @param middleName - IN1-16.3 Middle Name
   */
  nameOfInsured(
    familyName: string,
    givenName?: string,
    middleName?: string,
  ): this {
    this.fields[15] = this.createField([
      [familyName, givenName || "", middleName || ""],
    ]);
    return this;
  }

  /**
   * IN1-17 Insured's Relationship To Patient (chainable).
   * @param code - IN1-17.1 Code
   * @param text - IN1-17.2 Text
   */
  insuredRelationship(code: string, text?: string): this {
    this.fields[16] = this.createField([code, text || ""]);
    return this;
  }

  /** IN1-18 Insured's Date Of Birth (chainable). */
  insuredDateOfBirth(value: string, format?: never): this;
  /** IN1-18 Insured's Date Of Birth (chainable). */
  insuredDateOfBirth(value: Date, format?: HL7DateLayout): this;
  insuredDateOfBirth(value: string | Date, format?: HL7DateLayout): this {
    this.fields[17] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /**
   * IN1-19 Insured's Address (chainable).
   * @param street - IN1-19.1 Street
   * @param city - IN1-19.3 City
   * @param state - IN1-19.4 State
   * @param zip - IN1-19.5 Zip
   */
  insuredAddress(
    street: string,
    city?: string,
    state?: string,
    zip?: string,
  ): this {
    this.fields[18] = this.createField([
      [street, "", city || "", state || "", zip || ""],
    ]);
    return this;
  }

  /** IN1-20 Assignment Of Benefits (chainable). */
  assignmentOfBenefits(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** IN1-21 Coordination Of Benefits (chainable). */
  coordinationOfBenefits(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** IN1-22 Coord Of Ben. Priority (chainable). */
  coordOfBenPriority(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /** IN1-23 Notice Of Admission Flag (chainable). */
  noticeOfAdmissionFlag(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /** IN1-35 Coverage Type (chainable). */
  coverageType(value: string): this {
    this.fields[34] = this.createField(value);
    return this;
  }

  /** IN1-36 Handicap (chainable). */
  handicap(value: string): this {
    this.fields[35] = this.createField(value);
    return this;
  }

  /** IN1-46 Policy Number (chainable). */
  policyNumber(value: string): this {
    this.fields[45] = this.createField(value);
    return this;
  }

  /** IN1-47 Policy Deductible (chainable). */
  policyDeductible(value: string): this {
    this.fields[46] = this.createField(value);
    return this;
  }

  /** IN1-49 Policy Type (chainable). */
  policyType(value: string): this {
    this.fields[48] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<IN1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "IN1") {
      return {
        ok: false,
        err: new Err(`Expected IN1 segment, got ${parts[0]}`),
      };
    }
    const seg = new IN1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
