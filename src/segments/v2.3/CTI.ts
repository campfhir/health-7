import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * CTI - Clinical Trial Identification Segment (HL7 v2.3)
 *
 * Identifies clinical trial information associated with an order observation.
 * Appears after OBX segments within an ORDER_OBSERVATION group.
 */
export class CTI extends BaseSegment {
  name = "CTI";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * CTI-1: Sponsor Study ID (EI)
   * Identifies the sponsor's clinical study
   */
  sponsorStudyId(entityIdentifier: string, namespaceId?: string, universalId?: string, universalIdType?: string): this {
    if (namespaceId || universalId || universalIdType) {
      this.fields[0] = this.createField([[entityIdentifier, namespaceId || "", universalId || "", universalIdType || ""]]);
    } else {
      this.fields[0] = this.createField(entityIdentifier);
    }
    return this;
  }

  /**
   * CTI-2: Study Phase Identifier (CE)
   * Identifies a phase of the clinical study
   */
  studyPhaseIdentifier(identifier: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[1] = this.createField([[identifier, text || "", codingSystem || ""]]);
    } else {
      this.fields[1] = this.createField(identifier);
    }
    return this;
  }

  /**
   * CTI-3: Study Scheduled Time Point (CE)
   * Identifies a time point within a study phase
   */
  studyScheduledTimePoint(identifier: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[2] = this.createField([[identifier, text || "", codingSystem || ""]]);
    } else {
      this.fields[2] = this.createField(identifier);
    }
    return this;
  }

  getSponsorStudyId(): string {
    return this.fields[0]?.components?.[0]?.subComponents?.[0] ?? "";
  }

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
