/**
 * SPM segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * SPM - Specimen Segment (HL7 v2.3)
 */
export class SPM extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "SPM";

  constructor() {
    super();
    this.fields = [];
  }

  /** SPM-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * SPM-2 Specimen ID (chainable).
   * @param placerAssignedId - SPM-2.1 Placer Assigned ID
   * @param fillerAssignedId - SPM-2.2 Filler Assigned ID
   */
  specimenId(placerAssignedId: string, fillerAssignedId?: string): this {
    this.fields[1] = this.createField([
      [placerAssignedId, fillerAssignedId || ""],
    ]);
    return this;
  }

  /** SPM-3 Specimen Parent IDs (chainable). */
  specimenParentIds(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /**
   * SPM-4 Specimen Type (chainable).
   * @param code - SPM-4.1 Code
   * @param text - SPM-4.2 Text
   * @param codingSystem - SPM-4.3 Coding System
   */
  specimenType(code: string, text?: string, codingSystem?: string): this {
    this.fields[3] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /**
   * SPM-5 Specimen Type Modifier (chainable).
   * @param code - SPM-5.1 Code
   * @param text - SPM-5.2 Text
   */
  specimenTypeModifier(code: string, text?: string): this {
    this.fields[4] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * SPM-6 Specimen Additives (chainable).
   * @param code - SPM-6.1 Code
   * @param text - SPM-6.2 Text
   */
  specimenAdditives(code: string, text?: string): this {
    this.fields[5] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * SPM-7 Specimen Collection Method (chainable).
   * @param code - SPM-7.1 Code
   * @param text - SPM-7.2 Text
   */
  specimenCollectionMethod(code: string, text?: string): this {
    this.fields[6] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * SPM-8 Specimen Source Site (chainable).
   * @param code - SPM-8.1 Code
   * @param text - SPM-8.2 Text
   * @param codingSystem - SPM-8.3 Coding System
   */
  specimenSourceSite(code: string, text?: string, codingSystem?: string): this {
    this.fields[7] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /**
   * SPM-9 Specimen Source Site Modifier (chainable).
   * @param code - SPM-9.1 Code
   * @param text - SPM-9.2 Text
   */
  specimenSourceSiteModifier(code: string, text?: string): this {
    this.fields[8] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * SPM-10 Specimen Collection Site (chainable).
   * @param code - SPM-10.1 Code
   * @param text - SPM-10.2 Text
   */
  specimenCollectionSite(code: string, text?: string): this {
    this.fields[9] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * SPM-11 Specimen Role (chainable).
   * @param code - SPM-11.1 Code
   * @param text - SPM-11.2 Text
   */
  specimenRole(code: string, text?: string): this {
    this.fields[10] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * SPM-12 Specimen Collection Amount (chainable).
   * @param value - SPM-12.1 Value
   * @param units - SPM-12.2 Units
   */
  specimenCollectionAmount(value: string, units?: string): this {
    this.fields[11] = this.createField([[value, units || ""]]);
    return this;
  }

  /** SPM-13 Grouped Specimen Count (chainable). */
  groupedSpecimenCount(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** SPM-14 Specimen Description (chainable). */
  specimenDescription(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /**
   * SPM-17 Specimen Collection Date/Time (chainable).
   * @param rangeStart - SPM-17.1 Range Start
   * @param rangeEnd - SPM-17.2 Range End
   */
  specimenCollectionDateTime(rangeStart: string, rangeEnd?: string): this {
    this.fields[16] = this.createField([[rangeStart, rangeEnd || ""]]);
    return this;
  }

  /** SPM-18 Specimen Received Date/Time (chainable). */
  specimenReceivedDateTime(value: string, format?: never): this;
  /** SPM-18 Specimen Received Date/Time (chainable). */
  specimenReceivedDateTime(value: Date, format?: HL7DateTimeLayout): this;
  specimenReceivedDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[17] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** SPM-20 Specimen Availability (chainable). */
  specimenAvailability(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /**
   * SPM-25 Specimen Current Quantity (chainable).
   * @param value - SPM-25.1 Value
   * @param units - SPM-25.2 Units
   */
  specimenCurrentQuantity(value: string, units?: string): this {
    this.fields[24] = this.createField([[value, units || ""]]);
    return this;
  }

  /**
   * SPM-24 Specimen Condition (chainable).
   * @param code - SPM-24.1 Code
   * @param text - SPM-24.2 Text
   */
  specimenCondition(code: string, text?: string): this {
    this.fields[23] = this.createField([[code, text || ""]]);
    return this;
  }

  /**
   * SPM-21 Specimen Reject Reason (chainable).
   * @param code - SPM-21.1 Code
   * @param text - SPM-21.2 Text
   */
  specimenRejectReason(code: string, text?: string): this {
    this.fields[20] = this.createField([[code, text || ""]]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<SPM> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "SPM") {
      return {
        ok: false,
        err: new Err(`Expected SPM segment, got ${parts[0]}`),
      };
    }
    const seg = new SPM();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
