import { test } from "node:test";
import assert from "node:assert";
import { HL7Message } from "./message";
import { BaseSegment } from "./segment";
import { DEFAULT_ENCODING, EncodingCharacters } from "./encoding";

class TestSegment extends BaseSegment {
  name = "TST";
}

test("HL7Message constructor with default encoding", () => {
  const message = new HL7Message();

  assert.deepStrictEqual(message.encoding, DEFAULT_ENCODING);
  assert.strictEqual(message.segments.length, 0);
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

  assert.strictEqual(message.encoding.escapeCharacter, "/");
});

test("HL7Message addSegment", () => {
  const message = new HL7Message();
  const segment1 = new TestSegment();
  segment1.fields = [segment1["createField"]("value1")];

  const segment2 = new TestSegment();
  segment2.fields = [segment2["createField"]("value2")];

  message.addSegment(segment1);
  message.addSegment(segment2);

  assert.strictEqual(message.segments.length, 2);
  assert.strictEqual(message.segments[0], segment1);
  assert.strictEqual(message.segments[1], segment2);
});

test("HL7Message encode with single segment", () => {
  const message = new HL7Message();
  const segment = new TestSegment();
  segment.fields = [segment["createField"]("value1")];

  message.addSegment(segment);
  const encoded = message.encode();

  assert.strictEqual(encoded, "TST|value1");
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

  assert.strictEqual(encoded, "TST|value1\rTST|value2");
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

  assert.strictEqual(segments.length, 3);
  assert.strictEqual(segments[0], "TST|value0");
  assert.strictEqual(segments[1], "TST|value1");
  assert.strictEqual(segments[2], "TST|value2");
});
