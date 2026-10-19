// Field-position tests for the PRA v2.4 override. PRA-8 is a v2.4 field.
import { test, expect, describe } from "vitest";
import { PRA } from "./PRA.ts";

const SENTINEL = "ZQXP0S";

describe("PRA v2.4 field positions", () => {
  test("PRA-8 Date Entered Practice", () => {
    const parts = new PRA().dateEnteredPractice(SENTINEL).encode().split("|");
    expect(parts[8]).toBe(SENTINEL);
  });
});
