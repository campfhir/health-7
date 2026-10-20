import { test, expect, describe } from "vitest";
import { DSP } from "./DSP.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("DSP field positions", () => {
  test("DSP-1 Set ID", () => {
    expect(new DSP().setId("1").encode().split("|")[1]).toBe("1");
  });

  test("DSP-2 Display Level", () => {
    expect(new DSP().displayLevel("2").encode().split("|")[2]).toBe("2");
  });

  test("DSP-3 Data Line", () => {
    expect(new DSP().dataLine("LINE TEXT").encode().split("|")[3]).toBe("LINE TEXT");
  });

  test("DSP-4 Logical Break Point", () => {
    expect(new DSP().logicalBreakPoint("BP").encode().split("|")[4]).toBe("BP");
  });

  test("DSP-5 Result ID", () => {
    expect(new DSP().resultId("R1").encode().split("|")[5]).toBe("R1");
  });
});

describe("DSP parse/encode", () => {
  test("round-trips a display line", () => {
    const input = "DSP|1|2|LINE TEXT|BP|R1";
    const result = DSP.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not DSP", () => {
    expect(DSP.parse("DSC|1", DEFAULT_ENCODING).ok).toBe(false);
  });
});
