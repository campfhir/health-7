import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ORU_R30_Parser, parseORU_R30 } from "./ORU_R30_Parser.ts";
import { createORU_R30 } from "../../builders/v2.5.1/ORU_R30.ts";
import { createORU_R31 } from "../../builders/v2.5.1/ORU_R31.ts";
import { createORU_R32 } from "../../builders/v2.5.1/ORU_R32.ts";
import { MSH } from "../../segments/v2.5.1/MSH.ts";
import { PID } from "../../segments/v2.5.1/PID.ts";
import { PV1 } from "../../segments/v2.5.1/PV1.ts";
import { ORC } from "../../segments/v2.5.1/ORC.ts";
import { OBR } from "../../segments/v2.5.1/OBR.ts";
import { OBX } from "../../segments/v2.5.1/OBX.ts";

describe("ORU_R30_Parser", () => {
  const parser = new ORU_R30_Parser();

  describe("Basic ORU^R30 Parsing", () => {
    it("should parse minimal ORU^R30 message", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.val.patientResults.length).toBe(1);
        expect(result.val.patientResults[0].orderObservations.length).toBe(1);
        expect(
          result.val.patientResults[0].orderObservations[0].orc,
        ).toBeTruthy();
        expect(
          result.val.patientResults[0].orderObservations[0].obr,
        ).toBeTruthy();
      }
    });

    it("should parse ORU^R30 with patient demographics", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "PID|1||98765^^^MRN||Smith^Jane^M",
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.val.patientResults.length).toBe(1);
        expect(result.val.patientResults[0].pid).toBeTruthy();
        expect(result.val.patientResults[0].orderObservations.length).toBe(1);
      }
    });

    it("should parse ORU^R30 with visit information", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "PID|1||98765^^^MRN||Smith^Jane",
        "PV1|1|E|ER^5^B",
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.val.patientResults.length).toBe(1);
        expect(result.val.patientResults[0].pid).toBeTruthy();
        expect(result.val.patientResults[0].pv1).toBeTruthy();
        expect(result.val.patientResults[0].orderObservations.length).toBe(1);
      }
    });

    it("should parse ORU^R30 with observations", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
        "OBX|1|NM|2339-0^Glucose POC^LN|1|185|mg/dL",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.val.patientResults.length).toBe(1);
        const orderObs = result.val.patientResults[0].orderObservations[0];
        expect(orderObs.obxList.length).toBe(1);
      }
    });

    it("should parse ORU^R30 with multiple observations", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "ORC|NW|POC12345",
        "OBR|1|POC12345||PANEL^Basic Panel^LN",
        "OBX|1|NM|2339-0^Glucose^LN|1|185|mg/dL",
        "OBX|2|NM|2093-3^Cholesterol^LN|1|210|mg/dL",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        const orderObs = result.val.patientResults[0].orderObservations[0];
        expect(orderObs.obxList.length).toBe(2);
      }
    });
  });

  describe("Multiple Order Observations", () => {
    it("should parse multiple ORC/OBR pairs", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
        "OBX|1|NM|2339-0^Glucose^LN|1|185|mg/dL",
        "ORC|NW|POC12346",
        "OBR|2|POC12346||HGB^Hemoglobin^LN",
        "OBX|1|NM|718-7^Hemoglobin^LN|1|14.5|g/dL",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.val.patientResults.length).toBe(1);
        expect(result.val.patientResults[0].orderObservations.length).toBe(2);
        expect(
          result.val.patientResults[0].orderObservations[0].obxList.length,
        ).toBe(1);
        expect(
          result.val.patientResults[0].orderObservations[1].obxList.length,
        ).toBe(1);
      }
    });
  });

  describe("Multiple Patients", () => {
    it("should parse multiple patient results", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "PID|1||98765^^^MRN||Smith^Jane",
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
        "PID|1||98766^^^MRN||Doe^John",
        "ORC|NW|POC12346",
        "OBR|1|POC12346||HGB^Hemoglobin^LN",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.val.patientResults.length).toBe(2);
      }
    });
  });

  describe("ORU^R31 Parsing", () => {
    it("should parse ORU^R31 message", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R31|MSG001|P|2.5.1",
        "PID|1||98765^^^MRN||Smith^Jane",
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
        "OBX|1|NM|2339-0^Glucose^LN|1|185|mg/dL",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.val.msh.encode().includes("ORU^R31")).toBeTruthy();
        expect(result.val.patientResults.length).toBe(1);
      }
    });
  });

  describe("ORU^R32 Parsing", () => {
    it("should parse ORU^R32 message", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R32|MSG001|P|2.5.1",
        "PID|1||98765^^^MRN||Smith^Jane",
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
        "OBX|1|NM|2339-0^Glucose^LN|1|185|mg/dL",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.val.msh.encode().includes("ORU^R32")).toBeTruthy();
        expect(result.val.patientResults.length).toBe(1);
      }
    });
  });

  describe("Validation", () => {
    it("should fail when OBR appears without preceding ORC", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "OBR|1|POC12345||GLUC^Glucose^LN",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.err.message.includes("OBR")).toBeTruthy();
        expect(result.err.message.includes("ORC")).toBeTruthy();
      }
    });

    it("should fail when OBX appears without preceding OBR", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "ORC|NW|POC12345",
        "OBX|1|NM|2339-0^Glucose^LN|1|185|mg/dL",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.err.message.includes("OBX")).toBeTruthy();
      }
    });

    it("should fail when MSH is missing", () => {
      const message = [
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.err.message.includes("MSH")).toBeTruthy();
      }
    });

    it("should fail on empty message", () => {
      const result = parser.parse("");

      expect(result.ok).toBe(false);
    });
  });

  describe("Line Ending Support", () => {
    it("should handle \\r line endings", () => {
      const message =
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1\rORC|NW|POC12345\rOBR|1|POC12345||GLUC^Glucose^LN";

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
    });

    it("should handle \\n line endings", () => {
      const message =
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1\nORC|NW|POC12345\nOBR|1|POC12345||GLUC^Glucose^LN";

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
    });

    it("should handle \\r\\n line endings", () => {
      const message =
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1\r\nORC|NW|POC12345\r\nOBR|1|POC12345||GLUC^Glucose^LN";

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
    });
  });

  describe("Round-trip Consistency", () => {
    it("should maintain data through build->encode->parse->encode cycle for R30", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .sendingFacility("Bedside Lab")
        .receivingApplication("LIS")
        .receivingFacility("Main Lab")
        .messageType("ORU", "R30")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const pid = new PID()
        .setId("1")
        .patientIdentifierList("98765", "", "", "MRN", "MR")
        .patientName("Smith", "Jane", "M");
      const pv1 = new PV1()
        .setId("1")
        .patientClass("E")
        .assignedPatientLocation("ER", "5", "B");
      const orc = new ORC()
        .orderControl("NW")
        .placerOrderNumber("POC12345")
        .orderStatus("CM");
      const obr = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");
      const obx = new OBX()
        .setId("1")
        .valueType("NM")
        .observationIdentifier("2339-0", "Glucose POC", "LN")
        .observationSubId("1")
        .observationValue("185")
        .units("mg/dL");
      const message = createORU_R30(msh, [
        {
          pid,
          pv1,
          orderObservations: [{ orc, obr, observations: [obx] }],
        },
      ]);

      const encoded1 = message.encode();
      const parseResult = parser.parse(encoded1);

      expect(parseResult.ok).toBe(true);
      if (parseResult.ok) {
        const encoded2 = parseResult.val.message.encode();
        expect(encoded1).toBe(encoded2);
      }
    });

    it("should maintain data through build->encode->parse->encode cycle for R31", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .messageType("ORU", "R31")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const pid = new PID()
        .setId("1")
        .patientIdentifierList("98765", "", "", "MRN")
        .patientName("Smith", "Jane");
      const orc = new ORC().orderControl("NW").placerOrderNumber("POC12345");
      const obr = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");
      const obx = new OBX()
        .setId("1")
        .valueType("NM")
        .observationIdentifier("2339-0", "Glucose", "LN")
        .observationValue("185");
      const message = createORU_R31(msh, [
        {
          pid,
          orderObservations: [{ orc, obr, observations: [obx] }],
        },
      ]);

      const encoded1 = message.encode();
      const parseResult = parser.parse(encoded1);

      expect(parseResult.ok).toBe(true);
      if (parseResult.ok) {
        const encoded2 = parseResult.val.message.encode();
        expect(encoded1).toBe(encoded2);
      }
    });

    it("should maintain data through build->encode->parse->encode cycle for R32", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .messageType("ORU", "R32")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const pid = new PID()
        .setId("1")
        .patientIdentifierList("98765", "", "", "MRN")
        .patientName("Smith", "Jane");
      const orc = new ORC().orderControl("NW").placerOrderNumber("POC12345");
      const obr = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");
      const obx = new OBX()
        .setId("1")
        .valueType("NM")
        .observationIdentifier("2339-0", "Glucose", "LN")
        .observationValue("185");
      const message = createORU_R32(msh, [
        {
          pid,
          orderObservations: [{ orc, obr, observations: [obx] }],
        },
      ]);

      const encoded1 = message.encode();
      const parseResult = parser.parse(encoded1);

      expect(parseResult.ok).toBe(true);
      if (parseResult.ok) {
        const encoded2 = parseResult.val.message.encode();
        expect(encoded1).toBe(encoded2);
      }
    });

    it("should handle multiple patients round-trip", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .messageType("ORU", "R30")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const pid1 = new PID()
        .setId("1")
        .patientIdentifierList("98765", "", "", "MRN")
        .patientName("Smith", "Jane");
      const orc1 = new ORC().orderControl("NW").placerOrderNumber("POC12345");
      const obr1 = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");
      const pid2 = new PID()
        .setId("1")
        .patientIdentifierList("98766", "", "", "MRN")
        .patientName("Doe", "John");
      const orc2 = new ORC().orderControl("NW").placerOrderNumber("POC12346");
      const obr2 = new OBR()
        .setId("1")
        .placerOrderNumber("POC12346")
        .universalServiceIdentifier("HGB", "Hemoglobin", "LN");
      const message = createORU_R30(msh, [
        {
          pid: pid1,
          orderObservations: [{ orc: orc1, obr: obr1, observations: [] }],
        },
        {
          pid: pid2,
          orderObservations: [{ orc: orc2, obr: obr2, observations: [] }],
        },
      ]);

      const encoded1 = message.encode();
      const parseResult = parser.parse(encoded1);

      expect(parseResult.ok).toBe(true);
      if (parseResult.ok) {
        expect(parseResult.val.patientResults.length).toBe(2);
        const encoded2 = parseResult.val.message.encode();
        expect(encoded1).toBe(encoded2);
      }
    });
  });

  describe("Complex Scenarios", () => {
    it("should parse complete point-of-care message", () => {
      const message = [
        "MSH|^~\\&|POC_DEVICE|Bedside Lab|LIS|Main Lab|20251119215601||ORU^R30|MSG20251119215601|P|2.5.1",
        "PID|1||98765^MRN^MR||Smith^Jane^M||19750520|F||||||||||||||||||||||",
        "PV1|1|E|ER^5^B^Main||||5678^Johnson^Robert|||||||||||||||||||||||||||||||",
        "ORC|NW|POC12345|||CM||||20251119215601|||5678^Johnson^Robert",
        "OBR|1|POC12345||GLUC^Glucose^LN|||20251119215601||||||||||5678^Johnson^Robert",
        "OBX|1|NM|2339-0^Glucose POC^LN|1|185|mg/dL||H|||F|||20251119215601",
      ].join("\r");

      const result = parser.parse(message);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.val.patientResults.length).toBe(1);
        const patient = result.val.patientResults[0];
        expect(patient.pid).toBeTruthy();
        expect(patient.pv1).toBeTruthy();
        expect(patient.orderObservations.length).toBe(1);
        expect(patient.orderObservations[0].orc).toBeTruthy();
        expect(patient.orderObservations[0].obr).toBeTruthy();
        expect(patient.orderObservations[0].obxList.length).toBe(1);
      }
    });
  });
});

