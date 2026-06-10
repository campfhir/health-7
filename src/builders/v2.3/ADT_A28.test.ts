import { test, expect } from "vitest";
import { createADT_A28, ADT_A28 } from "./ADT_A28.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { EVN } from "../../segments/v2.3/EVN.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { NK1 } from "../../segments/v2.3/NK1.ts";
import { PR1 } from "../../segments/v2.3/PR1.ts";
import { ROL } from "../../segments/v2.3/ROL.ts";
import { IN1 } from "../../segments/v2.3/IN1.ts";
import { IN2 } from "../../segments/v2.3/IN2.ts";
import { IN3 } from "../../segments/v2.3/IN3.ts";
import { AL1 } from "../../segments/v2.3/AL1.ts";
import { DG1 } from "../../segments/v2.3/DG1.ts";
import { GT1 } from "../../segments/v2.3/GT1.ts";
import { parseADT_A28 } from "../../parsers/v2.5.1/ADT_A28_Parser.ts";

function makeMSH() {
  return new MSH().sendingApplication("TEST").messageType("ADT", "A28");
}
function makeEVN() {
  return new EVN().eventTypeCode("A28").recordedDateTime("20231015120000");
}
function makePID() {
  return new PID().setId("1").patientName("Doe", "John");
}
function makePV1() {
  return new PV1().patientClass("O");
}

test("createADT_A28 returns ADT_A28 instance", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1());
  expect(msg instanceof ADT_A28).toBe(true);
});

test("verify() passes with all required segments", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1());
  const result = msg.verify();
  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);
});

test("verify() fails when MSH is missing", () => {
  const msg = new ADT_A28(null as any, makeEVN(), makePID(), makePV1());
  const result = msg.verify();
  expect(result.valid).toBe(false);
  expect(result.errors.some((e) => e.includes("MSH"))).toBe(true);
});

test("verify() fails when EVN is missing", () => {
  const msg = new ADT_A28(makeMSH(), null as any, makePID(), makePV1());
  const result = msg.verify();
  expect(result.valid).toBe(false);
  expect(result.errors.some((e) => e.includes("EVN"))).toBe(true);
});

test("verify() fails when PID is missing", () => {
  const msg = new ADT_A28(makeMSH(), makeEVN(), null as any, makePV1());
  const result = msg.verify();
  expect(result.valid).toBe(false);
  expect(result.errors.some((e) => e.includes("PID"))).toBe(true);
});

test("verify() fails when PV1 is missing", () => {
  const msg = new ADT_A28(makeMSH(), makeEVN(), makePID(), null as any);
  const result = msg.verify();
  expect(result.valid).toBe(false);
  expect(result.errors.some((e) => e.includes("PV1"))).toBe(true);
});

test("encode() throws when message is invalid", () => {
  const msg = new ADT_A28(null as any, makeEVN(), makePID(), makePV1());
  expect(() => msg.encode()).toThrow();
});

test("encode() produces correct segment order for minimal message", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1());
  const encoded = msg.encode();
  const segments = encoded.split("\r");

  expect(segments[0].startsWith("MSH|")).toBe(true);
  expect(segments[1].startsWith("EVN|")).toBe(true);
  expect(segments[2].startsWith("PID|")).toBe(true);
  expect(segments[3].startsWith("PV1|")).toBe(true);
});

test("encode() includes optional PD1 and NK1 before PV1", () => {
  const pd1 = new PD1();
  const nk1 = new NK1().setId("1");
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    pd1,
    nk1List: [nk1],
  });
  const segments = msg.encode().split("\r");
  const names = segments.map((s) => s.substring(0, 3));

  expect(names.indexOf("PD1")).toBeLessThan(names.indexOf("PV1"));
  expect(names.indexOf("NK1")).toBeLessThan(names.indexOf("PV1"));
});

test("encode() includes patient-level ROL after PD1 and before PV1", () => {
  const pd1 = new PD1();
  const rol = new ROL();
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    pd1,
    rolList: [rol],
  });
  const segments = msg.encode().split("\r");
  const names = segments.map((s) => s.substring(0, 3));

  expect(names.indexOf("ROL")).toBeGreaterThan(names.indexOf("PD1"));
  expect(names.indexOf("ROL")).toBeLessThan(names.indexOf("PV1"));
});

