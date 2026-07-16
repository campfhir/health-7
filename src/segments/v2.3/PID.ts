/**
 * PID segment definition for HL7 v2.3.
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
 * PID - Patient Identification Segment (HL7 v2.3)
 */
export class PID extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "PID";

  constructor() {
    super();
    this.fields = [];
  }

  /** PID-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  /** PID-2 Patient ID (chainable). */
  patientId(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  /**
   * PID-3 Patient Identifier List (chainable).
   * @param id - PID-3.1 ID Number
   * @param checkDigit - PID-3.2 Check Digit
   * @param checkDigitScheme - PID-3.3 Check Digit Scheme
   * @param assigningAuthority - PID-3.4 Assigning Authority
   * @param identifierTypeCode - PID-3.5 Identifier Type Code
   */
  patientIdentifierList(
    id: string,
    checkDigit?: string,
    checkDigitScheme?: string,
    assigningAuthority?: string,
    identifierTypeCode?: string,
  ): this {
    this.fields[2] = this.createComponentsField([
      id,
      checkDigit,
      checkDigitScheme,
      assigningAuthority,
      identifierTypeCode,
    ]);
    return this;
  }
  /** PID-4 Alternate Patient ID (chainable). */
  alternatePatientId(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
  /**
   * PID-5 Patient Name (chainable).
   * @param familyName - PID-5.1 Family Name
   * @param givenName - PID-5.2 Given Name
   * @param middleName - PID-5.3 Middle Name
   * @param suffix - PID-5.4 Suffix
   * @param prefix - PID-5.5 Prefix
   */
  patientName(
    familyName: string,
    givenName?: string,
    middleName?: string,
    suffix?: string,
    prefix?: string,
  ): this {
    this.fields[4] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }
  /**
   * PID-6 Mothers Maiden Name (chainable).
   * @param familyName - PID-6.1 Family Name
   * @param givenName - PID-6.2 Given Name
   */
  mothersMaidenName(familyName: string, givenName?: string): this {
    this.fields[5] = this.createComponentsField([familyName, givenName]);
    return this;
  }
  /** PID-7 Date Time Of Birth (chainable). */
  dateTimeOfBirth(value: string, format?: never): this;
  /** PID-7 Date Time Of Birth (chainable). */
  dateTimeOfBirth(value: Date, format?: HL7DateLayout): this;
  dateTimeOfBirth(value: string | Date, format?: HL7DateLayout): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }
  /** PID-8 Administrative Sex (chainable). */
  administrativeSex(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }
  /**
   * PID-9 Patient Alias (chainable).
   * @param familyName - PID-9.1 Family Name
   * @param givenName - PID-9.2 Given Name
   */
  patientAlias(familyName: string, givenName?: string): this {
    this.fields[8] = this.createComponentsField([familyName, givenName]);
    return this;
  }
  /** PID-10 Race (chainable). */
  race(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
  /**
   * PID-11 Patient Address (chainable).
   * @param streetAddress - PID-11.1 Street Address
   * @param otherDesignation - PID-11.2 Other Designation
   * @param city - PID-11.3 City
   * @param state - PID-11.4 State
   * @param zip - PID-11.5 Zip
   * @param country - PID-11.6 Country
   */
  patientAddress(
    streetAddress?: string,
    otherDesignation?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[10] = this.createComponentsField([
      streetAddress,
      otherDesignation,
      city,
      state,
      zip,
      country,
    ]);
    return this;
  }
  /** PID-12 County Code (chainable). */
  countyCode(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }
  /** PID-13 Phone Number Home (chainable). */
  phoneNumberHome(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  /** PID-14 Phone Number Business (chainable). */
  phoneNumberBusiness(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }
  /** PID-15 Primary Language (chainable). */
  primaryLanguage(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  /** PID-16 Marital Status (chainable). */
  maritalStatus(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }
  /** PID-17 Religion (chainable). */
  religion(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }
  /** PID-18 Patient Account Number (chainable). */
  patientAccountNumber(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }
  /** PID-19 SSN (chainable). */
  ssn(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }
  /**
   * PID-20 Driver's License Number (chainable).
   * @param licenseNumber - PID-20.1 Driver's License Number
   * @param issuingAuthority - PID-20.2 Issuing State, Province, Country
   * @param expirationDate - PID-20.3 Expiration Date
   */
  driversLicenseNumber(
    licenseNumber: string,
    issuingAuthority?: string,
    expirationDate?: string,
  ): this {
    this.fields[19] = this.createComponentsField([
      licenseNumber,
      issuingAuthority,
      expirationDate,
    ]);
    return this;
  }
  /**
   * PID-21 Mother's Identifier (chainable).
   * @param id - PID-21.1 ID Number
   * @param assigningAuthority - PID-21.4 Assigning Authority
   * @param identifierTypeCode - PID-21.5 Identifier Type Code
   */
  mothersIdentifier(
    id: string,
    assigningAuthority?: string,
    identifierTypeCode?: string,
  ): this {
    this.fields[20] = this.createComponentsField([
      id,
      undefined,
      undefined,
      assigningAuthority,
      identifierTypeCode,
    ]);
    return this;
  }
  /**
   * PID-22 Ethnic Group (chainable).
   * @param code - PID-22.1 Identifier
   * @param text - PID-22.2 Text
   * @param codingSystem - PID-22.3 Name of Coding System
   */
  ethnicGroup(code: string, text?: string, codingSystem?: string): this {
    this.fields[21] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /** PID-23 Birth Place (chainable). */
  birthPlace(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }
  /** PID-24 Multiple Birth Indicator (chainable). */
  multipleBirthIndicator(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }
  /** PID-25 Birth Order (chainable). */
  birthOrder(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }
  /**
   * PID-26 Citizenship (chainable).
   * @param code - PID-26.1 Identifier
   * @param text - PID-26.2 Text
   * @param codingSystem - PID-26.3 Name of Coding System
   */
  citizenship(code: string, text?: string, codingSystem?: string): this {
    this.fields[25] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * PID-27 Veterans Military Status (chainable).
   * @param code - PID-27.1 Identifier
   * @param text - PID-27.2 Text
   * @param codingSystem - PID-27.3 Name of Coding System
   */
  veteransMilitaryStatus(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[26] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * PID-28 Nationality (chainable).
   * @param code - PID-28.1 Identifier
   * @param text - PID-28.2 Text
   * @param codingSystem - PID-28.3 Name of Coding System
   */
  nationality(code: string, text?: string, codingSystem?: string): this {
    this.fields[27] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /** PID-29 Patient Death Date and Time (chainable). */
  patientDeathDateAndTime(value: string, format?: never): this;
  /** PID-29 Patient Death Date and Time (chainable). */
  patientDeathDateAndTime(value: Date, format?: HL7DateTimeLayout): this;
  patientDeathDateAndTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[28] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** PID-30 Patient Death Indicator (chainable). */
  patientDeathIndicator(value: string): this {
    this.fields[29] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PID> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PID") {
      return {
        ok: false,
        err: new Err(`Expected PID segment, got ${parts[0]}`),
      };
    }
    const pid = new PID();
    for (let i = 1; i < parts.length; i++) {
      pid.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: pid };
  }
}
