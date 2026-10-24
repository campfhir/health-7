import { test, expect } from "vitest";
import { createADT_A17, ADT_A17 } from "./ADT_A17.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { EVN } from "../../segments/v2.3/EVN.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { PV2 } from "../../segments/v2.3/PV2.ts";
import { DB1 } from "../../segments/v2.3/DB1.ts";
import { OBX } from "../../segments/v2.3/OBX.ts";
import { parseADT_A17 } from "../../parsers/v2.3/ADT_A17_Parser.ts";
import { parseADT_A17 as parseADT_A17_v251 } from "../../parsers/v2.5.1/ADT_A17_Parser.ts";
import { ParserUtils } from "../../types/parser.ts";

function makeMSH() {
  return new MSH().sendingApplication("TEST").messageType({ messageCode: "ADT", triggerEvent: "A17" });
}
function makeEVN() {
  return new EVN().eventTypeCode("A17").recordedDateTime("20231015120000");
}
function makePatient(id: string, familyName: string, bed: string) {
  return {
    pid: new PID().setId(id).patientName({ familyName, givenName: "Pat" }),
    pv1: new PV1().patientClass("I").assignedPatientLocation({ pointOfCare: "WEST", room: bed }),
  };
}

test("createADT_A17 returns ADT_A17 instance", () => {
  const msg = createADT_A17(makeMSH(), makeEVN(), makePatient("1", "Doe", "101"), makePatient("2", "Roe", "102"));
  expect(msg instanceof ADT_A17).toBe(true);
});

test("verify() passes with both patients complete", () => {
  const msg = createADT_A17(makeMSH(), makeEVN(), makePatient("1", "Doe", "101"), makePatient("2", "Roe", "102"));
  expect(msg.verify()).toEqual({ valid: true, errors: [] });
});

test("verify() reports missing MSH, EVN and patient segments", () => {
  const msg = new ADT_A17(null as any, null as any, { pid: null as any, pv1: null as any }, null as any);
  const result = msg.verify();
  expect(result.valid).toBe(false);
  expect(result.errors).toEqual([
    "MSH segment is required",
    "EVN segment is required",
    "PID segment is required for patient 1",
    "PV1 segment is required for patient 1",
    "PID segment is required for patient 2",
    "PV1 segment is required for patient 2",
  ]);
});

test("encode() throws when a patient has no PV1", () => {
  const msg = new ADT_A17(makeMSH(), makeEVN(), makePatient("1", "Doe", "101"), { pid: new PID().setId("2"), pv1: null as any });
  expect(() => msg.encode()).toThrow(/PV1 segment is required for patient 2/);
});

test("encode() emits both patient groups in spec order", () => {
  const p1 = {
    ...makePatient("1", "Doe", "101"),
    pd1: new PD1(),
    pv2: new PV2().visitDescription("Observation"),
    db1List: [new DB1().setId("1"), new DB1().setId("2")],
    obxList: [new OBX().setId("1").valueType("ST")],
  };
  const p2 = makePatient("2", "Roe", "102");
  const segments = createADT_A17(makeMSH(), makeEVN(), p1, p2).encode().split("\r");
  expect(segments.map((s) => s.substring(0, 3))).toEqual([
    "MSH", "EVN", "PID", "PD1", "PV1", "PV2", "DB1", "DB1", "OBX", "PID", "PV1",
  ]);
});

test("round-trips through the v2.3 and v2.5.1 parsers", () => {
  const encoded = createADT_A17(makeMSH(), makeEVN(), makePatient("1", "Doe", "101"), makePatient("2", "Roe", "102")).encode();
  for (const parse of [parseADT_A17, parseADT_A17_v251]) {
    const result = parse(encoded);
    expect(result.ok).toBe(true);
    const { patient1, patient2, evn } = result.val!;
    expect(ParserUtils.getComponent(evn.fields[0], 0)).toBe("A17");
    expect(ParserUtils.getComponent(patient1.pid.fields[4], 0)).toBe("Doe");
    expect(ParserUtils.getComponent(patient2.pid.fields[4], 0)).toBe("Roe");
    expect(ParserUtils.getComponent(patient1.pv1.fields[2], 1)).toBe("101");
    expect(ParserUtils.getComponent(patient2.pv1.fields[2], 1)).toBe("102");
    expect(result.val!.message.encode()).toBe(encoded);
  }
});
