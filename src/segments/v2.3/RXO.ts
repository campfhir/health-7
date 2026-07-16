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
    if (text || codingSystem) {
      this.fields[0] = this.createField([[code, text || "", codingSystem || ""]]);
    } else {
      this.fields[0] = this.createField(code);
    }
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
    if (text) {
      this.fields[3] = this.createField([[code, text]]);
    } else {
      this.fields[3] = this.createField(code);
    }
    return this;
  }

  /**
   * RXO-5 Requested Dosage Form (chainable).
   * @param code - RXO-5.1 Code
   * @param text - RXO-5.2 Text
   */
  requestedDosageForm(code: string, text?: string): this {
    if (text) {
      this.fields[4] = this.createField([[code, text]]);
    } else {
      this.fields[4] = this.createField(code);
    }
    return this;
  }

  /**
   * RXO-6 Provider's Pharmacy/Treatment Instructions (chainable).
   * @param code - RXO-6.1 Code
   * @param text - RXO-6.2 Text
   */
  providerPharmacyInstructions(code: string, text?: string): this {
    if (text) {
      this.fields[5] = this.createField([[code, text]]);
    } else {
      this.fields[5] = this.createField(code);
    }
    return this;
  }

  /**
   * RXO-7 Provider's Administration Instructions (chainable).
   * @param code - RXO-7.1 Code
   * @param text - RXO-7.2 Text
   */
  providerAdminInstructions(code: string, text?: string): this {
    if (text) {
      this.fields[6] = this.createField([[code, text]]);
    } else {
      this.fields[6] = this.createField(code);
    }
    return this;
  }

  /**
   * RXO-9 Requested Dispense Code (chainable).
   * @param code - RXO-9.1 Code
   * @param text - RXO-9.2 Text
   */
  requestedDispenseCode(code: string, text?: string): this {
    if (text) {
      this.fields[8] = this.createField([[code, text]]);
    } else {
      this.fields[8] = this.createField(code);
    }
    return this;
  }

  /** RXO-10 Requested Dispense Amount (chainable). */
  requestedDispenseAmount(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /**
   * RXO-11 Requested Dispense Units (chainable).
   * @param code - RXO-11.1 Code
   * @param text - RXO-11.2 Text
   */
  requestedDispenseUnits(code: string, text?: string): this {
    if (text) {
      this.fields[10] = this.createField([[code, text]]);
    } else {
      this.fields[10] = this.createField(code);
    }
    return this;
  }

  /** RXO-12 Number of Refills (chainable). */
  numberOfRefills(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /**
   * RXO-13 Ordering Provider's DEA Number (chainable).
   * @param id - RXO-13.1 ID Number
   * @param familyName - RXO-13.2 Family Name
   * @param givenName - RXO-13.3 Given Name
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
   * RXO-14 Pharmacist/Treatment Supplier's Verifier ID (chainable).
   * @param id - RXO-14.1 ID Number
   * @param familyName - RXO-14.2 Family Name
   * @param givenName - RXO-14.3 Given Name
   */
  pharmacistVerifierId(id: string, familyName?: string, givenName?: string): this {
    if (familyName || givenName) {
      this.fields[13] = this.createField([[id, familyName || "", givenName || ""]]);
    } else {
      this.fields[13] = this.createField(id);
    }
    return this;
  }

  /** RXO-15 Needs Human Review (chainable). */
  needsHumanReview(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** RXO-20 Requested Give Rate Amount (chainable). */
  requestedGiveRateAmount(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /**
   * RXO-21 Requested Give Rate Units (chainable).
   * @param code - RXO-21.1 Code
   * @param text - RXO-21.2 Text
   */
  requestedGiveRateUnits(code: string, text?: string): this {
    if (text) {
      this.fields[20] = this.createField([[code, text]]);
    } else {
      this.fields[20] = this.createField(code);
    }
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
