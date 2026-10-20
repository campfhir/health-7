import { test, expect, describe } from "vitest";
import { BTS } from "./BTS.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("BTS field positions", () => {
  test("BTS-1 Batch Message Count", () => {
    expect(new BTS().messageCount("5").encode().split("|")[1]).toBe("5");
  });

  test("BTS-2 Batch Comment", () => {
    expect(new BTS().comment("COM").encode().split("|")[2]).toBe("COM");
  });

  test("BTS-3 Batch Totals repeat with the repetition separator", () => {
    expect(new BTS().batchTotals("10", "20").encode().split("|")[3]).toBe("10~20");
  });
});

describe("BTS parse/encode", () => {
  test("round-trips a trailer", () => {
    const input = "BTS|5|COM|10~20";
    const result = BTS.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not BTS", () => {
    expect(BTS.parse("FTS|5", DEFAULT_ENCODING).ok).toBe(false);
  });
});
