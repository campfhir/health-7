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
  specimenId({ placerAssignedId, fillerAssignedId }: { placerAssignedId: string; fillerAssignedId?: string }): this {
    this.fields[1] = this.createComponentsField([
      placerAssignedId,
      fillerAssignedId || "",
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
  specimenType({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[3] = this.createComponentsField([code, text || "", codingSystem || ""]);
    return this;
  }

  /**
   * SPM-5 Specimen Type Modifier (chainable).
   * @param code - SPM-5.1 Code
   * @param text - SPM-5.2 Text
   */
  specimenTypeModifier({ code, text }: { code: string; text?: string }): this {
    this.fields[4] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * SPM-6 Specimen Additives (chainable).
   * @param code - SPM-6.1 Code
   * @param text - SPM-6.2 Text
   */
  specimenAdditives({ code, text }: { code: string; text?: string }): this {
    this.fields[5] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * SPM-7 Specimen Collection Method (chainable).
   * @param code - SPM-7.1 Code
   * @param text - SPM-7.2 Text
   */
  specimenCollectionMethod({ code, text }: { code: string; text?: string }): this {
    this.fields[6] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * SPM-8 Specimen Source Site (chainable).
   * @param code - SPM-8.1 Code
   * @param text - SPM-8.2 Text
   * @param codingSystem - SPM-8.3 Coding System
   */
  specimenSourceSite({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[7] = this.createComponentsField([code, text || "", codingSystem || ""]);
    return this;
  }

  /**
   * SPM-9 Specimen Source Site Modifier (chainable).
   * @param code - SPM-9.1 Code
   * @param text - SPM-9.2 Text
   */
  specimenSourceSiteModifier({ code, text }: { code: string; text?: string }): this {
    this.fields[8] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * SPM-10 Specimen Collection Site (chainable).
   * @param code - SPM-10.1 Code
   * @param text - SPM-10.2 Text
   */
  specimenCollectionSite({ code, text }: { code: string; text?: string }): this {
    this.fields[9] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * SPM-11 Specimen Role (chainable).
   * @param code - SPM-11.1 Code
   * @param text - SPM-11.2 Text
   */
  specimenRole({ code, text }: { code: string; text?: string }): this {
    this.fields[10] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * SPM-12 Specimen Collection Amount (chainable).
   * @param value - SPM-12.1 Value
   * @param units - SPM-12.2 Units
   */
  specimenCollectionAmount({ value, units }: { value: string; units?: string }): this {
    this.fields[11] = this.createComponentsField([value, units || ""]);
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
  specimenCollectionDateTime({ rangeStart, rangeEnd }: { rangeStart: string; rangeEnd?: string }): this {
    this.fields[16] = this.createComponentsField([rangeStart, rangeEnd || ""]);
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
  specimenCurrentQuantity({ value, units }: { value: string; units?: string }): this {
    this.fields[24] = this.createComponentsField([value, units || ""]);
    return this;
  }

  /**
   * SPM-24 Specimen Condition (chainable).
   * @param code - SPM-24.1 Code
   * @param text - SPM-24.2 Text
   */
  specimenCondition({ code, text }: { code: string; text?: string }): this {
    this.fields[23] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * SPM-21 Specimen Reject Reason (chainable).
   * @param code - SPM-21.1 Code
   * @param text - SPM-21.2 Text
   */
  specimenRejectReason({ code, text }: { code: string; text?: string }): this {
    this.fields[20] = this.createComponentsField([code, text || ""]);
    return this;
  }

  /**
   * SPM-15 Specimen Handling Code (chainable).
   * @param code - SPM-15.1 Identifier
   * @param text - SPM-15.2 Text
   * @param codingSystem - SPM-15.3 Name of Coding System
   */
  specimenHandlingCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[14] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * SPM-16 Specimen Risk Code (chainable).
   * @param code - SPM-16.1 Identifier
   * @param text - SPM-16.2 Text
   * @param codingSystem - SPM-16.3 Name of Coding System
   */
  specimenRiskCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[15] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** SPM-19 Specimen Expiration Date/Time (chainable). */
  specimenExpirationDateTime(value: string, format?: never): this;
  /** SPM-19 Specimen Expiration Date/Time (chainable). */
  specimenExpirationDateTime(value: Date, format?: HL7DateTimeLayout): this;
  specimenExpirationDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[18] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * SPM-22 Specimen Quality (chainable).
   * @param code - SPM-22.1 Identifier
   * @param text - SPM-22.2 Text
   * @param codingSystem - SPM-22.3 Name of Coding System
   */
  specimenQuality({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[21] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * SPM-23 Specimen Appropriateness (chainable).
   * @param code - SPM-23.1 Identifier
   * @param text - SPM-23.2 Text
   * @param codingSystem - SPM-23.3 Name of Coding System
   */
  specimenAppropriateness({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[22] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** SPM-26 Number of Specimen Containers (chainable). */
  numberOfSpecimenContainers(value: string): this {
    this.fields[25] = this.createField(value);
    return this;
  }

  /**
   * SPM-27 Container Type (chainable).
   * @param code - SPM-27.1 Identifier
   * @param text - SPM-27.2 Text
   * @param codingSystem - SPM-27.3 Name of Coding System
   */
  containerType({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[26] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * SPM-28 Container Condition (chainable).
   * @param code - SPM-28.1 Identifier
   * @param text - SPM-28.2 Text
   * @param codingSystem - SPM-28.3 Name of Coding System
   */
  containerCondition({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[27] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * SPM-29 Specimen Child Role (chainable).
   * @param code - SPM-29.1 Identifier
   * @param text - SPM-29.2 Text
   * @param codingSystem - SPM-29.3 Name of Coding System
   */
  specimenChildRole({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[28] = this.createComponentsField([code, text, codingSystem]);
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
