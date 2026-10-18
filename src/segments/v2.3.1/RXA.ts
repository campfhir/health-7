/**
 * RXA segment definition for HL7 v2.3.1.
 *
 * position-tests: hand-written (see RXA.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { RXA as RXA_base } from "../v2.3/RXA.ts";
import { components, xcnInputParts, type XcnInput } from "../../utils/composites.ts";

/**
 * RXA segment (HL7 v2.3.1)
 *
 * Extends v2.3 RXA: RXA-10 Administering Provider repeats.
 */
export class RXA extends RXA_base {
  /**
   * RXA-10 Administering Provider (XCN, repeating) (chainable). One argument per repetition.
   */
  override administeringProvider(...values: (XcnInput | string)[]): this {
    this.fields[9] = this.createRepeatingField(
      values.map((v) => this.createField(typeof v === "string" ? v : components(xcnInputParts(v)))),
    );
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
