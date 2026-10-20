// Field-position tests for the AIS v2.4 override. These fields were moved here from
// v2.3 AIS; they are not defined in the v2.3 table.
import { test, expect, describe } from "vitest";
import { AIS } from "./AIS.ts";

describe("AIS v2.4 field positions", () => {
  test("AIS-11 Placer Supplemental Info", () => {
    const parts = new AIS().placerSupplementalInfo({ code: "C1", text: "C2" }).encode().split("|");
    expect(parts[11]).toBe("C1^C2");
  });

  test("AIS-12 Filler Supplemental Info", () => {
    const parts = new AIS().fillerSupplementalInfo({ code: "C1", text: "C2" }).encode().split("|");
    expect(parts[12]).toBe("C1^C2");
  });
});
