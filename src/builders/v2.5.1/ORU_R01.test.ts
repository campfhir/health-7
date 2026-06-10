import { test, expect } from "vitest";
import type assert from "node:assert";
import { createORU_R01, ORU_R01 } from "./ORU_R01.ts";
import { MSH } from "../../segments/v2.5.1/MSH.ts";
import { PID } from "../../segments/v2.5.1/PID.ts";
import { PV1 } from "../../segments/v2.5.1/PV1.ts";
import { OBR } from "../../segments/v2.5.1/OBR.ts";
import { OBX } from "../../segments/v2.5.1/OBX.ts";

test("createORU_R01 returns ORU_R01 instance", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ORU", "R01");
  const message = createORU_R01(msh);

  expect(message instanceof ORU_R01).toBeTruthy();
});

test("ORU_R01 verify() detects missing MSH segment", () => {
  const message = new ORU_R01(null as any);
  const result = message.verify();

  expect(result.valid).toBe(false);
  expect(result.errors.some((e) => e.includes("MSH segment is required"))).toBeTruthy();
});

test("ORU_R01 verify() detects missing patient results", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ORU", "R01");
  const message = createORU_R01(msh, []);

  const result = message.verify();

  expect(result.valid).toBe(false);
  expect(result.errors.some((e) =>
      e.includes("At least one patient result is required"),
    ), ).toBeTruthy();
});

test("ORU_R01 verify() detects missing order observations", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ORU", "R01");
  const pid = new PID().patientName("Doe", "John");

  const message = createORU_R01(msh, [
    {
      pid,
      orderObservations: [],
    },
  ]);

  const result = message.verify();

  expect(result.valid).toBe(false);
  expect(result.errors.some((e) =>
      e.includes("At least one order observation is required"),
    ), ).toBeTruthy();
});

test("ORU_R01 encodes valid message with minimal data", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ORU", "R01");

  const pid = new PID().patientName("Doe", "John");
  const obr = new OBR().setId("1");
  const obx = new OBX().setId("1").valueType("NM");

  const message = createORU_R01(msh, [
    {
      pid,
      orderObservations: [{ obr, obxList: [obx] }],
    },
  ]);

  const encoded = message.encode();
  const segments = encoded.split("\r");

  expect(segments.length).toBe(4);
  expect(segments[0].startsWith("MSH|")).toBeTruthy();
  expect(segments[1].startsWith("PID|")).toBeTruthy();
  expect(segments[2].startsWith("OBR|")).toBeTruthy();
  expect(segments[3].startsWith("OBX|")).toBeTruthy();
});

test("ORU_R01 encodes message with PV1", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ORU", "R01");

  const pid = new PID().patientName("Doe", "John");
  const pv1 = new PV1().patientClass("I");
  const obr = new OBR().setId("1");
  const obx = new OBX().setId("1").valueType("NM");

  const message = createORU_R01(msh, [
    {
      pid,
      pv1,
      orderObservations: [{ obr, obxList: [obx] }],
    },
  ]);

  const encoded = message.encode();
  const segments = encoded.split("\r");

  expect(segments.length).toBe(5);
  expect(segments[2].substring(0, 3)).toBe("PV1");
});

test("ORU_R01 handles multiple OBX segments", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ORU", "R01");

  const pid = new PID().patientName("Doe", "John");
  const obr = new OBR().setId("1");
  const obx1 = new OBX().setId("1").valueType("NM");
  const obx2 = new OBX().setId("2").valueType("NM");
  const obx3 = new OBX().setId("3").valueType("NM");

  const message = createORU_R01(msh, [
    {
      pid,
      orderObservations: [{ obr, obxList: [obx1, obx2, obx3] }],
    },
  ]);

  const encoded = message.encode();
  const segments = encoded.split("\r");

  expect(segments.length).toBe(6);
});

test("ORU_R01 handles multiple order observations", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ORU", "R01");

  const pid = new PID().patientName("Doe", "John");

  const obr1 = new OBR().setId("1");
  const obx1 = new OBX().setId("1").valueType("NM");

  const obr2 = new OBR().setId("2");
  const obx2 = new OBX().setId("1").valueType("NM");

  const message = createORU_R01(msh, [
    {
      pid,
      orderObservations: [
        { obr: obr1, obxList: [obx1] },
        { obr: obr2, obxList: [obx2] },
      ],
    },
  ]);

  const encoded = message.encode();
  const segments = encoded.split("\r");

  expect(segments.length).toBe(6);
});

test("ORU_R01 handles multiple patient results", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ORU", "R01");

  const pid1 = new PID().patientName("Doe", "John");
  const obr1 = new OBR().setId("1");
  const obx1 = new OBX().setId("1").valueType("NM");

  const pid2 = new PID().patientName("Smith", "Jane");
  const obr2 = new OBR().setId("1");
  const obx2 = new OBX().setId("1").valueType("NM");

  const message = createORU_R01(msh, [
    {
      pid: pid1,
      orderObservations: [{ obr: obr1, obxList: [obx1] }],
    },
    {
      pid: pid2,
      orderObservations: [{ obr: obr2, obxList: [obx2] }],
    },
  ]);

  const encoded = message.encode();
  const segments = encoded.split("\r");

  expect(segments.length).toBe(7);
});

test("ORU_R01 encodes to valid HL7 string", () => {
  const msh = new MSH()
    .sendingApplication("LAB")
    .receivingApplication("EMR")
    .dateTimeOfMessage("20250119120000")
    .messageType("ORU", "R01")
    .messageControlId("MSG001")
    .processingId("P")
    .versionId("2.5.1");

  const pid = new PID()
    .patientIdentifierList("12345")
    .patientName("Doe", "John");

  const obr = new OBR()
    .setId("1")
    .universalServiceIdentifier("CBC", "Complete Blood Count", "LN");

  const obx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("718-7", "Hemoglobin", "LN")
    .observationValue("15.5");

  const message = createORU_R01(msh, [
    {
      pid,
      orderObservations: [{ obr, obxList: [obx] }],
    },
  ]);

  const encoded = message.encode();

  expect(encoded.startsWith("MSH|")).toBeTruthy();
  expect(encoded.includes("\rPID|")).toBeTruthy();
  expect(encoded.includes("\rOBR|")).toBeTruthy();
  expect(encoded.includes("\rOBX|")).toBeTruthy();
});

test("ORU_R01 handles patient result without PID", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ORU", "R01");

  const obr = new OBR().setId("1");
  const obx = new OBX().setId("1").valueType("NM");

  const message = createORU_R01(msh, [
    {
      orderObservations: [{ obr, obxList: [obx] }],
    },
  ]);

  const encoded = message.encode();
  const segments = encoded.split("\r");

  expect(segments.length).toBe(3);
  expect(segments[0].substring(0, 3)).toBe("MSH");
  expect(segments[1].substring(0, 3)).toBe("OBR");
  expect(segments[2].substring(0, 3)).toBe("OBX");
});
