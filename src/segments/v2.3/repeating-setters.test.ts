// Repeating setters accept either an array of repetitions or spread arguments (Repeated<T>).
import { test, expect, describe } from "vitest";
import { BTS } from "./BTS.ts";
import { NK1 } from "./NK1.ts";
import { CM0 } from "./CM0.ts";
import { ARQ } from "./ARQ.ts";

describe("repeating setters accept an array or spread arguments", () => {
  test("hand-written string repetitions", () => {
    expect(new BTS().batchTotals(["10", "20"]).encode().split("|")[3]).toBe("10~20");
    expect(new BTS().batchTotals("10", "20").encode().split("|")[3]).toBe("10~20");
  });

  test("hand-written composite repetitions", () => {
    const array = new NK1().maritalStatus([{ code: "C1" }, { code: "C2", text: "C3" }]).encode().split("|");
    const spread = new NK1().maritalStatus({ code: "C1" }, { code: "C2", text: "C3" }).encode().split("|");
    expect(array[14]).toBe("C1~C2^C3");
    expect(spread[14]).toBe("C1~C2^C3");
  });

  test("generated repetitions", () => {
    expect(new CM0().alternateStudyId(["A^B", "C"]).encode().split("|")[3]).toBe("A^B~C");
    expect(new CM0().alternateStudyId("A^B", "C").encode().split("|")[3]).toBe("A^B~C");
  });
});

describe("composite fields accept a string or the typed object", () => {
  test("a string sets the first component", () => {
    expect(new ARQ().placerContactPerson("DOC1").encode().split("|")[15]).toBe("DOC1");
  });

  test("the typed object sets components in HL7 positions", () => {
    expect(new ARQ().placerContactPerson({ idNumber: "DOC1", familyName: "Smith" }).encode().split("|")[15]).toBe("DOC1^Smith");
  });
});
