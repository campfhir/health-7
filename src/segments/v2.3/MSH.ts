import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { DEFAULT_ENCODING, EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * MSH - Message Header Segment (HL7 v2.3)
 */
export class MSH extends BaseSegment {
  name = "MSH";
  private _encoding?: EncodingCharacters;

  constructor() {
    super();
    this.fields = [this.createEmptyField()];
  }

  /**
   * Get the encoding characters from this MSH segment.
   * If parsing was done, this will return the encoding extracted during parsing.
   * Otherwise returns DEFAULT_ENCODING.
   */
  getEncoding(): EncodingCharacters {
    return this._encoding ?? DEFAULT_ENCODING;
  }

  /**
   * Set the encoding characters for this MSH segment.
   * This is typically called by the parser when parsing an MSH segment.
   */
  setEncoding(encoding: EncodingCharacters): void {
    this._encoding = encoding;
  }

  sendingApplication(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  sendingFacility(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  receivingApplication(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  receivingFacility(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  dateTimeOfMessage(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  security(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  messageType(
    messageCode: string,
    triggerEvent: string,
    messageStructure?: string,
  ): this {
    const components = messageStructure
      ? [messageCode, triggerEvent, messageStructure]
      : [messageCode, triggerEvent];
    this.fields[7] = this.createField(components);
    return this;
  }

  messageControlId(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  processingId(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  versionId(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  sequenceNumber(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  continuationPointer(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  acceptAcknowledgmentType(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  applicationAcknowledgmentType(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  countryCode(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /**
   * Get message type from MSH-9
   * Returns an object with messageCode, triggerEvent, and messageStructure
   */
  getMessageType(): {
    messageCode: string;
    triggerEvent: string;
    messageStructure?: string;
  } {
    if (!this.fields[7]) {
      return { messageCode: "", triggerEvent: "" };
    }

    const field = this.fields[7];
    if (!field.components || field.components.length === 0) {
      return { messageCode: "", triggerEvent: "" };
    }

    const messageCode = field.components[0]?.subComponents[0] || "";
    const triggerEvent = field.components[1]?.subComponents[0] || "";
    const messageStructure = field.components[2]?.subComponents[0] || undefined;

    return {
      messageCode,
      triggerEvent,
      messageStructure,
    };
  }

  encode(_encoding?: EncodingCharacters): string {
    const encoding = _encoding ?? this._encoding ?? DEFAULT_ENCODING;
    const encodedFields = this.fields.slice(1).map((field) => {
      return field.components
        .map((comp) => comp.subComponents.join(encoding.subComponentSeparator))
        .join(encoding.componentSeparator);
    });

    const encodingChars =
      encoding.componentSeparator +
      encoding.repetitionSeparator +
      encoding.escapeCharacter +
      encoding.subComponentSeparator;

    return `${this.name}${encoding.fieldSeparator}${encodingChars}${encoding.fieldSeparator}${encodedFields.join(encoding.fieldSeparator)}`;
  }

  static parse(segmentString: string): Result<MSH> {
    try {
      if (!segmentString.startsWith("MSH")) {
        return { ok: false, err: new Err("Not a valid MSH segment") };
      }
      if (segmentString.length < 8) {
        return {
          ok: false,
          err: new Err("MSH segment too short to contain encoding characters"),
        };
      }
      const fieldSeparator = segmentString[3];
      const encodingChars = segmentString.substring(4, 8);
      if (encodingChars.length < 4) {
        return {
          ok: false,
          err: new Err("Invalid encoding characters in MSH segment"),
        };
      }
      const encoding: EncodingCharacters = {
        fieldSeparator,
        componentSeparator: encodingChars[0],
        repetitionSeparator: encodingChars[1],
        escapeCharacter: encodingChars[2],
        subComponentSeparator: encodingChars[3],
      };
      const fields = segmentString.split(encoding.fieldSeparator);
      const msh = new MSH();
      msh.fields = [];
      msh.setEncoding(encoding);
      msh.fields[0] = ParserUtils.parseField("", encoding);
      for (let i = 2; i < fields.length; i++) {
        msh.fields[i - 1] = ParserUtils.parseField(fields[i], encoding);
      }
      return { ok: true, val: msh };
    } catch (error) {
      return {
        ok: false,
        err: new Err(`Failed to parse MSH segment: ${error}`),
      };
    }
  }
}
