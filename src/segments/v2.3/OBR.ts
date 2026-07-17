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

  /** OBR-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  /** OBR-2 Placer Order Number (chainable). */
  placerOrderNumber(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  /** OBR-3 Filler Order Number (chainable). */
  fillerOrderNumber(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }
  /**
   * OBR-4 Universal Service Identifier (chainable).
   * @param identifier - OBR-4.1 Identifier
   * @param text - OBR-4.2 Text
   * @param nameOfCodingSystem - OBR-4.3 Name of Coding System
   */
  universalServiceIdentifier({ identifier, text, nameOfCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string }): this {
    this.fields[3] = this.createComponentsField([
      identifier,
      text,
      nameOfCodingSystem,
    ]);
    return this;
  }
  /** OBR-5 Priority (chainable). */
  priority(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  /** OBR-6 Requested Date Time (chainable). */
  requestedDateTime(value: string, format?: never): this;
  /** OBR-6 Requested Date Time (chainable). */
  requestedDateTime(value: Date, format?: HL7DateTimeLayout): this;
  requestedDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** OBR-7 Observation Date Time (chainable). */
  observationDateTime(value: string, format?: never): this;
  /** OBR-7 Observation Date Time (chainable). */
  observationDateTime(value: Date, format?: HL7DateTimeLayout): this;
  observationDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** OBR-8 Observation End Date Time (chainable). */
  observationEndDateTime(value: string, format?: never): this;
  /** OBR-8 Observation End Date Time (chainable). */
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
  /** OBR-9 Collection Volume (chainable). */
  collectionVolume(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }
  /**
   * OBR-10 Collector Identifier (chainable).
   * @param id - OBR-10.1 ID Number
   * @param familyName - OBR-10.2 Family Name
   * @param givenName - OBR-10.3 Given Name
   */
  collectorIdentifier({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    this.fields[9] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }
  /** OBR-11 Specimen Action Code (chainable). */
  specimenActionCode(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }
  /** OBR-12 Danger Code (chainable). */
  dangerCode(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }
  /** OBR-13 Relevant Clinical Info (chainable). */
  relevantClinicalInfo(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  /** OBR-14 Specimen Received Date Time (chainable). */
  specimenReceivedDateTime(value: string, format?: never): this;
  /** OBR-14 Specimen Received Date Time (chainable). */
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
  /** OBR-15 Specimen Source (chainable). */
  specimenSource(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  /**
   * OBR-16 Ordering Provider (chainable).
   * @param id - OBR-16.1 ID Number
   * @param familyName - OBR-16.2 Family Name
   * @param givenName - OBR-16.3 Given Name
   */
  orderingProvider({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    this.fields[15] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }
  /** OBR-17 Order Callback Phone Number (chainable). */
  orderCallbackPhoneNumber(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }
  /** OBR-18 Placer Field 1 (chainable). */
  placerField1(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }
  /** OBR-19 Placer Field 2 (chainable). */
  placerField2(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }
  /** OBR-20 Filler Field 1 (chainable). */
  fillerField1(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }
  /** OBR-21 Filler Field 2 (chainable). */
  fillerField2(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }
  /** OBR-22 Results Rpt Status Chng Date Time (chainable). */
  resultsRptStatusChngDateTime(value: string, format?: never): this;
  /** OBR-22 Results Rpt Status Chng Date Time (chainable). */
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
  /** OBR-23 Charge To Practice (chainable). */
  chargeToPractice(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }
  /** OBR-24 Diagnostic Serv Sect ID (chainable). */
  diagnosticServSectId(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }
  /** OBR-25 Result Status (chainable). */
  resultStatus(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }
  /**
   * OBR-26 Parent Result (chainable).
   * @param parentObservationIdentifier - OBR-26.1 Parent Observation Identifier
   * @param parentObservationSubIdentifier - OBR-26.2 Parent Observation Sub-Identifier
   * @param parentObservationValueDescriptor - OBR-26.3 Parent Observation Value Descriptor
   */
  parentResult({ parentObservationIdentifier, parentObservationSubIdentifier, parentObservationValueDescriptor }: { parentObservationIdentifier: string; parentObservationSubIdentifier?: string; parentObservationValueDescriptor?: string }): this {
    this.fields[25] = this.createComponentsField([
      parentObservationIdentifier,
      parentObservationSubIdentifier,
      parentObservationValueDescriptor,
    ]);
    return this;
  }
  /**
   * OBR-27 Quantity/Timing (chainable).
   * @param quantity - OBR-27.1 Quantity
   * @param interval - OBR-27.2 Interval
   * @param duration - OBR-27.3 Duration
   * @param startDateTime - OBR-27.4 Start Date/Time
   * @param endDateTime - OBR-27.5 End Date/Time
   * @param priority - OBR-27.6 Priority
   */
  quantityTiming({ quantity, interval, duration, startDateTime, endDateTime, priority }: { quantity: string; interval?: string; duration?: string; startDateTime?: string; endDateTime?: string; priority?: string }): this {
    this.fields[26] = this.createComponentsField([
      quantity,
      interval,
      duration,
      startDateTime,
      endDateTime,
      priority,
    ]);
    return this;
  }
  /**
   * OBR-28 Result Copies To (chainable).
   * @param id - OBR-28.1 ID Number
   * @param familyName - OBR-28.2 Family Name
   * @param givenName - OBR-28.3 Given Name
   */
  resultCopiesTo({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    this.fields[27] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }
  /**
   * OBR-29 Parent (chainable).
   * @param placerAssignedIdentifier - OBR-29.1 Placer Assigned Identifier
   * @param fillerAssignedIdentifier - OBR-29.2 Filler Assigned Identifier
   */
  parent({ placerAssignedIdentifier, fillerAssignedIdentifier }: { placerAssignedIdentifier: string; fillerAssignedIdentifier?: string }): this {
    this.fields[28] = this.createComponentsField([
      placerAssignedIdentifier,
      fillerAssignedIdentifier,
    ]);
    return this;
  }
  /** OBR-30 Transportation Mode (chainable). */
  transportationMode(value: string): this {
    this.fields[29] = this.createField(value);
    return this;
  }
  /**
   * OBR-31 Reason for Study (chainable).
   * @param code - OBR-31.1 Identifier
   * @param text - OBR-31.2 Text
   * @param codingSystem - OBR-31.3 Name of Coding System
   */
  reasonForStudy({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[30] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * OBR-32 Principal Result Interpreter (chainable).
   * @param name - OBR-32.1 Name
   * @param startDateTime - OBR-32.2 Start Date/Time
   * @param endDateTime - OBR-32.3 End Date/Time
   */
  principalResultInterpreter({ name, startDateTime, endDateTime }: { name: string; startDateTime?: string; endDateTime?: string }): this {
    this.fields[31] = this.createComponentsField([
      name,
      startDateTime,
      endDateTime,
    ]);
    return this;
  }
  /**
   * OBR-33 Assistant Result Interpreter (chainable).
   * @param name - OBR-33.1 Name
   * @param startDateTime - OBR-33.2 Start Date/Time
   * @param endDateTime - OBR-33.3 End Date/Time
   */
  assistantResultInterpreter({ name, startDateTime, endDateTime }: { name: string; startDateTime?: string; endDateTime?: string }): this {
    this.fields[32] = this.createComponentsField([
      name,
      startDateTime,
      endDateTime,
    ]);
    return this;
  }
  /**
   * OBR-34 Technician (chainable).
   * @param name - OBR-34.1 Name
   * @param startDateTime - OBR-34.2 Start Date/Time
   * @param endDateTime - OBR-34.3 End Date/Time
   */
  technician({ name, startDateTime, endDateTime }: { name: string; startDateTime?: string; endDateTime?: string }): this {
    this.fields[33] = this.createComponentsField([
      name,
      startDateTime,
      endDateTime,
    ]);
    return this;
  }
  /**
   * OBR-35 Transcriptionist (chainable).
   * @param name - OBR-35.1 Name
   * @param startDateTime - OBR-35.2 Start Date/Time
   * @param endDateTime - OBR-35.3 End Date/Time
   */
  transcriptionist({ name, startDateTime, endDateTime }: { name: string; startDateTime?: string; endDateTime?: string }): this {
    this.fields[34] = this.createComponentsField([
      name,
      startDateTime,
      endDateTime,
    ]);
    return this;
  }
  /** OBR-36 Scheduled Date Time (chainable). */
  scheduledDateTime(value: string, format?: never): this;
  /** OBR-36 Scheduled Date Time (chainable). */
  scheduledDateTime(value: Date, format?: HL7DateTimeLayout): this;
  scheduledDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[35] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** OBR-37 Number of Sample Containers (chainable). */
  numberOfSampleContainers(value: string): this {
    this.fields[36] = this.createField(value);
    return this;
  }
  /**
   * OBR-38 Transport Logistics of Collected Sample (chainable).
   * @param code - OBR-38.1 Identifier
   * @param text - OBR-38.2 Text
   * @param codingSystem - OBR-38.3 Name of Coding System
   */
  transportLogisticsOfCollectedSample({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[37] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * OBR-39 Collector's Comment (chainable).
   * @param code - OBR-39.1 Identifier
   * @param text - OBR-39.2 Text
   * @param codingSystem - OBR-39.3 Name of Coding System
   */
  collectorsComment({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[38] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * OBR-40 Transport Arrangement Responsibility (chainable).
   * @param code - OBR-40.1 Identifier
   * @param text - OBR-40.2 Text
   * @param codingSystem - OBR-40.3 Name of Coding System
   */
  transportArrangementResponsibility({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[39] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /** OBR-41 Transport Arranged (chainable). */
  transportArranged(value: string): this {
    this.fields[40] = this.createField(value);
    return this;
  }
  /** OBR-42 Escort Required (chainable). */
  escortRequired(value: string): this {
    this.fields[41] = this.createField(value);
    return this;
  }
  /**
   * OBR-43 Planned Patient Transport Comment (chainable).
   * @param code - OBR-43.1 Identifier
   * @param text - OBR-43.2 Text
   * @param codingSystem - OBR-43.3 Name of Coding System
   */
  plannedPatientTransportComment({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[42] = this.createComponentsField([code, text, codingSystem]);
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
