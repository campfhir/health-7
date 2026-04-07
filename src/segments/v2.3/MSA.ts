import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * MSA - Message Acknowledgment Segment (HL7 v2.3)
 */
export class MSA extends BaseSegment {
  name = "MSA";

  constructor() {
    super();
    this.fields = [];
  }

  /** MSA-1: Acknowledgment Code (ID) - e.g. AA=Application Accept, AE=Application Error, AR=Application Reject */
  acknowledgmentCode(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** MSA-2: Message Control ID (ST) */
  messageControlId(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** MSA-3: Text Message (ST) */
  textMessage(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** MSA-4: Expected Sequence Number (NM) */
  expectedSequenceNumber(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** MSA-5: Delayed Acknowledgment Type (ID) - deprecated */
  delayedAcknowledgmentType(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** MSA-6: Error Condition (CE) */
  errorCondition(code: string, text?: string): this {
    this.fields[5] = this.createField([[code, text || ""]]);
    return this;
  }

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
