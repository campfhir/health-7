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

  /** RXA-1: Give Sub-ID Counter (NM) */
  giveSubIdCounter(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** RXA-2: Administration Sub-ID Counter (NM) */
  administrationSubIdCounter(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** RXA-3: Date/Time Start of Administration (TS) */
  dateTimeStartOfAdministration(value: string, format?: never): this;
  /** Sets the date time start of administration field (chainable). */
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

  /** RXA-4: Date/Time End of Administration (TS) */
  dateTimeEndOfAdministration(value: string, format?: never): this;
  /** Sets the date time end of administration field (chainable). */
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

  /** RXA-5: Administered Code (CE, required) e.g. codingSystem=CVX for vaccines */
  administeredCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[4] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** RXA-6: Administered Amount (NM, required) */
  administeredAmount(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** RXA-7: Administered Units (CE) */
  administeredUnits(code: string, text?: string, codingSystem?: string): this {
    this.fields[6] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** RXA-8: Administered Dosage Form (CE) */
  administeredDosageForm(code: string, text?: string): this {
    this.fields[7] = this.createField([[code, text || ""]]);
    return this;
  }

  /** RXA-9: Administration Notes (CE) */
  administrationNotes(code: string, text?: string): this {
    this.fields[8] = this.createField([[code, text || ""]]);
    return this;
  }

  /** RXA-10: Administering Provider (XCN) */
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

  /** RXA-11: Administered-at Location (LA2) */
  administeredAtLocation(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** RXA-12: Administered Per (Time Unit) (ST) */
  administeredPer(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** RXA-13: Administered Strength (NM) */
  administeredStrength(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** RXA-14: Administered Strength Units (CE) */
  administeredStrengthUnits(code: string, text?: string): this {
    this.fields[13] = this.createField([[code, text || ""]]);
    return this;
  }

  /** RXA-15: Substance Lot Number (ST) */
  substanceLotNumber(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** RXA-16: Substance Expiration Date (TS) */
  substanceExpirationDate(value: string, format?: never): this;
  /** Sets the substance expiration date field (chainable). */
  substanceExpirationDate(value: Date, format?: HL7DateLayout): this;
  substanceExpirationDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[15] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** RXA-17: Substance Manufacturer Name (CE) */
  substanceManufacturerName(code: string, text?: string): this {
    this.fields[16] = this.createField([[code, text || ""]]);
    return this;
  }

  /** RXA-18: Substance/Treatment Refusal Reason (CE) */
  substanceRefusalReason(code: string, text?: string): this {
    this.fields[17] = this.createField([[code, text || ""]]);
    return this;
  }

  /** RXA-19: Indication (CE) */
  indication(code: string, text?: string): this {
    this.fields[18] = this.createField([[code, text || ""]]);
    return this;
  }

  /** RXA-20: Completion Status (ID) e.g. CP=Complete, RE=Refused, NA=Not Administered, PA=Partially Administered */
  completionStatus(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** RXA-21: Action Code - RXA (ID) e.g. A=Add, D=Delete, U=Update */
  actionCode(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** RXA-22: System Entry Date/Time (TS) */
  systemEntryDateTime(value: string, format?: never): this;
  /** Sets the system entry date time field (chainable). */
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
