/**
 * RXR segment definition for HL7 v2.5.
 *
 * position-tests: hand-written (see RXR.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { RXR as RXR_base } from "../v2.4/RXR.ts";
import { codedParts, components, type CodedInput } from "../../utils/composites.ts";

/**
 * RXR segment (HL7 v2.5)
 *
 * Extends v2.4 RXR with RXR-6 Administration Site Modifier; RXR-2 Administration Site and RXR-4 Administration Method are CWE (nine components) from v2.5.
 */
export class RXR extends RXR_base {
  /** RXR-2 Administration Site (CWE) (chainable). */
  override administrationSite(value: CodedInput): this {
    this.fields[1] = this.createField(components(codedParts(value, 9)));
    return this;
  }

  /** RXR-4 Administration Method (CWE) (chainable). */
  override administrationMethod(value: CodedInput): this {
    this.fields[3] = this.createField(components(codedParts(value, 9)));
    return this;
  }

  /** RXR-6 Administration Site Modifier (CWE, table 0495) (chainable). */
  administrationSiteModifier(value: CodedInput): this {
    this.fields[5] = this.createField(components(codedParts(value, 9)));
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(segmentString: string, encoding: EncodingCharacters): Result<RXR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXR") {
      return { ok: false, err: new Err(`Expected RXR segment, got ${parts[0]}`) };
    }
    const seg = new RXR();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
