/**
 * DRG segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 DRG; see DRG.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { DRG as DRG_base } from "../v2.3.1/DRG.ts";

/**
 * DRG segment (HL7 v2.4)
 *
 * Extends v2.3.1 DRG with DRG-11 DRG Transfer Type. Source: hl7.eu v2.4 DRG table (11 fields).
 */
export class DRG extends DRG_base {
  /** DRG-11 DRG Transfer Type (chainable). */
  drgTransferType(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<DRG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DRG") {
      return { ok: false, err: new Err(`Expected DRG segment, got ${parts[0]}`) };
    }
    const seg = new DRG();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
