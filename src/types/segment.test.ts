import { test } from "node:test";
import assert from "node:assert";
import { BaseSegment, Field, Component } from "./segment";
import { DEFAULT_ENCODING } from "./encoding";

class TestSegment extends BaseSegment {
  name = "TST";
}

test("BaseSegment createField with string", () => {
  const segment = new TestSegment();
  const field = segment["createField"]("test value");

  assert.strictEqual(field.components.length, 1);
  assert.strictEqual(field.components[0].subComponents.length, 1);
  assert.strictEqual(field.components[0].subComponents[0], "test value");
});

test("BaseSegment createField with string array (components)", () => {
  const segment = new TestSegment();
  const field = segment["createField"](["comp1", "comp2", "comp3"]);

  assert.strictEqual(field.components.length, 3);
  assert.strictEqual(field.components[0].subComponents[0], "comp1");
  assert.strictEqual(field.components[1].subComponents[0], "comp2");
  assert.strictEqual(field.components[2].subComponents[0], "comp3");
});

test("BaseSegment createField with 2D string array (components with subcomponents)", () => {
  const segment = new TestSegment();
  const field = segment["createField"]([["sub1", "sub2"], ["sub3"]]);

  assert.strictEqual(field.components.length, 2);
  assert.strictEqual(field.components[0].subComponents.length, 2);
  assert.strictEqual(field.components[0].subComponents[0], "sub1");
  assert.strictEqual(field.components[0].subComponents[1], "sub2");
  assert.strictEqual(field.components[1].subComponents[0], "sub3");
});

test("BaseSegment createEmptyField", () => {
  const segment = new TestSegment();
  const field = segment["createEmptyField"]();

  assert.strictEqual(field.components.length, 1);
  assert.strictEqual(field.components[0].subComponents.length, 1);
  assert.strictEqual(field.components[0].subComponents[0], "");
});

test("BaseSegment encode with single field", () => {
  const segment = new TestSegment();
  segment.fields = [segment["createField"]("value1")];

  const encoded = segment.encode();
  assert.strictEqual(encoded, "TST|value1");
});

test("BaseSegment encode with multiple fields", () => {
  const segment = new TestSegment();
  segment.fields = [
    segment["createField"]("value1"),
    segment["createField"]("value2"),
    segment["createField"](["comp1", "comp2"]),
  ];

  const encoded = segment.encode();
  assert.strictEqual(encoded, "TST|value1|value2|comp1^comp2");
});

test("BaseSegment encode with subcomponents", () => {
  const segment = new TestSegment();
  segment.fields = [segment["createField"]([["sub1", "sub2"], ["sub3"]])];

  const encoded = segment.encode(DEFAULT_ENCODING);
  assert.strictEqual(encoded, "TST|sub1&sub2^sub3");
});

test("BaseSegment encode with empty fields", () => {
  const segment = new TestSegment();
  segment.fields = [
    segment["createField"]("value1"),
    segment["createEmptyField"](),
    segment["createField"]("value3"),
  ];

  const encoded = segment.encode();
  assert.strictEqual(encoded, "TST|value1||value3");
});
