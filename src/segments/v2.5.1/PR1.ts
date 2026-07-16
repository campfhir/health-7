/**
 * PR1 segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { PR1 as PR1_base } from "../v2.3/PR1.ts";

/**
 * PR1 segment (HL7 v2.5.1)
 * Extends v2.3 PR1. Add v2.5.1-specific fields here as needed.
 */
export class PR1 extends PR1_base {
  /**
   * PR1-16 Procedure Code Modifier (chainable).
   * @param code - PR1-16.1 Identifier
   * @param text - PR1-16.2 Text
   * @param codingSystem - PR1-16.3 Name of Coding System
   */
  procedureCodeModifier(code: string, text?: string, codingSystem?: string): this {
    this.fields[15] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** PR1-17 Procedure DRG Type (chainable). */
  procedureDrgType(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /**
   * PR1-18 Tissue Type Code (chainable).
   * @param code - PR1-18.1 Identifier
   * @param text - PR1-18.2 Text
   * @param codingSystem - PR1-18.3 Name of Coding System
   */
  tissueTypeCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[17] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * PR1-19 Procedure Identifier (chainable).
   * @param entityIdentifier - PR1-19.1 Entity Identifier
   * @param namespaceId - PR1-19.2 Namespace ID
   */
  procedureIdentifier(entityIdentifier: string, namespaceId?: string): this {
    this.fields[18] = this.createComponentsField([
      entityIdentifier,
      namespaceId,
    ]);
    return this;
  }

  /** PR1-20 Procedure Action Code (chainable). */
  procedureActionCode(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PR1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PR1") {
      return { ok: false, err: new Err(`Expected PR1 segment, got ${parts[0]}`) };
    }
    const seg = new PR1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
