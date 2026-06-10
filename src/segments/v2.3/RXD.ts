/**
 * RXD segment definition for HL7 v2.3.
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
 * RXD - Pharmacy/Treatment Dispense Segment (HL7 v2.3)
 */
export class RXD extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "RXD";

  constructor() {
    super();
    this.fields = [];
  }

  /** RXD-1: Dispense Sub-ID Counter (NM, required) */
  dispenseSubIdCounter(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** RXD-2: Dispense/Give Code (CE, required) */
  dispenseGiveCode(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[1] = this.createField([
        [code, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[1] = this.createField(code);
    }
    return this;
  }

  /** RXD-3: Date/Time Dispensed (TS, required) */
  dateTimeDispensed(value: string, format?: never): this;
  /** Sets the date time dispensed field (chainable). */
  dateTimeDispensed(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeDispensed(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[2] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** RXD-4: Actual Dispense Amount (NM, required) */
  actualDispenseAmount(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** RXD-5: Actual Dispense Units (CE) */
  actualDispenseUnits(code: string, text?: string): this {
    if (text) {
      this.fields[4] = this.createField([[code, text]]);
    } else {
      this.fields[4] = this.createField(code);
    }
    return this;
  }

  /** RXD-6: Actual Dosage Form (CE) */
  actualDosageForm(code: string, text?: string): this {
    if (text) {
      this.fields[5] = this.createField([[code, text]]);
    } else {
      this.fields[5] = this.createField(code);
    }
    return this;
  }

  /** RXD-7: Prescription Number (ST, required) */
  prescriptionNumber(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** RXD-8: Number of Refills Remaining (NM) */
  numberOfRefillsRemaining(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** RXD-9: Dispense Notes (ST) */
  dispenseNotes(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** RXD-10: Dispensing Provider (XCN) */
  dispensingProvider(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    if (familyName || givenName) {
      this.fields[9] = this.createField([
        [id, familyName || "", givenName || ""],
      ]);
    } else {
      this.fields[9] = this.createField(id);
    }
    return this;
  }

  /** RXD-11: Substitution Status (ID) e.g. N=No substitute, G=Generic, T=Therapeutic */
  substitutionStatus(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** RXD-15: Substance Lot Number (ST) */
  substanceLotNumber(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** RXD-16: Substance Expiration Date (TS) */
  substanceExpirationDate(value: string, format?: never): this;
  /** Sets the substance expiration date field (chainable). */
  substanceExpirationDate(value: Date, format?: HL7DateLayout): this;
  substanceExpirationDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[15] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** RXD-17: Substance Manufacturer Name (CE) */
  substanceManufacturerName(code: string, text?: string): this {
    if (text) {
      this.fields[16] = this.createField([[code, text]]);
    } else {
      this.fields[16] = this.createField(code);
    }
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXD> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXD") {
      return {
        ok: false,
        err: new Err(`Expected RXD segment, got ${parts[0]}`),
      };
    }
    const seg = new RXD();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
