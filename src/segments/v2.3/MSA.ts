/**
 * MSA segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * MSA - Message Acknowledgment Segment (HL7 v2.3)
 */
export class MSA extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "MSA";

  constructor() {
    super();
    this.fields = [];
  }

  /** MSA-1 Acknowledgment Code (chainable). */
  acknowledgmentCode(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** MSA-2 Message Control ID (chainable). */
  messageControlId(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** MSA-3 Text Message (chainable). */
  textMessage(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** MSA-4 Expected Sequence Number (chainable). */
  expectedSequenceNumber(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** MSA-5 Delayed Acknowledgment Type (chainable). */
  delayedAcknowledgmentType(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /**
   * MSA-6 Error Condition (chainable).
   * @param code - MSA-6.1 Code
   * @param text - MSA-6.2 Text
   */
  errorCondition(code: string, text?: string): this {
    this.fields[5] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MSA> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "MSA") {
      return {
        ok: false,
        err: new Err(`Expected MSA segment, got ${parts[0]}`),
      };
    }
    const seg = new MSA();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
