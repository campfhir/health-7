/**
 * NK1 segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import type { Result } from "../../types/result.ts";

/**
 * NK1 - Next of Kin / Associated Parties Segment (HL7 v2.3)
 *
 * Contains information about a patient's next of kin, emergency contacts,
 * or other associated parties.
 */
export class NK1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "NK1";

  constructor() {
    super();
    this.fields = [];
  }

  /** NK1-1 Set ID (chainable). */
  setId(id: string): this {
    this.fields[0] = this.createField(id);
    return this;
  }

  /**
   * NK1-2 Name (chainable).
   * @param familyName - NK1-2.1 Family Name
   * @param givenName - NK1-2.2 Given Name
   * @param middleName - NK1-2.3 Middle Name
   * @param suffix - NK1-2.4 Suffix
   * @param prefix - NK1-2.5 Prefix
   */
  setName({ familyName, givenName, middleName, suffix, prefix }: { familyName: string; givenName?: string; middleName?: string; suffix?: string; prefix?: string }): this {
    this.fields[1] = this.createComponentsField([
      familyName,
      givenName || "",
      middleName || "",
      suffix || "",
      prefix || "",
    ]);
    return this;
  }

  /**
   * NK1-3 Relationship (chainable).
   * @param code - NK1-3.1 Code
   * @param text - NK1-3.2 Text
   * @param codingSystem - NK1-3.3 Coding System
   */
  relationship({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[2] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * NK1-4 Address (chainable).
   * @param street - NK1-4.1 Street
   * @param city - NK1-4.3 City
   * @param state - NK1-4.4 State
   * @param zip - NK1-4.5 Zip
   * @param country - NK1-4.6 Country
   */
  address({ street, city, state, zip, country }: { street: string; city?: string; state?: string; zip?: string; country?: string }): this {
    this.fields[3] = this.createComponentsField([
      street,
      "",
      city || "",
      state || "",
      zip || "",
      country || "",
    ]);
    return this;
  }

  /**
   * NK1-5 Phone Number (chainable).
   * @param number - NK1-5.1 Number
   * @param use - NK1-5.2 Use
   */
  phoneNumber({ number, use }: { number: string; use?: string }): this {
    this.fields[4] = this.createComponentsField([number, use]);
    return this;
  }

  /** NK1-6 Business Phone Number (chainable). */
  businessPhoneNumber(number: string): this {
    this.fields[5] = this.createField(number);
    return this;
  }

  /**
   * NK1-7 Contact Role (chainable).
   * @param code - NK1-7.1 Code
   * @param text - NK1-7.2 Text
   * @param codingSystem - NK1-7.3 Coding System
   */
  contactRole({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[6] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** NK1-8 Start Date (chainable). */
  startDate(date: string): this {
    this.fields[7] = this.createField(date);
    return this;
  }

  /** NK1-9 End Date (chainable). */
  endDate(date: string): this {
    this.fields[8] = this.createField(date);
    return this;
  }

  /** NK1-10 Job Title (chainable). */
  jobTitle(title: string): this {
    this.fields[9] = this.createField(title);
    return this;
  }

  /**
   * NK1-11 Next of Kin / Associated Parties Job Code/Class (chainable).
   * @param jobCode - NK1-11.1 Job Code
   * @param jobClass - NK1-11.2 Job Class
   * @param jobDescription - NK1-11.3 Job Description Text
   */
  jobCodeClass({ jobCode, jobClass, jobDescription }: { jobCode: string; jobClass?: string; jobDescription?: string }): this {
    this.fields[10] = this.createComponentsField([
      jobCode,
      jobClass,
      jobDescription,
    ]);
    return this;
  }

  /**
   * NK1-12 Next of Kin / Associated Parties Employee Number (chainable).
   * @param id - NK1-12.1 ID Number
   * @param assigningAuthority - NK1-12.4 Assigning Authority
   * @param identifierTypeCode - NK1-12.5 Identifier Type Code
   */
  employeeNumber({ id, assigningAuthority, identifierTypeCode }: { id: string; assigningAuthority?: string; identifierTypeCode?: string }): this {
    this.fields[11] = this.createComponentsField([
      id,
      undefined,
      undefined,
      assigningAuthority,
      identifierTypeCode,
    ]);
    return this;
  }

  /** NK1-13 Organization Name (chainable). */
  organizationName(name: string): this {
    this.fields[12] = this.createField(name);
    return this;
  }

  /**
   * NK1-14 Marital Status (chainable).
   * @param code - NK1-14.1 Identifier
   * @param text - NK1-14.2 Text
   * @param codingSystem - NK1-14.3 Name of Coding System
   */
  maritalStatus({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[13] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** NK1-15 Administrative Sex (chainable). */
  administrativeSex(sex: string): this {
    this.fields[14] = this.createField(sex);
    return this;
  }

  /** NK1-16 Date/Time of Birth (chainable). */
  dateTimeOfBirth(dateTime: string): this {
    this.fields[15] = this.createField(dateTime);
    return this;
  }

  /** NK1-17 Living Dependency (chainable). */
  livingDependency(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** NK1-18 Ambulatory Status (chainable). */
  ambulatoryStatus(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /**
   * NK1-19 Citizenship (chainable).
   * @param code - NK1-19.1 Identifier
   * @param text - NK1-19.2 Text
   * @param codingSystem - NK1-19.3 Name of Coding System
   */
  citizenship({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[18] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * NK1-20 Primary Language (chainable).
   * @param code - NK1-20.1 Identifier
   * @param text - NK1-20.2 Text
   * @param codingSystem - NK1-20.3 Name of Coding System
   */
  primaryLanguage({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[19] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** NK1-21 Living Arrangement (chainable). */
  livingArrangement(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /**
   * NK1-22 Publicity Code (chainable).
   * @param code - NK1-22.1 Identifier
   * @param text - NK1-22.2 Text
   * @param codingSystem - NK1-22.3 Name of Coding System
   */
  publicityCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[21] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** NK1-23 Protection Indicator (chainable). */
  protectionIndicator(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /** NK1-24 Student Indicator (chainable). */
  studentIndicator(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }

  /**
   * NK1-25 Religion (chainable).
   * @param code - NK1-25.1 Identifier
   * @param text - NK1-25.2 Text
   * @param codingSystem - NK1-25.3 Name of Coding System
   */
  religion({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[24] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * NK1-26 Mother's Maiden Name (chainable).
   * @param familyName - NK1-26.1 Family Name
   * @param givenName - NK1-26.2 Given Name
   * @param middleName - NK1-26.3 Middle Name
   * @param suffix - NK1-26.4 Suffix
   * @param prefix - NK1-26.5 Prefix
   */
  mothersMaidenName({ familyName, givenName, middleName, suffix, prefix }: { familyName: string; givenName?: string; middleName?: string; suffix?: string; prefix?: string }): this {
    this.fields[25] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }

  /**
   * NK1-27 Nationality (chainable).
   * @param code - NK1-27.1 Identifier
   * @param text - NK1-27.2 Text
   * @param codingSystem - NK1-27.3 Name of Coding System
   */
  nationality({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[26] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * NK1-28 Ethnic Group (chainable).
   * @param code - NK1-28.1 Identifier
   * @param text - NK1-28.2 Text
   * @param codingSystem - NK1-28.3 Name of Coding System
   */
  ethnicGroup({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[27] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * NK1-29 Contact Reason (chainable).
   * @param code - NK1-29.1 Identifier
   * @param text - NK1-29.2 Text
   * @param codingSystem - NK1-29.3 Name of Coding System
   */
  contactReason({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[28] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * NK1-30 Contact Person's Name (chainable).
   * @param familyName - NK1-30.1 Family Name
   * @param givenName - NK1-30.2 Given Name
   * @param middleName - NK1-30.3 Middle Name
   * @param suffix - NK1-30.4 Suffix
   * @param prefix - NK1-30.5 Prefix
   */
  contactPersonName({ familyName, givenName, middleName, suffix, prefix }: { familyName: string; givenName?: string; middleName?: string; suffix?: string; prefix?: string }): this {
    this.fields[29] = this.createComponentsField([
      familyName,
      givenName,
      middleName,
      suffix,
      prefix,
    ]);
    return this;
  }

  /** NK1-31 Contact Person's Telephone Number (chainable). */
  contactPersonTelephoneNumber(value: string): this {
    this.fields[30] = this.createField(value);
    return this;
  }

  /**
   * NK1-32 Contact Person's Address (chainable).
   * @param street - NK1-32.1 Street Address
   * @param otherDesignation - NK1-32.2 Other Designation
   * @param city - NK1-32.3 City
   * @param state - NK1-32.4 State or Province
   * @param zip - NK1-32.5 Zip or Postal Code
   * @param country - NK1-32.6 Country
   */
  contactPersonAddress({ street, otherDesignation, city, state, zip, country }: { street: string; otherDesignation?: string; city?: string; state?: string; zip?: string; country?: string }): this {
    this.fields[31] = this.createComponentsField([
      street,
      otherDesignation,
      city,
      state,
      zip,
      country,
    ]);
    return this;
  }

  /**
   * NK1-33 Next of Kin/Associated Party's Identifiers (chainable).
   * @param id - NK1-33.1 ID Number
   * @param assigningAuthority - NK1-33.4 Assigning Authority
   * @param identifierTypeCode - NK1-33.5 Identifier Type Code
   */
  associatedPartysIdentifiers({ id, assigningAuthority, identifierTypeCode }: { id: string; assigningAuthority?: string; identifierTypeCode?: string }): this {
    this.fields[32] = this.createComponentsField([
      id,
      undefined,
      undefined,
      assigningAuthority,
      identifierTypeCode,
    ]);
    return this;
  }

  /** NK1-34 Job Status (chainable). */
  jobStatus(value: string): this {
    this.fields[33] = this.createField(value);
    return this;
  }

  /**
   * NK1-35 Race (chainable).
   * @param code - NK1-35.1 Identifier
   * @param text - NK1-35.2 Text
   * @param codingSystem - NK1-35.3 Name of Coding System
   */
  race({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[34] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** NK1-36 Handicap (chainable). */
  handicap(value: string): this {
    this.fields[35] = this.createField(value);
    return this;
  }

  /** NK1-37 Contact Person Social Security Number (chainable). */
  contactPersonSocialSecurityNumber(value: string): this {
    this.fields[36] = this.createField(value);
    return this;
  }

  /**
   * Get next of kin name
   */
  getName(): { familyName: string; givenName: string; middleName: string } {
    if (!this.fields[1]) {
      return { familyName: "", givenName: "", middleName: "" };
    }

    const field = this.fields[1];
    if (!field.components || field.components.length === 0) {
      return { familyName: "", givenName: "", middleName: "" };
    }

    const component = field.components[0];
    if (!component.subComponents || component.subComponents.length === 0) {
      return { familyName: "", givenName: "", middleName: "" };
    }

    return {
      familyName: component.subComponents[0] || "",
      givenName: component.subComponents[1] || "",
      middleName: component.subComponents[2] || "",
    };
  }

  /**
   * Get relationship code
   */
  getRelationship(): string {
    if (!this.fields[2]) {
      return "";
    }

    const field = this.fields[2];
    if (!field.components || field.components.length === 0) {
      return "";
    }

    const component = field.components[0];
    if (!component.subComponents || component.subComponents.length === 0) {
      return "";
    }

    return component.subComponents[0] || "";
  }

  /**
   * Static factory method for parsing
   */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<NK1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    const segmentType = parts[0];

    if (segmentType !== "NK1") {
      return {
        ok: false,
        err: new Err(`Expected NK1 segment, got ${segmentType}`),
      };
    }

    const nk1 = new NK1();

    // Parse fields starting from index 1
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        nk1.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }

    return { ok: true, val: nk1 };
  }
}
