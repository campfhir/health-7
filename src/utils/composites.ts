/**
 * Typed shapes and component builders for the HL7 composite data types shared by several
 * segments (CE, CWE/CNE, HD, MO, CP, PL, XCN, XPN, XAD, XTN, EI, PI). Component lists were
 * checked against the hl7.eu definitions of HL7 v2.3 (CE, CP, PL, XCN, EI, XPN, XAD, XTN),
 * v2.3.1 (PI) and v2.5 (CWE) / v2.5.1 (CNE).
 *
 * Each `*Parts` function returns the components of the type, in order, where a component
 * that is itself composite (HD, MO, CE nested in another type) is an array of its
 * sub-components. Pass the result to `components()` and then to `createField()`.
 *
 * @module
 */

/** One component: plain text, or its sub-components when the component is itself composite. */
export type Part = string | undefined | readonly (string | undefined)[];

/**
 * Turns component parts into the `string[][]` shape `createField` takes: undefined becomes "",
 * interior gaps are kept, and trailing empty components are trimmed.
 */
export function components(parts: readonly Part[]): string[][] {
  const comps = parts.map((p) => (Array.isArray(p) ? trimSubs(p) : [(p as string | undefined) ?? ""]));
  while (comps.length > 1 && comps[comps.length - 1].every((s) => s === "")) comps.pop();
  return comps;
}

function trimSubs(subs: readonly (string | undefined)[]): string[] {
  const out = subs.map((s) => s ?? "");
  while (out.length > 1 && out[out.length - 1] === "") out.pop();
  return out;
}

/** Hierarchic designator (HD). */
export interface HD {
  /** HD.1 Namespace ID */
  namespaceId?: string;
  /** HD.2 Universal ID */
  universalId?: string;
  /** HD.3 Universal ID Type */
  universalIdType?: string;
}
/** Sub-components of an HD. */
export const hd = (v?: HD | string): Part =>
  v === undefined ? undefined : typeof v === "string" ? v : [v.namespaceId, v.universalId, v.universalIdType];

/** Coded element (CE). */
export interface CE {
  /** CE.1 Identifier */
  identifier: string;
  /** CE.2 Text */
  text?: string;
  /** CE.3 Name of Coding System */
  nameOfCodingSystem?: string;
  /** CE.4 Alternate Identifier */
  alternateIdentifier?: string;
  /** CE.5 Alternate Text */
  alternateText?: string;
  /** CE.6 Name of Alternate Coding System */
  nameOfAlternateCodingSystem?: string;
}
/** Components of a CE. */
export const ceParts = (v: CE): Part[] => [
  v.identifier, v.text, v.nameOfCodingSystem, v.alternateIdentifier, v.alternateText, v.nameOfAlternateCodingSystem,
];
/** A CE nested in another type (its components become sub-components). */
export const ceSubs = (v?: CE | string): Part =>
  v === undefined ? undefined : typeof v === "string" ? v : ceParts(v) as string[];

/** Coded with (no) exceptions (CWE / CNE, identical in structure). */
export interface CodedElement {
  /** Identifier (component 1) */
  code: string;
  /** Text (component 2) */
  text?: string;
  /** Name of Coding System (component 3) */
  codingSystem?: string;
  /** Alternate Identifier (component 4) */
  alternateIdentifier?: string;
  /** Alternate Text (component 5) */
  alternateText?: string;
  /** Name of Alternate Coding System (component 6) */
  alternateCodingSystem?: string;
  /** Coding System Version ID (component 7) */
  codingSystemVersionId?: string;
  /** Alternate Coding System Version ID (component 8) */
  alternateCodingSystemVersionId?: string;
  /** Original Text (component 9) */
  originalText?: string;
}
/** Components of a CWE or CNE. */
export const cweParts = (v: CodedElement): Part[] => [
  v.code, v.text, v.codingSystem, v.alternateIdentifier, v.alternateText, v.alternateCodingSystem,
  v.codingSystemVersionId, v.alternateCodingSystemVersionId, v.originalText,
];

/** Money (MO). */
export interface MO {
  /** MO.1 Quantity */
  quantity?: string;
  /** MO.2 Denomination */
  denomination?: string;
}