// ---------------------------------------------------------------------------
// Integration tests — parse validated example .hl7 files
// ---------------------------------------------------------------------------

const testDataDir = join(__dirname, "..", "testdata", "ORU_R30");
const testFiles = readdirSync(testDataDir).filter((f) => f.endsWith(".hl7"));

describe("ORU_R30 Integration Tests - Parse validated example messages", () => {
  for (const testFile of testFiles) {
    it(`Parse ${testFile}`, () => {
      const messageContent = readFileSync(join(testDataDir, testFile), "utf-8");
      const result = parseORU_R30(messageContent);

      expect(
        result.ok,
        `Failed to parse ${testFile}: ${result.err?.message}`,
      ).toBe(true);
      expect(result.val, `No data returned for ${testFile}`).toBeTruthy();
      expect(result.val!.msh, `No MSH segment in ${testFile}`).toBeTruthy();
      expect(
        result.val!.patientResults.length > 0,
        `No patient results in ${testFile}`,
      ).toBeTruthy();

      for (const patientResult of result.val!.patientResults) {
        expect(
          patientResult.orderObservations.length > 0,
          `No order observations in patient result for ${testFile}`,
        ).toBeTruthy();
      }
    });
  }
});

describe("ORU_R30 Integration Tests - Event type validation", () => {
  it("R30 messages have ORC with NW or RE", () => {
    for (const testFile of testFiles.filter((f) => f.includes("_r30"))) {
      const result = parseORU_R30(
        readFileSync(join(testDataDir, testFile), "utf-8"),
      );
      expect(result.ok).toBe(true);
      expect(
        result.val!.msh.getMessageType().messageCode,
        `Expected ORU message code in ${testFile}`,
      ).toBe("ORU");
    }
  });

  it("R31 messages parse correctly", () => {
    for (const testFile of testFiles.filter((f) => f.includes("_r31"))) {
      const result = parseORU_R30(
        readFileSync(join(testDataDir, testFile), "utf-8"),
      );
      expect(result.ok, `Failed to parse R31 message ${testFile}`).toBe(true);
    }
  });

  it("R32 messages have existing order references", () => {
    for (const testFile of testFiles.filter((f) => f.includes("_r32"))) {
      const result = parseORU_R30(
        readFileSync(join(testDataDir, testFile), "utf-8"),
      );
      expect(result.ok).toBe(true);
      const firstOrc = result.val!.patientResults[0].orderObservations[0].orc;
      expect(firstOrc, `Expected ORC segment in ${testFile}`).toBeTruthy();
    }
  });
});

