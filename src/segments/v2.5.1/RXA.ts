/**
 * RXA segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { RXA as RXA_base } from "../v2.3/RXA.ts";

/**
 * RXA segment (HL7 v2.5.1)
 * Extends v2.3 RXA. Add v2.5.1-specific fields here as needed.
 */
export class RXA extends RXA_base {
  /** RXA-23 Administered Drug Strength Volume (chainable). */
  administeredDrugStrengthVolume(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /**
   * RXA-24 Administered Drug Strength Volume Units (chainable).
   * @param code - RXA-24.1 Identifier
   * @param text - RXA-24.2 Text
   * @param codingSystem - RXA-24.3 Name of Coding System
   */
  administeredDrugStrengthVolumeUnits(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[23] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * RXA-25 Administered Barcode Identifier (chainable).
   * @param code - RXA-25.1 Identifier
   * @param text - RXA-25.2 Text
   * @param codingSystem - RXA-25.3 Name of Coding System
   */
  administeredBarcodeIdentifier(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[24] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXA-26 Pharmacy Order Type (chainable). */
  pharmacyOrderType(value: string): this {
    this.fields[25] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXA> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXA") {
      return { ok: false, err: new Err(`Expected RXA segment, got ${parts[0]}`) };
    }
    const seg = new RXA();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
