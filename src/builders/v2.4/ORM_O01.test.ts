import { describe, test, expect } from "vitest";
import { ORM_O01, createORM_O01, type OrderGroup } from "./ORM_O01.ts";
import { parseORM_O01 } from "../../parsers/v2.4/ORM_O01_Parser.ts";
import { MSH } from "../../segments/v2.4/MSH.ts";
import { NTE } from "../../segments/v2.4/NTE.ts";
import { PID } from "../../segments/v2.4/PID.ts";
import { PD1 } from "../../segments/v2.4/PD1.ts";
import { PV1 } from "../../segments/v2.4/PV1.ts";
import { PV2 } from "../../segments/v2.4/PV2.ts";
import { IN1 } from "../../segments/v2.4/IN1.ts";
import { IN2 } from "../../segments/v2.4/IN2.ts";
import { IN3 } from "../../segments/v2.4/IN3.ts";
import { GT1 } from "../../segments/v2.4/GT1.ts";
import { AL1 } from "../../segments/v2.4/AL1.ts";
import { ORC } from "../../segments/v2.4/ORC.ts";
import { OBR } from "../../segments/v2.4/OBR.ts";
import { RQD } from "../../segments/v2.4/RQD.ts";
import { RQ1 } from "../../segments/v2.4/RQ1.ts";
import { RXO } from "../../segments/v2.4/RXO.ts";
import { ODS } from "../../segments/v2.4/ODS.ts";
import { ODT } from "../../segments/v2.4/ODT.ts";
import { DG1 } from "../../segments/v2.4/DG1.ts";
import { OBX } from "../../segments/v2.4/OBX.ts";
import { CTI } from "../../segments/v2.4/CTI.ts";
import { BLG } from "../../segments/v2.4/BLG.ts";
import { CTD } from "../../segments/v2.4/CTD.ts";
import { FT1 } from "../../segments/v2.4/FT1.ts";

const makeMSH = () =>
  new MSH().sendingApplication("ORDERS").messageType({ messageCode: "ORM", triggerEvent: "O01" }).messageControlId("M1");
const makeORC = (n = "ORD1") => new ORC().orderControl("NW").placerOrderNumber(n);
const names = (wire: string) => wire.split("\r").map((s) => s.slice(0, 3));

function fullMessage() {
  return createORM_O01(
    makeMSH(),
    [
      {
        orc: makeORC("ORD1"),
        detail: {
          segment: new OBR().setId("1").placerOrderNumber("ORD1"),
          notes: [new NTE().setId("1").comment("detail note")],
          ctd: new CTD().contactRole({ identifier: "EP" }),
          diagnoses: [new DG1().setId("1")],
          observations: [
            { obx: new OBX().setId("1").valueType("ST"), notes: [new NTE().setId("1").comment("obx note")] },
            { obx: new OBX().setId("2").valueType("ST") },
          ],
        },
        ftList: [new FT1().setId("1"), new FT1().setId("2")],
        ctiList: [new CTI().sponsorStudyId({ entityIdentifier: "S1" })],
        blg: new BLG().chargeType("CH"),
      },
      { orc: makeORC("ORD2"), detail: { segment: new RXO().requestedGiveCode({ code: "RX1" }) } },
    ],
    {
      notes: [new NTE().setId("1").comment("header note")],
      patient: {
        pid: new PID().setId("1"),
        pd1: new PD1(),
        notes: [new NTE().setId("1").comment("patient note")],
        visit: { pv1: new PV1().patientClass("I"), pv2: new PV2() },
        insurance: [{ in1: new IN1().setId("1"), in2: new IN2(), in3List: [new IN3(), new IN3()] }, { in1: new IN1().setId("2") }],
        gt1: new GT1().setId("1"),
        allergies: [new AL1().setId("1")],
      },
    },
  );
}

