/**
 * ERR segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ERR as ERR_base } from "../v2.3/ERR.ts";

/**
 * ERR segment (HL7 v2.5.1)
 * Extends v2.3 ERR. Add v2.5.1-specific fields here as needed.
 */
export class ERR extends ERR_base {
  /**
   * ERR-10 Override Type (chainable).
   * @param code - ERR-10.1 Identifier
   * @param text - ERR-10.2 Text
   * @param codingSystem - ERR-10.3 Name of Coding System
   */
  overrideType({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[9] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * ERR-11 Override Reason Code (chainable).
   * @param code - ERR-11.1 Identifier
   * @param text - ERR-11.2 Text
   * @param codingSystem - ERR-11.3 Name of Coding System
   */
  overrideReasonCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[10] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** ERR-12 Help Desk Contact Point (chainable). */
  helpDeskContactPoint(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ERR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ERR") {
      return { ok: false, err: new Err(`Expected ERR segment, got ${parts[0]}`) };
    }
    const seg = new ERR();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
