import { test, expect } from "vitest";
import assert from "node:assert";
import { BaseSegment, Field, Component } from "./segment";
import { DEFAULT_ENCODING } from "./encoding";

class TestSegment extends BaseSegment {
  name = "TST";
}

test("BaseSegment createField with string", () => {
  const segment = new TestSegment();
  const field = segment["createField"]("test value");

  expect(field.components.length).toBe(1);
  expect(field.components[0].subComponents.length).toBe(1);
  expect(field.components[0].subComponents[0]).toBe("test value");
});

test("BaseSegment createField with string array (components)", () => {
  const segment = new TestSegment();
  const field = segment["createField"](["comp1", "comp2", "comp3"]);

  expect(field.components.length).toBe(3);
  expect(field.components[0].subComponents[0]).toBe("comp1");
  expect(field.components[1].subComponents[0]).toBe("comp2");
  expect(field.components[2].subComponents[0]).toBe("comp3");
});

test("BaseSegment createField with 2D string array (components with subcomponents)", () => {
  const segment = new TestSegment();
  const field = segment["createField"]([["sub1", "sub2"], ["sub3"]]);

  expect(field.components.length).toBe(2);
  expect(field.components[0].subComponents.length).toBe(2);
  expect(field.components[0].subComponents[0]).toBe("sub1");
  expect(field.components[0].subComponents[1]).toBe("sub2");
  expect(field.components[1].subComponents[0]).toBe("sub3");
});

test("BaseSegment createEmptyField", () => {
  const segment = new TestSegment();
  const field = segment["createEmptyField"]();

  expect(field.components.length).toBe(1);
  expect(field.components[0].subComponents.length).toBe(1);
  expect(field.components[0].subComponents[0]).toBe("");
});

test("BaseSegment encode with single field", () => {
  const segment = new TestSegment();
  segment.fields = [segment["createField"]("value1")];

  const encoded = segment.encode();
  expect(encoded).toBe("TST|value1");
});

test("BaseSegment encode with multiple fields", () => {
  const segment = new TestSegment();
  segment.fields = [
    segment["createField"]("value1"),
    segment["createField"]("value2"),
    segment["createField"](["comp1", "comp2"]),
  ];

  const encoded = segment.encode();
  expect(encoded).toBe("TST|value1|value2|comp1^comp2");
});

test("BaseSegment encode with subcomponents", () => {
  const segment = new TestSegment();
  segment.fields = [segment["createField"]([["sub1", "sub2"], ["sub3"]])];

  const encoded = segment.encode(DEFAULT_ENCODING);
  expect(encoded).toBe("TST|sub1&sub2^sub3");
});

test("BaseSegment encode with empty fields", () => {
  const segment = new TestSegment();
  segment.fields = [
    segment["createField"]("value1"),
    segment["createEmptyField"](),
    segment["createField"]("value3"),
  ];

  const encoded = segment.encode();
  expect(encoded).toBe("TST|value1||value3");
});