describe("ORM_O01 builder", () => {
  test("createORM_O01 returns an ORM_O01", () => {
    expect(createORM_O01(makeMSH(), [{ orc: makeORC() }])).toBeInstanceOf(ORM_O01);
  });

  test("verify() requires MSH and at least one order", () => {
    const result = new ORM_O01(makeMSH(), []).verify();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("At least one order (ORC) is required");
    expect(new ORM_O01(null as any, [{ orc: makeORC() }]).verify().errors).toContain("MSH segment is required");
  });

  test("verify() checks nested required segments", () => {
    const bad = (x: any) => x as OrderGroup;
    const msg = new ORM_O01(
      makeMSH(),
      [
        bad({ orc: null }),
        bad({ orc: makeORC(), detail: { segment: null } }),
        bad({ orc: makeORC(), detail: { segment: new OBR(), observations: [{ obx: null }] } }),
      ],
      { patient: { pid: null, visit: { pv1: null }, insurance: [{ in1: null }] } as any },
    );
    expect(msg.verify().errors).toEqual([
      "Patient group: PID segment is required",
      "Patient group: PV1 segment is required when a visit is present",
      "Insurance group 1: IN1 segment is required",
      "Order 1: ORC segment is required",
      "Order 2: order detail segment is required when a detail group is present",
      "Order 3, observation 1: OBX segment is required",
    ]);
  });

  test("encode() throws when invalid", () => {
    expect(() => new ORM_O01(makeMSH(), []).encode()).toThrow(/at least one order/i);
  });

  test("a minimal message is MSH + ORC (CTD and FT1 are optional)", () => {
    expect(names(createORM_O01(makeMSH(), [{ orc: makeORC() }]).encode())).toEqual(["MSH", "ORC"]);
  });

  test("encodes every group in specification order", () => {
    expect(names(fullMessage().encode())).toEqual([
      "MSH", "NTE",
      "PID", "PD1", "NTE", "PV1", "PV2", "IN1", "IN2", "IN3", "IN3", "IN1", "GT1", "AL1",
      "ORC", "OBR", "NTE", "CTD", "DG1", "OBX", "NTE", "OBX", "FT1", "FT1", "CTI", "BLG",
      "ORC", "RXO",
    ]);
  });
});

