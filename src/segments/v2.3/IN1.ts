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
  DateTimeLayout,
  formatHL7Date,
  type HL7DateLayout,
  type HL7DateTimeLayout,
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
    this.fields[2] = this.createComponentsField([
      id,
      "",
      "",
      assigningAuthority || "",
    ]);
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
    this.fields[4] = this.createComponentsField([
      street,
      "",
      city || "",
      state || "",
      zip || "",
    ]);
    return this;
  }

  /**
   * IN1-6 Insurance Co Contact Person (chainable).
   * @param familyName - IN1-6.1 Family Name
   * @param givenName - IN1-6.2 Given Name
   */
  insuranceContactPerson(familyName: string, givenName?: string): this {
    this.fields[5] = this.createComponentsField([familyName, givenName || ""]);
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
    this.fields[13] = this.createComponentsField([
      authorizationNumber,
      date || "",
      source || "",
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
    this.fields[15] = this.createComponentsField([
      familyName,
      givenName || "",
      middleName || "",
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
    this.fields[18] = this.createComponentsField([
      street,
      "",
      city || "",
      state || "",
      zip || "",
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

  /** IN1-47 Coverage Type (chainable). */
  coverageType(value: string): this {
    this.fields[46] = this.createField(value);
    return this;
  }

  /** IN1-48 Handicap (chainable). */
  handicap(value: string): this {
    this.fields[47] = this.createField(value);
    return this;
  }

  /** IN1-36 Policy Number (chainable). */
  policyNumber(value: string): this {
    this.fields[35] = this.createField(value);
    return this;
  }

  /** IN1-37 Policy Deductible (chainable). */
  policyDeductible(value: string): this {
    this.fields[36] = this.createField(value);
    return this;
  }

  /** IN1-24 Notice Of Admission Date (chainable). */
  noticeOfAdmissionDate(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }

  /** IN1-25 Report Of Eligibility Flag (chainable). */
  reportOfEligibilityFlag(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }

  /** IN1-26 Report Of Eligibility Date (chainable). */
  reportOfEligibilityDate(value: string): this {
    this.fields[25] = this.createField(value);
    return this;
  }

  /** IN1-27 Release Information Code (chainable). */
  releaseInformationCode(value: string): this {
    this.fields[26] = this.createField(value);
    return this;
  }

  /** IN1-28 Pre-Admit Cert (PAC) (chainable). */
  preAdmitCert(value: string): this {
    this.fields[27] = this.createField(value);
    return this;
  }

  /** IN1-29 Verification Date/Time (chainable). */
  verificationDateTime(value: string, format?: never): this;
  /** IN1-29 Verification Date/Time (chainable). */
  verificationDateTime(value: Date, format?: HL7DateTimeLayout): this;
  verificationDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[28] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * IN1-30 Verification By (chainable).
   * @param id - IN1-30.1 ID Number
   * @param familyName - IN1-30.2 Family Name
   * @param givenName - IN1-30.3 Given Name
   */
  verificationBy(id: string, familyName?: string, givenName?: string): this {
    this.fields[29] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** IN1-31 Type Of Agreement Code (chainable). */
  typeOfAgreementCode(value: string): this {
    this.fields[30] = this.createField(value);
    return this;
  }

  /** IN1-32 Billing Status (chainable). */
  billingStatus(value: string): this {
    this.fields[31] = this.createField(value);
    return this;
  }

  /** IN1-33 Lifetime Reserve Days (chainable). */
  lifetimeReserveDays(value: string): this {
    this.fields[32] = this.createField(value);
    return this;
  }

  /** IN1-34 Delay Before L.R. Day (chainable). */
  delayBeforeLRDay(value: string): this {
    this.fields[33] = this.createField(value);
    return this;
  }

  /** IN1-35 Company Plan Code (chainable). */
  companyPlanCode(value: string): this {
    this.fields[34] = this.createField(value);
    return this;
  }

  /**
   * IN1-38 Policy Limit - Amount (chainable).
   * @param price - IN1-38.1 Price
   * @param priceType - IN1-38.2 Price Type
   */
  policyLimitAmount(price: string, priceType?: string): this {
    this.fields[37] = this.createComponentsField([price, priceType]);
    return this;
  }

  /** IN1-39 Policy Limit - Days (chainable). */
  policyLimitDays(value: string): this {
    this.fields[38] = this.createField(value);
    return this;
  }

  /**
   * IN1-40 Room Rate - Semi-Private (chainable).
   * @param price - IN1-40.1 Price
   * @param priceType - IN1-40.2 Price Type
   */
  roomRateSemiPrivate(price: string, priceType?: string): this {
    this.fields[39] = this.createComponentsField([price, priceType]);
    return this;
  }

  /**
   * IN1-41 Room Rate - Private (chainable).
   * @param price - IN1-41.1 Price
   * @param priceType - IN1-41.2 Price Type
   */
  roomRatePrivate(price: string, priceType?: string): this {
    this.fields[40] = this.createComponentsField([price, priceType]);
    return this;
  }

  /**
   * IN1-42 Insured's Employment Status (chainable).
   * @param code - IN1-42.1 Identifier
   * @param text - IN1-42.2 Text
   * @param codingSystem - IN1-42.3 Name of Coding System
   */
  insuredEmploymentStatus(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[41] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** IN1-43 Insured's Administrative Sex (chainable). */
  insuredAdministrativeSex(value: string): this {
    this.fields[42] = this.createField(value);
    return this;
  }

  /**
   * IN1-44 Insured's Employer's Address (chainable).
   * @param street - IN1-44.1 Street
   * @param otherDesignation - IN1-44.2 Other Designation
   * @param city - IN1-44.3 City
   * @param state - IN1-44.4 State/Province
   * @param zip - IN1-44.5 Zip
   * @param country - IN1-44.6 Country
   */
  insuredEmployerAddress(
    street: string,
    otherDesignation?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[43] = this.createComponentsField([
      street,
      otherDesignation,
      city,
      state,
      zip,
      country,
    ]);
    return this;
  }

  /** IN1-45 Verification Status (chainable). */
  verificationStatus(value: string): this {
    this.fields[44] = this.createField(value);
    return this;
  }

  /** IN1-46 Prior Insurance Plan ID (chainable). */
  priorInsurancePlanId(value: string): this {
    this.fields[45] = this.createField(value);
    return this;
  }

  /**
   * IN1-49 Insured's ID Number (chainable).
   * @param id - IN1-49.1 ID Number
   * @param assigningAuthority - IN1-49.4 Assigning Authority
   * @param identifierTypeCode - IN1-49.5 Identifier Type Code
   */
  insuredIdNumber(
    id: string,
    assigningAuthority?: string,
    identifierTypeCode?: string,
  ): this {
    this.fields[48] = this.createComponentsField([
      id,
      undefined,
      undefined,
      assigningAuthority,
      identifierTypeCode,
    ]);
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
