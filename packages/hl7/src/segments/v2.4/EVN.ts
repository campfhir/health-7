/**
 * EVN segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 EVN; see EVN.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { EVN as EVN_base } from "../v2.3.1/EVN.ts";

/**
 * EVN segment (HL7 v2.4)
 *
 * Extends v2.3.1 EVN with EVN-7 Event Facility. Source: hl7.eu v2.4 EVN table (7 fields).
 */
export class EVN extends EVN_base {
  /**
   * EVN-7 Event Facility (chainable).
   * @param namespaceId - EVN-7.1 Namespace ID
   * @param universalId - EVN-7.2 Universal ID
   * @param universalIdType - EVN-7.3 Universal ID Type
   */
  eventFacility({ namespaceId, universalId, universalIdType }: { namespaceId: string; universalId?: string; universalIdType?: string }): this {
    const components = [namespaceId, universalId || "", universalIdType || ""];
    this.fields[6] = this.createField(components);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<EVN> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "EVN") {
      return { ok: false, err: new Err(`Expected EVN segment, got ${parts[0]}`) };
    }
    const seg = new EVN();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
