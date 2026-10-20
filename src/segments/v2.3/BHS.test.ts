import { test, expect, describe } from "vitest";
import { BHS } from "./BHS.ts";

describe("BHS field positions", () => {
  // BHS-n is the n-th pipe-separated part, counting BHS-1 (the separator) as implicit.
  test.each([
    ["BHS-3 Sending Application", () => new BHS().sendingApplication("S1"), 2, "S1"],
    ["BHS-4 Sending Facility", () => new BHS().sendingFacility("S2"), 3, "S2"],
    ["BHS-5 Receiving Application", () => new BHS().receivingApplication("R1"), 4, "R1"],
    ["BHS-6 Receiving Facility", () => new BHS().receivingFacility("R2"), 5, "R2"],
    ["BHS-7 Creation Date/Time", () => new BHS().creationDateTime("20250101120000"), 6, "20250101120000"],
    ["BHS-8 Security", () => new BHS().security("SEC"), 7, "SEC"],
    ["BHS-9 Name/ID/Type", () => new BHS().nameIdType("NAME"), 8, "NAME"],
    ["BHS-10 Comment", () => new BHS().comment("COM"), 9, "COM"],
    ["BHS-11 Batch Control ID", () => new BHS().batchControlId("B1"), 10, "B1"],
    ["BHS-12 Reference Batch Control ID", () => new BHS().referenceBatchControlId("B0"), 11, "B0"],
  ])("%s", (_name, build, index, expected) => {
    const parts = build().encode().split("|");
    expect(parts[index]).toBe(expected);
  });

  test("encoding characters are written into BHS-2", () => {
    expect(new BHS().encode().split("|")[1]).toBe("^~\\&");
  });
});

describe("BHS parse/encode", () => {
  test("round-trips a header with all fields", () => {
    const input = "BHS|^~\\&|APP|FAC|RAPP|RFAC|20250101120000|SEC|NAME|COMMENT|CTRL01|REF01";
    const result = BHS.parse(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not BHS", () => {
    const result = BHS.parse("BTS|^~\\&|X");
    expect(result.ok).toBe(false);
  });
});
