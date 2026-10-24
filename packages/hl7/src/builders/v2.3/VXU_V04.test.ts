import { describe, test, expect } from "vitest";
import { VXU_V04, createVXU_V04 } from "./VXU_V04.ts";
import { parseVXU_V04 } from "../../parsers/v2.3/VXU_V04_Parser.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { NK1 } from "../../segments/v2.3/NK1.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { PV2 } from "../../segments/v2.3/PV2.ts";
import { GT1 } from "../../segments/v2.3/GT1.ts";
import { IN1 } from "../../segments/v2.3/IN1.ts";
import { IN2 } from "../../segments/v2.3/IN2.ts";
import { IN3 } from "../../segments/v2.3/IN3.ts";
import { ORC } from "../../segments/v2.3/ORC.ts";
import { RXA } from "../../segments/v2.3/RXA.ts";
import { RXR } from "../../segments/v2.3/RXR.ts";
import { OBX } from "../../segments/v2.3/OBX.ts";
import { NTE } from "../../segments/v2.3/NTE.ts";

const makeMSH = () => new MSH().messageType({ messageCode: "VXU", triggerEvent: "V04" }).messageControlId("V1");
const makePID = () => new PID().setId("1");
const makeRXA = (n = "1") => new RXA().giveSubIdCounter("0").administrationSubIdCounter(n).administeredCode({ code: "08", text: "Hep B" });
const makeORC = () => new ORC().orderControl("RE");
const names = (wire: string) => wire.split("\r").map((s) => s.slice(0, 3));
const msh = () => makeMSH().encode();

function fullMessage() {
  return createVXU_V04(makeMSH(), makePID(), {
    pd1: new PD1(),
    nk1List: [new NK1().setId("1"), new NK1().setId("2")],
    visit: { pv1: new PV1().patientClass("O"), pv2: new PV2() },
    insurance: [{ in1: new IN1().setId("1"), in2: new IN2(), in3: new IN3() }, { in1: new IN1().setId("2") }],
    orders: [
      {
        orc: makeORC(),
        rxa: makeRXA("1"),
        rxr: new RXR().route({ code: "IM" }),
        observations: [
          { obx: new OBX().setId("1").valueType("CE"), notes: [new NTE().setId("1").comment("n1"), new NTE().setId("2").comment("n2")] },
          { obx: new OBX().setId("2").valueType("CE") },
        ],
      },
      { rxa: makeRXA("2") },
    ],
  });
}

describe("VXU_V04 builder (v2.3)", () => {
  test("createVXU_V04 returns a VXU_V04", () => {
    expect(createVXU_V04(makeMSH(), makePID())).toBeInstanceOf(VXU_V04);
  });

  test("a minimal message is MSH + PID", () => {
    expect(names(createVXU_V04(makeMSH(), makePID()).encode())).toEqual(["MSH", "PID"]);
  });

  test("encodes every group in specification order (the ORC is optional)", () => {
    expect(names(fullMessage().encode())).toEqual([
      "MSH", "PID", "PD1", "NK1", "NK1", "PV1", "PV2", "IN1", "IN2", "IN3", "IN1",
      "ORC", "RXA", "RXR", "OBX", "NTE", "NTE", "OBX", "RXA",
    ]);
  });

  test("verify() requires MSH, PID, and the RXA of every order", () => {
    // @ts-expect-error missing required segments
    const result = new VXU_V04(null, null, { orders: [{ orc: makeORC() }] }).verify();
    expect(result.errors).toEqual(["MSH segment is required", "PID segment is required", "Order 1: RXA segment is required"]);
  });

  test("verify() checks nested required segments", () => {
    const msg = new VXU_V04(makeMSH(), makePID(), {
      // @ts-expect-error missing required segments
      visit: { pv2: new PV2() },
      // @ts-expect-error missing required segments
      insurance: [{ in2: new IN2() }],
      // @ts-expect-error missing required segments
      orders: [{ rxa: makeRXA(), observations: [{ notes: [] }] }],
    });
    expect(msg.verify().errors).toEqual([
      "PV1 segment is required when a visit is present",
      "Insurance group 1: IN1 segment is required",
      "Order 1, observation 1: OBX segment is required",
    ]);
  });

  test("GT1 is not part of the v2.3 structure", () => {
    const msg = createVXU_V04(makeMSH(), makePID(), { gt1List: [new GT1().setId("1")] });
    expect(msg.verify().errors).toEqual(["GT1 segments are not part of VXU^V04 in this version"]);
    expect(() => msg.encode()).toThrow(/GT1/);
  });
});

