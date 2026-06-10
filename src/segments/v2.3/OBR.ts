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
 * OBR - Observation Request Segment (HL7 v2.3)
 */
export class OBR extends BaseSegment {
  name = "OBR";

  constructor() {
    super();
    this.fields = [];
  }

  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  placerOrderNumber(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  fillerOrderNumber(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }
  universalServiceIdentifier(
    identifier: string,
    text?: string,
    nameOfCodingSystem?: string,
  ): this {
    const components = [identifier];
    if (text) components.push(text);
    if (nameOfCodingSystem) components.push(nameOfCodingSystem);

    this.fields[3] = this.createField(components);
    return this;
  }
  priority(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  requestedDateTime(value: string, format?: never): this;
  requestedDateTime(value: Date, format?: HL7DateTimeLayout): this;
  requestedDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  observationDateTime(value: string, format?: never): this;
  observationDateTime(value: Date, format?: HL7DateTimeLayout): this;
  observationDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  observationEndDateTime(value: string, format?: never): this;
  observationEndDateTime(value: Date, format?: HL7DateTimeLayout): this;
  observationEndDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  collectionVolume(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }
  collectorIdentifier(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[9] = this.createField(components);
    return this;
  }
  specimenActionCode(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }
  dangerCode(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }
  relevantClinicalInfo(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  specimenReceivedDateTime(value: string, format?: never): this;
  specimenReceivedDateTime(value: Date, format?: HL7DateTimeLayout): this;
  specimenReceivedDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[13] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  specimenSource(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  orderingProvider(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[15] = this.createField(components);
    return this;
  }
  orderCallbackPhoneNumber(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }
  placerField1(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }
  placerField2(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }
  fillerField1(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }
  fillerField2(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }
  resultsRptStatusChngDateTime(value: string, format?: never): this;
  resultsRptStatusChngDateTime(value: Date, format?: HL7DateTimeLayout): this;
  resultsRptStatusChngDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[21] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  chargeToPractice(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }
  diagnosticServSectId(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }
  resultStatus(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<OBR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "OBR") {
      return {
        ok: false,
        err: new Err(`Expected OBR segment, got ${parts[0]}`),
      };
    }
    const obr = new OBR();
    for (let i = 1; i < parts.length; i++) {
      obr.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: obr };
  }
}
