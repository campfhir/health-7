/**
 * RXE segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  DateTimeLayout,
  formatHL7Date,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * RXE - Pharmacy/Treatment Encoded Order Segment (HL7 v2.3)
 */
export class RXE extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "RXE";

  constructor() {
    super();
    this.fields = [];
  }

  /** RXE-1 Quantity/Timing (chainable). */
  quantityTiming(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * RXE-2 Give Code (chainable).
   * @param code - RXE-2.1 Code
   * @param text - RXE-2.2 Text
   * @param codingSystem - RXE-2.3 Coding System
   */
  giveCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[1] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXE-3 Give Amount - Minimum (chainable). */
  giveAmountMin(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** RXE-4 Give Amount - Maximum (chainable). */
  giveAmountMax(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * RXE-5 Give Units (chainable).
   * @param code - RXE-5.1 Code
   * @param text - RXE-5.2 Text
   */
  giveUnits({ code, text }: { code: string; text?: string }): this {
    this.fields[4] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXE-6 Give Dosage Form (chainable).
   * @param code - RXE-6.1 Code
   * @param text - RXE-6.2 Text
   */
  giveDosageForm({ code, text }: { code: string; text?: string }): this {
    this.fields[5] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXE-7 Provider's Administration Instructions (chainable).
   * @param code - RXE-7.1 Code
   * @param text - RXE-7.2 Text
   */
  providerAdminInstructions({ code, text }: { code: string; text?: string }): this {
    this.fields[6] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXE-8 Deliver-To Location (chainable).
   * @param pointOfCare - RXE-8.1 Point of Care
   * @param room - RXE-8.2 Room
   * @param bed - RXE-8.3 Bed
   * @param facility - RXE-8.4 Facility
   */
  deliverToLocation({ pointOfCare, room, bed, facility }: { pointOfCare: string; room?: string; bed?: string; facility?: string }): this {
    this.fields[7] = this.createComponentsField([
      pointOfCare,
      room,
      bed,
      facility,
    ]);
    return this;
  }

  /** RXE-9 Substitution Status (chainable). */
  substitutionStatus(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** RXE-10 Dispense Amount (chainable). */
  dispenseAmount(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /**
   * RXE-11 Dispense Units (chainable).
   * @param code - RXE-11.1 Code
   * @param text - RXE-11.2 Text
   */
  dispenseUnits({ code, text }: { code: string; text?: string }): this {
    this.fields[10] = this.createComponentsField([code, text]);
    return this;
  }

  /** RXE-12 Number of Refills (chainable). */
  numberOfRefills(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /**
   * RXE-13 Ordering Provider's DEA Number (chainable).
   * @param id - RXE-13.1 ID Number
   * @param familyName - RXE-13.2 Family Name
   * @param givenName - RXE-13.3 Given Name
   */
  orderingProviderDeaNumber({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    this.fields[12] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /**
   * RXE-14 Pharmacist/Treatment Supplier's Verifier ID (chainable).
   * @param id - RXE-14.1 ID Number
   * @param familyName - RXE-14.2 Family Name
   * @param givenName - RXE-14.3 Given Name
   */
  pharmacistVerifierId({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    this.fields[13] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** RXE-15 Prescription Number (chainable). */
  prescriptionNumber(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** RXE-16 Number of Refills Remaining (chainable). */
  numberOfRefillsRemaining(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** RXE-17 Number of Refills/Doses Dispensed (chainable). */
  numberOfRefillsDosesDispensed(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** RXE-18 Date/Time of Most Recent Refill or Dose Dispensed (chainable). */
  dateTimeMostRecentRefillOrDoseDispensed(value: string, format?: never): this;
  /** RXE-18 Date/Time of Most Recent Refill or Dose Dispensed (chainable). */
  dateTimeMostRecentRefillOrDoseDispensed(
    value: Date,
    format?: HL7DateTimeLayout,
  ): this;
  dateTimeMostRecentRefillOrDoseDispensed(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[17] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * RXE-19 Total Daily Dose (chainable).
   * @param quantity - RXE-19.1 Quantity
   * @param units - RXE-19.2 Units
   */
  totalDailyDose({ quantity, units }: { quantity: string; units?: string }): this {
    this.fields[18] = this.createComponentsField([quantity, units]);
    return this;
  }

  /** RXE-20 Needs Human Review (chainable). */
  needsHumanReview(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /**
   * RXE-21 Pharmacy/Treatment Supplier's Special Dispensing Instructions (chainable).
   * @param code - RXE-21.1 Identifier
   * @param text - RXE-21.2 Text
   * @param codingSystem - RXE-21.3 Name of Coding System
   */
  specialDispensingInstructions({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[20] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXE-22 Give Per (Time Unit) (chainable). */
  givePer(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /** RXE-23 Give Rate Amount (chainable). */
  giveRateAmount(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /**
   * RXE-24 Give Rate Units (chainable).
   * @param code - RXE-24.1 Code
   * @param text - RXE-24.2 Text
   */
  giveRateUnits({ code, text }: { code: string; text?: string }): this {
    this.fields[23] = this.createComponentsField([code, text]);
    return this;
  }

  /** RXE-25 Give Strength (chainable). */
  giveStrength(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }

  /**
   * RXE-26 Give Strength Units (chainable).
   * @param code - RXE-26.1 Code
   * @param text - RXE-26.2 Text
   */
  giveStrengthUnits({ code, text }: { code: string; text?: string }): this {
    this.fields[25] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXE-27 Give Indication (chainable).
   * @param code - RXE-27.1 Identifier
   * @param text - RXE-27.2 Text
   * @param codingSystem - RXE-27.3 Name of Coding System
   */
  giveIndication({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[26] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXE-28 Dispense Package Size (chainable). */
  dispensePackageSize(value: string): this {
    this.fields[27] = this.createField(value);
    return this;
  }

  /**
   * RXE-29 Dispense Package Size Unit (chainable).
   * @param code - RXE-29.1 Identifier
   * @param text - RXE-29.2 Text
   * @param codingSystem - RXE-29.3 Name of Coding System
   */
  dispensePackageSizeUnit({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[28] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXE-30 Dispense Package Method (chainable). */
  dispensePackageMethod(value: string): this {
    this.fields[29] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<RXE> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXE") {
      return { ok: false, err: new Err(`Expected RXE segment, got ${parts[0]}`) };
    }
    const seg = new RXE();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
