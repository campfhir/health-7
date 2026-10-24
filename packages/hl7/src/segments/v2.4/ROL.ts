/**
 * ROL segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 ROL; see ROL.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ROL as ROL_base } from "../v2.3.1/ROL.ts";

/**
 * ROL segment (HL7 v2.4)
 *
 * Extends v2.3.1 ROL with ROL-9 to ROL-12 (Provider Type, Organization Unit Type, Office/Home Address, Phone). Source: hl7.eu v2.4 ROL table (12 fields).
 */
export class ROL extends ROL_base {
  /**
   * ROL-9 Provider Type (chainable).
   * @param code - ROL-9.1 Code
   * @param text - ROL-9.2 Text
   */
  providerType({ code, text }: { code: string; text?: string }): this {
    this.fields[8] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * ROL-10 Organization Unit Type (chainable).
   * @param code - ROL-10.1 Code
   * @param text - ROL-10.2 Text
   */
  organizationUnitType({ code, text }: { code: string; text?: string }): this {
    this.fields[9] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * ROL-11 Office/Home Address/Birthplace (chainable).
   * @param street - ROL-11.1 Street
   * @param city - ROL-11.3 City
   * @param state - ROL-11.4 State
   * @param zip - ROL-11.5 Zip
   */
  officeAddress({ street, city, state, zip }: { street: string; city?: string; state?: string; zip?: string }): this {
    this.fields[10] = this.createComponentsField([
      street,
      "",
      city || "",
      state || "",
      zip || "",
    ]);
    return this;
  }

  /** ROL-12 Phone (chainable). */
  phone(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ROL> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ROL") {
      return { ok: false, err: new Err(`Expected ROL segment, got ${parts[0]}`) };
    }
    const seg = new ROL();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
