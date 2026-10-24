// RXR in HL7 v2.3 has four fields (RXR-5 arrived in v2.3.1, RXR-6 in v2.5).
import { describe, test, expect } from "vitest";
import { RXR } from "./RXR.ts";

const at = (seg: RXR, n: number) => seg.encode().split("|")[n];

describe("RXR (v2.3)", () => {
  const cases: [number, (s: RXR) => RXR, string][] = [
    [1, (s) => s.route({ identifier: "IM", text: "Intramuscular" }), "IM^Intramuscular"],
    [2, (s) => s.administrationSite({ identifier: "LA" }), "LA"],
    [3, (s) => s.administrationDevice({ identifier: "NDL" }), "NDL"],
    [4, (s) => s.administrationMethod({ identifier: "IP" }), "IP"],
  ];

  test.each(cases)("RXR-%i", (n, set, expected) => {
    const parts = set(new RXR()).encode().split("|");
    expect(parts[n]).toBe(expected);
    expect(parts.filter((p, i) => i !== 0 && i !== n && p !== "")).toEqual([]);
  });

  test("has only the four v2.3 setters", () => {
    const seg = new RXR() as unknown as Record<string, unknown>;
    expect(seg.routingInstruction).toBeUndefined();
    expect(seg.administrationSiteModifier).toBeUndefined();
  });

  test("CE fields carry all six components", () => {
    const rxr = new RXR().route({
      identifier: "A", text: "B", nameOfCodingSystem: "C", alternateIdentifier: "D", alternateText: "E", nameOfAlternateCodingSystem: "F",
    });
    expect(at(rxr, 1)).toBe("A^B^C^D^E^F");
  });

  test("the earlier code/text/codingSystem shape still works", () => {
    expect(at(new RXR().route({ code: "IM", text: "Intramuscular", codingSystem: "HL70162" }), 1)).toBe("IM^Intramuscular^HL70162");
    expect(at(new RXR().administrationSite({ code: "LA", text: "Left arm" }), 2)).toBe("LA^Left arm");
  });
});
