/**
 * RXO segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { RXO as RXO_base } from "../v2.3/RXO.ts";

/**
 * RXO segment (HL7 v2.5.1)
 * Extends v2.3 RXO. Add v2.5.1-specific fields here as needed.
 */
export class RXO extends RXO_base {
  /**
   * RXO-23 Total Daily Dose (chainable).
   * @param quantity - RXO-23.1 Quantity
   * @param units - RXO-23.2 Units
   */
  totalDailyDose(quantity: string, units?: string): this {
    this.fields[22] = this.createComponentsField([quantity, units]);
    return this;
  }

  /**
   * RXO-24 Supplementary Code (chainable).
   * @param code - RXO-24.1 Identifier
   * @param text - RXO-24.2 Text
   * @param codingSystem - RXO-24.3 Name of Coding System
   */
  supplementaryCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[23] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXO-25 Requested Drug Strength Volume (chainable). */
  requestedDrugStrengthVolume(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }

  /**
   * RXO-26 Requested Drug Strength Volume Units (chainable).
   * @param code - RXO-26.1 Identifier
   * @param text - RXO-26.2 Text
   * @param codingSystem - RXO-26.3 Name of Coding System
   */
  requestedDrugStrengthVolumeUnits(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[25] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXO-27 Pharmacy Order Type (chainable). */
  pharmacyOrderType(value: string): this {
    this.fields[26] = this.createField(value);
    return this;
  }

  /** RXO-28 Dispensing Interval (chainable). */
  dispensingInterval(value: string): this {
    this.fields[27] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXO> {
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
