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

  /** ROL-1: Role Instance ID (EI) */
  roleInstanceId(
    entityId: string,
    namespaceId?: string,
    universalId?: string,
    universalIdType?: string,
  ): this {
    this.fields[0] = this.createField([
      [entityId, namespaceId || "", universalId || "", universalIdType || ""],
    ]);
    return this;
  }

  /** ROL-2: Action Code (ID) - e.g. AD=Add, DE=Delete, UP=Update, CO=Correct */
  actionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** ROL-3: Role-ROL (CE) */
  role(code: string, text?: string, codingSystem?: string): this {
    this.fields[2] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** ROL-4: Role Person (XCN) */
  rolePerson(
    id: string,
    familyName?: string,
    givenName?: string,
    middleName?: string,
  ): this {
    this.fields[3] = this.createField([
      [id, familyName || "", givenName || "", middleName || ""],
    ]);
    return this;
  }

  /** ROL-5: Role Begin Date/Time (TS) */
  roleBeginDateTime(value: string, format?: never): this;
  /** Sets the role begin date time field (chainable). */
  roleBeginDateTime(value: Date, format?: HL7DateTimeLayout): this;
  roleBeginDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[4] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** ROL-6: Role End Date/Time (TS) */
  roleEndDateTime(value: string, format?: never): this;
  /** Sets the role end date time field (chainable). */
  roleEndDateTime(value: Date, format?: HL7DateTimeLayout): this;
  roleEndDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** ROL-7: Role Duration (CE) */
  roleDuration(code: string, text?: string): this {
    this.fields[6] = this.createField([[code, text || ""]]);
    return this;
  }

  /** ROL-8: Role Action Reason (CE) */
  roleActionReason(code: string, text?: string): this {
    this.fields[7] = this.createField([[code, text || ""]]);
    return this;
  }

  /** ROL-9: Provider Type (CE) */
  providerType(code: string, text?: string): this {
    this.fields[8] = this.createField([[code, text || ""]]);
    return this;
  }

  /** ROL-10: Organization Unit Type (CE) */
  organizationUnitType(code: string, text?: string): this {
    this.fields[9] = this.createField([[code, text || ""]]);
    return this;
  }

  /** ROL-11: Office/Home Address/Birthplace (XAD) */
  officeAddress(
    street: string,
    city?: string,
    state?: string,
    zip?: string,
  ): this {
    this.fields[10] = this.createField([
      [street, "", city || "", state || "", zip || ""],
    ]);
    return this;
  }

  /** ROL-12: Phone (XTN) */
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
