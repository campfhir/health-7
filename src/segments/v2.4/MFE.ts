/**
 * MFE segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 MFE; see MFE.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { MFE as MFE_base } from "../v2.3.1/MFE.ts";

/**
 * MFE segment (HL7 v2.4)
 *
 * Extends v2.3.1 MFE with MFE-5 Primary Key Value Type. Source: hl7.eu v2.4 MFE table (5 fields).
 */
export class MFE extends MFE_base {
  /** MFE-5 Primary Key Value Type (chainable). */
  primaryKeyValueType(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MFE> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "MFE") {
      return { ok: false, err: new Err(`Expected MFE segment, got ${parts[0]}`) };
    }
    const seg = new MFE();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
