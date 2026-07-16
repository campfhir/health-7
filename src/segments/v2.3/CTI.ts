/**
 * CTI segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * CTI - Clinical Trial Identification Segment (HL7 v2.3)
 *
 * Identifies clinical trial information associated with an order observation.
 * Appears after OBX segments within an ORDER_OBSERVATION group.
 */
export class CTI extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "CTI";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * CTI-1 Sponsor Study ID (chainable).
   * @param entityIdentifier - CTI-1.1 Entity Identifier
   * @param namespaceId - CTI-1.2 Namespace ID
   * @param universalId - CTI-1.3 Universal ID
   * @param universalIdType - CTI-1.4 Universal ID Type
   */
  sponsorStudyId(entityIdentifier: string, namespaceId?: string, universalId?: string, universalIdType?: string): this {
    this.fields[0] = this.createComponentsField([entityIdentifier, namespaceId, universalId, universalIdType]);
    return this;
  }

  /**
   * CTI-2 Study Phase Identifier (chainable).
   * @param identifier - CTI-2.1 Identifier
   * @param text - CTI-2.2 Text
   * @param codingSystem - CTI-2.3 Coding System
   */
  studyPhaseIdentifier(identifier: string, text?: string, codingSystem?: string): this {
    this.fields[1] = this.createComponentsField([identifier, text, codingSystem]);
    return this;
  }

  /**
   * CTI-3 Study Scheduled Time Point (chainable).
   * @param identifier - CTI-3.1 Identifier
   * @param text - CTI-3.2 Text
   * @param codingSystem - CTI-3.3 Coding System
   */
  studyScheduledTimePoint(identifier: string, text?: string, codingSystem?: string): this {
    this.fields[2] = this.createComponentsField([identifier, text, codingSystem]);
    return this;
  }

  /** Get sponsor study id. */
  getSponsorStudyId(): string {
    return this.fields[0]?.components?.[0]?.subComponents?.[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<CTI> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "CTI") {
      return { ok: false, err: new Err(`Expected CTI segment, got ${parts[0]}`) };
    }
    const seg = new CTI();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
