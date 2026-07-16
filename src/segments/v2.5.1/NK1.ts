/**
 * NK1 segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { NK1 as NK1_base } from "../v2.3/NK1.ts";

/**
 * NK1 segment (HL7 v2.5.1)
 * Extends v2.3 NK1. Add v2.5.1-specific fields here as needed.
 */
export class NK1 extends NK1_base {
  /** NK1-38 Next of Kin Birth Place (chainable). */
  nextOfKinBirthPlace(value: string): this {
    this.fields[37] = this.createField(value);
    return this;
  }

  /** NK1-39 VIP Indicator (chainable). */
  vipIndicator(value: string): this {
    this.fields[38] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<NK1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "NK1") {
      return { ok: false, err: new Err(`Expected NK1 segment, got ${parts[0]}`) };
    }
    const seg = new NK1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
