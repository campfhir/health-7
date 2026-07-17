import { test, expect, describe } from "vitest";
import { PV1 } from "./PV1.ts";

// Field-position tests. `encode()` emits `PV1|<field1>|<field2>|...`, so after
// splitting on the field separator, PV1-N lives at parts[N] (parts[0] is the
// segment name). Asserting the exact index — not just substring presence —
// is what catches off-by-one field-placement bugs.
function fieldOf(pv1: PV1, n: number): string {
  return pv1.encode().split("|")[n] ?? "";
}

describe("PV1 field positions", () => {
  test("PV1-1 Set ID", () => {
    expect(fieldOf(new PV1().setId("1"), 1)).toBe("1");
  });

  test("PV1-2 Patient Class", () => {
    expect(fieldOf(new PV1().patientClass("I"), 2)).toBe("I");
  });

  test("PV1-19 Visit Number", () => {
    const pv1 = new PV1().visitNumber({ value: "V123" });
    expect(fieldOf(pv1, 19)).toBe("V123");
  });

  test("PV1-19 Visit Number places CX components at .1/.4/.5", () => {
    const pv1 = new PV1().visitNumber({ value: "V123", assigningAuthority: "AUTH", identifierType: "MR" });
    // CX.1 ID, CX.4 Assigning Authority, CX.5 Identifier Type Code,
    // with CX.2/CX.3 padded empty.
    expect(fieldOf(pv1, 19)).toBe("V123^^^AUTH^MR");
  });

  test("PV1-44 Admit Date/Time", () => {
    const pv1 = new PV1().admitDateTime("20200101120000");
    expect(fieldOf(pv1, 44)).toBe("20200101120000");
    // must NOT land in the Discharge Date/Time slot (PV1-45)
    expect(fieldOf(pv1, 45)).toBe("");
  });

  test("PV1-45 Discharge Date/Time", () => {
    const pv1 = new PV1().dischargeDateTime("20200105120000");
    expect(fieldOf(pv1, 45)).toBe("20200105120000");
    // must NOT land in PV1-46
    expect(fieldOf(pv1, 46)).toBe("");
  });

  test("Admit and Discharge occupy distinct, correct fields", () => {
    const pv1 = new PV1()
      .admitDateTime("20200101")
      .dischargeDateTime("20200105");
    expect(fieldOf(pv1, 44)).toBe("20200101");
    expect(fieldOf(pv1, 45)).toBe("20200105");
  });
});
