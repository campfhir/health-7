// Field-position tests for the ROL v2.4 override. The fields below
// were moved here from v2.3 ROL (the field exists only from v2.4 onward).
import { test, expect, describe } from "vitest";
import { ROL } from "./ROL.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: ROL, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("ROL v2.4 field positions", () => {
  test("ROL-9 Provider Type", () => {
    const parts = new ROL().providerType({ code: "C1", text: "C2" }).encode().split("|");
    expect(parts[9]).toBe("C1^C2");
  });

  test("ROL-10 Organization Unit Type", () => {
    const parts = new ROL().organizationUnitType({ code: "C1", text: "C2" }).encode().split("|");
    expect(parts[10]).toBe("C1^C2");
  });

  test("ROL-11 Office Address", () => {
    const parts = new ROL().officeAddress({ street: "C1", city: "C2", state: "C3", zip: "C4" }).encode().split("|");
    expect(parts[11]).toBe("C1^^C2^C3^C4");
  });

  test("ROL-12 Phone", () => {
    assertField(new ROL().phone(SENTINEL), 12);
  });

  test("round-trips a 12-field ROL", () => {
    const input = "ROL|EI1|UP|CE1^Role|XCN1^Doc|20250101|20250102|CE2|CE3|CE4|CE5|XAD1|XTN1";
    const result = ROL.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });
});
