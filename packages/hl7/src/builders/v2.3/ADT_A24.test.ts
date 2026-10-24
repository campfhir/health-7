import { test, expect } from "vitest";
import { createADT_A24, ADT_A24 } from "./ADT_A24.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { EVN } from "../../segments/v2.3/EVN.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { DB1 } from "../../segments/v2.3/DB1.ts";
import { parseADT_A24 } from "../../parsers/v2.3/ADT_A24_Parser.ts";
import { parseADT_A24 as parseADT_A24_v251 } from "../../parsers/v2.5.1/ADT_A24_Parser.ts";
import { ParserUtils } from "../../types/parser.ts";

function makeMSH() {
  return new MSH().sendingApplication("TEST").messageType({ messageCode: "ADT", triggerEvent: "A24" });
}
function makeEVN() {
  return new EVN().eventTypeCode("A24").recordedDateTime("20231015120000");
}
function makePID(id: string, familyName: string) {
  return new PID().setId(id).patientName({ familyName, givenName: "Pat" });
}

test("createADT_A24 returns ADT_A24 instance", () => {
  const msg = createADT_A24(makeMSH(), makeEVN(), { pid: makePID("1", "Doe") }, { pid: makePID("2", "Roe") });
  expect(msg instanceof ADT_A24).toBe(true);
});

test("verify() passes with only PID per patient (PV1 is optional)", () => {
  const msg = createADT_A24(makeMSH(), makeEVN(), { pid: makePID("1", "Doe") }, { pid: makePID("2", "Roe") });
  expect(msg.verify()).toEqual({ valid: true, errors: [] });
});

test("verify() reports missing MSH, EVN and PIDs", () => {
  const msg = new ADT_A24(null as any, null as any, { pid: null as any }, null as any);
  expect(msg.verify().errors).toEqual([
    "MSH segment is required",
    "EVN segment is required",
    "PID segment is required for patient 1",
    "PID segment is required for patient 2",
  ]);
});

test("encode() throws when message is invalid", () => {
  const msg = new ADT_A24(makeMSH(), null as any, { pid: makePID("1", "Doe") }, { pid: makePID("2", "Roe") });
  expect(() => msg.encode()).toThrow(/EVN segment is required/);
});

test("encode() emits both patient groups in spec order", () => {
  const p1 = { pid: makePID("1", "Doe"), pd1: new PD1(), pv1: new PV1().patientClass("O"), db1List: [new DB1().setId("1")] };
  const p2 = { pid: makePID("2", "Roe"), pv1: new PV1().patientClass("I") };
  const segments = createADT_A24(makeMSH(), makeEVN(), p1, p2).encode().split("\r");
  expect(segments.map((s) => s.substring(0, 3))).toEqual(["MSH", "EVN", "PID", "PD1", "PV1", "DB1", "PID", "PV1"]);
});

test("round-trips through the v2.3 and v2.5.1 parsers", () => {
  const encoded = createADT_A24(
    makeMSH(),
    makeEVN(),
    { pid: makePID("1", "Doe"), pv1: new PV1().patientClass("O") },
    { pid: makePID("2", "Roe") },
  ).encode();
  for (const parse of [parseADT_A24, parseADT_A24_v251]) {
    const result = parse(encoded);
    expect(result.ok).toBe(true);
    const { patient1, patient2 } = result.val!;
    expect(ParserUtils.getComponent(patient1.pid.fields[4], 0)).toBe("Doe");
    expect(ParserUtils.getComponent(patient1.pv1!.fields[1], 0)).toBe("O");
    expect(ParserUtils.getComponent(patient2.pid.fields[4], 0)).toBe("Roe");
    expect(patient2.pv1).toBeUndefined();
    expect(patient2.db1List).toEqual([]);
    expect(result.val!.message.encode()).toBe(encoded);
  }
});
