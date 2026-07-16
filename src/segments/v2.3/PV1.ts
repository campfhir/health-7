/**
 * PV1 segment definition for HL7 v2.3.
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
 * PV1 - Patient Visit Segment (HL7 v2.3)
 */
export class PV1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "PV1";

  constructor() {
    super();
    this.fields = [];
  }

  /** PV1-1 Set ID - PV1 (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  /** PV1-2 Patient Class (chainable). */
  patientClass(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  /**
   * PV1-3 Assigned Patient Location (chainable).
   * @param pointOfCare - PV1-3.1 Point of Care
   * @param room - PV1-3.2 Room
   * @param bed - PV1-3.3 Bed
   * @param facility - PV1-3.4 Facility
   * @param locationStatus - PV1-3.5 Location Status
   * @param personLocationType - PV1-3.6 Person Location Type
   */
  assignedPatientLocation(
    pointOfCare?: string,
    room?: string,
    bed?: string,
    facility?: string,
    locationStatus?: string,
    personLocationType?: string,
  ): this {
    this.fields[2] = this.createComponentsField([
      pointOfCare,
      room,
      bed,
      facility,
      locationStatus,
      personLocationType,
    ]);
    return this;
  }
  /** PV1-4 Admission Type (chainable). */
  admissionType(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
  /** PV1-5 Preadmit Number (chainable). */
  preadmitNumber(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  /**
   * PV1-6 Prior Patient Location (chainable).
   * @param pointOfCare - PV1-6.1 Point of Care
   * @param room - PV1-6.2 Room
   * @param bed - PV1-6.3 Bed
   * @param facility - PV1-6.4 Facility
   */
  priorPatientLocation(
    pointOfCare?: string,
    room?: string,
    bed?: string,
    facility?: string,
  ): this {
    this.fields[5] = this.createComponentsField([
      pointOfCare,
      room,
      bed,
      facility,
    ]);
    return this;
  }
  /**
   * PV1-7 Attending Doctor (chainable).
   * @param id - PV1-7.1 ID Number
   * @param familyName - PV1-7.2 Family Name
   * @param givenName - PV1-7.3 Given Name
   */
  attendingDoctor(id: string, familyName?: string, givenName?: string): this {
    this.fields[6] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }
  /**
   * PV1-8 Referring Doctor (chainable).
   * @param id - PV1-8.1 ID Number
   * @param familyName - PV1-8.2 Family Name
   * @param givenName - PV1-8.3 Given Name
   */
  referringDoctor(id: string, familyName?: string, givenName?: string): this {
    this.fields[7] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }
  /**
   * PV1-9 Consulting Doctor (chainable).
   * @param id - PV1-9.1 ID Number
   * @param familyName - PV1-9.2 Family Name
   * @param givenName - PV1-9.3 Given Name
   */
  consultingDoctor(id: string, familyName?: string, givenName?: string): this {
    this.fields[8] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }
  /** PV1-10 Hospital Service (chainable). */
  hospitalService(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
  /**
   * PV1-11 Temporary Location (chainable).
   * @param pointOfCare - PV1-11.1 Point of Care
   * @param room - PV1-11.2 Room
   * @param bed - PV1-11.3 Bed
   */
  temporaryLocation(pointOfCare?: string, room?: string, bed?: string): this {
    this.fields[10] = this.createComponentsField([pointOfCare, room, bed]);
    return this;
  }
  /** PV1-12 Preadmit Test Indicator (chainable). */
  preadmitTestIndicator(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }
  /** PV1-13 Re-admission Indicator (chainable). */
  reAdmissionIndicator(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  /** PV1-14 Admit Source (chainable). */
  admitSource(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }
  /** PV1-15 Ambulatory Status (chainable). */
  ambulatoryStatus(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  /** PV1-16 VIP Indicator (chainable). */
  vipIndicator(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }
  /**
   * PV1-17 Admitting Doctor (chainable).
   * @param id - PV1-17.1 ID Number
   * @param familyName - PV1-17.2 Family Name
   * @param givenName - PV1-17.3 Given Name
   */
  admittingDoctor(id: string, familyName?: string, givenName?: string): this {
    this.fields[16] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }
  /** PV1-18 Patient Type (chainable). */
  patientType(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }
  /**
   * PV1-19 Visit Number (chainable).
   *
   * Encoded as a CX data type. The assigning authority and identifier type
   * code occupy CX.4 and CX.5, so the intervening CX.2/CX.3 components are
   * padded to keep the component positions correct.
   *
   * @param value - PV1-19.1 ID Number
   * @param assigningAuthority - PV1-19.4 Assigning Authority
   * @param identifierType - PV1-19.5 Identifier Type Code
   */
  visitNumber(
    value: string,
    assigningAuthority?: string,
    identifierType?: string,
  ): this {
    this.fields[18] = this.createComponentsField([
      value,
      undefined,
      undefined,
      assigningAuthority,
      identifierType,
    ]);
    return this;
  }
  /**
   * PV1-20 Financial Class (chainable).
   * @param financialClassCode - PV1-20.1 Financial Class Code
   * @param effectiveDate - PV1-20.2 Effective Date
   */
  financialClass(financialClassCode: string, effectiveDate?: string): this {
    this.fields[19] = this.createComponentsField([
      financialClassCode,
      effectiveDate,
    ]);
    return this;
  }
  /** PV1-21 Charge Price Indicator (chainable). */
  chargePriceIndicator(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }
  /** PV1-22 Courtesy Code (chainable). */
  courtesyCode(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }
  /** PV1-23 Credit Rating (chainable). */
  creditRating(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }
  /** PV1-24 Contract Code (chainable). */
  contractCode(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }
  /** PV1-25 Contract Effective Date (chainable). */
  contractEffectiveDate(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }
  /** PV1-26 Contract Amount (chainable). */
  contractAmount(value: string): this {
    this.fields[25] = this.createField(value);
    return this;
  }
  /** PV1-27 Contract Period (chainable). */
  contractPeriod(value: string): this {
    this.fields[26] = this.createField(value);
    return this;
  }
  /** PV1-28 Interest Code (chainable). */
  interestCode(value: string): this {
    this.fields[27] = this.createField(value);
    return this;
  }
  /** PV1-29 Transfer to Bad Debt Code (chainable). */
  transferToBadDebtCode(value: string): this {
    this.fields[28] = this.createField(value);
    return this;
  }
  /** PV1-30 Transfer to Bad Debt Date (chainable). */
  transferToBadDebtDate(value: string): this {
    this.fields[29] = this.createField(value);
    return this;
  }
  /** PV1-31 Bad Debt Agency Code (chainable). */
  badDebtAgencyCode(value: string): this {
    this.fields[30] = this.createField(value);
    return this;
  }
  /** PV1-32 Bad Debt Transfer Amount (chainable). */
  badDebtTransferAmount(value: string): this {
    this.fields[31] = this.createField(value);
    return this;
  }
  /** PV1-33 Bad Debt Recovery Amount (chainable). */
  badDebtRecoveryAmount(value: string): this {
    this.fields[32] = this.createField(value);
    return this;
  }
  /** PV1-34 Delete Account Indicator (chainable). */
  deleteAccountIndicator(value: string): this {
    this.fields[33] = this.createField(value);
    return this;
  }
  /** PV1-35 Delete Account Date (chainable). */
  deleteAccountDate(value: string): this {
    this.fields[34] = this.createField(value);
    return this;
  }
  /** PV1-36 Discharge Disposition (chainable). */
  dischargeDisposition(value: string): this {
    this.fields[35] = this.createField(value);
    return this;
  }
  /**
   * PV1-37 Discharged to Location (chainable).
   * @param dischargeToLocation - PV1-37.1 Discharge to Location
   * @param effectiveDate - PV1-37.2 Effective Date
   */
  dischargedToLocation(
    dischargeToLocation: string,
    effectiveDate?: string,
  ): this {
    this.fields[36] = this.createComponentsField([
      dischargeToLocation,
      effectiveDate,
    ]);
    return this;
  }
  /**
   * PV1-38 Diet Type (chainable).
   * @param code - PV1-38.1 Identifier
   * @param text - PV1-38.2 Text
   * @param codingSystem - PV1-38.3 Name of Coding System
   */
  dietType(code: string, text?: string, codingSystem?: string): this {
    this.fields[37] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /** PV1-39 Servicing Facility (chainable). */
  servicingFacility(value: string): this {
    this.fields[38] = this.createField(value);
    return this;
  }
  /** PV1-40 Bed Status (chainable). */
  bedStatus(value: string): this {
    this.fields[39] = this.createField(value);
    return this;
  }
  /** PV1-41 Account Status (chainable). */
  accountStatus(value: string): this {
    this.fields[40] = this.createField(value);
    return this;
  }
  /**
   * PV1-42 Pending Location (chainable).
   * @param pointOfCare - PV1-42.1 Point of Care
   * @param room - PV1-42.2 Room
   * @param bed - PV1-42.3 Bed
   * @param facility - PV1-42.4 Facility
   * @param locationStatus - PV1-42.5 Location Status
   * @param personLocationType - PV1-42.6 Person Location Type
   */
  pendingLocation(
    pointOfCare?: string,
    room?: string,
    bed?: string,
    facility?: string,
    locationStatus?: string,
    personLocationType?: string,
  ): this {
    this.fields[41] = this.createComponentsField([
      pointOfCare,
      room,
      bed,
      facility,
      locationStatus,
      personLocationType,
    ]);
    return this;
  }
  /**
   * PV1-43 Prior Temporary Location (chainable).
   * @param pointOfCare - PV1-43.1 Point of Care
   * @param room - PV1-43.2 Room
   * @param bed - PV1-43.3 Bed
   * @param facility - PV1-43.4 Facility
   * @param locationStatus - PV1-43.5 Location Status
   * @param personLocationType - PV1-43.6 Person Location Type
   */
  priorTemporaryLocation(
    pointOfCare?: string,
    room?: string,
    bed?: string,
    facility?: string,
    locationStatus?: string,
    personLocationType?: string,
  ): this {
    this.fields[42] = this.createComponentsField([
      pointOfCare,
      room,
      bed,
      facility,
      locationStatus,
      personLocationType,
    ]);
    return this;
  }
  /** PV1-44 Admit Date/Time (chainable). */
  admitDateTime(value: string, format?: never): this;
  /** PV1-44 Admit Date/Time (chainable). */
  admitDateTime(value: Date, format?: HL7DateTimeLayout): this;
  admitDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[43] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** PV1-45 Discharge Date/Time (chainable). */
  dischargeDateTime(value: string, format?: never): this;
  /** PV1-45 Discharge Date/Time (chainable). */
  dischargeDateTime(value: Date, format?: HL7DateTimeLayout): this;
  dischargeDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[44] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** PV1-46 Current Patient Balance (chainable). */
  currentPatientBalance(value: string): this {
    this.fields[45] = this.createField(value);
    return this;
  }
  /** PV1-47 Total Charges (chainable). */
  totalCharges(value: string): this {
    this.fields[46] = this.createField(value);
    return this;
  }
  /** PV1-48 Total Adjustments (chainable). */
  totalAdjustments(value: string): this {
    this.fields[47] = this.createField(value);
    return this;
  }
  /** PV1-49 Total Payments (chainable). */
  totalPayments(value: string): this {
    this.fields[48] = this.createField(value);
    return this;
  }
  /**
   * PV1-50 Alternate Visit ID (chainable).
   *
   * Encoded as a CX data type. The assigning authority and identifier type
   * code occupy CX.4 and CX.5, so the intervening CX.2/CX.3 components are
   * padded to keep the component positions correct.
   *
   * @param value - PV1-50.1 ID Number
   * @param assigningAuthority - PV1-50.4 Assigning Authority
   * @param identifierType - PV1-50.5 Identifier Type Code
   */
  alternateVisitId(
    value: string,
    assigningAuthority?: string,
    identifierType?: string,
  ): this {
    this.fields[49] = this.createComponentsField([
      value,
      undefined,
      undefined,
      assigningAuthority,
      identifierType,
    ]);
    return this;
  }
  /** PV1-51 Visit Indicator (chainable). */
  visitIndicator(value: string): this {
    this.fields[50] = this.createField(value);
    return this;
  }
  /**
   * PV1-52 Other Healthcare Provider (chainable).
   * @param id - PV1-52.1 ID Number
   * @param familyName - PV1-52.2 Family Name
   * @param givenName - PV1-52.3 Given Name
   */
  otherHealthcareProvider(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    this.fields[51] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PV1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PV1") {
      return {
        ok: false,
        err: new Err(`Expected PV1 segment, got ${parts[0]}`),
      };
    }
    const pv1 = new PV1();
    for (let i = 1; i < parts.length; i++) {
      pv1.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: pv1 };
  }
}
