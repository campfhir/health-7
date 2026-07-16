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
  DateTimeLayout,
  formatHL7Date,
  type HL7DateLayout,
  type HL7DateTimeLayout,
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
    this.fields[1] = this.createComponentsField([id, "", "", assigningAuthority || ""]);
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
    this.fields[2] = this.createComponentsField([familyName, givenName || "", middleName || ""]);
    return this;
  }

  /**
   * GT1-4 Guarantor Spouse Name (chainable).
   * @param familyName - GT1-4.1 Family Name
   * @param givenName - GT1-4.2 Given Name
   */
  guarantorSpouseName(familyName: string, givenName?: string): this {
    this.fields[3] = this.createComponentsField([familyName, givenName || ""]);
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
    this.fields[4] = this.createComponentsField([street, "", city || "", state || "", zip || "", country || ""]);
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
    this.fields[16] = this.createComponentsField([street, "", city || "", state || "", zip || ""]);
    return this;
  }

  /** GT1-18 Guarantor Employer Phone Number (chainable). */
  guarantorEmployerPhone(value: string): this {
    this.fields[17] = this.createField(value);
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

  /** GT1-22 Guarantor Billing Hold Flag (chainable). */
  guarantorBillingHoldFlag(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /**
   * GT1-23 Guarantor Credit Rating Code (chainable).
   * @param code - GT1-23.1 Identifier
   * @param text - GT1-23.2 Text
   * @param codingSystem - GT1-23.3 Name of Coding System
   */
  guarantorCreditRatingCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[22] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** GT1-24 Guarantor Death Date And Time (chainable). */
  guarantorDeathDateTime(value: string, format?: never): this;
  /** GT1-24 Guarantor Death Date And Time (chainable). */
  guarantorDeathDateTime(value: Date, format?: HL7DateTimeLayout): this;
  guarantorDeathDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[23] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** GT1-25 Guarantor Death Flag (chainable). */
  guarantorDeathFlag(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }

  /**
   * GT1-26 Guarantor Charge Adjustment Code (chainable).
   * @param code - GT1-26.1 Identifier
   * @param text - GT1-26.2 Text
   * @param codingSystem - GT1-26.3 Name of Coding System
   */
  guarantorChargeAdjustmentCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[25] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * GT1-27 Guarantor Household Annual Income (chainable).
   * @param price - GT1-27.1 Price
   * @param priceType - GT1-27.2 Price Type
   */
  guarantorHouseholdAnnualIncome(price: string, priceType?: string): this {
    this.fields[26] = this.createComponentsField([price, priceType]);
    return this;
  }

  /** GT1-28 Guarantor Household Size (chainable). */
  guarantorHouseholdSize(value: string): this {
    this.fields[27] = this.createField(value);
    return this;
  }

  /**
   * GT1-29 Guarantor Employer ID Number (chainable).
   * @param id - GT1-29.1 ID Number
   * @param assigningAuthority - GT1-29.4 Assigning Authority
   * @param identifierTypeCode - GT1-29.5 Identifier Type Code
   */
  guarantorEmployerId(
    id: string,
    assigningAuthority?: string,
    identifierTypeCode?: string,
  ): this {
    this.fields[28] = this.createComponentsField([
      id,
      undefined,
      undefined,
      assigningAuthority,
      identifierTypeCode,
    ]);
    return this;
  }

  /**
   * GT1-30 Guarantor Marital Status Code (chainable).
   * @param code - GT1-30.1 Identifier
   * @param text - GT1-30.2 Text
   * @param codingSystem - GT1-30.3 Name of Coding System
   */
  guarantorMaritalStatusCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[29] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** GT1-31 Guarantor Hire Effective Date (chainable). */
  guarantorHireEffectiveDate(value: string): this {
    this.fields[30] = this.createField(value);
    return this;
  }

  /** GT1-32 Employment Stop Date (chainable). */
  employmentStopDate(value: string): this {
    this.fields[31] = this.createField(value);
    return this;
  }

  /** GT1-33 Living Dependency (chainable). */
  livingDependency(value: string): this {
    this.fields[32] = this.createField(value);
    return this;
  }

  /** GT1-34 Ambulatory Status (chainable). */
  ambulatoryStatus(value: string): this {
    this.fields[33] = this.createField(value);
    return this;
  }

  /**
   * GT1-35 Citizenship (chainable).
   * @param code - GT1-35.1 Identifier
   * @param text - GT1-35.2 Text
   * @param codingSystem - GT1-35.3 Name of Coding System
   */
  citizenship(code: string, text?: string, codingSystem?: string): this {
    this.fields[34] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * GT1-36 Primary Language (chainable).
   * @param code - GT1-36.1 Identifier
   * @param text - GT1-36.2 Text
   * @param codingSystem - GT1-36.3 Name of Coding System
   */
  primaryLanguage(code: string, text?: string, codingSystem?: string): this {
    this.fields[35] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** GT1-37 Living Arrangement (chainable). */
  livingArrangement(value: string): this {
    this.fields[36] = this.createField(value);
    return this;
  }

  /**
   * GT1-38 Publicity Code (chainable).
   * @param code - GT1-38.1 Identifier
   * @param text - GT1-38.2 Text
   * @param codingSystem - GT1-38.3 Name of Coding System
   */
  publicityCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[37] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** GT1-39 Protection Indicator (chainable). */
  protectionIndicator(value: string): this {
    this.fields[38] = this.createField(value);
    return this;
  }

  /** GT1-40 Student Indicator (chainable). */
  studentIndicator(value: string): this {
    this.fields[39] = this.createField(value);
    return this;
  }

  /**
   * GT1-41 Religion (chainable).
   * @param code - GT1-41.1 Identifier
   * @param text - GT1-41.2 Text
   * @param codingSystem - GT1-41.3 Name of Coding System
   */
  religion(code: string, text?: string, codingSystem?: string): this {
    this.fields[40] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * GT1-42 Mother's Maiden Name (chainable).
   * @param familyName - GT1-42.1 Family Name
   * @param givenName - GT1-42.2 Given Name
   * @param middleName - GT1-42.3 Middle Name
   * @param suffix - GT1-42.4 Suffix
   * @param prefix - GT1-42.5 Prefix
   */
  mothersMaidenName(
    familyName: string,
    givenName?: string,
    middleName?: string,
    suffix?: string,
    prefix?: string,
  ): this {
    this.fields[41] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }

  /**
   * GT1-43 Nationality (chainable).
   * @param code - GT1-43.1 Identifier
   * @param text - GT1-43.2 Text
   * @param codingSystem - GT1-43.3 Name of Coding System
   */
  nationality(code: string, text?: string, codingSystem?: string): this {
    this.fields[42] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * GT1-44 Ethnic Group (chainable).
   * @param code - GT1-44.1 Identifier
   * @param text - GT1-44.2 Text
   * @param codingSystem - GT1-44.3 Name of Coding System
   */
  ethnicGroup(code: string, text?: string, codingSystem?: string): this {
    this.fields[43] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * GT1-45 Contact Person's Name (chainable).
   * @param familyName - GT1-45.1 Family Name
   * @param givenName - GT1-45.2 Given Name
   * @param middleName - GT1-45.3 Middle Name
   * @param suffix - GT1-45.4 Suffix
   * @param prefix - GT1-45.5 Prefix
   */
  contactPersonName(
    familyName: string,
    givenName?: string,
    middleName?: string,
    suffix?: string,
    prefix?: string,
  ): this {
    this.fields[44] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }

  /** GT1-46 Contact Person's Telephone Number (chainable). */
  contactPersonTelephone(value: string): this {
    this.fields[45] = this.createField(value);
    return this;
  }

  /**
   * GT1-47 Contact Reason (chainable).
   * @param code - GT1-47.1 Identifier
   * @param text - GT1-47.2 Text
   * @param codingSystem - GT1-47.3 Name of Coding System
   */
  contactReason(code: string, text?: string, codingSystem?: string): this {
    this.fields[46] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** GT1-48 Contact Relationship (chainable). */
  contactRelationship(value: string): this {
    this.fields[47] = this.createField(value);
    return this;
  }

  /** GT1-49 Job Title (chainable). */
  jobTitle(value: string): this {
    this.fields[48] = this.createField(value);
    return this;
  }

  /**
   * GT1-50 Job Code/Class (chainable).
   * @param jobCode - GT1-50.1 Job Code
   * @param jobClass - GT1-50.2 Job Class
   */
  jobCodeClass(jobCode: string, jobClass?: string): this {
    this.fields[49] = this.createComponentsField([jobCode, jobClass]);
    return this;
  }

  /** GT1-51 Guarantor Employer's Organization Name (chainable). */
  guarantorEmployerOrganizationName(value: string): this {
    this.fields[50] = this.createField(value);
    return this;
  }

  /** GT1-52 Handicap (chainable). */
  handicap(value: string): this {
    this.fields[51] = this.createField(value);
    return this;
  }

  /** GT1-53 Job Status (chainable). */
  jobStatus(value: string): this {
    this.fields[52] = this.createField(value);
    return this;
  }

  /**
   * GT1-54 Guarantor Financial Class (chainable).
   * @param financialClassCode - GT1-54.1 Financial Class Code
   * @param effectiveDate - GT1-54.2 Effective Date
   */
  guarantorFinancialClass(
    financialClassCode: string,
    effectiveDate?: string,
  ): this {
    this.fields[53] = this.createComponentsField([
      financialClassCode,
      effectiveDate,
    ]);
    return this;
  }

  /**
   * GT1-55 Guarantor Race (chainable).
   * @param code - GT1-55.1 Identifier
   * @param text - GT1-55.2 Text
   * @param codingSystem - GT1-55.3 Name of Coding System
   */
  guarantorRace(code: string, text?: string, codingSystem?: string): this {
    this.fields[54] = this.createComponentsField([code, text, codingSystem]);
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
