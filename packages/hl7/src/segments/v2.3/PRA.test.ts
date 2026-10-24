// Field-position tests for the PRA segment (HL7 v2.3). Hand-written: PRA-7 repeats,
// which the generator does not model.
import { test, expect, describe } from "vitest";
import { PRA } from "./PRA.ts";

const SENTINEL = "ZQXP0S";

// Assert the sentinel encodes into field `splitIndex` (first component, first
// subcomponent) and nowhere else.
function assertField(seg: PRA, splitIndex: number): void {
  const parts = seg.encode().split("|");
  const value = parts[splitIndex]?.split("^")[0]?.split("&")[0];
  expect(value).toBe(SENTINEL);
  expect(parts.filter((p) => p.includes(SENTINEL)).length).toBe(1);
}

describe("PRA field positions", () => {
  test("PRA-1 Primary Key Value", () => {
    const parts = new PRA().primaryKeyValue({ identifier: "C1", text: "C2", codingSystem: "C3" }).encode().split("|");
    expect(parts[1]).toBe("C1^C2^C3");
  });

  test("PRA-2 Practitioner Group", () => {
    const parts = new PRA().practitionerGroup({ identifier: "C1", text: "C2" }).encode().split("|");
    expect(parts[2]).toBe("C1^C2");
  });

  test("PRA-3 Practitioner Category", () => {
    assertField(new PRA().practitionerCategory(SENTINEL), 3);
  });

  test("PRA-4 Provider Billing", () => {
    assertField(new PRA().providerBilling(SENTINEL), 4);
  });

  test("PRA-5 Specialty", () => {
    assertField(new PRA().specialty({ specialtyName: SENTINEL, governingBoard: "", eligibleOrCertified: "", dateOfCertification: "" }), 5);
  });

  test("PRA-6 Practitioner ID Numbers", () => {
    assertField(new PRA().practitionerIdNumbers({ idNumber: SENTINEL, typeOfIdNumber: "", stateOrQualifying: "", expireDate: "" }), 6);
  });

  test("PRA-7 Privileges repeats", () => {
    const parts = new PRA().privileges("A^B", "C").encode().split("|");
    expect(parts[7]).toBe("A^B~C");
  });
});
