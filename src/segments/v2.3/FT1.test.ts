// Position and composite tests for FT1 (HL7 v2.3, 25 fields).
import { describe, test, expect } from "vitest";
import { FT1 } from "./FT1.ts";

const at = (seg: FT1, n: number) => seg.encode().split("|")[n];

describe("FT1 field positions", () => {
  // [HL7 field number, setter call, expected encoding of that field]
  const cases: [number, (s: FT1) => FT1, string][] = [
    [1, (s) => s.setId("S"), "S"],
    [2, (s) => s.transactionId("T"), "T"],
    [3, (s) => s.transactionBatchId("B"), "B"],
    [4, (s) => s.transactionDate("20240102030405"), "20240102030405"],
    [5, (s) => s.transactionPostingDate("20240103"), "20240103"],
    [6, (s) => s.transactionType("CG"), "CG"],
    [7, (s) => s.transactionCode({ identifier: "C7", text: "T7" }), "C7^T7"],
    [8, (s) => s.transactionDescription("D"), "D"],
    [9, (s) => s.transactionDescriptionAlternate("A"), "A"],
    [10, (s) => s.transactionQuantity("2"), "2"],
    [11, (s) => s.transactionAmountExtended({ price: { quantity: "10.00", denomination: "USD" } }), "10.00&USD"],
    [12, (s) => s.transactionAmountUnit({ price: "5.00" }), "5.00"],
    [13, (s) => s.departmentCode({ identifier: "DEP" }), "DEP"],
    [14, (s) => s.insurancePlanId({ identifier: "PLAN" }), "PLAN"],
    [15, (s) => s.insuranceAmount({ price: "1.00" }), "1.00"],
    [16, (s) => s.assignedPatientLocation({ pointOfCare: "ICU", room: "2", bed: "A" }), "ICU^2^A"],
    [17, (s) => s.feeSchedule("1"), "1"],
    [18, (s) => s.patientType("I"), "I"],
    [19, (s) => s.diagnosisCode({ identifier: "J45" }, { identifier: "E11" }), "J45~E11"],
    [20, (s) => s.performedByCode({ idNumber: "P1", familyName: "Doe" }), "P1^Doe"],
    [21, (s) => s.orderedByCode({ idNumber: "O1", familyName: "Roe" }), "O1^Roe"],
    [22, (s) => s.unitCost("9.5"), "9.5"],
    [23, (s) => s.fillerOrderNumber({ entityIdentifier: "F1", namespaceId: "NS" }), "F1^NS"],
    [24, (s) => s.enteredByCode({ idNumber: "E1", givenName: "Jo" }), "E1^^Jo"],
    [25, (s) => s.procedureCode({ identifier: "99213", nameOfCodingSystem: "CPT" }), "99213^^CPT"],
  ];

  test.each(cases)("FT1-%i", (n, set, expected) => {
    const parts = set(new FT1()).encode().split("|");
    expect(parts[n]).toBe(expected);
    expect(parts.filter((p, i) => i !== 0 && i !== n && p !== "")).toEqual([]);
  });

  test("covers every field of the segment", () => {
    expect(cases.map(([n]) => n)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });
});

describe("FT1 composites", () => {
  test("TS fields accept a Date", () => {
    expect(at(new FT1().transactionDate(new Date(2024, 0, 2, 3, 4, 5)), 4)).toBe("20240102030405");
  });

  test("CE keeps all six components and interior gaps", () => {
    const ft1 = new FT1().transactionCode({
      identifier: "A", text: "B", nameOfCodingSystem: "C", alternateIdentifier: "D", alternateText: "E", nameOfAlternateCodingSystem: "F",
    });
    expect(at(ft1, 7)).toBe("A^B^C^D^E^F");
    expect(at(new FT1().transactionCode({ identifier: "A", alternateIdentifier: "D" }), 7)).toBe("A^^^D");
  });

  test("CP: MO and CE are sub-components of their components", () => {
    const ft1 = new FT1().transactionAmountExtended({
      price: { quantity: "10", denomination: "USD" }, priceType: "UP", fromValue: "1", toValue: "9",
      rangeUnits: { identifier: "u", text: "units" }, rangeType: "P",
    });
    expect(at(ft1, 11)).toBe("10&USD^UP^1^9^u&units^P");
  });

  test("PL: the facility HD is sub-components of PL.4", () => {
    const ft1 = new FT1().assignedPatientLocation({
      pointOfCare: "ICU", room: "2", bed: "A", facility: { namespaceId: "HOSP", universalId: "1.2.3", universalIdType: "ISO" },
      locationStatus: "S", personLocationType: "N", building: "B1", floor: "3", locationDescription: "north",
    });
    expect(at(ft1, 16)).toBe("ICU^2^A^HOSP&1.2.3&ISO^S^N^B1^3^north");
  });

  test("XCN: fourteen components with HD sub-components", () => {
    const ft1 = new FT1().performedByCode({
      idNumber: "1", familyName: "F", givenName: "G", middleInitialOrName: "M", suffix: "S", prefix: "P", degree: "D",
      sourceTable: "ST", assigningAuthority: { namespaceId: "AA" }, nameType: "L", identifierCheckDigit: "7",
      checkDigitScheme: "M10", identifierTypeCode: "NPI", assigningFacility: { namespaceId: "FAC", universalId: "9" },
    });
    expect(at(ft1, 20)).toBe("1^F^G^M^S^P^D^ST^AA^L^7^M10^NPI^FAC&9");
  });

  test("EI: four components", () => {
    const ft1 = new FT1().fillerOrderNumber({ entityIdentifier: "1", namespaceId: "2", universalId: "3", universalIdType: "4" });
    expect(at(ft1, 23)).toBe("1^2^3^4");
  });

  test("strings are used as raw field text", () => {
    expect(at(new FT1().transactionCode("99213^Office visit^CPT"), 7)).toBe("99213^Office visit^CPT");
  });

  test("parse round-trips a repeated diagnosis field", () => {
    const wire = "FT1|1|||20240102|||99213^x||||||||||||J45~E11";
    const parsed = FT1.parse(wire, { fieldSeparator: "|", componentSeparator: "^", repetitionSeparator: "~", escapeCharacter: "\\", subComponentSeparator: "&" });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.val.encode()).toBe(wire);
  });
});
