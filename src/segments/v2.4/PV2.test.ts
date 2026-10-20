// Field-position tests for the PV2 v2.4 override. These fields were moved here from
// v2.3 PV2; they are not defined in the v2.3 table.
import { test, expect, describe } from "vitest";
import { PV2 } from "./PV2.ts";

describe("PV2 v2.4 field positions", () => {
  test("PV2-38 Mode Of Arrival Code", () => {
    const parts = new PV2().modeOfArrivalCode({ code: "C1", text: "C2" }).encode().split("|");
    expect(parts[38]).toBe("C1^C2");
  });
});
