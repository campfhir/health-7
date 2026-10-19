// Field-position tests for the ACC v2.5 override. The fields below
// were moved here from v2.3 ACC (the field exists only from v2.5 onward).
import { test, expect, describe } from "vitest";
import { ACC } from "./ACC.ts";

describe("ACC v2.5 field positions", () => {
  test("ACC-11 Accident Address", () => {
    const parts = new ACC().accidentAddress({ street: "C1", city: "C2", state: "C3", zip: "C4" }).encode().split("|");
    expect(parts[11]).toBe("C1^^C2^C3^C4");
  });

  test("keeps the v2.4 ACC-7 setter", () => {
    expect(new ACC().enteredBy({ id: "C1" }).encode().split("|")[7]).toBe("C1^^");
  });
});
