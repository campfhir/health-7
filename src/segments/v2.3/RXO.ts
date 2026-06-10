import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * RXO - Pharmacy/Treatment Order Segment (HL7 v2.3)
 */
export class RXO extends BaseSegment {
  name = "RXO";

  constructor() {
    super();
    this.fields = [];
  }

  /** RXO-1: Requested Give Code (CE, required) */
  requestedGiveCode(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[0] = this.createField([[code, text || "", codingSystem || ""]]);
    } else {
      this.fields[0] = this.createField(code);
    }
    return this;
  }

  /** RXO-2: Requested Give Amount - Minimum (NM, required) */
  requestedGiveAmountMin(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** RXO-3: Requested Give Amount - Maximum (NM) */
  requestedGiveAmountMax(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** RXO-4: Requested Give Units (CE, required) */
  requestedGiveUnits(code: string, text?: string): this {
    if (text) {
      this.fields[3] = this.createField([[code, text]]);
    } else {
      this.fields[3] = this.createField(code);
    }
    return this;
  }

  /** RXO-5: Requested Dosage Form (CE) */
  requestedDosageForm(code: string, text?: string): this {
    if (text) {
      this.fields[4] = this.createField([[code, text]]);
    } else {
      this.fields[4] = this.createField(code);
    }
    return this;
  }

  /** RXO-6: Provider's Pharmacy/Treatment Instructions (CE) */
  providerPharmacyInstructions(code: string, text?: string): this {
    if (text) {
      this.fields[5] = this.createField([[code, text]]);
    } else {
      this.fields[5] = this.createField(code);
    }
    return this;
  }

  /** RXO-7: Provider's Administration Instructions (CE) */
  providerAdminInstructions(code: string, text?: string): this {
    if (text) {
      this.fields[6] = this.createField([[code, text]]);
    } else {
      this.fields[6] = this.createField(code);
    }
    return this;
  }

  /** RXO-9: Requested Dispense Code (CE) */
  requestedDispenseCode(code: string, text?: string): this {
    if (text) {
      this.fields[8] = this.createField([[code, text]]);
    } else {
      this.fields[8] = this.createField(code);
    }
    return this;
  }

  /** RXO-10: Requested Dispense Amount (NM) */
  requestedDispenseAmount(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** RXO-11: Requested Dispense Units (CE) */
  requestedDispenseUnits(code: string, text?: string): this {
    if (text) {
      this.fields[10] = this.createField([[code, text]]);
    } else {
      this.fields[10] = this.createField(code);
    }
    return this;
  }

  /** RXO-12: Number of Refills (NM) */
  numberOfRefills(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** RXO-13: Ordering Provider's DEA Number (XCN) */
  orderingProviderDeaNumber(id: string, familyName?: string, givenName?: string): this {
    if (familyName || givenName) {
      this.fields[12] = this.createField([[id, familyName || "", givenName || ""]]);
    } else {
      this.fields[12] = this.createField(id);
    }
    return this;
  }

  /** RXO-14: Pharmacist/Treatment Supplier's Verifier ID (XCN) */
  pharmacistVerifierId(id: string, familyName?: string, givenName?: string): this {
    if (familyName || givenName) {
      this.fields[13] = this.createField([[id, familyName || "", givenName || ""]]);
    } else {
      this.fields[13] = this.createField(id);
    }
    return this;
  }

  /** RXO-15: Needs Human Review (ID) e.g. Y/N */
  needsHumanReview(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** RXO-20: Requested Give Rate Amount (ST) */
  requestedGiveRateAmount(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** RXO-21: Requested Give Rate Units (CE) */
  requestedGiveRateUnits(code: string, text?: string): this {
    if (text) {
      this.fields[20] = this.createField([[code, text]]);
    } else {
      this.fields[20] = this.createField(code);
    }
    return this;
  }

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
