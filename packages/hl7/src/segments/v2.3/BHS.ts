/**
 * BHS segment definition for HL7 v2.3.
 *
 * position-tests: hand-written
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import { DEFAULT_ENCODING, type EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * BHS - Batch Header Segment (HL7 v2.3)
 *
 * Starts a batch of messages. BHS-1 (field separator) and BHS-2 (encoding characters) are
 * carried by the header itself, so `fields[0]` holds the BHS-2 placeholder and `fields[n]`
 * holds BHS-(n + 2), the same layout as MSH.
 */
export class BHS extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "BHS";
  private _encoding?: EncodingCharacters;

  constructor() {
    super();
    this.fields = [this.createEmptyField()];
  }

  /** The encoding characters used by this segment (parsed or default). */
  get encoding(): EncodingCharacters {
    return this._encoding ?? DEFAULT_ENCODING;
  }

  /** Set the encoding characters for this segment. Called by the parser. */
  setEncoding(encoding: EncodingCharacters): void {
    this._encoding = encoding;
  }

  /** BHS-3 Batch Sending Application (chainable). */
  sendingApplication(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** BHS-4 Batch Sending Facility (chainable). */
  sendingFacility(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** BHS-5 Batch Receiving Application (chainable). */
  receivingApplication(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** BHS-6 Batch Receiving Facility (chainable). */
  receivingFacility(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** BHS-7 Batch Creation Date/Time (chainable). */
  creationDateTime(value: string, format?: never): this;
  /** BHS-7 Batch Creation Date/Time (chainable). */
  creationDateTime(value: Date, format?: HL7DateTimeLayout): this;
  creationDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(formatHL7Date(value, format ?? DateTimeLayout));
    return this;
  }

  /** BHS-8 Batch Security (chainable). */
  security(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** BHS-9 Batch Name, ID, Type (chainable). */
  nameIdType(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** BHS-10 Batch Comment (chainable). */
  comment(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** BHS-11 Batch Control ID (chainable). */
  batchControlId(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** BHS-12 Reference Batch Control ID (chainable). */
  referenceBatchControlId(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** Encodes the segment, writing the encoding characters into BHS-2. */
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

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string): Result<BHS> {
    const encodingChars = segmentString.substring(4, 8);
    if (encodingChars.length < 4) {
      return {
        ok: false,
        err: new Err("Invalid encoding characters in BHS segment"),
      };
    }
    const encoding: EncodingCharacters = {
      fieldSeparator: segmentString[3],
      componentSeparator: encodingChars[0],
      repetitionSeparator: encodingChars[1],
      escapeCharacter: encodingChars[2],
      subComponentSeparator: encodingChars[3],
    };
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "BHS") {
      return {
        ok: false,
        err: new Err(`Expected BHS segment, got ${parts[0]}`),
      };
    }
    const seg = new BHS();
    seg.fields = [ParserUtils.parseField("", encoding)];
    seg.setEncoding(encoding);
    for (let i = 2; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
