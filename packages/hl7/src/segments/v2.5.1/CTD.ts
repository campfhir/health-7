/**
 * CTD segment definition for HL7 v2.5.1.
 *
 * position-tests: hand-written (composite and repeating fields; see CTD.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { type Repeated, repetitions } from "../../types/segment.ts";
import { CTD as CTD_base } from "../v2.5/CTD.ts";
import { ceParts, components, plnParts, type CE, type PI, type PLN } from "../../utils/composites.ts";

/**
 * CTD segment (HL7 v2.5.1)
 *
 * Extends v2.5 CTD: CTD-1 Contact Role repeats, and CTD-7 Contact Identifiers is a PLN
 * (ID number, type, qualifying information, expiration date) instead of a PI.
 */
export class CTD extends CTD_base {
  /** CTD-1 Contact Role (CE, repeating, table 0131) (chainable). */
  override contactRole(...values: (CE | string)[]): this {
    this.fields[0] = this.createRepeatingField(
      values.map((v) => this.createField(typeof v === "string" ? v : components(ceParts(v)))),
    );
    return this;
  }

  /**
   * CTD-7 Contact Identifiers (PLN, repeating) (chainable). A PI-shaped value (v2.3 layout) is
   * accepted too: its otherQualifyingInfo becomes PLN.3.
   */
  override contactIdentifiers(...values: Repeated<PI | PLN | string>[]): this {
    this.fields[6] = this.createRepeatingField(
      repetitions(values).map((v) => {
        if (typeof v === "string") return this.createField(v);
        const either = v as Partial<PI> & Partial<PLN>;
        const pln: PLN = {
          idNumber: v.idNumber,
          typeOfIdNumber: either.typeOfIdNumber,
          stateOtherQualifyingInformation: either.stateOtherQualifyingInformation ?? either.otherQualifyingInfo,
          expirationDate: either.expirationDate,
        };
        return this.createField(components(plnParts(pln)));
      }),
    );
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<CTD> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "CTD") {
      return { ok: false, err: new Err(`Expected CTD segment, got ${parts[0]}`) };
    }
    const seg = new CTD();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
