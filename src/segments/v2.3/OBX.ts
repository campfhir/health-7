import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  type HL7DateLayout,
  DateTimeLayout,
  DateLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * OBX - Observation/Result Segment (HL7 v2.3)
 */
export class OBX extends BaseSegment {
  name = "OBX";

  constructor() {
    super();
    this.fields = [];
  }

  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  valueType(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  observationIdentifier(
    identifier: string,
    text?: string,
    nameOfCodingSystem?: string,
  ): this {
    const components = [identifier];
    if (text) components.push(text);
    if (nameOfCodingSystem) components.push(nameOfCodingSystem);

    this.fields[2] = this.createField(components);
    return this;
  }
  observationSubId(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
  observationValue(value: string | string[]): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  units(identifier?: string, text?: string, nameOfCodingSystem?: string): this {
    const components = [];
    if (identifier) components.push(identifier);
    if (text) components.push(text);
    if (nameOfCodingSystem) components.push(nameOfCodingSystem);

    this.fields[5] = this.createField(components);
    return this;
  }
  referenceRange(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }
  abnormalFlags(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }
  probability(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }
  natureOfAbnormalTest(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
  observationResultStatus(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }
  effectiveDateOfReferenceRange(value: string, format?: never): this;
  effectiveDateOfReferenceRange(value: Date, format?: HL7DateLayout): this;
  effectiveDateOfReferenceRange(
    value: string | Date,
    format?: HL7DateLayout,
  ): this {
    this.fields[11] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }
  userDefinedAccessChecks(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  dateTimeOfObservation(value: string, format?: never): this;
  dateTimeOfObservation(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeOfObservation(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[13] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  producersId(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  responsibleObserver(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[15] = this.createField(components);
    return this;
  }
  observationMethod(
    identifier?: string,
    text?: string,
    nameOfCodingSystem?: string,
  ): this {
    const components = [];
    if (identifier) components.push(identifier);
    if (text) components.push(text);
    if (nameOfCodingSystem) components.push(nameOfCodingSystem);

    this.fields[16] = this.createField(components);
    return this;
  }

  /**
   * Get abnormal flags from OBX-8
   * Returns array of abnormal flag codes (e.g., ["H"], ["L"], ["HH"], ["LL"], ["A"], etc.)
   */
  getAbnormalFlags(): string[] {
    if (!this.fields[7]) {
      return [];
    }

    const flagField = this.fields[7];
    if (!flagField.components || flagField.components.length === 0) {
      return [];
    }

    // Get the first component's subcomponents
    const firstComponent = flagField.components[0];
    if (
      !firstComponent.subComponents ||
      firstComponent.subComponents.length === 0
    ) {
      return [];
    }

    // Filter out empty strings and return
    return firstComponent.subComponents.filter(
      (flag) => flag && flag.trim().length > 0,
    );
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<OBX> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "OBX") {
      return {
        ok: false,
        err: new Err(`Expected OBX segment, got ${parts[0]}`),
      };
    }
    const obx = new OBX();
    for (let i = 1; i < parts.length; i++) {
      obx.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: obx };
  }
}
