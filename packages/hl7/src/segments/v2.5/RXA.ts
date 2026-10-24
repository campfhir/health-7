/**
 * RXA segment definition for HL7 v2.5.
 *
 * position-tests: hand-written (see RXA.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { RXA as RXA_base } from "../v2.4/RXA.ts";
import { codedParts, components, type CodedInput } from "../../utils/composites.ts";

/**
 * RXA segment (HL7 v2.5)
 *
 * Extends v2.4 RXA with RXA-23 to RXA-26.
 */
export class RXA extends RXA_base {
  /** RXA-23 Administered Drug Strength Volume (NM) (chainable). */
  administeredDrugStrengthVolume(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /** RXA-24 Administered Drug Strength Volume Units (CWE) (chainable). */
  administeredDrugStrengthVolumeUnits(value: CodedInput): this {
    this.fields[23] = this.createField(components(codedParts(value, 9)));
    return this;
  }

  /** RXA-25 Administered Barcode Identifier (CWE) (chainable). */
  administeredBarcodeIdentifier(value: CodedInput): this {
    this.fields[24] = this.createField(components(codedParts(value, 9)));
    return this;
  }

  /** RXA-26 Pharmacy Order Type (ID, table 0480) (chainable). */
  pharmacyOrderType(value: string): this {
    this.fields[25] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(segmentString: string, encoding: EncodingCharacters): Result<RXA> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXA") {
      return { ok: false, err: new Err(`Expected RXA segment, got ${parts[0]}`) };
    }
    const seg = new RXA();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
