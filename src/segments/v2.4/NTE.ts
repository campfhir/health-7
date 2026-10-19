/**
 * NTE segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 NTE; see NTE.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { NTE as NTE_base } from "../v2.3.1/NTE.ts";

/**
 * NTE segment (HL7 v2.4)
 *
 * Extends v2.3.1 NTE with NTE-4 Comment Type. Source: hl7.eu v2.4 NTE table (4 fields).
 */
export class NTE extends NTE_base {
  /**
   * NTE-4 Comment Type (chainable).
   * @param identifier - NTE-4.1 Identifier
   * @param text - NTE-4.2 Text
   * @param codingSystem - NTE-4.3 Coding System
   */
  commentType({ identifier, text, codingSystem }: { identifier: string; text?: string; codingSystem?: string }): this {
    this.fields[3] = this.createComponentsField([
      identifier,
      text,
      codingSystem,
    ]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<NTE> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "NTE") {
      return { ok: false, err: new Err(`Expected NTE segment, got ${parts[0]}`) };
    }
    const seg = new NTE();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