describe("ORM_O01 parser", () => {
  test("round-trips a full message", () => {
    const wire = fullMessage().encode();
    const result = parseORM_O01(wire);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { val } = result;

    expect(val.notes).toHaveLength(1);
    expect(val.patient?.pid).toBeInstanceOf(PID);
    expect(val.patient?.pd1).toBeInstanceOf(PD1);
    expect(val.patient?.notes).toHaveLength(1);
    expect(val.patient?.visit?.pv2).toBeInstanceOf(PV2);
    expect(val.patient?.insurance).toHaveLength(2);
    expect(val.patient?.insurance[0].in2).toBeInstanceOf(IN2);
    expect(val.patient?.insurance[0].in3List).toHaveLength(2);
    expect(val.patient?.insurance[0].in3List[0]).toBeInstanceOf(IN3);
    expect(val.patient?.insurance[1].in3List).toHaveLength(0);
    expect(val.patient?.insurance[1].in2).toBeUndefined();
    expect(val.patient?.gt1).toBeInstanceOf(GT1);
    expect(val.patient?.allergies).toHaveLength(1);

    expect(val.orders).toHaveLength(2);
    const first = val.orders[0];
    expect(first.detail?.segment).toBeInstanceOf(OBR);
    expect(first.detail?.notes).toHaveLength(1);
    expect(first.detail?.ctd).toBeInstanceOf(CTD);
    expect(first.detail?.diagnoses).toHaveLength(1);
    expect(first.ftList).toHaveLength(2);
    expect(first.ftList[0]).toBeInstanceOf(FT1);
    expect(first.detail?.observations.map((o) => o.notes.length)).toEqual([1, 0]);
    expect(first.ctiList).toHaveLength(1);
    expect(first.blg).toBeInstanceOf(BLG);
    expect(val.orders[1].detail?.segment).toBeInstanceOf(RXO);

    // every segment survives into the message container
    expect(val.message.segments).toHaveLength(wire.split("\r").length);
  });

  test.each([
    ["OBR", () => new OBR().setId("1")],
    ["RQD", () => new RQD().requisitionLineNumber("1")],
    ["RQ1", () => new RQ1().anticipatedPrice("9.99")],
    ["RXO", () => new RXO().requestedGiveCode({ code: "RX" })],
    ["ODS", () => new ODS().type("D")],
    ["ODT", () => new ODT().textInstruction("none")],
  ] as const)("accepts %s as the order detail segment", (name, make) => {
    const wire = createORM_O01(makeMSH(), [{ orc: makeORC(), detail: { segment: make() } }]).encode();
    const result = parseORM_O01(wire);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.orders[0].detail?.segment.name).toBe(name);
  });

  test("the patient group is optional", () => {
    const result = parseORM_O01(createORM_O01(makeMSH(), [{ orc: makeORC() }]).encode());
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.patient).toBeUndefined();
  });

  test("an order detail segment is optional (control messages)", () => {
    const result = parseORM_O01([makeMSH().encode(), "ORC|HD|ORD1"].join("\r"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.orders[0].detail).toBeUndefined();
  });

  test("CTD sits between the detail notes and the diagnoses, FT1 after the detail group", () => {
    const result = parseORM_O01(
      [makeMSH().encode(), "ORC|NW|1", "OBR|1", "NTE|1||n", "CTD|EP", "DG1|1", "OBX|1|ST", "FT1|1", "FT1|2", "CTI|S"].join("\r"),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const order = result.val.orders[0];
    expect(order.detail?.notes).toHaveLength(1);
    expect(order.detail?.ctd).toBeInstanceOf(CTD);
    expect(order.ftList).toHaveLength(2);
    expect(order.ctiList).toHaveLength(1);
  });

  test("a v2.3-shaped message (no CTD/FT1) still parses", () => {
    const result = parseORM_O01([makeMSH().encode(), "ORC|NW|1", "OBR|1"].join("\r"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.orders[0].ftList).toEqual([]);
  });

  test("an NTE after OBX attaches to that OBX, not the order detail", () => {
    const result = parseORM_O01(
      [makeMSH().encode(), "ORC|NW|1", "OBR|1", "OBX|1|ST", "NTE|1||x"].join("\r"),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.orders[0].detail?.notes).toHaveLength(0);
    expect(result.val.orders[0].detail?.observations[0].notes).toHaveLength(1);
  });

  const msh = () => makeMSH().encode();
  test.each([
    ["empty", ""],
    ["no MSH first", "ORC|NW|1"],
    ["no ORC", [msh(), "PID|1"].join("\r")],
    ["detail without ORC", [msh(), "OBR|1"].join("\r")],
    ["two detail segments for one ORC", [msh(), "ORC|NW|1", "OBR|1", "OBR|2"].join("\r")],
    ["DG1 without detail", [msh(), "ORC|NW|1", "DG1|1"].join("\r")],
    ["OBX without detail", [msh(), "ORC|NW|1", "OBX|1"].join("\r")],
    ["CTI before ORC", [msh(), "CTI|S1", "ORC|NW|1"].join("\r")],
    ["FT1 before ORC", [msh(), "FT1|1", "ORC|NW|1"].join("\r")],
    ["CTD without detail", [msh(), "ORC|NW|1", "CTD|EP"].join("\r")],
    ["two CTD in one detail", [msh(), "ORC|NW|1", "OBR|1", "CTD|EP", "CTD|EP"].join("\r")],
    ["BLG before ORC", [msh(), "BLG|O", "ORC|NW|1"].join("\r")],
    ["PD1 without PID", [msh(), "PD1|1", "ORC|NW|1"].join("\r")],
    ["PV2 without PV1", [msh(), "PID|1", "PV2|1", "ORC|NW|1"].join("\r")],
    ["IN2 without IN1", [msh(), "PID|1", "IN2|1", "ORC|NW|1"].join("\r")],
    ["PID after ORC", [msh(), "ORC|NW|1", "PID|1"].join("\r")],
    ["NTE after ORC (not allowed there)", [msh(), "ORC|NW|1", "NTE|1||x"].join("\r")],
  ])("rejects: %s", (_label, wire) => {
    expect(parseORM_O01(wire).ok).toBe(false);
  });
});
