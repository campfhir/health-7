/**
 * RXA segment definition for HL7 v2.3.
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
  DateLayout,
  type HL7DateLayout,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * RXA - Pharmacy/Treatment Administration Segment (HL7 v2.3)
 */
export class RXA extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "RXA";

  constructor() {
    super();
    this.fields = [];
  }

  /** RXA-1 Give Sub-ID Counter (chainable). */
  giveSubIdCounter(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** RXA-2 Administration Sub-ID Counter (chainable). */
  administrationSubIdCounter(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** RXA-3 Date/Time Start of Administration (chainable). */
  dateTimeStartOfAdministration(value: string, format?: never): this;
  /** RXA-3 Date/Time Start of Administration (chainable). */
  dateTimeStartOfAdministration(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeStartOfAdministration(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[2] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** RXA-4 Date/Time End of Administration (chainable). */
  dateTimeEndOfAdministration(value: string, format?: never): this;
  /** RXA-4 Date/Time End of Administration (chainable). */
  dateTimeEndOfAdministration(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeEndOfAdministration(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[3] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * RXA-5 Administered Code (chainable).
   * @param code - RXA-5.1 Code
   * @param text - RXA-5.2 Text
   * @param codingSystem - RXA-5.3 Coding System
   */
  administeredCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[4] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** RXA-6 Administered Amount (chainable). */
  administeredAmount(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /**
   * RXA-7 Administered Units (chainable).
   * @param code - RXA-7.1 Code
   * @param text - RXA-7.2 Text
   * @param codingSystem - RXA-7.3 Coding System
   */
  administeredUnits(code: string, text?: string, codingSystem?: string): this {
    this.fields[6] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /**
   * RXA-8 Administered Dosage Form (chainable).
   * @param code - RXA-8.1 Code
   * @param text - RXA-8.2 Text
   */
  administeredDosageForm(code: string, text?: string): this {
    this.fields[7] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * RXA-9 Administration Notes (chainable).
   * @param code - RXA-9.1 Code
   * @param text - RXA-9.2 Text
   */
  administrationNotes(code: string, text?: string): this {
    this.fields[8] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * RXA-10 Administering Provider (chainable).
   * @param id - RXA-10.1 ID Number
   * @param familyName - RXA-10.2 Family Name
   * @param givenName - RXA-10.3 Given Name
   */
  administeringProvider(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    this.fields[9] = this.createField([
      [id, familyName || "", givenName || ""],
    ]);
    return this;
  }

  /** RXA-11 Administered-at Location (chainable). */
  administeredAtLocation(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** RXA-12 Administered Per (Time Unit) (chainable). */
  administeredPer(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** RXA-13 Administered Strength (chainable). */
  administeredStrength(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /**
   * RXA-14 Administered Strength Units (chainable).
   * @param code - RXA-14.1 Code
   * @param text - RXA-14.2 Text
   */
  administeredStrengthUnits(code: string, text?: string): this {
    this.fields[13] = this.createField([[code, text || ""]]);
    return this;
  }

  /** RXA-15 Substance Lot Number (chainable). */
  substanceLotNumber(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** RXA-16 Substance Expiration Date (chainable). */
  substanceExpirationDate(value: string, format?: never): this;
  /** RXA-16 Substance Expiration Date (chainable). */
  substanceExpirationDate(value: Date, format?: HL7DateLayout): this;
  substanceExpirationDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[15] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /**
   * RXA-17 Substance Manufacturer Name (chainable).
   * @param code - RXA-17.1 Code
   * @param text - RXA-17.2 Text
   */
  substanceManufacturerName(code: string, text?: string): this {
    this.fields[16] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * RXA-18 Substance/Treatment Refusal Reason (chainable).
   * @param code - RXA-18.1 Code
   * @param text - RXA-18.2 Text
   */
  substanceRefusalReason(code: string, text?: string): this {
    this.fields[17] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * RXA-19 Indication (chainable).
   * @param code - RXA-19.1 Code
   * @param text - RXA-19.2 Text
   */
  indication(code: string, text?: string): this {
    this.fields[18] = this.createField([[code, text || ""]]);
    return this;
  }

  /** RXA-20 Completion Status (chainable). */
  completionStatus(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** RXA-21 Action Code - RXA (chainable). */
  actionCode(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** RXA-22 System Entry Date/Time (chainable). */
  systemEntryDateTime(value: string, format?: never): this;
  /** RXA-22 System Entry Date/Time (chainable). */
  systemEntryDateTime(value: Date, format?: HL7DateTimeLayout): this;
  systemEntryDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[21] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXA> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXA") {
      return {
        ok: false,
        err: new Err(`Expected RXA segment, got ${parts[0]}`),
      };
    }
    const seg = new RXA();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