/** Composite price (CP). */
export interface CP {
  /** CP.1 Price (MO) */
  price?: MO | string;
  /** CP.2 Price Type */
  priceType?: string;
  /** CP.3 From Value */
  fromValue?: string;
  /** CP.4 To Value */
  toValue?: string;
  /** CP.5 Range Units (CE) */
  rangeUnits?: CE | string;
  /** CP.6 Range Type */
  rangeType?: string;
}
/** Components of a CP. */
export const cpParts = (v: CP): Part[] => [
  typeof v.price === "object" ? [v.price.quantity, v.price.denomination] : v.price,
  v.priceType, v.fromValue, v.toValue, ceSubs(v.rangeUnits), v.rangeType,
];

/** Person location (PL). */
export interface PL {
  /** PL.1 Point of Care */
  pointOfCare?: string;
  /** PL.2 Room */
  room?: string;
  /** PL.3 Bed */
  bed?: string;
  /** PL.4 Facility (HD) */
  facility?: HD | string;
  /** PL.5 Location Status */
  locationStatus?: string;
  /** PL.6 Person Location Type */
  personLocationType?: string;
  /** PL.7 Building */
  building?: string;
  /** PL.8 Floor */
  floor?: string;
  /** PL.9 Location Description */
  locationDescription?: string;
}
/** Components of a PL. */
export const plParts = (v: PL): Part[] => [
  v.pointOfCare, v.room, v.bed, hd(v.facility), v.locationStatus, v.personLocationType,
  v.building, v.floor, v.locationDescription,
];

/** Extended composite ID number and name for persons (XCN). */
export interface XCN {
  /** XCN.1 ID Number */
  idNumber?: string;
  /** XCN.2 Family Name */
  familyName?: string;
  /** XCN.3 Given Name */
  givenName?: string;
  /** XCN.4 Middle Initial or Name */
  middleInitialOrName?: string;
  /** XCN.5 Suffix */
  suffix?: string;
  /** XCN.6 Prefix */
  prefix?: string;
  /** XCN.7 Degree */
  degree?: string;
  /** XCN.8 Source Table */
  sourceTable?: string;
  /** XCN.9 Assigning Authority (HD) */
  assigningAuthority?: HD | string;
  /** XCN.10 Name Type */
  nameType?: string;
  /** XCN.11 Identifier Check Digit */
  identifierCheckDigit?: string;
  /** XCN.12 Code Identifying the Check Digit Scheme Employed */
  checkDigitScheme?: string;
  /** XCN.13 Identifier Type Code */
  identifierTypeCode?: string;
  /** XCN.14 Assigning Facility ID (HD) */
  assigningFacility?: HD | string;
}
/** Components of an XCN. */
export const xcnParts = (v: XCN): Part[] => [
  v.idNumber, v.familyName, v.givenName, v.middleInitialOrName, v.suffix, v.prefix, v.degree,
  v.sourceTable, hd(v.assigningAuthority), v.nameType, v.identifierCheckDigit, v.checkDigitScheme,
  v.identifierTypeCode, hd(v.assigningFacility),
];

/** Extended person name (XPN). */
export interface XPN {
  /** XPN.1 Family Name */
  familyName?: string;
  /** XPN.2 Given Name */
  givenName?: string;
  /** XPN.3 Middle Initial or Name */
  middleInitialOrName?: string;
  /** XPN.4 Suffix */
  suffix?: string;
  /** XPN.5 Prefix */
  prefix?: string;
  /** XPN.6 Degree */
  degree?: string;
  /** XPN.7 Name Type Code */
  nameTypeCode?: string;
  /** XPN.8 Name Representation Code */
  nameRepresentationCode?: string;
}
/** Components of an XPN. */
export const xpnParts = (v: XPN): Part[] => [
  v.familyName, v.givenName, v.middleInitialOrName, v.suffix, v.prefix, v.degree,
  v.nameTypeCode, v.nameRepresentationCode,
];

/** Extended address (XAD). */
export interface XAD {
  /** XAD.1 Street Address */
  streetAddress?: string;
  /** XAD.2 Other Designation */
  otherDesignation?: string;
  /** XAD.3 City */
  city?: string;
  /** XAD.4 State or Province */
  stateOrProvince?: string;
  /** XAD.5 Zip or Postal Code */
  zipOrPostalCode?: string;
  /** XAD.6 Country */
  country?: string;
  /** XAD.7 Address Type */
  addressType?: string;
  /** XAD.8 Other Geographic Designation */
  otherGeographicDesignation?: string;
  /** XAD.9 County/Parish Code */
  countyParishCode?: string;
  /** XAD.10 Census Tract */
  censusTract?: string;
}
/** Components of an XAD. */
export const xadParts = (v: XAD): Part[] => [
  v.streetAddress, v.otherDesignation, v.city, v.stateOrProvince, v.zipOrPostalCode, v.country,
  v.addressType, v.otherGeographicDesignation, v.countyParishCode, v.censusTract,
];

