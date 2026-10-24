// Position, composite and repeating-field tests for RXA (HL7 v2.3, 22 fields).
import { describe, test, expect } from "vitest";
import { RXA } from "./RXA.ts";

const at = (seg: RXA, n: number) => seg.encode().split("|")[n];
const ce6 = { identifier: "A", text: "B", nameOfCodingSystem: "C", alternateIdentifier: "D", alternateText: "E", nameOfAlternateCodingSystem: "F" };

describe("RXA field positions", () => {
  // [HL7 field number, setter call, expected encoding of that field]
  const cases: [number, (s: RXA) => RXA, string][] = [
    [1, (s) => s.giveSubIdCounter("0"), "0"],
    [2, (s) => s.administrationSubIdCounter("1"), "1"],
    [3, (s) => s.dateTimeStartOfAdministration("20240102030405"), "20240102030405"],
    [4, (s) => s.dateTimeEndOfAdministration("20240102040405"), "20240102040405"],
    [5, (s) => s.administeredCode({ identifier: "08", text: "Hep B" }), "08^Hep B"],
    [6, (s) => s.administeredAmount("0.5"), "0.5"],
    [7, (s) => s.administeredUnits({ identifier: "mL" }), "mL"],
    [8, (s) => s.administeredDosageForm({ identifier: "INJ" }), "INJ"],
    [9, (s) => s.administrationNotes({ identifier: "N1", text: "note" }, { identifier: "N2" }), "N1^note~N2"],
    [10, (s) => s.administeringProvider({ idNumber: "P1", familyName: "Doe", givenName: "Jo" }), "P1^Doe^Jo"],
    [11, (s) => s.administeredAtLocation({ pointOfCare: "CLINIC", room: "2" }), "CLINIC^2"],
    [12, (s) => s.administeredPer("D"), "D"],
    [13, (s) => s.administeredStrength("10"), "10"],
    [14, (s) => s.administeredStrengthUnits({ identifier: "mg" }), "mg"],
    [15, (s) => s.substanceLotNumber("L1", "L2"), "L1~L2"],
    [16, (s) => s.substanceExpirationDate("20251231"), "20251231"],
    [17, (s) => s.substanceManufacturerName({ identifier: "MSD", text: "Merck" }, { identifier: "GSK" }), "MSD^Merck~GSK"],
    [18, (s) => s.substanceRefusalReason({ identifier: "00" }), "00"],
    [19, (s) => s.indication({ identifier: "I1" }, { identifier: "I2" }), "I1~I2"],
    [20, (s) => s.completionStatus("CP"), "CP"],
    [21, (s) => s.actionCode("A"), "A"],
    [22, (s) => s.systemEntryDateTime("20240103"), "20240103"],
  ];

  test.each(cases)("RXA-%i", (n, set, expected) => {
    const parts = set(new RXA()).encode().split("|");
    expect(parts[n]).toBe(expected);
    expect(parts.filter((p, i) => i !== 0 && i !== n && p !== "")).toEqual([]);
  });

  test("covers every field of the segment", () => {
    expect(cases.map(([n]) => n)).toEqual(Array.from({ length: 22 }, (_, i) => i + 1));
  });
});

describe("RXA composites", () => {
  test("TS fields accept a Date", () => {
    expect(at(new RXA().dateTimeStartOfAdministration(new Date(2024, 0, 2, 3, 4, 5)), 3)).toBe("20240102030405");
    expect(at(new RXA().systemEntryDateTime(new Date(2024, 0, 2, 3, 4, 5)), 22)).toBe("20240102030405");
  });

  test("RXA-16 repeats: the plural form takes every repetition, and a Date uses the date layout", () => {
    expect(at(new RXA().substanceExpirationDates("20251231", new Date(2026, 5, 7)), 16)).toBe("20251231~20260607");
    expect(at(new RXA().substanceExpirationDate(new Date(2026, 5, 7)), 16)).toBe("20260607");
  });

  test("CE fields carry all six components, with interior gaps", () => {
    expect(at(new RXA().administeredCode(ce6), 5)).toBe("A^B^C^D^E^F");
    expect(at(new RXA().administeredCode({ identifier: "A", alternateIdentifier: "D" }), 5)).toBe("A^^^D");
  });

  test("the earlier code/text/codingSystem shape still works", () => {
    expect(at(new RXA().administeredCode({ code: "08", text: "Hep B", codingSystem: "CVX" }), 5)).toBe("08^Hep B^CVX");
    expect(at(new RXA().administeredUnits({ code: "mL", text: "milliliter" }), 7)).toBe("mL^milliliter");
  });

  test("RXA-10 (XCN) models fourteen components, and the earlier id/familyName/givenName shape works", () => {
    const rxa = new RXA().administeringProvider({
      idNumber: "1", familyName: "F", givenName: "G", middleInitialOrName: "M", suffix: "S", prefix: "P", degree: "D",
      sourceTable: "ST", assigningAuthority: { namespaceId: "AA" }, nameType: "L", identifierCheckDigit: "7",
      checkDigitScheme: "M10", identifierTypeCode: "NPI", assigningFacility: { namespaceId: "FAC", universalId: "9" },
    });
    expect(at(rxa, 10)).toBe("1^F^G^M^S^P^D^ST^AA^L^7^M10^NPI^FAC&9");
    expect(at(new RXA().administeringProvider({ id: "P1", familyName: "Doe", givenName: "Jo" }), 10)).toBe("P1^Doe^Jo");
  });

  test("RXA-11 has sixteen components: PV1-3's eight plus an address", () => {
    const rxa = new RXA().administeredAtLocation({
      pointOfCare: "1", room: "2", bed: "3", facility: { namespaceId: "HOSP", universalId: "U", universalIdType: "ISO" },
      locationStatus: "5", personLocationType: "6", building: "7", floor: "8", streetAddress: "9",
      otherDesignation: "10", city: "11", stateOrProvince: "12", zipOrPostalCode: "13", country: "14",
      addressType: "15", otherGeographicDesignation: "16",
    });
    expect(at(rxa, 11)).toBe("1^2^3^HOSP&U&ISO^5^6^7^8^9^10^11^12^13^14^15^16");
  });

  test("the earlier four-component location call still works", () => {
    expect(at(new RXA().administeredAtLocation({ pointOfCare: "ER", room: "1", bed: "2", facility: "MAIN" }), 11)).toBe("ER^1^2^MAIN");
  });

  test("RXA-10 does not repeat in v2.3 (a second repetition arrives in v2.3.1)", () => {
    expect(new RXA().administeringProvider.length).toBe(1);
  });

  test("parse round-trips repeated fields", () => {
    const wire = "RXA|0|1|20240102|20240102|08^Hep B|0.5|mL||N1~N2||||||L1~L2|20251231~20261231|MSD~GSK";
    const result = RXA.parse(wire, { fieldSeparator: "|", componentSeparator: "^", repetitionSeparator: "~", escapeCharacter: "\\", subComponentSeparator: "&" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.encode()).toBe(wire);
  });

  test("RXA-16 Substance Expiration Date repeats and accepts a format per entry", () => {
    const parts = new RXA().substanceExpirationDate("20250101", { value: "20250102" }).encode().split("|");
    expect(parts[16]).toBe("20250101~20250102");
  });
});
