import { describe, it } from "node:test";
import assert from "node:assert";
import { ORU_R30_Parser } from "./ORU_R30_Parser.js";
import {
  createORU_R30,
  createORU_R31,
  createORU_R32,
} from "../../builders/v2.5.1/ORU_R30.js";
import { MSH } from "../../segments/v2.5.1/MSH.js";
import { PID } from "../../segments/v2.5.1/PID.js";
import { PV1 } from "../../segments/v2.5.1/PV1.js";
import { ORC } from "../../segments/v2.5.1/ORC.js";
import { OBR } from "../../segments/v2.5.1/OBR.js";
import { OBX } from "../../segments/v2.5.1/OBX.js";
import { DEFAULT_ENCODING } from "../../types/encoding.js";

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

      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.patientResults.length, 1);
        assert.strictEqual(
          result.data.patientResults[0].orderObservations.length,
          1,
        );
        assert.ok(result.data.patientResults[0].orderObservations[0].orc);
        assert.ok(result.data.patientResults[0].orderObservations[0].obr);
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

      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.patientResults.length, 1);
        assert.ok(result.data.patientResults[0].pid);
        assert.strictEqual(
          result.data.patientResults[0].orderObservations.length,
          1,
        );
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

      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.patientResults.length, 1);
        assert.ok(result.data.patientResults[0].pid);
        assert.ok(result.data.patientResults[0].pv1);
        assert.strictEqual(
          result.data.patientResults[0].orderObservations.length,
          1,
        );
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

      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.patientResults.length, 1);
        const orderObs = result.data.patientResults[0].orderObservations[0];
        assert.strictEqual(orderObs.obxList.length, 1);
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

      assert.strictEqual(result.success, true);
      if (result.success) {
        const orderObs = result.data.patientResults[0].orderObservations[0];
        assert.strictEqual(orderObs.obxList.length, 2);
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

      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.patientResults.length, 1);
        assert.strictEqual(
          result.data.patientResults[0].orderObservations.length,
          2,
        );
        assert.strictEqual(
          result.data.patientResults[0].orderObservations[0].obxList.length,
          1,
        );
        assert.strictEqual(
          result.data.patientResults[0].orderObservations[1].obxList.length,
          1,
        );
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

      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.patientResults.length, 2);
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

      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.ok(result.data.msh.encode().includes("ORU^R31"));
        assert.strictEqual(result.data.patientResults.length, 1);
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

      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.ok(result.data.msh.encode().includes("ORU^R32"));
        assert.strictEqual(result.data.patientResults.length, 1);
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

      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.includes("OBR"));
        assert.ok(result.error.includes("ORC"));
      }
    });

    it("should fail when OBX appears without preceding OBR", () => {
      const message = [
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1",
        "ORC|NW|POC12345",
        "OBX|1|NM|2339-0^Glucose^LN|1|185|mg/dL",
      ].join("\r");

      const result = parser.parse(message);

      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.includes("OBX"));
      }
    });

    it("should fail when MSH is missing", () => {
      const message = [
        "ORC|NW|POC12345",
        "OBR|1|POC12345||GLUC^Glucose^LN",
      ].join("\r");

      const result = parser.parse(message);

      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.includes("MSH"));
      }
    });

    it("should fail on empty message", () => {
      const result = parser.parse("");

      assert.strictEqual(result.success, false);
    });
  });

  describe("Line Ending Support", () => {
    it("should handle \\r line endings", () => {
      const message =
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1\rORC|NW|POC12345\rOBR|1|POC12345||GLUC^Glucose^LN";

      const result = parser.parse(message);

      assert.strictEqual(result.success, true);
    });

    it("should handle \\n line endings", () => {
      const message =
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1\nORC|NW|POC12345\nOBR|1|POC12345||GLUC^Glucose^LN";

      const result = parser.parse(message);

      assert.strictEqual(result.success, true);
    });

    it("should handle \\r\\n line endings", () => {
      const message =
        "MSH|^~\\&|POC|Lab|LIS|Hospital|20251119120000||ORU^R30|MSG001|P|2.5.1\r\nORC|NW|POC12345\r\nOBR|1|POC12345||GLUC^Glucose^LN";

      const result = parser.parse(message);

      assert.strictEqual(result.success, true);
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

      assert.strictEqual(parseResult.success, true);
      if (parseResult.success) {
        const encoded2 = parseResult.data.message.encode();
        assert.strictEqual(encoded1, encoded2);
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

      assert.strictEqual(parseResult.success, true);
      if (parseResult.success) {
        const encoded2 = parseResult.data.message.encode();
        assert.strictEqual(encoded1, encoded2);
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

      assert.strictEqual(parseResult.success, true);
      if (parseResult.success) {
        const encoded2 = parseResult.data.message.encode();
        assert.strictEqual(encoded1, encoded2);
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

      assert.strictEqual(parseResult.success, true);
      if (parseResult.success) {
        assert.strictEqual(parseResult.data.patientResults.length, 2);
        const encoded2 = parseResult.data.message.encode();
        assert.strictEqual(encoded1, encoded2);
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

      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.patientResults.length, 1);
        const patient = result.data.patientResults[0];
        assert.ok(patient.pid);
        assert.ok(patient.pv1);
        assert.strictEqual(patient.orderObservations.length, 1);
        assert.ok(patient.orderObservations[0].orc);
        assert.ok(patient.orderObservations[0].obr);
        assert.strictEqual(patient.orderObservations[0].obxList.length, 1);
      }
    });
  });
});
