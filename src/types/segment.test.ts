import { test, expect } from "vitest";
import { BaseSegment } from "./segment.ts";
import { DEFAULT_ENCODING } from "./encoding.ts";

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

test("BaseSegment createComponentsField preserves interior gaps (CX-style)", () => {
  const segment = new TestSegment();
  // CX: id at .1, assigning authority at .4, identifier type at .5.
  const field = segment["createComponentsField"](["id", undefined, undefined, "AUTH", "MR"]);
  const encoded = segment["encodeField"](field, DEFAULT_ENCODING);
  expect(encoded).toBe("id^^^AUTH^MR");
});

test("BaseSegment createComponentsField trims trailing empties", () => {
  const segment = new TestSegment();
  const field = segment["createComponentsField"](["only", undefined, undefined]);
  expect(segment["encodeField"](field, DEFAULT_ENCODING)).toBe("only");
});

test("BaseSegment createComponentsField keeps interior gap, trims trailing (XPN-style)", () => {
  const segment = new TestSegment();
  // family at .1, suffix at .4, no given/middle, no prefix.
  const field = segment["createComponentsField"](["Doe", "", "", "Jr", ""]);
  expect(segment["encodeField"](field, DEFAULT_ENCODING)).toBe("Doe^^^Jr");
});

test("BaseSegment createComponentsField encodes coded element as components (CE)", () => {
  const segment = new TestSegment();
  const field = segment["createComponentsField"](["A", "B", "C"]);
  // components (^), NOT subcomponents (&)
  expect(segment["encodeField"](field, DEFAULT_ENCODING)).toBe("A^B^C");
});

test("BaseSegment createComponentsField all-empty yields empty field", () => {
  const segment = new TestSegment();
  const field = segment["createComponentsField"]([undefined, ""]);
  expect(segment["encodeField"](field, DEFAULT_ENCODING)).toBe("");
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
