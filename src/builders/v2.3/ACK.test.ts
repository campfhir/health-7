import { describe, test, expect } from "vitest";
import { ACK, createACK } from "./ACK.ts";
import { parseACK } from "../../parsers/v2.3/ACK_Parser.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { MSA } from "../../segments/v2.3/MSA.ts";
import { ERR } from "../../segments/v2.3/ERR.ts";

const makeMSH = () =>
  new MSH().sendingApplication("RECV").messageType({ messageCode: "ACK", triggerEvent: "A01" }).messageControlId("ACK1");
const makeMSA = () => new MSA().acknowledgmentCode("AA").messageControlId("MSG1");

describe("ACK builder", () => {
  test("createACK returns an ACK", () => {
    expect(createACK(makeMSH(), makeMSA())).toBeInstanceOf(ACK);
  });

  test("verify() requires MSH and MSA", () => {
    const result = new ACK(null as any, null as any).verify();
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(["MSH segment is required", "MSA segment is required"]);
  });

  test("encode() throws when invalid", () => {
    expect(() => new ACK(makeMSH(), null as any).encode()).toThrow(/MSA segment is required/);
  });

  test("encodes MSH, MSA and no ERR by default", () => {
    const segments = createACK(makeMSH(), makeMSA()).encode().split("\r");
    expect(segments.map((s) => s.slice(0, 3))).toEqual(["MSH", "MSA"]);
    expect(segments[1]).toBe("MSA|AA|MSG1");
  });

  test("encodes ERR after MSA", () => {
    const err = new ERR().errorCodeAndLocation("101");
    const segments = createACK(makeMSH(), makeMSA(), err).encode().split("\r");
    expect(segments.map((s) => s.slice(0, 3))).toEqual(["MSH", "MSA", "ERR"]);
  });
});

describe("ACK round trip", () => {
  test("parse(encode()) preserves the segments", () => {
    const wire = createACK(makeMSH(), makeMSA().textMessage("ok"), new ERR().errorCodeAndLocation("101")).encode();
    const result = parseACK(wire);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.msa.encode()).toBe("MSA|AA|MSG1|ok");
    expect(result.val.err?.encode()).toBe("ERR|101");
    expect(result.val.message.segments).toHaveLength(3);
  });

  test("a structured, repeating ERR-1 survives the round trip", () => {
    const err = new ERR().errorCodeAndLocation(
      { segmentId: "PID", sequence: "1", fieldPosition: "5", codeIdentifyingError: { identifier: "101", text: "Required field missing" } },
      { segmentId: "PV1", sequence: "1", fieldPosition: "2", codeIdentifyingError: { identifier: "102" } },
    );
    const result = parseACK(createACK(makeMSH(), makeMSA().acknowledgmentCode("AE"), err).encode());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.val.err?.encode()).toBe("ERR|PID^1^5^101&Required field missing~PV1^1^2^102");
    }
  });

  test("ERR is optional", () => {
    const result = parseACK(createACK(makeMSH(), makeMSA()).encode());
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.err).toBeUndefined();
  });
});

describe("ACK parser errors", () => {
  test("empty message", () => {
    const result = parseACK("");
    expect(result.ok).toBe(false);
  });

  test("must start with MSH", () => {
    const result = parseACK("MSA|AA|1");
    expect(result.ok).toBe(false);
  });

  test("MSA is required", () => {
    const result = parseACK(makeMSH().encode());
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.err.message).toMatch(/MSA/);
  });

  test("ERR before MSA is rejected", () => {
    const result = parseACK([makeMSH().encode(), "ERR|101", "MSA|AA|1"].join("\r"));
    expect(result.ok).toBe(false);
  });

  test("a second MSA is rejected", () => {
    const result = parseACK([makeMSH().encode(), "MSA|AA|1", "MSA|AE|2"].join("\r"));
    expect(result.ok).toBe(false);
  });
});
