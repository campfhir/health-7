/**
 * ACC segment definition for HL7 v2.5.
 *
 * position-tests: hand-written (overrides of the v2.4 ACC; see ACC.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ACC as ACC_base } from "../v2.4/ACC.ts";

/**
 * ACC segment (HL7 v2.5)
 *
 * Extends v2.4 ACC with ACC-11 Accident Address (XAD). Source: hl7.eu v2.5 ACC table (11 fields).
 */
export class ACC extends ACC_base {
  /**
   * ACC-11 Accident Address (chainable).
   * @param street - ACC-11.1 Street
   * @param city - ACC-11.3 City
   * @param state - ACC-11.4 State
   * @param zip - ACC-11.5 Zip
   */
  accidentAddress({ street, city, state, zip }: { street: string; city?: string; state?: string; zip?: string }): this {
    this.fields[10] = this.createComponentsField([
      street,
      "",
      city || "",
      state || "",
      zip || "",
    ]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ACC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ACC") {
      return { ok: false, err: new Err(`Expected ACC segment, got ${parts[0]}`) };
    }
    const seg = new ACC();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
