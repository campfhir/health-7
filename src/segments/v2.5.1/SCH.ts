/**
 * SCH segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { SCH as SCH_base } from "../v2.3/SCH.ts";

/**
 * SCH segment (HL7 v2.5.1)
 * Extends v2.3 SCH. Add v2.5.1-specific fields here as needed.
 */
export class SCH extends SCH_base {
  /**
   * SCH-26 Placer Order Number (chainable).
   * @param entityIdentifier - SCH-26.1 Entity Identifier
   * @param namespaceId - SCH-26.2 Namespace ID
   */
  placerOrderNumber(entityIdentifier: string, namespaceId?: string): this {
    this.fields[25] = this.createComponentsField([entityIdentifier, namespaceId]);
    return this;
  }

  /**
   * SCH-27 Filler Order Number (chainable).
   * @param entityIdentifier - SCH-27.1 Entity Identifier
   * @param namespaceId - SCH-27.2 Namespace ID
   */
  fillerOrderNumber(entityIdentifier: string, namespaceId?: string): this {
    this.fields[26] = this.createComponentsField([entityIdentifier, namespaceId]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<SCH> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "SCH") {
      return { ok: false, err: new Err(`Expected SCH segment, got ${parts[0]}`) };
    }
    const seg = new SCH();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
