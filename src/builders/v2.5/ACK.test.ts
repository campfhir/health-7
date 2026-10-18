import { describe, test, expect } from "vitest";
import { ACK, createACK } from "./ACK.ts";
import { parseACK } from "../../parsers/v2.5/ACK_Parser.ts";
import { MSH } from "../../segments/v2.5/MSH.ts";
import { MSA } from "../../segments/v2.5/MSA.ts";
import { ERR } from "../../segments/v2.5/ERR.ts";
import { SFT } from "../../segments/v2.5/SFT.ts";

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

  test("encodes SFT segments before MSA and ERR segments after it", () => {
    const wire = createACK(makeMSH(), makeMSA(), {
      sftList: [new SFT(), new SFT()],
      errList: [new ERR().errorLocation({ segmentId: "PID" }), new ERR().severity("E")],
    }).encode();
    expect(wire.split("\r").map((s) => s.slice(0, 3))).toEqual(["MSH", "SFT", "SFT", "MSA", "ERR", "ERR"]);
  });
});

describe("ACK round trip", () => {
  test("parse(encode()) preserves SFT, MSA and every ERR in order", () => {
    const wire = createACK(makeMSH(), makeMSA().textMessage("ok"), {
      sftList: [new SFT(), new SFT()],
      errList: [
        new ERR().errorLocation({ segmentId: "PID", segmentSequence: "1", fieldPosition: "5" }).hl7ErrorCode({ code: "101", text: "Required field missing" }).severity("E"),
        new ERR().severity("W"),
      ],
    }).encode();
    const result = parseACK(wire);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.sftList).toHaveLength(2);
    expect(result.val.msa.encode()).toBe("MSA|AA|MSG1|ok");
    expect(result.val.errList).toHaveLength(2);
    expect(result.val.errList[0].encode()).toBe("ERR||PID^1^5|101^Required field missing|E");
    expect(result.val.message.segments).toHaveLength(wire.split("\r").length);
  });

  test("SFT and ERR are optional", () => {
    const result = parseACK(createACK(makeMSH(), makeMSA()).encode());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.val.sftList).toEqual([]);
      expect(result.val.errList).toEqual([]);
    }
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

  test("SFT after MSA is rejected", () => {
    const result = parseACK([makeMSH().encode(), "MSA|AA|1", "SFT|x"].join("\r"));
    expect(result.ok).toBe(false);
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
