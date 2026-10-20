import { test, expect, describe } from "vitest";
import { FTS } from "./FTS.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("FTS field positions", () => {
  test("FTS-1 File Batch Count", () => {
    expect(new FTS().fileBatchCount("3").encode().split("|")[1]).toBe("3");
  });

  test("FTS-2 File Trailer Comment", () => {
    expect(new FTS().comment("COM").encode().split("|")[2]).toBe("COM");
  });
});

describe("FTS parse/encode", () => {
  test("round-trips a trailer", () => {
    const input = "FTS|3|COM";
    const result = FTS.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not FTS", () => {
    expect(FTS.parse("BTS|3", DEFAULT_ENCODING).ok).toBe(false);
  });
});
