// Field-position tests for the ACC v2.4 override. The fields below
// were moved here from v2.3 ACC (the field exists only from v2.4 onward).
import { test, expect, describe } from "vitest";
import { ACC } from "./ACC.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: ACC, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("ACC v2.4 field positions", () => {
  test("ACC-7 Entered By", () => {
    const parts = new ACC().enteredBy({ id: "C1", familyName: "C2", givenName: "C3" }).encode().split("|");
    expect(parts[7]).toBe("C1^C2^C3");
  });

  test("ACC-8 Accident Description", () => {
    assertField(new ACC().accidentDescription(SENTINEL), 8);
  });

  test("ACC-9 Brought In By", () => {
    assertField(new ACC().broughtInBy(SENTINEL), 9);
  });

  test("ACC-10 Police Notified", () => {
    assertField(new ACC().policeNotified(SENTINEL), 10);
  });

  test("ACC v2.4 has no ACC-11 setter", () => {
    expect("accidentAddress" in new ACC()).toBe(false);
  });

  test("round-trips a 10-field ACC", () => {
    const input = "ACC|20250101|CODE^Text|LOC|STATE|Y|N|ID^Smith^John|DESC|BRING|Y";
    const result = ACC.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });
});
