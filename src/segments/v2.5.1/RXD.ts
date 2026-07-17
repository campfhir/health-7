/**
 * RXD segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { RXD as RXD_base } from "../v2.3/RXD.ts";

/**
 * RXD segment (HL7 v2.5.1)
 * Extends v2.3 RXD. Add v2.5.1-specific fields here as needed.
 */
export class RXD extends RXD_base {
  /**
   * RXD-25 Supplementary Code (chainable).
   * @param code - RXD-25.1 Identifier
   * @param text - RXD-25.2 Text
   * @param codingSystem - RXD-25.3 Name of Coding System
   */
  supplementaryCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[24] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * RXD-26 Initiating Location (chainable).
   * @param code - RXD-26.1 Identifier
   * @param text - RXD-26.2 Text
   * @param codingSystem - RXD-26.3 Name of Coding System
   */
  initiatingLocation({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[25] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * RXD-27 Packaging/Assembly Location (chainable).
   * @param code - RXD-27.1 Identifier
   * @param text - RXD-27.2 Text
   * @param codingSystem - RXD-27.3 Name of Coding System
   */
  packagingAssemblyLocation({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[26] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXD-28 Actual Drug Strength Volume (chainable). */
  actualDrugStrengthVolume(value: string): this {
    this.fields[27] = this.createField(value);
    return this;
  }

  /**
   * RXD-29 Actual Drug Strength Volume Units (chainable).
   * @param code - RXD-29.1 Identifier
   * @param text - RXD-29.2 Text
   * @param codingSystem - RXD-29.3 Name of Coding System
   */
  actualDrugStrengthVolumeUnits({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[28] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * RXD-30 Dispense to Pharmacy (chainable).
   * @param code - RXD-30.1 Identifier
   * @param text - RXD-30.2 Text
   * @param codingSystem - RXD-30.3 Name of Coding System
   */
  dispenseToPharmacy({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[29] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * RXD-31 Dispense to Pharmacy Address (chainable).
   * @param street - RXD-31.1 Street Address
   * @param otherDesignation - RXD-31.2 Other Designation
   * @param city - RXD-31.3 City
   * @param state - RXD-31.4 State/Province
   * @param zip - RXD-31.5 Zip or Postal Code
   * @param country - RXD-31.6 Country
   */
  dispenseToPharmacyAddress({ street, otherDesignation, city, state, zip, country }: { street: string; otherDesignation?: string; city?: string; state?: string; zip?: string; country?: string }): this {
    this.fields[30] = this.createComponentsField([
      street,
      otherDesignation,
      city,
      state,
      zip,
      country,
    ]);
    return this;
  }

  /** RXD-32 Pharmacy Order Type (chainable). */
  pharmacyOrderType(value: string): this {
    this.fields[31] = this.createField(value);
    return this;
  }

  /**
   * RXD-33 Dispense Type (chainable).
   * @param code - RXD-33.1 Identifier
   * @param text - RXD-33.2 Text
   * @param codingSystem - RXD-33.3 Name of Coding System
   */
  dispenseType({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[32] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXD> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXD") {
      return { ok: false, err: new Err(`Expected RXD segment, got ${parts[0]}`) };
    }
    const seg = new RXD();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
