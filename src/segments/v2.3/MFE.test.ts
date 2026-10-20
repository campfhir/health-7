// Field-position tests for the MFE segment (HL7 v2.3). Hand-written: repeating setters
// take spread arguments, which the generator does not model.
import { test, expect, describe } from "vitest";
import { MFE } from "./MFE.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: MFE, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("MFE field positions", () => {
  test("MFE-1 Record Level Event Code", () => {
    assertField(new MFE().recordLevelEventCode(SENTINEL), 1);
  });

  test("MFE-2 Mfn Control ID", () => {
    assertField(new MFE().mfnControlId(SENTINEL), 2);
  });

  test("MFE-3 Effective Date Time", () => {
    assertField(new MFE().effectiveDateTime(SENTINEL), 3);
  });

  test("MFE-4 Primary Key Value", () => {
    assertField(new MFE().primaryKeyValue(SENTINEL), 4);
  });
});
