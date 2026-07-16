/**
 * RXR segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * RXR - Pharmacy/Treatment Route Segment (HL7 v2.3)
 */
export class RXR extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "RXR";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * RXR-1 Route (chainable).
   * @param code - RXR-1.1 Code
   * @param text - RXR-1.2 Text
   * @param codingSystem - RXR-1.3 Coding System
   */
  route(code: string, text?: string, codingSystem?: string): this {
    this.fields[0] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /**
   * RXR-2 Administration Site (chainable).
   * @param code - RXR-2.1 Code
   * @param text - RXR-2.2 Text
   */
  administrationSite(code: string, text?: string): this {
    this.fields[1] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * RXR-3 Administration Device (chainable).
   * @param code - RXR-3.1 Code
   * @param text - RXR-3.2 Text
   */
  administrationDevice(code: string, text?: string): this {
    this.fields[2] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * RXR-4 Administration Method (chainable).
   * @param code - RXR-4.1 Code
   * @param text - RXR-4.2 Text
   */
  administrationMethod(code: string, text?: string): this {
    this.fields[3] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * RXR-5 Routing Instruction (chainable).
   * @param code - RXR-5.1 Code
   * @param text - RXR-5.2 Text
   */
  routingInstruction(code: string, text?: string): this {
    this.fields[4] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * RXR-6 Administration Site Modifier (chainable).
   * @param code - RXR-6.1 Code
   * @param text - RXR-6.2 Text
   */
  administrationSiteModifier(code: string, text?: string): this {
    this.fields[5] = this.createField([[code, text || ""]]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXR") {
      return {
        ok: false,
        err: new Err(`Expected RXR segment, got ${parts[0]}`),
      };
    }
    const seg = new RXR();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
