// Field-position tests for the NSC v2.4 override. NSC-9 is a v2.4 addition; the v2.3 table
// has eight fields.
import { test, expect, describe } from "vitest";
import { NSC } from "./NSC.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("NSC v2.4 field positions", () => {
  test("NSC-9 New Facility", () => {
    expect(new NSC().newFacility("FAC1").encode().split("|")[9]).toBe("FAC1");
  });

  test("round-trips a nine-field NSC", () => {
    const input = "NSC|ID1|CPU1|FS1|APP1|FAC1|CPU2|FS2|APP2|FAC2";
    const result = NSC.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });
});