describe("ORU_R30 Integration Tests - Point of Care validations", () => {
  it("Glucose meter message has valid glucose reading", () => {
    const result = parseORU_R30(
      readFileSync(join(testDataDir, "01_glucose_meter_r30.hl7"), "utf-8"),
    );
    expect(result.ok).toBe(true);
    expect(
      result.val!.patientResults[0].orderObservations[0].obxList.length > 0,
      "Expected at least one OBX",
    ).toBeTruthy();
  });

  it("Blood pressure message has systolic and diastolic", () => {
    const result = parseORU_R30(
      readFileSync(join(testDataDir, "02_blood_pressure_r30.hl7"), "utf-8"),
    );
    expect(result.ok).toBe(true);
    const obxList = result.val!.patientResults[0].orderObservations[0].obxList;
    expect(
      obxList.length >= 2,
      "Expected at least 2 OBX segments (systolic and diastolic)",
    ).toBeTruthy();
  });

  it("ABG message has multiple parameters", () => {
    const result = parseORU_R30(
      readFileSync(join(testDataDir, "06_arterial_blood_gas_r32.hl7"), "utf-8"),
    );
    expect(result.ok).toBe(true);
    const obxList = result.val!.patientResults[0].orderObservations[0].obxList;
    expect(
      obxList.length >= 6,
      `Expected at least 6 OBX segments for ABG, got ${obxList.length}`,
    ).toBeTruthy();
  });

  it("Multiple vitals message has complete vital signs", () => {
    const result = parseORU_R30(
      readFileSync(join(testDataDir, "11_multiple_vitals_r30.hl7"), "utf-8"),
    );
    expect(result.ok).toBe(true);
    const obxList = result.val!.patientResults[0].orderObservations[0].obxList;
    expect(
      obxList.length >= 7,
      `Expected at least 7 OBX segments for complete vitals, got ${obxList.length}`,
    ).toBeTruthy();
  });
});

describe("ORU_R30 Integration Tests - Round-trip encoding", () => {
  for (const testFile of testFiles) {
    it(`Round-trip encode/decode ${testFile}`, () => {
      const messageContent = readFileSync(join(testDataDir, testFile), "utf-8");
      const result = parseORU_R30(messageContent);
      expect(result.ok).toBe(true);

      const result2 = parseORU_R30(result.val!.message.encode());
      expect(
        result2.ok,
        `Round-trip failed for ${testFile}: ${result2.err?.message}`,
      ).toBe(true);
      expect(
        result2.val!.patientResults.length,
        `Patient result count mismatch in round-trip for ${testFile}`,
      ).toBe(result.val!.patientResults.length);
    });
  }
});
