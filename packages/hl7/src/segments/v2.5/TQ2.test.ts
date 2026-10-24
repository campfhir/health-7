// Position and composite tests for TQ2 (HL7 v2.5, 10 fields).
import { describe, test, expect } from "vitest";
import { TQ2 } from "./TQ2.ts";

describe("TQ2", () => {
  const cases: [number, (s: TQ2) => TQ2, string][] = [
    [1, (s) => s.setId("1"), "1"],
    [2, (s) => s.sequenceResultsFlag("S"), "S"],
    [3, (s) => s.relatedPlacerNumber({ entityIdentifier: "P1", namespaceId: "NS" }, "raw"), "P1^NS~raw"],
    [4, (s) => s.relatedFillerNumber({ entityIdentifier: "F1" }), "F1"],
    [5, (s) => s.relatedPlacerGroupNumber({ entityIdentifier: "G1", universalId: "U", universalIdType: "ISO" }), "G1^^U^ISO"],
    [6, (s) => s.sequenceConditionCode("EE"), "EE"],
    [7, (s) => s.cyclicEntryExitIndicator("E"), "E"],
    [8, (s) => s.sequenceConditionTimeInterval({ value: "30", units: "min" }), "30^min"],
    [9, (s) => s.cyclicGroupMaximumNumberOfRepeats("5"), "5"],
    [10, (s) => s.specialServiceRequestRelationship("N"), "N"],
  ];

  test.each(cases)("TQ2-%i", (n, set, expected) => {
    const parts = set(new TQ2()).encode().split("|");
    expect(parts[n]).toBe(expected);
    expect(parts.filter((p, i) => i !== 0 && i !== n && p !== "")).toEqual([]);
  });

  test("covers every field of the segment", () => {
    expect(cases.map(([n]) => n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
