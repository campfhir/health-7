/**
 * RXR segment definition for HL7 v2.3.
 *
 * position-tests: hand-written (composite fields; see RXR.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { codedParts, components, type CodedInput } from "../../utils/composites.ts";

/**
 * RXR - Pharmacy/Treatment Route Segment (HL7 v2.3, 4 fields)
 *
 * RXR-5 Routing Instruction was added in v2.3.1 and RXR-6 Administration Site Modifier in
 * v2.5. The CE fields take a CE or the shorter `code`/`text`/`codingSystem` shape.
 */
export class RXR extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "RXR";

  constructor() {
    super();
    this.fields = [];
  }

  /** RXR-1 Route (CE) (chainable). Takes a CE, or the `code`/`text`/`codingSystem` shape. */
  route(value: CodedInput): this {
    this.fields[0] = this.createField(components(codedParts(value, 6)));
    return this;
  }

  /** RXR-2 Administration Site (CE) (chainable). Takes a CE, or the `code`/`text`/`codingSystem` shape. */
  administrationSite(value: CodedInput): this {
    this.fields[1] = this.createField(components(codedParts(value, 6)));
    return this;
  }

  /** RXR-3 Administration Device (CE) (chainable). Takes a CE, or the `code`/`text`/`codingSystem` shape. */
  administrationDevice(value: CodedInput): this {
    this.fields[2] = this.createField(components(codedParts(value, 6)));
    return this;
  }

  /** RXR-4 Administration Method (CE) (chainable). Takes a CE, or the `code`/`text`/`codingSystem` shape. */
  administrationMethod(value: CodedInput): this {
    this.fields[3] = this.createField(components(codedParts(value, 6)));
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<RXR> {
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
