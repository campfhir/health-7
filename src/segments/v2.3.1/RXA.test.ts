// RXA in HL7 v2.3.1: RXA-10 Administering Provider repeats.
import { describe, test, expect } from "vitest";
import { RXA } from "./RXA.ts";
import { RXA as RXA_v23 } from "../v2.3/RXA.ts";

describe("RXA (v2.3.1)", () => {
  test("extends the v2.3 segment", () => {
    expect(new RXA()).toBeInstanceOf(RXA_v23);
  });

  test("RXA-10 repeats", () => {
    const rxa = new RXA().administeringProvider({ idNumber: "1", familyName: "A" }, { id: "2", givenName: "B" }, "raw");
    expect(rxa.encode().split("|")[10]).toBe("1^A~2^^B~raw");
  });

  test("a single provider still encodes as before", () => {
    expect(new RXA().administeringProvider({ id: "P1", familyName: "Doe" }).encode().split("|")[10]).toBe("P1^Doe");
  });
});
