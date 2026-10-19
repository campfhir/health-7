// RXA in HL7 v2.5: RXA-23..26 are new.
import { describe, test, expect } from "vitest";
import { RXA } from "./RXA.ts";
import { RXA as RXA_v231 } from "../v2.3.1/RXA.ts";
import { RXA as RXA_v251 } from "../v2.5.1/RXA.ts";

const at = (seg: RXA, n: number) => seg.encode().split("|")[n];

describe("RXA (v2.5)", () => {
  test("extends the v2.3.1 segment", () => {
    expect(new RXA()).toBeInstanceOf(RXA_v231);
  });

  test.each([
    [23, (s: RXA) => s.administeredDrugStrengthVolume("5"), "5"],
    [24, (s: RXA) => s.administeredDrugStrengthVolumeUnits({ code: "mL", text: "milliliter", codingSystem: "UCUM" }), "mL^milliliter^UCUM"],
    [25, (s: RXA) => s.administeredBarcodeIdentifier({ code: "BC1" }), "BC1"],
    [26, (s: RXA) => s.pharmacyOrderType("M"), "M"],
  ])("RXA-%i", (n, set, expected) => {
    const parts = set(new RXA()).encode().split("|");
    expect(parts[n]).toBe(expected);
    expect(parts.filter((p, i) => i !== 0 && i !== n && p !== "")).toEqual([]);
  });

  test("the CWE fields carry nine components", () => {
    const rxa = new RXA().administeredDrugStrengthVolumeUnits({
      code: "1", text: "2", codingSystem: "3", alternateIdentifier: "4", alternateText: "5",
      alternateCodingSystem: "6", codingSystemVersionId: "7", alternateCodingSystemVersionId: "8", originalText: "9",
    });
    expect(at(rxa, 24)).toBe("1^2^3^4^5^6^7^8^9");
  });

  test("v2.5.1 inherits RXA-23..26 and the earlier fields from v2.5", () => {
    const rxa = new RXA_v251().pharmacyOrderType("M").administeringProvider({ id: "1" }, { id: "2" });
    expect(rxa).toBeInstanceOf(RXA);
    expect(rxa.encode().split("|")[26]).toBe("M");
    expect(rxa.encode().split("|")[10]).toBe("1~2");
  });
});
