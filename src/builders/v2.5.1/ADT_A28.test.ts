import { test, expect } from "vitest";
import { createADT_A28, ADT_A28 } from "./ADT_A28.ts";
import { MSH } from "../../segments/v2.5.1/MSH.ts";
import { EVN } from "../../segments/v2.5.1/EVN.ts";
import { PID } from "../../segments/v2.5.1/PID.ts";
import { PV1 } from "../../segments/v2.5.1/PV1.ts";
import { NK1 } from "../../segments/v2.5.1/NK1.ts";
import { PR1 } from "../../segments/v2.5.1/PR1.ts";
import { IN1 } from "../../segments/v2.5.1/IN1.ts";
import { IN2 } from "../../segments/v2.5.1/IN2.ts";
import { IN3 } from "../../segments/v2.5.1/IN3.ts";
import { AL1 } from "../../segments/v2.5.1/AL1.ts";
import { GT1 } from "../../segments/v2.5.1/GT1.ts";
import { parseADT_A28 } from "../../parsers/v2.5.1/ADT_A28_Parser.ts";

function makeMSH() {
  return new MSH().sendingApplication("TEST").messageType("ADT", "A28", "ADT_A28");
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
  // deno-lint-ignore no-explicit-any
  const msg = new ADT_A28(null as any, makeEVN(), makePID(), makePV1());
  expect(msg.verify().valid).toBe(false);
  expect(msg.verify().errors.some((e) => e.includes("MSH"))).toBe(true);
});

test("verify() fails when EVN is missing", () => {
  // deno-lint-ignore no-explicit-any
  const msg = new ADT_A28(makeMSH(), null as any, makePID(), makePV1());
  expect(msg.verify().valid).toBe(false);
  expect(msg.verify().errors.some((e) => e.includes("EVN"))).toBe(true);
});

test("verify() fails when PID is missing", () => {
  // deno-lint-ignore no-explicit-any
  const msg = new ADT_A28(makeMSH(), makeEVN(), null as any, makePV1());
  expect(msg.verify().valid).toBe(false);
  expect(msg.verify().errors.some((e) => e.includes("PID"))).toBe(true);
});

test("verify() fails when PV1 is missing", () => {
  // deno-lint-ignore no-explicit-any
  const msg = new ADT_A28(makeMSH(), makeEVN(), makePID(), null as any);
  expect(msg.verify().valid).toBe(false);
  expect(msg.verify().errors.some((e) => e.includes("PV1"))).toBe(true);
});

test("encode() produces correct segment order", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1());
  const names = msg.encode().split("\r").map((s) => s.substring(0, 3));
  expect(names).toEqual(["MSH", "EVN", "PID", "PV1"]);
});

test("encode() includes NK1 before PV1", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    nk1List: [new NK1().setId("1")],
  });
  const names = msg.encode().split("\r").map((s) => s.substring(0, 3));
  expect(names.indexOf("NK1")).toBeLessThan(names.indexOf("PV1"));
});

test("encode() places procedure groups after PV1", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    procedures: [{ pr1: new PR1().setId("1") }],
  });
  const names = msg.encode().split("\r").map((s) => s.substring(0, 3));
  expect(names.indexOf("PR1")).toBeGreaterThan(names.indexOf("PV1"));
});

test("encode() places GT1 before IN1", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    gt1List: [new GT1().setId("1")],
    insuranceGroups: [{ in1: new IN1().setId("1").insurancePlanId("PPO") }],
  });
  const names = msg.encode().split("\r").map((s) => s.substring(0, 3));
  expect(names.indexOf("GT1")).toBeLessThan(names.indexOf("IN1"));
});

test("encode() interleaves IN2 and IN3 inside insurance group", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    insuranceGroups: [{
      in1: new IN1().setId("1").insurancePlanId("PPO"),
      in2: new IN2().insuredSsn("SSN123"),
      in3List: [new IN3().setId("1")],
    }],
  });
  const names = msg.encode().split("\r").map((s) => s.substring(0, 3));
  expect(names.indexOf("IN2")).toBeGreaterThan(names.indexOf("IN1"));
  expect(names.indexOf("IN3")).toBeGreaterThan(names.indexOf("IN2"));
});

test("encode() includes AL1 list after PV1", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    al1List: [new AL1().setId("1")],
  });
  const names = msg.encode().split("\r").map((s) => s.substring(0, 3));
  expect(names.includes("AL1")).toBe(true);
  expect(names.indexOf("AL1")).toBeGreaterThan(names.indexOf("PV1"));
});

test("round-trip: build → encode → parse", () => {
  const msg = createADT_A28(makeMSH(), makeEVN(), makePID(), makePV1(), {
    nk1List: [new NK1().setId("1")],
    al1List: [new AL1().setId("1")],
    procedures: [{ pr1: new PR1().setId("1") }],
    insuranceGroups: [{ in1: new IN1().setId("1").insurancePlanId("PPO") }],
  });

  const parsed = parseADT_A28(msg.encode());
  expect(parsed.ok).toBe(true);
  expect(parsed.val!.nk1List!.length).toBe(1);
  expect(parsed.val!.al1List!.length).toBe(1);
  expect(parsed.val!.procedures!.length).toBe(1);
  expect(parsed.val!.insuranceGroups!.length).toBe(1);
});
