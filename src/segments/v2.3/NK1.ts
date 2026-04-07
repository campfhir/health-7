import { Err } from "../../utils/err";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { Result } from "../../types/result";

/**
 * NK1 - Next of Kin / Associated Parties Segment (HL7 v2.3)
 *
 * Contains information about a patient's next of kin, emergency contacts,
 * or other associated parties.
 */
export class NK1 extends BaseSegment {
  name = "NK1";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * NK1-1: Set ID - NK1 (SI)
   * Sequential number for multiple next of kin
   */
  setId(id: string): this {
    this.fields[0] = this.createField(id);
    return this;
  }

  /**
   * NK1-2: Name (XPN)
   * Next of kin's name
   * Components: Family Name^Given Name^Middle Name^Suffix^Prefix^Degree
   */
  setName(
    familyName: string,
    givenName?: string,
    middleName?: string,
    suffix?: string,
    prefix?: string,
  ): this {
    this.fields[1] = this.createField([
      [
        familyName,
        givenName || "",
        middleName || "",
        suffix || "",
        prefix || "",
      ],
    ]);
    return this;
  }

  /**
   * NK1-3: Relationship (CE)
   * Relationship to patient
   * Examples: SPO (Spouse), CHD (Child), PAR (Parent), EME (Emergency Contact)
   */
  relationship(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[2] = this.createField([
        [code, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[2] = this.createField(code);
    }
    return this;
  }

  /**
   * NK1-4: Address (XAD)
   * Next of kin's address
   * Components: Street^Other Designation^City^State^Zip^Country
   */
  address(
    street: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[3] = this.createField([
      [street, "", city || "", state || "", zip || "", country || ""],
    ]);
    return this;
  }

  /**
   * NK1-5: Phone Number (XTN)
   * Phone number(s) for next of kin
   */
  phoneNumber(number: string, use?: string): this {
    if (use) {
      this.fields[4] = this.createField([[number, use]]);
    } else {
      this.fields[4] = this.createField(number);
    }
    return this;
  }

  /**
   * NK1-6: Business Phone Number (XTN)
   */
  businessPhoneNumber(number: string): this {
    this.fields[5] = this.createField(number);
    return this;
  }

  /**
   * NK1-7: Contact Role (CE)
   * Role of the contact person
   * Examples: C (Emergency Contact), E (Employer), F (Federal Agency)
   */
  contactRole(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[6] = this.createField([
        [code, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[6] = this.createField(code);
    }
    return this;
  }

  /**
   * NK1-8: Start Date (DT)
   */
  startDate(date: string): this {
    this.fields[7] = this.createField(date);
    return this;
  }

  /**
   * NK1-9: End Date (DT)
   */
  endDate(date: string): this {
    this.fields[8] = this.createField(date);
    return this;
  }

  /**
   * NK1-10: Next of Kin / Associated Parties Job Title (ST)
   */
  jobTitle(title: string): this {
    this.fields[9] = this.createField(title);
    return this;
  }

  /**
   * NK1-13: Organization Name - NK1 (XON)
   */
  organizationName(name: string): this {
    this.fields[12] = this.createField(name);
    return this;
  }

  /**
   * NK1-15: Administrative Sex (IS)
   * M = Male, F = Female, O = Other, U = Unknown
   */
  administrativeSex(sex: string): this {
    this.fields[14] = this.createField(sex);
    return this;
  }

  /**
   * NK1-16: Date/Time of Birth (TS)
   */
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
