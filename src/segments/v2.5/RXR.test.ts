// RXR in HL7 v2.5: RXR-6 is new and RXR-2 / RXR-4 are CWE.
import { describe, test, expect } from "vitest";
import { RXR } from "./RXR.ts";
import { RXR as RXR_v231 } from "../v2.3.1/RXR.ts";
import { RXR as RXR_v251 } from "../v2.5.1/RXR.ts";

const cwe9 = {
  code: "1", text: "2", codingSystem: "3", alternateIdentifier: "4", alternateText: "5",
  alternateCodingSystem: "6", codingSystemVersionId: "7", alternateCodingSystemVersionId: "8", originalText: "9",
};

describe("RXR (v2.5)", () => {
  test("extends the v2.3.1 segment (RXR-5 stays)", () => {
    const rxr = new RXR().routingInstruction({ identifier: "R" });
    expect(rxr).toBeInstanceOf(RXR_v231);
    expect(rxr.encode()).toBe("RXR|||||R");
  });

  test("RXR-6 Administration Site Modifier (CWE)", () => {
    expect(new RXR().administrationSiteModifier(cwe9).encode()).toBe("RXR|||||" + "|1^2^3^4^5^6^7^8^9");
  });

  test("RXR-2 and RXR-4 take nine components from v2.5", () => {
    const rxr = new RXR().administrationSite(cwe9).administrationMethod(cwe9);
    const parts = rxr.encode().split("|");
    expect(parts[2]).toBe("1^2^3^4^5^6^7^8^9");
    expect(parts[4]).toBe("1^2^3^4^5^6^7^8^9");
  });

  test("the earlier code/text shape still works", () => {
    expect(new RXR().administrationSite({ code: "LA", text: "Left arm" }).encode()).toBe("RXR||LA^Left arm");
  });

  test("RXR-1 and RXR-3 stay CE (six components)", () => {
    const parts = new RXR().route(cwe9).administrationDevice(cwe9).encode().split("|");
    expect(parts[1]).toBe("1^2^3^4^5^6");
    expect(parts[3]).toBe("1^2^3^4^5^6");
  });

  test("v2.5.1 inherits RXR-5 and RXR-6", () => {
    const rxr = new RXR_v251().routingInstruction({ identifier: "R" }).administrationSiteModifier({ code: "M" });
    expect(rxr).toBeInstanceOf(RXR);
    expect(rxr.encode()).toBe("RXR|||||R|M");
  });
});
