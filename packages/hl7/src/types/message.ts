import type { Segment } from './segment.ts';
import { type EncodingCharacters, DEFAULT_ENCODING } from './encoding.ts';

/** Message. */
export interface Message {
  /** The segments value. */
  segments: Segment[];
  /** The encoding value. */
  encoding: EncodingCharacters;
  /** Encodes this message to its HL7 wire string. */
  encode(): string;
}

/** HL7 Message. */
export class HL7Message implements Message {
  /** The segments value. */
  segments: Segment[] = [];
  /** The encoding value. */
  encoding: EncodingCharacters;

  /** Constructor. */
  constructor(encoding: EncodingCharacters = DEFAULT_ENCODING) {
    this.encoding = encoding;
  }

  /** Add segment. */
  addSegment(segment: Segment): void {
    this.segments.push(segment);
  }

  /** Encodes this message to its HL7 wire string. */
  encode(): string {
    return this.segments
      .map(segment => segment.encode(this.encoding))
      .join('\r');
  }
}
