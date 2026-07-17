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
  insuredEmployerName({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    this.fields[2] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** IN2-4 Employer Information Data (chainable). */
  employerInfoData(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** IN2-5 Mail Claim Party (chainable). */
  mailClaimParty(value: string): this {
    this.fields[4] = this.createField(value);
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
  medicaidCaseName({ familyName, givenName }: { familyName: string; givenName?: string }): this {
    this.fields[6] = this.createComponentsField([familyName, givenName || ""]);
    return this;
  }

  /** IN2-8 Medicaid Case Number (chainable). */
  medicaidCaseNumber(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /**
   * IN2-9 Military Sponsor Name (chainable).
   * @param familyName - IN2-9.1 Family Name
   * @param givenName - IN2-9.2 Given Name
   * @param middleName - IN2-9.3 Middle Name
   * @param suffix - IN2-9.4 Suffix
   * @param prefix - IN2-9.5 Prefix
   */
  militarySponsorName({ familyName, givenName, middleName, suffix, prefix }: { familyName: string; givenName?: string; middleName?: string; suffix?: string; prefix?: string }): this {
    this.fields[8] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }

  /** IN2-10 Military ID Number (chainable). */
  militaryIdNumber(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /**
   * IN2-11 Dependent Of Military Recipient (chainable).
   * @param code - IN2-11.1 Identifier
   * @param text - IN2-11.2 Text
   * @param codingSystem - IN2-11.3 Name of Coding System
   */
  dependentOfMilitaryRecipient({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[10] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** IN2-12 Military Organization (chainable). */
  militaryOrganization(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** IN2-13 Military Station (chainable). */
  militaryStation(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** IN2-14 Military Service (chainable). */
  militaryService(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /** IN2-15 Military Rank/Grade (chainable). */
  militaryRankGrade(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** IN2-16 Military Status (chainable). */
  militaryStatus(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** IN2-17 Military Retire Date (chainable). */
  militaryRetireDate(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** IN2-18 Military Non-Avail Cert On File (chainable). */
  militaryNonAvailCertOnFile(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /** IN2-19 Baby Coverage (chainable). */
  babyCoverage(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

  /** IN2-20 Combine Baby Bill (chainable). */
  combineBabyBill(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** IN2-21 Blood Deductible (chainable). */
  bloodDeductible(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /**
   * IN2-22 Special Coverage Approval Name (chainable).
   * @param familyName - IN2-22.1 Family Name
   * @param givenName - IN2-22.2 Given Name
   * @param middleName - IN2-22.3 Middle Name
   * @param suffix - IN2-22.4 Suffix
   * @param prefix - IN2-22.5 Prefix
   */
  specialCoverageApprovalName({ familyName, givenName, middleName, suffix, prefix }: { familyName: string; givenName?: string; middleName?: string; suffix?: string; prefix?: string }): this {
    this.fields[21] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }

  /** IN2-23 Special Coverage Approval Title (chainable). */
  specialCoverageApprovalTitle(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /** IN2-24 Non-Covered Insurance Code (chainable). */
  nonCoveredInsuranceCode(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }

  /**
   * IN2-25 Payor ID (chainable).
   * @param id - IN2-25.1 ID Number
   * @param assigningAuthority - IN2-25.4 Assigning Authority
   * @param identifierTypeCode - IN2-25.5 Identifier Type Code
   */
  payorId({ id, assigningAuthority, identifierTypeCode }: { id: string; assigningAuthority?: string; identifierTypeCode?: string }): this {
    this.fields[24] = this.createComponentsField([
      id,
      undefined,
      undefined,
      assigningAuthority,
      identifierTypeCode,
    ]);
    return this;
  }

  /**
   * IN2-26 Payor Subscriber ID (chainable).
   * @param id - IN2-26.1 ID Number
   * @param assigningAuthority - IN2-26.4 Assigning Authority
   * @param identifierTypeCode - IN2-26.5 Identifier Type Code
   */
  payorSubscriberId({ id, assigningAuthority, identifierTypeCode }: { id: string; assigningAuthority?: string; identifierTypeCode?: string }): this {
    this.fields[25] = this.createComponentsField([
      id,
      undefined,
      undefined,
      assigningAuthority,
      identifierTypeCode,
    ]);
    return this;
  }

  /** IN2-27 Eligibility Source (chainable). */
  eligibilitySource(value: string): this {
    this.fields[26] = this.createField(value);
    return this;
  }

  /**
   * IN2-28 Room Coverage Type/Amount (chainable).
   * @param roomType - IN2-28.1 Room Type
   * @param amountType - IN2-28.2 Amount Type
   * @param coverageAmount - IN2-28.3 Coverage Amount
   */
  roomCoverageTypeAmount({ roomType, amountType, coverageAmount }: { roomType: string; amountType?: string; coverageAmount?: string }): this {
    this.fields[27] = this.createComponentsField([
      roomType,
      amountType,
      coverageAmount,
    ]);
    return this;
  }

  /**
   * IN2-29 Policy Type/Amount (chainable).
   * @param policyType - IN2-29.1 Policy Type
   * @param amountClass - IN2-29.2 Amount Class
   * @param amount - IN2-29.3 Amount
   */
  policyTypeAmount({ policyType, amountClass, amount }: { policyType: string; amountClass?: string; amount?: string }): this {
    this.fields[28] = this.createComponentsField([
      policyType,
      amountClass,
      amount,
    ]);
    return this;
  }

  /**
   * IN2-30 Daily Deductible (chainable).
   * @param delayDays - IN2-30.1 Delay Days
   * @param amount - IN2-30.2 Amount
   * @param numberOfDays - IN2-30.3 Number of Days
   */
  dailyDeductible({ delayDays, amount, numberOfDays }: { delayDays: string; amount?: string; numberOfDays?: string }): this {
    this.fields[29] = this.createComponentsField([
      delayDays,
      amount,
      numberOfDays,
    ]);
    return this;
  }

  /** IN2-31 Living Dependency (chainable). */
  livingDependency(value: string): this {
    this.fields[30] = this.createField(value);
    return this;
  }

  /** IN2-32 Ambulatory Status (chainable). */
  ambulatoryStatus(value: string): this {
    this.fields[31] = this.createField(value);
    return this;
  }

  /**
   * IN2-33 Citizenship (chainable).
   * @param code - IN2-33.1 Identifier
   * @param text - IN2-33.2 Text
   * @param codingSystem - IN2-33.3 Name of Coding System
   */
  citizenship({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[32] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * IN2-34 Primary Language (chainable).
   * @param code - IN2-34.1 Identifier
   * @param text - IN2-34.2 Text
   * @param codingSystem - IN2-34.3 Name of Coding System
   */
  primaryLanguage({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[33] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** IN2-35 Living Arrangement (chainable). */
  livingArrangement(value: string): this {
    this.fields[34] = this.createField(value);
    return this;
  }

  /**
   * IN2-36 Publicity Code (chainable).
   * @param code - IN2-36.1 Identifier
   * @param text - IN2-36.2 Text
   * @param codingSystem - IN2-36.3 Name of Coding System
   */
  publicityCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[35] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** IN2-37 Protection Indicator (chainable). */
  protectionIndicator(value: string): this {
    this.fields[36] = this.createField(value);
    return this;
  }

  /** IN2-38 Student Indicator (chainable). */
  studentIndicator(value: string): this {
    this.fields[37] = this.createField(value);
    return this;
  }

  /**
   * IN2-39 Religion (chainable).
   * @param code - IN2-39.1 Identifier
   * @param text - IN2-39.2 Text
   * @param codingSystem - IN2-39.3 Name of Coding System
   */
  religion({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[38] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * IN2-40 Mother's Maiden Name (chainable).
   * @param familyName - IN2-40.1 Family Name
   * @param givenName - IN2-40.2 Given Name
   * @param middleName - IN2-40.3 Middle Name
   * @param suffix - IN2-40.4 Suffix
   * @param prefix - IN2-40.5 Prefix
   */
  mothersMaidenName({ familyName, givenName, middleName, suffix, prefix }: { familyName: string; givenName?: string; middleName?: string; suffix?: string; prefix?: string }): this {
    this.fields[39] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }

  /**
   * IN2-41 Nationality (chainable).
   * @param code - IN2-41.1 Identifier
   * @param text - IN2-41.2 Text
   * @param codingSystem - IN2-41.3 Name of Coding System
   */
  nationality({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[40] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * IN2-42 Ethnic Group (chainable).
   * @param code - IN2-42.1 Identifier
   * @param text - IN2-42.2 Text
   * @param codingSystem - IN2-42.3 Name of Coding System
   */
  ethnicGroup({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[41] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * IN2-43 Marital Status (chainable).
   * @param code - IN2-43.1 Identifier
   * @param text - IN2-43.2 Text
   * @param codingSystem - IN2-43.3 Name of Coding System
   */
  maritalStatus({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[42] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** IN2-44 Insured's Employment Start Date (chainable). */
  insuredsEmploymentStartDate(value: string): this {
    this.fields[43] = this.createField(value);
    return this;
  }

  /** IN2-45 Employment Stop Date (chainable). */
  employmentStopDate(value: string): this {
    this.fields[44] = this.createField(value);
    return this;
  }

  /** IN2-46 Job Title (chainable). */
  jobTitle(value: string): this {
    this.fields[45] = this.createField(value);
    return this;
  }

  /**
   * IN2-47 Job Code/Class (chainable).
   * @param jobCode - IN2-47.1 Job Code
   * @param jobClass - IN2-47.2 Job Class
   */
  jobCodeClass({ jobCode, jobClass }: { jobCode: string; jobClass?: string }): this {
    this.fields[46] = this.createComponentsField([jobCode, jobClass]);
    return this;
  }

  /** IN2-48 Job Status (chainable). */
  jobStatus(value: string): this {
    this.fields[47] = this.createField(value);
    return this;
  }

  /**
   * IN2-49 Employer Contact Person Name (chainable).
   * @param familyName - IN2-49.1 Family Name
   * @param givenName - IN2-49.2 Given Name
   * @param middleName - IN2-49.3 Middle Name
   * @param suffix - IN2-49.4 Suffix
   * @param prefix - IN2-49.5 Prefix
   */
  employerContactPersonName({ familyName, givenName, middleName, suffix, prefix }: { familyName: string; givenName?: string; middleName?: string; suffix?: string; prefix?: string }): this {
    this.fields[48] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }

  /** IN2-50 Employer Contact Person Phone Number (chainable). */
  employerContactPersonPhoneNumber(value: string): this {
    this.fields[49] = this.createField(value);
    return this;
  }

  /** IN2-51 Employer Contact Reason (chainable). */
  employerContactReason(value: string): this {
    this.fields[50] = this.createField(value);
    return this;
  }

  /**
   * IN2-52 Insured's Contact Person's Name (chainable).
   * @param familyName - IN2-52.1 Family Name
   * @param givenName - IN2-52.2 Given Name
   * @param middleName - IN2-52.3 Middle Name
   * @param suffix - IN2-52.4 Suffix
   * @param prefix - IN2-52.5 Prefix
   */
  insuredsContactPersonName({ familyName, givenName, middleName, suffix, prefix }: { familyName: string; givenName?: string; middleName?: string; suffix?: string; prefix?: string }): this {
    this.fields[51] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }

  /** IN2-53 Insured's Contact Person Phone Number (chainable). */
  insuredsContactPersonPhoneNumber(value: string): this {
    this.fields[52] = this.createField(value);
    return this;
  }

  /** IN2-54 Insured's Contact Person Reason (chainable). */
  insuredsContactPersonReason(value: string): this {
    this.fields[53] = this.createField(value);
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

  /** IN2-57 Insurance Co. Contact Reason (chainable). */
  insuranceCoContactReason(value: string): this {
    this.fields[56] = this.createField(value);
    return this;
  }

  /** IN2-58 Insurance Co Contact Phone Number (chainable). */
  insuranceCoContactPhoneNumber(value: string): this {
    this.fields[57] = this.createField(value);
    return this;
  }

  /** IN2-59 Policy Scope (chainable). */
  policyScope(value: string): this {
    this.fields[58] = this.createField(value);
    return this;
  }

  /** IN2-60 Policy Source (chainable). */
  policySource(value: string): this {
    this.fields[59] = this.createField(value);
    return this;
  }

  /**
   * IN2-61 Patient Member Number (chainable).
   * @param id - IN2-61.1 ID Number
   * @param assigningAuthority - IN2-61.4 Assigning Authority
   * @param identifierTypeCode - IN2-61.5 Identifier Type Code
   */
  patientMemberNumber({ id, assigningAuthority, identifierTypeCode }: { id: string; assigningAuthority?: string; identifierTypeCode?: string }): this {
    this.fields[60] = this.createComponentsField([
      id,
      undefined,
      undefined,
      assigningAuthority,
      identifierTypeCode,
    ]);
    return this;
  }

  /**
   * IN2-62 Guarantor's Relationship to Insured (chainable).
   * @param code - IN2-62.1 Identifier
   * @param text - IN2-62.2 Text
   * @param codingSystem - IN2-62.3 Name of Coding System
   */
  guarantorsRelationshipToInsured({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[61] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** IN2-63 Insured's Phone Number - Home (chainable). */
  insuredsPhoneNumberHome(value: string): this {
    this.fields[62] = this.createField(value);
    return this;
  }

  /** IN2-64 Insured's Employer Phone Number (chainable). */
  insuredsEmployerPhoneNumber(value: string): this {
    this.fields[63] = this.createField(value);
    return this;
  }

  /**
   * IN2-65 Military Handicapped Program (chainable).
   * @param code - IN2-65.1 Identifier
   * @param text - IN2-65.2 Text
   * @param codingSystem - IN2-65.3 Name of Coding System
   */
  militaryHandicappedProgram({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[64] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** IN2-66 Suspend Flag (chainable). */
  suspendFlag(value: string): this {
    this.fields[65] = this.createField(value);
    return this;
  }

  /** IN2-67 Copay Limit Flag (chainable). */
  copayLimitFlag(value: string): this {
    this.fields[66] = this.createField(value);
    return this;
  }

  /** IN2-68 Stoploss Limit Flag (chainable). */
  stoplossLimitFlag(value: string): this {
    this.fields[67] = this.createField(value);
    return this;
  }

  /**
   * IN2-69 Insured Organization Name and ID (chainable).
   * @param organizationName - IN2-69.1 Organization Name
   * @param organizationNameTypeCode - IN2-69.2 Organization Name Type Code
   * @param idNumber - IN2-69.3 ID Number
   */
  insuredOrganizationNameAndId({ organizationName, organizationNameTypeCode, idNumber }: { organizationName: string; organizationNameTypeCode?: string; idNumber?: string }): this {
    this.fields[68] = this.createComponentsField([
      organizationName,
      organizationNameTypeCode,
      idNumber,
    ]);
    return this;
  }

  /**
   * IN2-70 Insured Employer Organization Name and ID (chainable).
   * @param organizationName - IN2-70.1 Organization Name
   * @param organizationNameTypeCode - IN2-70.2 Organization Name Type Code
   * @param idNumber - IN2-70.3 ID Number
   */
  insuredEmployerOrganizationNameAndId({ organizationName, organizationNameTypeCode, idNumber }: { organizationName: string; organizationNameTypeCode?: string; idNumber?: string }): this {
    this.fields[69] = this.createComponentsField([
      organizationName,
      organizationNameTypeCode,
      idNumber,
    ]);
    return this;
  }

  /**
   * IN2-71 Race (chainable).
   * @param code - IN2-71.1 Identifier
   * @param text - IN2-71.2 Text
   * @param codingSystem - IN2-71.3 Name of Coding System
   */
  race({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[70] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * IN2-72 Patient's Relationship to Insured (chainable).
   * @param code - IN2-72.1 Code
   * @param text - IN2-72.2 Text
   */
  relationshipToPatient({ code, text }: { code: string; text?: string }): this {
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
