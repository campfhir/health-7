// Field-position tests for the PD1 v2.4 override. The fields below
// were moved here from v2.3 PD1 (the field exists only from v2.4 onward).
import { test, expect, describe } from "vitest";
import { PD1 } from "./PD1.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: PD1, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("PD1 v2.4 field positions", () => {
  test("PD1-13 Protection Indicator Effective Date", () => {
    assertField(new PD1().protectionIndicatorEffectiveDate(SENTINEL), 13);
  });

  test("PD1-14 Place Of Worship", () => {
    assertField(new PD1().placeOfWorship(SENTINEL), 14);
  });

  test("PD1-15 Advance Directive Code", () => {
    const parts = new PD1().advanceDirectiveCode({ code: "C1", text: "C2", codingSystem: "C3" }).encode().split("|");
    expect(parts[15]).toBe("C1^C2^C3");
  });

  test("PD1-16 Immunization Registry Status", () => {
    assertField(new PD1().immunizationRegistryStatus(SENTINEL), 16);
  });

  test("PD1-17 Immunization Registry Status Effective Date", () => {
    assertField(new PD1().immunizationRegistryStatusEffectiveDate(SENTINEL), 17);
  });

  test("PD1-18 Publicity Code Effective Date", () => {
    assertField(new PD1().publicityCodeEffectiveDate(SENTINEL), 18);
  });

  test("PD1-19 Military Branch", () => {
    assertField(new PD1().militaryBranch(SENTINEL), 19);
  });

  test("PD1-20 Military Rank Grade", () => {
    assertField(new PD1().militaryRankGrade(SENTINEL), 20);
  });

  test("PD1-21 Military Status", () => {
    assertField(new PD1().militaryStatus(SENTINEL), 21);
  });

});
