// Field-position tests for the NTE v2.4 override. These fields were moved here from
// v2.3 NTE; they are not defined in the v2.3 table.
import { test, expect, describe } from "vitest";
import { NTE } from "./NTE.ts";

describe("NTE v2.4 field positions", () => {
  test("NTE-4 Comment Type", () => {
    const parts = new NTE().commentType({ identifier: "C1", text: "C2", codingSystem: "C3" }).encode().split("|");
    expect(parts[4]).toBe("C1^C2^C3");
  });
});
