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
  setName(
    familyName: string,
    givenName?: string,
    middleName?: string,
    suffix?: string,
    prefix?: string,
  ): this {
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
  relationship(code: string, text?: string, codingSystem?: string): this {
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
  address(
    street: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
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
  phoneNumber(number: string, use?: string): this {
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
  contactRole(code: string, text?: string, codingSystem?: string): this {
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

  /** NK1-13 Organization Name (chainable). */
  organizationName(name: string): this {
    this.fields[12] = this.createField(name);
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
