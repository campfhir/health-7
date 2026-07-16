/**
 * RXO segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * RXO - Pharmacy/Treatment Order Segment (HL7 v2.3)
 */
export class RXO extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "RXO";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * RXO-1 Requested Give Code (chainable).
   * @param code - RXO-1.1 Code
   * @param text - RXO-1.2 Text
   * @param codingSystem - RXO-1.3 Coding System
   */
  requestedGiveCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[0] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXO-2 Requested Give Amount - Minimum (chainable). */
  requestedGiveAmountMin(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** RXO-3 Requested Give Amount - Maximum (chainable). */
  requestedGiveAmountMax(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /**
   * RXO-4 Requested Give Units (chainable).
   * @param code - RXO-4.1 Code
   * @param text - RXO-4.2 Text
   */
  requestedGiveUnits(code: string, text?: string): this {
    this.fields[3] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXO-5 Requested Dosage Form (chainable).
   * @param code - RXO-5.1 Code
   * @param text - RXO-5.2 Text
   */
  requestedDosageForm(code: string, text?: string): this {
    this.fields[4] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXO-6 Provider's Pharmacy/Treatment Instructions (chainable).
   * @param code - RXO-6.1 Code
   * @param text - RXO-6.2 Text
   */
  providerPharmacyInstructions(code: string, text?: string): this {
    this.fields[5] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXO-7 Provider's Administration Instructions (chainable).
   * @param code - RXO-7.1 Code
   * @param text - RXO-7.2 Text
   */
  providerAdminInstructions(code: string, text?: string): this {
    this.fields[6] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * RXO-8 Deliver-To Location (chainable).
   * @param pointOfCare - RXO-8.1 Point of Care
   * @param room - RXO-8.2 Room
   * @param bed - RXO-8.3 Bed
   * @param facility - RXO-8.4 Facility
   */
  deliverToLocation(
    pointOfCare: string,
    room?: string,
    bed?: string,
    facility?: string,
  ): this {
    this.fields[7] = this.createComponentsField([
      pointOfCare,
      room,
      bed,
      facility,
    ]);
    return this;
  }

  /** RXO-9 Allow Substitutions (chainable). */
  allowSubstitutions(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * RXO-10 Requested Dispense Code (chainable).
   * @param code - RXO-10.1 Code
   * @param text - RXO-10.2 Text
   */
  requestedDispenseCode(code: string, text?: string): this {
    this.fields[9] = this.createComponentsField([code, text]);
    return this;
  }

  /** RXO-11 Requested Dispense Amount (chainable). */
  requestedDispenseAmount(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * RXO-12 Requested Dispense Units (chainable).
   * @param code - RXO-12.1 Code
   * @param text - RXO-12.2 Text
   */
  requestedDispenseUnits(code: string, text?: string): this {
    this.fields[11] = this.createComponentsField([code, text]);
    return this;
  }

  /** RXO-13 Number of Refills (chainable). */
  numberOfRefills(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /**
   * RXO-14 Ordering Provider's DEA Number (chainable).
   * @param id - RXO-14.1 ID Number
   * @param familyName - RXO-14.2 Family Name
   * @param givenName - RXO-14.3 Given Name
   */
  orderingProviderDeaNumber(id: string, familyName?: string, givenName?: string): this {
    this.fields[13] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /**
   * RXO-15 Pharmacist/Treatment Supplier's Verifier ID (chainable).
   * @param id - RXO-15.1 ID Number
   * @param familyName - RXO-15.2 Family Name
   * @param givenName - RXO-15.3 Given Name
   */
  pharmacistVerifierId(id: string, familyName?: string, givenName?: string): this {
    this.fields[14] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** RXO-16 Needs Human Review (chainable). */
  needsHumanReview(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** RXO-17 Requested Give Per (Time Unit) (chainable). */
  requestedGivePerTimeUnit(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** RXO-18 Requested Give Strength (chainable). */
  requestedGiveStrength(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /**
   * RXO-19 Requested Give Strength Units (chainable).
   * @param code - RXO-19.1 Identifier
   * @param text - RXO-19.2 Text
   * @param codingSystem - RXO-19.3 Name of Coding System
   */
  requestedGiveStrengthUnits(code: string, text?: string, codingSystem?: string): this {
    this.fields[18] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * RXO-20 Indication (chainable).
   * @param code - RXO-20.1 Identifier
   * @param text - RXO-20.2 Text
   * @param codingSystem - RXO-20.3 Name of Coding System
   */
  indication(code: string, text?: string, codingSystem?: string): this {
    this.fields[19] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXO-21 Requested Give Rate Amount (chainable). */
  requestedGiveRateAmount(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /**
   * RXO-22 Requested Give Rate Units (chainable).
   * @param code - RXO-22.1 Code
   * @param text - RXO-22.2 Text
   */
  requestedGiveRateUnits(code: string, text?: string): this {
    this.fields[21] = this.createComponentsField([code, text]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<RXO> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXO") {
      return { ok: false, err: new Err(`Expected RXO segment, got ${parts[0]}`) };
    }
    const seg = new RXO();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
