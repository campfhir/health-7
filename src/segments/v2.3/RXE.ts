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
  giveCode(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[1] = this.createField([[code, text || "", codingSystem || ""]]);
    } else {
      this.fields[1] = this.createField(code);
    }
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
  giveUnits(code: string, text?: string): this {
    if (text) {
      this.fields[4] = this.createField([[code, text]]);
    } else {
      this.fields[4] = this.createField(code);
    }
    return this;
  }

  /**
   * RXE-6 Give Dosage Form (chainable).
   * @param code - RXE-6.1 Code
   * @param text - RXE-6.2 Text
   */
  giveDosageForm(code: string, text?: string): this {
    if (text) {
      this.fields[5] = this.createField([[code, text]]);
    } else {
      this.fields[5] = this.createField(code);
    }
    return this;
  }

  /**
   * RXE-7 Provider's Administration Instructions (chainable).
   * @param code - RXE-7.1 Code
   * @param text - RXE-7.2 Text
   */
  providerAdminInstructions(code: string, text?: string): this {
    if (text) {
      this.fields[6] = this.createField([[code, text]]);
    } else {
      this.fields[6] = this.createField(code);
    }
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
  dispenseUnits(code: string, text?: string): this {
    if (text) {
      this.fields[10] = this.createField([[code, text]]);
    } else {
      this.fields[10] = this.createField(code);
    }
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
  orderingProviderDeaNumber(id: string, familyName?: string, givenName?: string): this {
    if (familyName || givenName) {
      this.fields[12] = this.createField([[id, familyName || "", givenName || ""]]);
    } else {
      this.fields[12] = this.createField(id);
    }
    return this;
  }

  /**
   * RXE-14 Pharmacist/Treatment Supplier's Verifier ID (chainable).
   * @param id - RXE-14.1 ID Number
   * @param familyName - RXE-14.2 Family Name
   * @param givenName - RXE-14.3 Given Name
   */
  pharmacistVerifierId(id: string, familyName?: string, givenName?: string): this {
    if (familyName || givenName) {
      this.fields[13] = this.createField([[id, familyName || "", givenName || ""]]);
    } else {
      this.fields[13] = this.createField(id);
    }
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

  /** RXE-21 Give Per (Time Unit) (chainable). */
  givePer(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** RXE-22 Give Rate Amount (chainable). */
  giveRateAmount(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /**
   * RXE-23 Give Rate Units (chainable).
   * @param code - RXE-23.1 Code
   * @param text - RXE-23.2 Text
   */
  giveRateUnits(code: string, text?: string): this {
    if (text) {
      this.fields[22] = this.createField([[code, text]]);
    } else {
      this.fields[22] = this.createField(code);
    }
    return this;
  }

  /** RXE-24 Give Strength (chainable). */
  giveStrength(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }

  /**
   * RXE-25 Give Strength Units (chainable).
   * @param code - RXE-25.1 Code
   * @param text - RXE-25.2 Text
   */
  giveStrengthUnits(code: string, text?: string): this {
    if (text) {
      this.fields[24] = this.createField([[code, text]]);
    } else {
      this.fields[24] = this.createField(code);
    }
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
