// Field-position tests for the MFE v2.4 override. These fields were moved here from
// v2.3 MFE; they are not defined in the v2.3 table.
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

describe("MFE v2.4 field positions", () => {
  test("MFE-5 Primary Key Value Type", () => {
    assertField(new MFE().primaryKeyValueType(SENTINEL), 5);
  });
});
