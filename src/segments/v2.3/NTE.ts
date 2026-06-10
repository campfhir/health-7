import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * NTE - Notes and Comments Segment (HL7 v2.3)
 *
 * Used to add notes/comments to various parts of an HL7 message.
 * Can appear after PID (patient notes), OBR (order notes), or OBX (observation notes).
 */
export class NTE extends BaseSegment {
  name = "NTE";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * NTE-1: Set ID - NTE (SI)
   * Sequential number for notes
   */
  setId(id: string): this {
    this.fields[0] = this.createField(id);
    return this;
  }

  /**
   * NTE-2: Source of Comment (ID)
   * Who/what generated the comment
   * Values: L (Ancillary), P (Placer), O (Order Filler)
   */
  sourceOfComment(source: string): this {
    this.fields[1] = this.createField(source);
    return this;
  }

  /**
   * NTE-3: Comment (FT)
   * The actual note/comment text
   * This is a multi-line field that can contain line breaks
   */
  comment(text: string): this {
    this.fields[2] = this.createField(text);
    return this;
  }

  /**
   * NTE-4: Comment Type (CE)
   * Categorizes the type of comment
   */
  commentType(identifier: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[3] = this.createField([
        [identifier, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[3] = this.createField(identifier);
    }
    return this;
  }

  /**
   * Get the comment text from NTE-3
   */
  getComment(): string {
    if (!this.fields[2]) {
      return "";
    }

    const field = this.fields[2];
    if (!field.components || field.components.length === 0) {
      return "";
    }

    const component = field.components[0];
    if (!component.subComponents || component.subComponents.length === 0) {
      return "";
    }

    return component.subComponents[0] || "";
  }

  /**
   * Get the source of comment from NTE-2
   */
  getSourceOfComment(): string {
    if (!this.fields[1]) {
      return "";
    }

    const field = this.fields[1];
    if (!field.components || field.components.length === 0) {
      return "";
    }

    const component = field.components[0];
    if (!component.subComponents || component.subComponents.length === 0) {
      return "";
    }

    return component.subComponents[0] || "";
  }

  /**
   * Static factory method for parsing
   */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<NTE> {
    const parts = segmentString.split(encoding.fieldSeparator);
    const segmentType = parts[0];

    if (segmentType !== "NTE") {
      return {
        ok: false,
        err: new Err(`Expected NTE segment, got ${segmentType}`),
      };
    }

    const nte = new NTE();

    // Parse fields starting from index 1 (field separator already consumed)
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        nte.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }

    return { ok: true, val: nte };
  }
}
