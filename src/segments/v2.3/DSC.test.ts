import { test, expect, describe } from "vitest";
import { DSC } from "./DSC.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("DSC field positions", () => {
  test("DSC-1 Continuation Pointer", () => {
    expect(new DSC().continuationPointer("PTR123").encode().split("|")[1]).toBe("PTR123");
  });
});

describe("DSC parse/encode", () => {
  test("round-trips a continuation pointer", () => {
    const input = "DSC|PTR123";
    const result = DSC.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not DSC", () => {
    expect(DSC.parse("DSP|PTR", DEFAULT_ENCODING).ok).toBe(false);
  });
});
