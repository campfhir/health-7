// Field-position tests for the ODT segment (HL7 v2.3). Hand-written: repeating setters
// take spread arguments, which the generator does not model.
import { test, expect, describe } from "vitest";
import { ODT } from "./ODT.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: ODT, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("ODT field positions", () => {
  test("ODT-1 Tray Type", () => {
    const parts = new ODT().trayType({ identifier: "C1", text: "C2", nameOfCodingSystem: "C3", alternateIdentifier: "C4", alternateText: "C5", nameOfAlternateCodingSystem: "C6" }).encode().split("|");
    expect(parts[1]).toBe("C1^C2^C3^C4^C5^C6");
  });

  test("ODT-2 Service Period", () => {
    const parts = new ODT().servicePeriod({ identifier: "C1", text: "C2", nameOfCodingSystem: "C3", alternateIdentifier: "C4", alternateText: "C5", nameOfAlternateCodingSystem: "C6" }).encode().split("|");
    expect(parts[2]).toBe("C1^C2^C3^C4^C5^C6");
  });

  test("ODT-3 Text Instruction", () => {
    assertField(new ODT().textInstruction(SENTINEL), 3);
  });
});