/** Extended telecommunication number (XTN), v2.3 layout (nine components). */
export interface XTN {
  /** XTN.1 [(999)] 999-9999 [X99999][C any text] */
  telephoneNumber?: string;
  /** XTN.2 Telecommunication Use Code */
  telecommunicationUseCode?: string;
  /** XTN.3 Telecommunication Equipment Type */
  telecommunicationEquipmentType?: string;
  /** XTN.4 Email Address */
  emailAddress?: string;
  /** XTN.5 Country Code */
  countryCode?: string;
  /** XTN.6 Area/City Code */
  areaCityCode?: string;
  /** XTN.7 Phone Number */
  phoneNumber?: string;
  /** XTN.8 Extension */
  extension?: string;
  /** XTN.9 Any Text */
  anyText?: string;
}
/** Components of a v2.3 XTN. */
export const xtnParts = (v: XTN): Part[] => [
  v.telephoneNumber, v.telecommunicationUseCode, v.telecommunicationEquipmentType, v.emailAddress,
  v.countryCode, v.areaCityCode, v.phoneNumber, v.extension, v.anyText,
];

/** Entity identifier (EI). */
export interface EI {
  /** EI.1 Entity Identifier */
  entityIdentifier: string;
  /** EI.2 Namespace ID */
  namespaceId?: string;
  /** EI.3 Universal ID */
  universalId?: string;
  /** EI.4 Universal ID Type */
  universalIdType?: string;
}
/** Components of an EI. */
export const eiParts = (v: EI): Part[] => [v.entityIdentifier, v.namespaceId, v.universalId, v.universalIdType];

/** Person identifier (PI). */
export interface PI {
  /** PI.1 ID Number */
  idNumber: string;
  /** PI.2 Type of ID Number */
  typeOfIdNumber?: string;
  /** PI.3 Other Qualifying Info */
  otherQualifyingInfo?: string;
}
/** Components of a PI. */
export const piParts = (v: PI): Part[] => [v.idNumber, v.typeOfIdNumber, v.otherQualifyingInfo];

/** Extended composite ID with check digit (CX), v2.5.1 layout (ten components). */
export interface CX {
  /** CX.1 ID Number */
  idNumber: string;
  /** CX.2 Check Digit */
  checkDigit?: string;
  /** CX.3 Check Digit Scheme */
  checkDigitScheme?: string;
  /** CX.4 Assigning Authority (HD) */
  assigningAuthority?: HD | string;
  /** CX.5 Identifier Type Code */
  identifierTypeCode?: string;
  /** CX.6 Assigning Facility (HD) */
  assigningFacility?: HD | string;
  /** CX.7 Effective Date */
  effectiveDate?: string;
  /** CX.8 Expiration Date */
  expirationDate?: string;
  /** CX.9 Assigning Jurisdiction (CWE) */
  assigningJurisdiction?: CodedElement | string;
  /** CX.10 Assigning Agency or Department (CWE) */
  assigningAgencyOrDepartment?: CodedElement | string;
}
/** Components of a CX; the CWE components are sub-components of CX.9 and CX.10. */
export const cxParts = (v: CX): Part[] => [
  v.idNumber, v.checkDigit, v.checkDigitScheme, hd(v.assigningAuthority), v.identifierTypeCode,
  hd(v.assigningFacility), v.effectiveDate, v.expirationDate,
  typeof v.assigningJurisdiction === "object" ? (cweParts(v.assigningJurisdiction) as string[]) : v.assigningJurisdiction,
  typeof v.assigningAgencyOrDepartment === "object"
    ? (cweParts(v.assigningAgencyOrDepartment) as string[])
    : v.assigningAgencyOrDepartment,
];

/** Person location number (PLN), v2.5.1 layout (four components). */
export interface PLN {
  /** PLN.1 ID Number */
  idNumber: string;
  /** PLN.2 Type of ID Number */
  typeOfIdNumber?: string;
  /** PLN.3 State/other Qualifying Information */
  stateOtherQualifyingInformation?: string;
  /** PLN.4 Expiration Date */
  expirationDate?: string;
}
/** Components of a PLN. */
export const plnParts = (v: PLN): Part[] => [
  v.idNumber, v.typeOfIdNumber, v.stateOtherQualifyingInformation, v.expirationDate,
];
