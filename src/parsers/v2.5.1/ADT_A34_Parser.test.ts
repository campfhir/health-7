import { describe, test, expect } from "vitest";
import { parseADT_A34 } from "./ADT_A34_Parser";
import { ParserUtils } from "../../types/parser";

const minimalMessage = [
  "MSH|^~\\&|SEND|SFAC|RECV|RFAC|20231015120000||ADT^A34^ADT_A34|MSG001|P|2.5.1",
  "PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M",
  "MRG|OLD-12345^^^MRN^MR",
].join("\r");

const fullMessage = [
  "MSH|^~\\&|SEND|SFAC|RECV|RFAC|20231015120000||ADT^A34^ADT_A34|MSG001|P|2.5.1",
  "EVN|A34|20231015120000",
  "PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M",
  "PD1|||CLINIC^MAIN",
  "MRG|OLD-12345^^^MRN^MR",
  "PV1|1|I|WEST^101^1",
].join("\r");

describe("parseADT_A34 — minimal message", () => {
  test("parses valid minimal message", () => {
    const result = parseADT_A34(minimalMessage);
    expect(result.ok).toBe(true);
    expect(result.val).toBeTruthy();
  });

  test("extracts MSH", () => {
    const result = parseADT_A34(minimalMessage);
    expect(result.val!.msh.name).toBe("MSH");
    expect(ParserUtils.getComponent(result.val!.msh.fields[1], 0)).toBe("SEND");
  });

  test("extracts PID", () => {
    const result = parseADT_A34(minimalMessage);
    expect(result.val!.pid).toBeTruthy();
    const familyName = ParserUtils.getComponent(result.val!.pid.fields[4], 0);
    expect(familyName).toBe("Doe");
  });

  test("extracts MRG", () => {
    const result = parseADT_A34(minimalMessage);
    expect(result.val!.mrg).toBeTruthy();
    expect(result.val!.mrg.name).toBe("MRG");
  });

  test("EVN is absent in minimal message", () => {
    const result = parseADT_A34(minimalMessage);
    expect(result.val!.evn).toBeUndefined();
  });
});

describe("parseADT_A34 — optional segments", () => {
  test("extracts EVN", () => {
    const result = parseADT_A34(fullMessage);
    expect(result.val!.evn).toBeTruthy();
    expect(result.val!.evn!.name).toBe("EVN");
  });

  test("extracts PD1", () => {
    const result = parseADT_A34(fullMessage);
    expect(result.val!.pd1).toBeTruthy();
    expect(result.val!.pd1!.name).toBe("PD1");
  });

  test("extracts PV1", () => {
    const result = parseADT_A34(fullMessage);
    expect(result.val!.pv1).toBeTruthy();
    expect(result.val!.pv1!.name).toBe("PV1");
    const patientClass = ParserUtils.getComponent(result.val!.pv1!.fields[1], 0);
    expect(patientClass).toBe("I");
  });
});

describe("parseADT_A34 — error cases", () => {
  test("returns error for empty message", () => {
    const result = parseADT_A34("");
    expect(result.ok).toBe(false);
  });

  test("returns error when message does not start with MSH", () => {
    const result = parseADT_A34("PID|1||12345\rMRG|OLD-12345");
    expect(result.ok).toBe(false);
    expect(result.err?.message).toContain("MSH");
  });

  test("returns error when PID is missing", () => {
    const msg = [
      "MSH|^~\\&|SEND|SFAC|RECV|RFAC|20231015||ADT^A34^ADT_A34|MSG002|P|2.5.1",
      "MRG|OLD-12345^^^MRN^MR",
    ].join("\r");

    const result = parseADT_A34(msg);
    expect(result.ok).toBe(false);
    expect(result.err?.message).toContain("PID");
  });

  test("returns error when MRG is missing", () => {
    const msg = [
      "MSH|^~\\&|SEND|SFAC|RECV|RFAC|20231015||ADT^A34^ADT_A34|MSG003|P|2.5.1",
      "PID|1||12345^^^MRN^MR||Doe^John",
    ].join("\r");

    const result = parseADT_A34(msg);
    expect(result.ok).toBe(false);
    expect(result.err?.message).toContain("MRG");
  });
});

describe("parseADT_A34 — message object", () => {
  test("populates the HL7Message with all segments", () => {
    const result = parseADT_A34(fullMessage);
    expect(result.val!.message).toBeTruthy();
    const segs = result.val!.message.segments;
    expect(segs.some((s) => s.name === "MSH")).toBe(true);
    expect(segs.some((s) => s.name === "PID")).toBe(true);
    expect(segs.some((s) => s.name === "MRG")).toBe(true);
    expect(segs.some((s) => s.name === "EVN")).toBe(true);
  });
});
