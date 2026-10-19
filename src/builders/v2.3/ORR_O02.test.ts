import { describe, test, expect } from "vitest";
import { ORR_O02, createORR_O02 } from "./ORR_O02.ts";
import { parseORR_O02 } from "../../parsers/v2.3/ORR_O02_Parser.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { MSA } from "../../segments/v2.3/MSA.ts";
import { ERR } from "../../segments/v2.3/ERR.ts";
import { NTE } from "../../segments/v2.3/NTE.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { ORC } from "../../segments/v2.3/ORC.ts";
import { OBR } from "../../segments/v2.3/OBR.ts";
import { CTI } from "../../segments/v2.3/CTI.ts";

const makeMSH = () => new MSH().messageType({ messageCode: "ORR", triggerEvent: "O02" }).messageControlId("R1");
const makeMSA = () => new MSA().acknowledgmentCode("AA").messageControlId("M1");
const names = (wire: string) => wire.split("\r").map((s) => s.slice(0, 3));

const fullMessage = () =>
  createORR_O02(makeMSH(), makeMSA(), {
    err: new ERR().errorCodeAndLocation("101"),
    notes: [new NTE().setId("1").comment("header")],
    patient: { pid: new PID().setId("1"), notes: [new NTE().setId("1").comment("patient")] },
    orders: [
      {
        orc: new ORC().orderControl("OK").placerOrderNumber("1"),
        detail: {
          segment: new OBR().setId("1"),
          notes: [new NTE().setId("1").comment("detail")],
          ctiList: [new CTI().sponsorStudyId({ entityIdentifier: "S1" })],
        },
      },
      { orc: new ORC().orderControl("OK").placerOrderNumber("2") },
    ],
  });

describe("ORR_O02 builder", () => {
  test("createORR_O02 returns an ORR_O02", () => {
    expect(createORR_O02(makeMSH(), makeMSA())).toBeInstanceOf(ORR_O02);
  });

  test("verify() requires MSH and MSA", () => {
    expect(new ORR_O02(null as any, null as any).verify().errors).toEqual([
      "MSH segment is required",
      "MSA segment is required",
    ]);
  });

  test("a minimal message is MSH + MSA", () => {
    expect(names(createORR_O02(makeMSH(), makeMSA()).encode())).toEqual(["MSH", "MSA"]);
  });

  test("encodes every group in specification order", () => {
    expect(names(fullMessage().encode())).toEqual([
      "MSH", "MSA", "ERR", "NTE", "PID", "NTE", "ORC", "OBR", "NTE", "CTI", "ORC",
    ]);
  });

  test("encode() throws when invalid", () => {
    expect(() => new ORR_O02(makeMSH(), null as any).encode()).toThrow(/MSA segment is required/);
  });
});

describe("ORR_O02 parser", () => {
  test("round-trips a full message", () => {
    const wire = fullMessage().encode();
    const result = parseORR_O02(wire);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { val } = result;
    expect(val.msa.encode()).toBe("MSA|AA|M1");
    expect(val.err).toBeInstanceOf(ERR);
    expect(val.notes).toHaveLength(1);
    expect(val.patient?.pid).toBeInstanceOf(PID);
    expect(val.patient?.notes).toHaveLength(1);
    expect(val.orders).toHaveLength(2);
    expect(val.orders[0].detail?.segment).toBeInstanceOf(OBR);
    expect(val.orders[0].detail?.notes).toHaveLength(1);
    expect(val.orders[0].detail?.ctiList).toHaveLength(1);
    expect(val.orders[1].detail).toBeUndefined();
    expect(val.message.segments).toHaveLength(wire.split("\r").length);
  });

  test("everything after MSA is optional", () => {
    const result = parseORR_O02(createORR_O02(makeMSH(), makeMSA()).encode());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.val.orders).toEqual([]);
      expect(result.val.patient).toBeUndefined();
    }
  });

  test("accepts orders without a PID (PID may be omitted)", () => {
    const result = parseORR_O02([makeMSH().encode(), "MSA|AE|M1", "ORC|UA|1"].join("\r"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.orders).toHaveLength(1);
  });

  const msh = () => makeMSH().encode();
  test.each([
    ["empty", ""],
    ["no MSA", msh()],
    ["a second MSA", [msh(), "MSA|AA|1", "MSA|AA|2"].join("\r")],
    ["ERR before MSA", [msh(), "ERR|1", "MSA|AA|1"].join("\r")],
    ["detail without ORC", [msh(), "MSA|AA|1", "OBR|1"].join("\r")],
    ["two details for one ORC", [msh(), "MSA|AA|1", "ORC|OK|1", "OBR|1", "OBR|2"].join("\r")],
    ["CTI without detail", [msh(), "MSA|AA|1", "ORC|OK|1", "CTI|S"].join("\r")],
    ["PID after ORC", [msh(), "MSA|AA|1", "ORC|OK|1", "PID|1"].join("\r")],
    ["NTE after ORC (not allowed there)", [msh(), "MSA|AA|1", "ORC|OK|1", "NTE|1||x"].join("\r")],
  ])("rejects: %s", (_label, wire) => {
    expect(parseORR_O02(wire).ok).toBe(false);
  });
});
