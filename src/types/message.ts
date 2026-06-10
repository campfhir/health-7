import type { Segment } from './segment.ts';
import { type EncodingCharacters, DEFAULT_ENCODING } from './encoding.ts';

export interface Message {
  segments: Segment[];
  encoding: EncodingCharacters;
  encode(): string;
}

export class HL7Message implements Message {
  segments: Segment[] = [];
  encoding: EncodingCharacters;

  constructor(encoding: EncodingCharacters = DEFAULT_ENCODING) {
    this.encoding = encoding;
  }

  addSegment(segment: Segment): void {
    this.segments.push(segment);
  }

  encode(): string {
    return this.segments
      .map(segment => segment.encode(this.encoding))
      .join('\r');
  }
}
