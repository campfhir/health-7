/**
 * ACC segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 ACC; see ACC.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ACC as ACC_base } from "../v2.3.1/ACC.ts";

/**
 * ACC segment (HL7 v2.4)
 *
 * Extends v2.3.1 ACC with ACC-7 to ACC-10 (Entered By, Accident Description, Brought In By, Police Notified Indicator). Source: hl7.eu v2.4 ACC table (10 fields).
 */
export class ACC extends ACC_base {
  /**
   * ACC-7 Entered By (chainable).
   * @param id - ACC-7.1 ID Number
   * @param familyName - ACC-7.2 Family Name
   * @param givenName - ACC-7.3 Given Name
   */
  enteredBy({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    this.fields[6] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** ACC-8 Accident Description (chainable). */
  accidentDescription(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** ACC-9 Brought In By (chainable). */
  broughtInBy(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** ACC-10 Police Notified Indicator (chainable). */
  policeNotified(value: string): this {
    this.fields[9] = this.createField(value);
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