describe("VXU_V04 parser (v2.3)", () => {
  test("round-trips a full message", () => {
    const wire = fullMessage().encode();
    const result = parseVXU_V04(wire);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { val } = result;
    expect(val.pid).toBeInstanceOf(PID);
    expect(val.pd1).toBeInstanceOf(PD1);
    expect(val.nk1List).toHaveLength(2);
    expect(val.visit?.pv2).toBeInstanceOf(PV2);
    expect(val.gt1List).toEqual([]);
    expect(val.insurance).toHaveLength(2);
    expect(val.insurance[0].in2).toBeInstanceOf(IN2);
    expect(val.insurance[0].in3).toBeInstanceOf(IN3);
    expect(val.orders).toHaveLength(2);
    expect(val.orders[0].orc).toBeInstanceOf(ORC);
    expect(val.orders[0].rxr).toBeInstanceOf(RXR);
    expect(val.orders[0].observations.map((o) => o.notes.length)).toEqual([2, 0]);
    expect(val.orders[1].orc).toBeUndefined();
    expect(val.message.segments).toHaveLength(wire.split("\r").length);
  });

  test("the vaccination groups are optional", () => {
    const result = parseVXU_V04([msh(), "PID|1"].join("\r"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.orders).toEqual([]);
  });

  test("a new RXA without an ORC starts a new group", () => {
    const result = parseVXU_V04([msh(), "PID|1", "RXA|0|1", "OBX|1|CE", "RXA|0|2"].join("\r"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.orders.map((o) => o.observations.length)).toEqual([1, 0]);
  });

  test("skips GT1, which is not part of the v2.3 structure", () => {
    const result = parseVXU_V04([msh(), "PID|1", "GT1|1", "RXA|0|1"].join("\r"));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.val.gt1List).toEqual([]);
      expect(result.val.message.segments.map((s) => s.name)).not.toContain("GT1");
    }
  });

  test.each([
    ["empty", ""],
    ["no MSH first", "PID|1"],
    ["no PID", msh()],
    ["a second PID", [msh(), "PID|1", "PID|2"].join("\r")],
    ["PD1 before PID", [msh(), "PD1|1", "PID|1"].join("\r")],
    ["PV2 without PV1", [msh(), "PID|1", "PV2|1"].join("\r")],
    ["IN2 without IN1", [msh(), "PID|1", "IN2|1"].join("\r")],
    ["an ORC with no RXA at the end", [msh(), "PID|1", "ORC|RE"].join("\r")],
    ["an ORC with no RXA before the next group", [msh(), "PID|1", "ORC|RE", "ORC|RE", "RXA|0|1"].join("\r")],
    ["RXR without RXA", [msh(), "PID|1", "ORC|RE", "RXR|IM"].join("\r")],
    ["two RXR in one group", [msh(), "PID|1", "RXA|0|1", "RXR|IM", "RXR|IV"].join("\r")],
    ["OBX without RXA", [msh(), "PID|1", "OBX|1"].join("\r")],
    ["NTE without OBX", [msh(), "PID|1", "RXA|0|1", "NTE|1"].join("\r")],
  ])("rejects: %s", (_label, wire) => {
    expect(parseVXU_V04(wire).ok).toBe(false);
  });
});
