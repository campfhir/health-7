/**
 * OBR segment definition for HL7 v2.3.
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
 * OBR - Observation Request Segment (HL7 v2.3)
 */
export class OBR extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "OBR";

  constructor() {
    super();
    this.fields = [];
  }

  /** Sets the set id field (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  /** Sets the placer order number field (chainable). */
  placerOrderNumber(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  /** Sets the filler order number field (chainable). */
  fillerOrderNumber(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }
  /** Universal service identifier. */
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
  /** Sets the priority field (chainable). */
  priority(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  /** Sets the requested date time field (chainable). */
  requestedDateTime(value: string, format?: never): this;
  /** Sets the requested date time field (chainable). */
  requestedDateTime(value: Date, format?: HL7DateTimeLayout): this;
  requestedDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** Sets the observation date time field (chainable). */
  observationDateTime(value: string, format?: never): this;
  /** Sets the observation date time field (chainable). */
  observationDateTime(value: Date, format?: HL7DateTimeLayout): this;
  observationDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** Sets the observation end date time field (chainable). */
  observationEndDateTime(value: string, format?: never): this;
  /** Sets the observation end date time field (chainable). */
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
  /** Sets the collection volume field (chainable). */
  collectionVolume(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }
  /** Collector identifier. */
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
  /** Sets the specimen action code field (chainable). */
  specimenActionCode(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }
  /** Sets the danger code field (chainable). */
  dangerCode(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }
  /** Sets the relevant clinical info field (chainable). */
  relevantClinicalInfo(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  /** Sets the specimen received date time field (chainable). */
  specimenReceivedDateTime(value: string, format?: never): this;
  /** Sets the specimen received date time field (chainable). */
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
  /** Sets the specimen source field (chainable). */
  specimenSource(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  /** Sets the ordering provider field (chainable). */
  orderingProvider(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[15] = this.createField(components);
    return this;
  }
  /** Sets the order callback phone number field (chainable). */
  orderCallbackPhoneNumber(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }
  /** Sets the placer field1 field (chainable). */
  placerField1(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }
  /** Sets the placer field2 field (chainable). */
  placerField2(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }
  /** Sets the filler field1 field (chainable). */
  fillerField1(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }
  /** Sets the filler field2 field (chainable). */
  fillerField2(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }
  /** Sets the results rpt status chng date time field (chainable). */
  resultsRptStatusChngDateTime(value: string, format?: never): this;
  /** Sets the results rpt status chng date time field (chainable). */
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
  /** Sets the charge to practice field (chainable). */
  chargeToPractice(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }
  /** Sets the diagnostic serv sect id field (chainable). */
  diagnosticServSectId(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }
  /** Sets the result status field (chainable). */
  resultStatus(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
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
