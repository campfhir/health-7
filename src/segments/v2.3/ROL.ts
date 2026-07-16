/**
 * ROL segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * ROL - Role Segment (HL7 v2.3)
 */
export class ROL extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "ROL";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * ROL-1 Role Instance ID (chainable).
   * @param entityId - ROL-1.1 Entity ID
   * @param namespaceId - ROL-1.2 Namespace ID
   * @param universalId - ROL-1.3 Universal ID
   * @param universalIdType - ROL-1.4 Universal ID Type
   */
  roleInstanceId(
    entityId: string,
    namespaceId?: string,
    universalId?: string,
    universalIdType?: string,
  ): this {
    this.fields[0] = this.createComponentsField([
      entityId,
      namespaceId || "",
      universalId || "",
      universalIdType || "",
    ]);
    return this;
  }

  /** ROL-2 Action Code (chainable). */
  actionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * ROL-3 Role-ROL (chainable).
   * @param code - ROL-3.1 Code
   * @param text - ROL-3.2 Text
   * @param codingSystem - ROL-3.3 Coding System
   */
  role(code: string, text?: string, codingSystem?: string): this {
    this.fields[2] = this.createComponentsField([
      code,
      text || "",
      codingSystem || "",
    ]);
    return this;
  }

  /**
   * ROL-4 Role Person (chainable).
   * @param id - ROL-4.1 ID Number
   * @param familyName - ROL-4.2 Family Name
   * @param givenName - ROL-4.3 Given Name
   * @param middleName - ROL-4.4 Middle Name
   */
  rolePerson(
    id: string,
    familyName?: string,
    givenName?: string,
    middleName?: string,
  ): this {
    this.fields[3] = this.createComponentsField([
      id,
      familyName || "",
      givenName || "",
      middleName || "",
    ]);
    return this;
  }

  /** ROL-5 Role Begin Date/Time (chainable). */
  roleBeginDateTime(value: string, format?: never): this;
  /** ROL-5 Role Begin Date/Time (chainable). */
  roleBeginDateTime(value: Date, format?: HL7DateTimeLayout): this;
  roleBeginDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[4] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** ROL-6 Role End Date/Time (chainable). */
  roleEndDateTime(value: string, format?: never): this;
  /** ROL-6 Role End Date/Time (chainable). */
  roleEndDateTime(value: Date, format?: HL7DateTimeLayout): this;
  roleEndDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * ROL-7 Role Duration (chainable).
   * @param code - ROL-7.1 Code
   * @param text - ROL-7.2 Text
   */
  roleDuration(code: string, text?: string): this {
    this.fields[6] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * ROL-8 Role Action Reason (chainable).
   * @param code - ROL-8.1 Code
   * @param text - ROL-8.2 Text
   */
  roleActionReason(code: string, text?: string): this {
    this.fields[7] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * ROL-9 Provider Type (chainable).
   * @param code - ROL-9.1 Code
   * @param text - ROL-9.2 Text
   */
  providerType(code: string, text?: string): this {
    this.fields[8] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * ROL-10 Organization Unit Type (chainable).
   * @param code - ROL-10.1 Code
   * @param text - ROL-10.2 Text
   */
  organizationUnitType(code: string, text?: string): this {
    this.fields[9] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * ROL-11 Office/Home Address/Birthplace (chainable).
   * @param street - ROL-11.1 Street
   * @param city - ROL-11.3 City
   * @param state - ROL-11.4 State
   * @param zip - ROL-11.5 Zip
   */
  officeAddress(
    street: string,
    city?: string,
    state?: string,
    zip?: string,
  ): this {
    this.fields[10] = this.createComponentsField([
      street,
      "",
      city || "",
      state || "",
      zip || "",
    ]);
    return this;
  }

  /** ROL-12 Phone (chainable). */
  phone(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ROL> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ROL") {
      return {
        ok: false,
        err: new Err(`Expected ROL segment, got ${parts[0]}`),
      };
    }
    const seg = new ROL();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
