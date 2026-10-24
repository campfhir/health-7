import { test, expect, describe } from "vitest";
import { FHS } from "./FHS.ts";

describe("FHS field positions", () => {
  // FHS-n is the n-th pipe-separated part, counting FHS-1 (the separator) as implicit.
  test.each([
    ["FHS-3 Sending Application", () => new FHS().sendingApplication("S1"), 2, "S1"],
    ["FHS-4 Sending Facility", () => new FHS().sendingFacility("S2"), 3, "S2"],
    ["FHS-5 Receiving Application", () => new FHS().receivingApplication("R1"), 4, "R1"],
    ["FHS-6 Receiving Facility", () => new FHS().receivingFacility("R2"), 5, "R2"],
    ["FHS-7 Creation Date/Time", () => new FHS().creationDateTime("20250101120000"), 6, "20250101120000"],
    ["FHS-8 Security", () => new FHS().security("SEC"), 7, "SEC"],
    ["FHS-9 Name/ID", () => new FHS().nameId("FILE1"), 8, "FILE1"],
    ["FHS-10 File Header Comment", () => new FHS().comment("COM"), 9, "COM"],
    ["FHS-11 File Control ID", () => new FHS().fileControlId("F1"), 10, "F1"],
    ["FHS-12 Reference File Control ID", () => new FHS().referenceFileControlId("F0"), 11, "F0"],
  ])("%s", (_name, build, index, expected) => {
    const parts = build().encode().split("|");
    expect(parts[index]).toBe(expected);
  });

  test("encoding characters are written into FHS-2", () => {
    expect(new FHS().encode().split("|")[1]).toBe("^~\\&");
  });
});

describe("FHS parse/encode", () => {
  test("round-trips a header with all fields", () => {
    const input = "FHS|^~\\&|APP|FAC|RAPP|RFAC|20250101120000|SEC|FILE1|COMMENT|FCTRL01|FREF01";
    const result = FHS.parse(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not FHS", () => {
    const result = FHS.parse("BHS|^~\\&|X");
    expect(result.ok).toBe(false);
  });
});
