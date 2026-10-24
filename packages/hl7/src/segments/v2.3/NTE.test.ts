// Field-position tests for the NTE segment (HL7 v2.3). Hand-written: repeating setters
// take spread arguments, which the generator does not model.
import { test, expect, describe } from "vitest";
import { NTE } from "./NTE.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: NTE, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("NTE field positions", () => {
  test("NTE-1 Set ID", () => {
    assertField(new NTE().setId(SENTINEL), 1);
  });

  test("NTE-2 Source Of Comment", () => {
    assertField(new NTE().sourceOfComment(SENTINEL), 2);
  });

  test("NTE-3 Comment", () => {
    assertField(new NTE().comment(SENTINEL), 3);
  });
});