test("encode() places AL1 and DG1 after OBX list", () => {
  const al1 = new AL1().setId("1");
  const dg1 = new DG1().setId("1");
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    al1List: [al1],
    dg1List: [dg1],
  });
  const segments = msg.encode().split("\r");
  const names = segments.map((s) => s.substring(0, 3));

  expect(names.includes("AL1")).toBe(true);
  expect(names.includes("DG1")).toBe(true);
  expect(names.indexOf("AL1")).toBeGreaterThan(names.indexOf("PV1"));
  expect(names.indexOf("DG1")).toBeGreaterThan(names.indexOf("AL1"));
});

test("encode() places procedure groups after DRG", () => {
  const pr1 = new PR1().setId("1");
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    procedures: [{ pr1 }],
  });
  const segments = msg.encode().split("\r");
  const names = segments.map((s) => s.substring(0, 3));

  expect(names.includes("PR1")).toBe(true);
  expect(names.indexOf("PR1")).toBeGreaterThan(names.indexOf("PV1"));
});

test("encode() interleaves ROL inside procedure group", () => {
  const pr1 = new PR1().setId("1");
  const rol = new ROL();
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    procedures: [{ pr1, rolList: [rol] }],
  });
  const segments = msg.encode().split("\r");
  const names = segments.map((s) => s.substring(0, 3));

  const pr1Idx = names.indexOf("PR1");
  const rolIdx = names.lastIndexOf("ROL");
  expect(rolIdx).toBeGreaterThan(pr1Idx);
});

test("encode() places GT1 before insurance groups", () => {
  const gt1 = new GT1().setId("1");
  const in1 = new IN1().setId("1").insurancePlanId("PPO");
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    gt1List: [gt1],
    insuranceGroups: [{ in1 }],
  });
  const segments = msg.encode().split("\r");
  const names = segments.map((s) => s.substring(0, 3));

  expect(names.indexOf("GT1")).toBeLessThan(names.indexOf("IN1"));
});

test("encode() interleaves IN2 and IN3 inside insurance group", () => {
  const in1 = new IN1().setId("1").insurancePlanId("PPO");
  const in2 = new IN2().insuredSsn("SSN12345");
  const in3 = new IN3().setId("1");
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    insuranceGroups: [{ in1, in2, in3List: [in3] }],
  });
  const segments = msg.encode().split("\r");
  const names = segments.map((s) => s.substring(0, 3));

  const in1Idx = names.indexOf("IN1");
  const in2Idx = names.indexOf("IN2");
  const in3Idx = names.indexOf("IN3");
  expect(in2Idx).toBeGreaterThan(in1Idx);
  expect(in3Idx).toBeGreaterThan(in2Idx);
});

test("encode() handles multiple insurance groups in order", () => {
  const in1a = new IN1().setId("1").insurancePlanId("PPO");
  const in1b = new IN1().setId("2").insurancePlanId("HMO");
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    insuranceGroups: [{ in1: in1a }, { in1: in1b }],
  });
  const segments = msg.encode().split("\r");
  const in1Segments = segments.filter((s) => s.startsWith("IN1|"));
  expect(in1Segments).toHaveLength(2);
});

test("round-trip: build → encode → parse", () => {
  const pr1 = new PR1().setId("1");
  const in1 = new IN1().setId("1").insurancePlanId("PPO");
  const nk1 = new NK1().setId("1");
  const al1 = new AL1().setId("1");

  const msg = createADT_A28(
    makeMSH(),
    makeEVN(),
    makePID(),
    makePV1(),
    {
      nk1List: [nk1],
      al1List: [al1],
      procedures: [{ pr1 }],
      insuranceGroups: [{ in1 }],
    },
  );

  const encoded = msg.encode();
  const parsed = parseADT_A28(encoded);

  expect(parsed.ok).toBe(true);
  expect(parsed.val!.pid).toBeTruthy();
  expect(parsed.val!.pv1).toBeTruthy();
  expect(parsed.val!.nk1List!.length).toBe(1);
  expect(parsed.val!.al1List!.length).toBe(1);
  expect(parsed.val!.procedures!.length).toBe(1);
  expect(parsed.val!.insuranceGroups!.length).toBe(1);
});
