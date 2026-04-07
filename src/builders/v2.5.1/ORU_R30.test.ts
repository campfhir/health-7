import { describe, it, expect } from "vitest";
import { createORU_R30 } from "./ORU_R30.js";
import { createORU_R31 } from "./ORU_R31.js";
import { createORU_R32 } from "./ORU_R32.js";
import { PID } from "../../segments/v2.5.1/PID.js";
import { ORC } from "../../segments/v2.5.1/ORC.js";
import { OBX } from "../../segments/v2.5.1/OBX.js";
import { MSH } from "../../segments/v2.5.1/MSH.js";
import { OBR } from "../../segments/v2.5.1/OBR.js";
import assert from "node:assert";
import { PV1 } from "../../segments/v2.5.1/PV1.js";

describe("ORU_R30 Builder", () => {
  describe("createORU_R30", () => {
    it("should create minimal ORU^R30 message", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .sendingFacility("Bedside Lab")
        .receivingApplication("LIS")
        .receivingFacility("Main Lab")
        .messageType("ORU", "R30")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const orc = new ORC().orderControl("NW").placerOrderNumber("POC12345");
      const obr = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");

      const message = createORU_R30(msh, [
        {
          orderObservations: [{ orc, obr, observations: [] }],
        },
      ]);
      const encoded = message.encode();
      const segments = encoded.split("\r");

      expect(segments[0].substring(0, 3)).toBe("MSH");
      expect(segments[1].substring(0, 3)).toBe("ORC");
    });
    it("should create ORU^R30 message with patient demographics", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .messageType("ORU", "R30")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const pid = new PID()
        .setId("1")
        .patientIdentifierList("98765", "", "", "MRN", "MR")
        .patientName("Smith", "Jane", "M");
      const orc = new ORC().orderControl("NW").placerOrderNumber("POC12345");
      const obr = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");

      const message = createORU_R30(msh, [
        {
          pid,
          orderObservations: [{ orc, obr, observations: [] }],
        },
      ]);
      const encoded = message.encode();
      const segments = encoded.split("\r");

      expect(segments[0].substring(0, 3)).toBe("MSH");
      expect(segments[2].substring(0, 3)).toBe("ORC");
    });
    it("should create ORU^R30 message with visit information", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .messageType("ORU", "R30")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const pid = new PID()
        .setId("1")
        .patientIdentifierList("98765", "", "", "MRN", "MR")
        .patientName("Smith", "Jane");
      const pv1 = new PV1().setId("1").patientClass("E");

      const orc = new ORC().orderControl("NW").placerOrderNumber("POC12345");
      const obr = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");

      const message = createORU_R30(msh, [
        {
          pid,
          pv1,
          orderObservations: [{ orc, obr, observations: [] }],
        },
      ]);
      const encoded = message.encode();
      const segments = encoded.split("\r");

      expect(segments[0].substring(0, 3)).toBe("MSH");
      expect(segments[2].substring(0, 3)).toBe("PV1");
      expect(segments[4].substring(0, 3)).toBe("OBR");
    });

    it("should create ORU^R30 message with observations", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .messageType("ORU", "R30")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const orc = new ORC().orderControl("NW").placerOrderNumber("POC12345");
      const obr = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");

      const obx = new OBX()
        .setId("1")
        .valueType("NM")
        .observationIdentifier("2339-0", "Glucose POC", "LN")
        .observationSubId("1")
        .observationValue("185");

      const message = createORU_R30(msh, [
        {
          orderObservations: [{ orc, obr, observations: [obx] }],
        },
      ]);
      const encoded = message.encode();
      const segments = encoded.split("\r");

      expect(segments[0].substring(0, 3)).toBe("MSH");
      expect(segments[2].substring(0, 3)).toBe("OBR");
      expect(segments[3].includes("185")).toBeTruthy();
    });
    it("should create ORU^R30 message with multiple observations", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .messageType("ORU", "R30")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const orc = new ORC().orderControl("NW").placerOrderNumber("POC12345");
      const obr = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");

      const obx1 = new OBX()
        .setId("1")
        .valueType("NM")
        .observationIdentifier("2339-0", "Glucose", "LN")
        .observationValue("185");

      const obx2 = new OBX()
        .setId("2")
        .valueType("NM")
        .observationIdentifier("2093-3", "Cholesterol", "LN")
        .observationValue("210");

      const message = createORU_R30(msh, [
        {
          orderObservations: [{ orc, obr, observations: [obx1, obx2] }],
        },
      ]);
      const encoded = message.encode();
      const segments = encoded.split("\r");

      expect(segments.length).toBe(5);
      expect(segments[4].substring(0, 3)).toBe("OBX");
      expect(segments[4].includes("Cholesterol")).toBeTruthy();
    });

    it("should create ORU^R30 message with multiple order observations", () => {
      const msh = new MSH()
        .sendingApplication("POC_DEVICE")
        .messageType("ORU", "R30")
        .messageControlId("MSG12345")
        .versionId("2.5.1");
      const orc1 = new ORC().orderControl("NW").placerOrderNumber("POC12345");
      const obr1 = new OBR()
        .setId("1")
        .placerOrderNumber("POC12345")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");

      const obx1 = new OBX()
        .setId("1")
        .valueType("NM")
        .observationIdentifier("2339-0", "Glucose", "LN")
        .observationValue("185");
      const orc2 = new ORC().orderControl("NW").placerOrderNumber("POC12346");
      const obr2 = new OBR()
        .setId("2")
        .placerOrderNumber("POC12346")
        .universalServiceIdentifier("GLUC", "Glucose", "LN");

      const obx2 = new OBX()
        .setId("1")
        .valueType("NM")
        .observationIdentifier("718-7", "Hemoglobin", "LN")
        .observationValue("14.5");
      const message = createORU_R30(msh, [
        {
          orderObservations: [
            { orc: orc1, obr: obr1, observations: [obx1] },
            { orc: orc2, obr: obr2, observations: [obx2] },
          ],
        },
      ]);
      const encoded = message.encode();
      const segments = encoded.split("\r");

      expect(segments[0].substring(0, 3)).toBe("MSH");
      expect(segments[2].substring(0, 3)).toBe("OBR");
      expect(segments[4].substring(0, 3)).toBe("ORC");
      expect(segments[6].substring(0, 3)).toBe("OBX");
    });

    it("should create ORU^R30 message with multiple patients", () => {
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
        .universalServiceIdentifier("GLUC", "Glucose", "LN");

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
      const encoded = message.encode();
      const segments = encoded.split("\r");

      expect(segments[0].substring(0, 3)).toBe("MSH");
      expect(segments[1].includes("Smith")).toBeTruthy();
      expect(segments[3].substring(0, 3)).toBe("OBR");
      expect(segments[4].includes("Doe")).toBeTruthy();
      expect(segments[6].substring(0, 3)).toBe("OBR");
    });

    describe("createORU_R31", () => {
      it("should create ORU^R31 message", () => {
        const msh = new MSH()
          .sendingApplication("POC_DEVICE")
          .messageType("ORU", "R31")
          .messageControlId("MSG12345")
          .versionId("2.5.1");
        const orc = new ORC().orderControl("NW").placerOrderNumber("POC12345");
        const obr = new OBR()
          .setId("1")
          .placerOrderNumber("POC12345")
          .universalServiceIdentifier("GLUC", "Glucose", "LN");

        const message = createORU_R31(msh, [
          {
            orderObservations: [{ orc, obr, observations: [] }],
          },
        ]);
        const encoded = message.encode();
        const segments = encoded.split("\r");

        expect(segments[0].substring(0, 3)).toBe("MSH");
        expect(segments[1].substring(0, 3)).toBe("ORC");
      });
      it("should create ORU^R31 with complete patient data", () => {
        const msh = new MSH()
          .sendingApplication("POC_DEVICE")
          .messageType("ORU", "R31")
          .messageControlId("MSG12345")
          .versionId("2.5.1");
        const pid = new PID()
          .setId("1")
          .patientIdentifierList("98765", "", "", "MRN")
          .patientName("Smith", "Jane");
        const pv1 = new PV1().setId("1").patientClass("I");
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
            pv1,
            orderObservations: [{ orc, obr, observations: [obx] }],
          },
        ]);
        const encoded = message.encode();
        const segments = encoded.split("\r");

        expect(segments.length).toBe(6);
      });
    });

    describe("createORU_R32", () => {
      it("should create ORU^R32 message", () => {
        const msh = new MSH()
          .sendingApplication("POC_DEVICE")
          .messageType("ORU", "R32")
          .messageControlId("MSG12345")
          .versionId("2.5.1");
        const orc = new ORC().orderControl("NW").placerOrderNumber("POC12345");
        const obr = new OBR()
          .setId("1")
          .placerOrderNumber("POC12345")
          .universalServiceIdentifier("GLUC", "Glucose", "LN");

        const message = createORU_R32(msh, [
          {
            orderObservations: [{ orc, obr, observations: [] }],
          },
        ]);
        const encoded = message.encode();
        const segments = encoded.split("\r");

        expect(segments[0].substring(0, 3)).toBe("MSH");
        expect(segments[1].substring(0, 3)).toBe("ORC");
      });
      it("should create ORU^R32 with complete patient data", () => {
        const msh = new MSH()
          .sendingApplication("POC_DEVICE")
          .messageType("ORU", "R32")
          .messageControlId("MSG12345")
          .versionId("2.5.1");
        const pid = new PID()
          .setId("1")
          .patientIdentifierList("98765", "", "", "MRN")
          .patientName("Smith", "Jane");
        const pv1 = new PV1().setId("1").patientClass("O");
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
            pv1,
            orderObservations: [{ orc, obr, observations: [obx] }],
          },
        ]);
        const encoded = message.encode();
        const segments = encoded.split("\r");

        expect(segments.length).toBe(6);
      });

      describe("Segment Ordering Validation", () => {
        it("should maintain correct segment order: MSH, PID, PV1, ORC, OBR, OBX", () => {
          const msh = new MSH()
            .sendingApplication("POC_DEVICE")
            .messageType("ORU", "R30")
            .messageControlId("MSG12345")
            .versionId("2.5.1");
          const pid = new PID()
            .setId("1")
            .patientIdentifierList("98765", "", "", "MRN")
            .patientName("Smith", "Jane");
          const pv1 = new PV1().setId("1").patientClass("E");
          const orc = new ORC()
            .orderControl("NW")
            .placerOrderNumber("POC12345");
          const obr = new OBR()
            .setId("1")
            .placerOrderNumber("POC12345")
            .universalServiceIdentifier("GLUC", "Glucose", "LN");

          const obx = new OBX()
            .setId("1")
            .valueType("NM")
            .observationIdentifier("2339-0", "Glucose", "LN")
            .observationValue("185");
          const message = createORU_R30(msh, [
            {
              pid,
              pv1,
              orderObservations: [{ orc, obr, observations: [obx] }],
            },
          ]);
          const encoded = message.encode();
          const segments = encoded.split("\r");

          expect(segments[0].substring(0, 3)).toBe("MSH");
          expect(segments[2].substring(0, 3)).toBe("PV1");
          expect(segments[4].substring(0, 3)).toBe("OBR");
        });
        it("should require ORC before OBR", () => {
          const msh = new MSH()
            .sendingApplication("POC_DEVICE")
            .messageType("ORU", "R30")
            .messageControlId("MSG12345")
            .versionId("2.5.1");
          const orc = new ORC()
            .orderControl("NW")
            .placerOrderNumber("POC12345");
          const obr = new OBR()
            .setId("1")
            .placerOrderNumber("POC12345")
            .universalServiceIdentifier("GLUC", "Glucose", "LN");

          // This should work - ORC followed by OBR
          const message = createORU_R30(msh, [
            {
              orderObservations: [{ orc, obr, observations: [] }],
            },
          ]);
          const encoded = message.encode();
          const segments = encoded.split("\r");

          // Verify ORC comes before OBR
          let orcIndex = -1;
          let obrIndex = -1;

          segments.forEach((seg, idx) => {
            if (seg.startsWith("ORC")) orcIndex = idx;
            if (seg.startsWith("OBR")) obrIndex = idx;
          });
          expect(orcIndex !== -1, "ORC segment should exist").toBeTruthy();
          expect(obrIndex !== -1, "OBR segment should exist").toBeTruthy();
          expect(orcIndex < obrIndex, "ORC should come before OBR").toBeTruthy();
        });
      });
    });
  });
});
