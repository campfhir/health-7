// Field-position tests for the EVN v2.4 override. These fields were moved here from
// v2.3 EVN; they are not defined in the v2.3 table.
import { test, expect, describe } from "vitest";
import { EVN } from "./EVN.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: EVN, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("EVN v2.4 field positions", () => {
  test("EVN-7 Event Facility", () => {
    assertField(new EVN().eventFacility({ namespaceId: SENTINEL, universalId: "", universalIdType: "" }), 7);
  });
});
