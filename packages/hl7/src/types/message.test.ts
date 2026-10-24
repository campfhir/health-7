import { test, expect } from "vitest";
import { HL7Message } from "./message.ts";
import { BaseSegment } from "./segment.ts";
import { DEFAULT_ENCODING, type EncodingCharacters } from "./encoding.ts";

class TestSegment extends BaseSegment {
  name = "TST";
}

test("HL7Message constructor with default encoding", () => {
  const message = new HL7Message();

  expect(message.encoding).toEqual(DEFAULT_ENCODING);
  expect(message.segments.length).toBe(0);
});

test("HL7Message constructor with custom encoding", () => {
  const customEncoding: EncodingCharacters = {
    fieldSeparator: "|",
    componentSeparator: "^",
    repetitionSeparator: "~",
    escapeCharacter: "/",
    subComponentSeparator: "&",
  };

  const message = new HL7Message(customEncoding);

  expect(message.encoding.escapeCharacter).toBe("/");
});

test("HL7Message addSegment", () => {
  const message = new HL7Message();
  const segment1 = new TestSegment();
  segment1.fields = [segment1["createField"]("value1")];

  const segment2 = new TestSegment();
  segment2.fields = [segment2["createField"]("value2")];

  message.addSegment(segment1);
  message.addSegment(segment2);

  expect(message.segments.length).toBe(2);
  expect(message.segments[0]).toBe(segment1);
  expect(message.segments[1]).toBe(segment2);
});

test("HL7Message encode with single segment", () => {
  const message = new HL7Message();
  const segment = new TestSegment();
  segment.fields = [segment["createField"]("value1")];

  message.addSegment(segment);
  const encoded = message.encode();

  expect(encoded).toBe("TST|value1");
});

test("HL7Message encode with multiple segments", () => {
  const message = new HL7Message();

  const segment1 = new TestSegment();
  segment1.fields = [segment1["createField"]("value1")];

  const segment2 = new TestSegment();
  segment2.fields = [segment2["createField"]("value2")];

  message.addSegment(segment1);
  message.addSegment(segment2);

  const encoded = message.encode();

  expect(encoded).toBe("TST|value1\rTST|value2");
});

test("HL7Message encode separates segments with carriage return", () => {
  const message = new HL7Message();

  for (let i = 0; i < 3; i++) {
    const segment = new TestSegment();
    segment.fields = [segment["createField"](`value${i}`)];
    message.addSegment(segment);
  }

  const encoded = message.encode();
  const segments = encoded.split("\r");

  expect(segments.length).toBe(3);
  expect(segments[0]).toBe("TST|value0");
  expect(segments[1]).toBe("TST|value1");
  expect(segments[2]).toBe("TST|value2");
});
