import { test, expect, describe } from "vitest";
import { QAK } from "./QAK.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("QAK field positions", () => {
  test("QAK-1 Query Tag", () => {
    expect(new QAK().queryTag("TAG1").encode().split("|")[1]).toBe("TAG1");
  });

  test("QAK-2 Query Response Status", () => {
    expect(new QAK().queryResponseStatus("OK").encode().split("|")[2]).toBe("OK");
  });
});

describe("QAK parse/encode", () => {
  test("round-trips an acknowledgment", () => {
    const input = "QAK|TAG1|OK";
    const result = QAK.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not QAK", () => {
    expect(QAK.parse("QRD|TAG1", DEFAULT_ENCODING).ok).toBe(false);
  });
});
