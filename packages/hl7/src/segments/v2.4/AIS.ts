/**
 * AIS segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 AIS; see AIS.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import { type Repeated, repetitions } from "../../types/segment.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { AIS as AIS_base } from "../v2.3.1/AIS.ts";

/**
 * AIS segment (HL7 v2.4)
 *
 * Extends v2.3.1 AIS with AIS-11 and AIS-12 (Placer and Filler Supplemental Service Information). Source: hl7.eu v2.4 AIS table (12 fields).
 */
export class AIS extends AIS_base {
  /**
   * AIS-11 Placer Supplemental Service Information (chainable).
   * @param code - AIS-11.1 Code
   * @param text - AIS-11.2 Text
   */
  placerSupplementalInfo(...values: Repeated<{ code: string; text?: string }>[]): this {
    this.fields[10] = this.createRepeatingField(
      repetitions(values).map(({ code, text }) => this.createComponentsField([code, text])),
    );
    return this;
  }

  /**
   * AIS-12 Filler Supplemental Service Information (chainable).
   * @param code - AIS-12.1 Code
   * @param text - AIS-12.2 Text
   */
  fillerSupplementalInfo(...values: Repeated<{ code: string; text?: string }>[]): this {
    this.fields[11] = this.createRepeatingField(
      repetitions(values).map(({ code, text }) => this.createComponentsField([code, text])),
    );
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIS> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIS") {
      return { ok: false, err: new Err(`Expected AIS segment, got ${parts[0]}`) };
    }
    const seg = new AIS();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
