import { test, expect, describe } from "vitest";
import { ADD } from "./ADD.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("ADD field positions", () => {
  test("ADD-1 Continuation Pointer", () => {
    expect(new ADD().addendumContinuationPointer("PTR123").encode().split("|")[1]).toBe("PTR123");
  });
});

describe("ADD parse/encode", () => {
  test("round-trips a continuation pointer", () => {
    const input = "ADD|PTR123";
    const result = ADD.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not ADD", () => {
    expect(ADD.parse("DSP|PTR", DEFAULT_ENCODING).ok).toBe(false);
  });
});
