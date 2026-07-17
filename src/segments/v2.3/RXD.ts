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

  /** RXD-1 Dispense Sub-ID Counter (chainable). */
  dispenseSubIdCounter(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * RXD-2 Dispense/Give Code (chainable).
   * @param code - RXD-2.1 Code
   * @param text - RXD-2.2 Text
   * @param codingSystem - RXD-2.3 Coding System
   */
  dispenseGiveCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[1] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXD-3 Date/Time Dispensed (chainable). */
  dateTimeDispensed(value: string, format?: never): this;
  /** RXD-3 Date/Time Dispensed (chainable). */
  dateTimeDispensed(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeDispensed(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[2] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** RXD-4 Actual Dispense Amount (chainable). */
  actualDispenseAmount(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * RXD-5 Actual Dispense Units (chainable).
   * @param code - RXD-5.1 Code
   * @param text - RXD-5.2 Text
   */
  actualDispenseUnits({ code, text }: { code: string; text?: string }): this {
    this.fields[4] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXD-6 Actual Dosage Form (chainable).
   * @param code - RXD-6.1 Code
   * @param text - RXD-6.2 Text
   */
  actualDosageForm({ code, text }: { code: string; text?: string }): this {
    this.fields[5] = this.createComponentsField([code, text]);
    return this;
  }

  /** RXD-7 Prescription Number (chainable). */
  prescriptionNumber(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** RXD-8 Number of Refills Remaining (chainable). */
  numberOfRefillsRemaining(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** RXD-9 Dispense Notes (chainable). */
  dispenseNotes(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * RXD-10 Dispensing Provider (chainable).
   * @param id - RXD-10.1 ID Number
   * @param familyName - RXD-10.2 Family Name
   * @param givenName - RXD-10.3 Given Name
   */
  dispensingProvider({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    this.fields[9] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** RXD-11 Substitution Status (chainable). */
  substitutionStatus(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * RXD-12 Total Daily Dose (chainable).
   * @param quantity - RXD-12.1 Quantity
   * @param units - RXD-12.2 Units
   */
  totalDailyDose({ quantity, units }: { quantity: string; units?: string }): this {
    this.fields[11] = this.createComponentsField([quantity, units]);
    return this;
  }

  /**
   * RXD-13 Dispense-to Location (chainable).
   * @param pointOfCare - RXD-13.1 Point of Care
   * @param room - RXD-13.2 Room
   * @param bed - RXD-13.3 Bed
   * @param facility - RXD-13.4 Facility
   */
  dispenseToLocation({ pointOfCare, room, bed, facility }: { pointOfCare: string; room?: string; bed?: string; facility?: string }): this {
    this.fields[12] = this.createComponentsField([
      pointOfCare,
      room,
      bed,
      facility,
    ]);
    return this;
  }

  /** RXD-14 Needs Human Review (chainable). */
  needsHumanReview(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /**
   * RXD-15 Pharmacy/Treatment Supplier's Special Dispensing Instructions (chainable).
   * @param code - RXD-15.1 Identifier
   * @param text - RXD-15.2 Text
   * @param codingSystem - RXD-15.3 Name of Coding System
   */
  specialDispensingInstructions({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[14] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXD-16 Actual Strength (chainable). */
  actualStrength(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /**
   * RXD-17 Actual Strength Unit (chainable).
   * @param code - RXD-17.1 Identifier
   * @param text - RXD-17.2 Text
   * @param codingSystem - RXD-17.3 Name of Coding System
   */
  actualStrengthUnit({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[16] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXD-18 Substance Lot Number (chainable). */
  substanceLotNumber(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /** RXD-19 Substance Expiration Date (chainable). */
  substanceExpirationDate(value: string, format?: never): this;
  /** RXD-19 Substance Expiration Date (chainable). */
  substanceExpirationDate(value: Date, format?: HL7DateLayout): this;
  substanceExpirationDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[18] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /**
   * RXD-20 Substance Manufacturer Name (chainable).
   * @param code - RXD-20.1 Code
   * @param text - RXD-20.2 Text
   */
  substanceManufacturerName({ code, text }: { code: string; text?: string }): this {
    this.fields[19] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXD-21 Indication (chainable).
   * @param code - RXD-21.1 Identifier
   * @param text - RXD-21.2 Text
   * @param codingSystem - RXD-21.3 Name of Coding System
   */
  indication({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[20] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXD-22 Dispense Package Size (chainable). */
  dispensePackageSize(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /**
   * RXD-23 Dispense Package Size Unit (chainable).
   * @param code - RXD-23.1 Identifier
   * @param text - RXD-23.2 Text
   * @param codingSystem - RXD-23.3 Name of Coding System
   */
  dispensePackageSizeUnit({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[22] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXD-24 Dispense Package Method (chainable). */
  dispensePackageMethod(value: string): this {
    this.fields[23] = this.createField(value);
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
