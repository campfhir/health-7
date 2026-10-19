// Field-position tests for the ODS segment (HL7 v2.3). Hand-written: repeating setters
// take spread arguments, which the generator does not model.
import { test, expect, describe } from "vitest";
import { ODS } from "./ODS.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: ODS, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("ODS field positions", () => {
  test("ODS-1 Type", () => {
    assertField(new ODS().type(SENTINEL), 1);
  });

  test("ODS-2 Service Period", () => {
    const parts = new ODS().servicePeriod({ identifier: "C1", text: "C2", nameOfCodingSystem: "C3", alternateIdentifier: "C4", alternateText: "C5", nameOfAlternateCodingSystem: "C6" }).encode().split("|");
    expect(parts[2]).toBe("C1^C2^C3^C4^C5^C6");
  });

  test("ODS-3 Diet Supplement Or Preference Code", () => {
    const parts = new ODS().dietSupplementOrPreferenceCode({ identifier: "C1", text: "C2", nameOfCodingSystem: "C3", alternateIdentifier: "C4", alternateText: "C5", nameOfAlternateCodingSystem: "C6" }).encode().split("|");
    expect(parts[3]).toBe("C1^C2^C3^C4^C5^C6");
  });

  test("ODS-4 Text Instruction", () => {
    assertField(new ODS().textInstruction(SENTINEL), 4);
  });
});
