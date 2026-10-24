/**
 * PV2 segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 PV2; see PV2.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { PV2 as PV2_base } from "../v2.3.1/PV2.ts";

/**
 * PV2 segment (HL7 v2.4)
 *
 * Extends v2.3.1 PV2 with PV2-38 Mode of Arrival Code. Source: hl7.eu v2.4 PV2 table (47 fields; only PV2-38 is implemented so far).
 */
export class PV2 extends PV2_base {
  /**
   * PV2-38 Mode of Arrival Code (chainable).
   * @param code - PV2-38.1 Code
   * @param text - PV2-38.2 Text
   */
  modeOfArrivalCode({ code, text }: { code: string; text?: string }): this {
    this.fields[37] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PV2> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PV2") {
      return { ok: false, err: new Err(`Expected PV2 segment, got ${parts[0]}`) };
    }
    const seg = new PV2();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
