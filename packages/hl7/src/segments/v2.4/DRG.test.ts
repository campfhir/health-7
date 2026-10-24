// Field-position tests for the DRG v2.4 override. These fields were moved here from
// v2.3 DRG; they are not defined in the v2.3 table.
import { test, expect, describe } from "vitest";
import { DRG } from "./DRG.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: DRG, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("DRG v2.4 field positions", () => {
  test("DRG-11 Drg Transfer Type", () => {
    assertField(new DRG().drgTransferType(SENTINEL), 11);
  });
});
