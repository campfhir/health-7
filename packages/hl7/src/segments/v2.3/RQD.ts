/**
 * RQD segment definition for HL7 v2.3.
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
  DateLayout,
  type HL7DateLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * RQD - Requisition Detail Segment (HL7 v2.3)
 *
 * Requisition detail for a supply-type order (HL7 v2.3 order detail segment).
 */
export class RQD extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "RQD";

  constructor() {
    super();
    this.fields = [];
  }

  /** RQD-1 Requisition Line Number (chainable). */
  requisitionLineNumber(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * RQD-2 Item Code - Internal (chainable).
   * @param identifier - RQD-2.1 Identifier
   * @param text - RQD-2.2 Text
   * @param nameOfCodingSystem - RQD-2.3 Name of Coding System
   * @param alternateIdentifier - RQD-2.4 Alternate Identifier
   * @param alternateText - RQD-2.5 Alternate Text
   * @param nameOfAlternateCodingSystem - RQD-2.6 Name of Alternate Coding System
   */
  itemCodeInternal({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }): this {
    this.fields[1] = this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem]);
    return this;
  }

  /**
   * RQD-3 Item Code - External (chainable).
   * @param identifier - RQD-3.1 Identifier
   * @param text - RQD-3.2 Text
   * @param nameOfCodingSystem - RQD-3.3 Name of Coding System
   * @param alternateIdentifier - RQD-3.4 Alternate Identifier
   * @param alternateText - RQD-3.5 Alternate Text
   * @param nameOfAlternateCodingSystem - RQD-3.6 Name of Alternate Coding System
   */
  itemCodeExternal({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }): this {
    this.fields[2] = this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem]);
    return this;
  }

  /**
   * RQD-4 Hospital Item Code (chainable).
   * @param identifier - RQD-4.1 Identifier
   * @param text - RQD-4.2 Text
   * @param nameOfCodingSystem - RQD-4.3 Name of Coding System
   * @param alternateIdentifier - RQD-4.4 Alternate Identifier
   * @param alternateText - RQD-4.5 Alternate Text
   * @param nameOfAlternateCodingSystem - RQD-4.6 Name of Alternate Coding System
   */
  hospitalItemCode({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }): this {
    this.fields[3] = this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem]);
    return this;
  }

  /** RQD-5 Requisition Quantity (chainable). */
  requisitionQuantity(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /**
   * RQD-6 Requisition Unit of Measure (chainable).
   * @param identifier - RQD-6.1 Identifier
   * @param text - RQD-6.2 Text
   * @param nameOfCodingSystem - RQD-6.3 Name of Coding System
   * @param alternateIdentifier - RQD-6.4 Alternate Identifier
   * @param alternateText - RQD-6.5 Alternate Text
   * @param nameOfAlternateCodingSystem - RQD-6.6 Name of Alternate Coding System
   */
  requisitionUnitOfMeasure({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }): this {
    this.fields[5] = this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem]);
    return this;
  }

  /** RQD-7 Department Cost Center (chainable). */
  departmentCostCenter(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** RQD-8 Item Natural Account Code (chainable). */
  itemNaturalAccountCode(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /**
   * RQD-9 Deliver To ID (chainable).
   * @param identifier - RQD-9.1 Identifier
   * @param text - RQD-9.2 Text
   * @param nameOfCodingSystem - RQD-9.3 Name of Coding System
   * @param alternateIdentifier - RQD-9.4 Alternate Identifier
   * @param alternateText - RQD-9.5 Alternate Text
   * @param nameOfAlternateCodingSystem - RQD-9.6 Name of Alternate Coding System
   */
  deliverToId({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }): this {
    this.fields[8] = this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem]);
    return this;
  }

  /** RQD-10 Date Needed (chainable). */
  dateNeeded(value: string, format?: never): this;
  /** RQD-10 Date Needed (chainable). */
  dateNeeded(value: Date, format?: HL7DateLayout): this;
  dateNeeded(value: string | Date, format?: HL7DateLayout): this {
    this.fields[9] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** Get requisition line number. */
  getRequisitionLineNumber(): string {
    return this.fields[0]?.components?.[0]?.subComponents?.[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<RQD> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RQD") {
      return { ok: false, err: new Err(`Expected RQD segment, got ${parts[0]}`) };
    }
    const seg = new RQD();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
