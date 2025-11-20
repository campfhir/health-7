import { test } from "node:test";
import assert from "node:assert";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parseORU_R30 } from "./ORU_R30_Parser";

const testDataDir = join(__dirname, "..", "testdata", "ORU_R30");

// Get all .hl7 files from the testdata directory
const testFiles = readdirSync(testDataDir).filter((file) =>
  file.endsWith(".hl7"),
);

test("ORU_R30 Integration Tests - Parse validated example messages", async (t) => {
  for (const testFile of testFiles) {
    await t.test(`Parse ${testFile}`, () => {
      const filePath = join(testDataDir, testFile);
      const messageContent = readFileSync(filePath, "utf-8");

      const result = parseORU_R30(messageContent);

      // Basic assertions - all messages should parse successfully
      assert.strictEqual(
        result.success,
        true,
        `Failed to parse ${testFile}: ${result.error}`,
      );
      assert.ok(result.data, `No data returned for ${testFile}`);

      // Verify MSH segment exists
      assert.ok(result.data.msh, `No MSH segment in ${testFile}`);

      // Verify at least one patient result exists
      assert.ok(
        result.data.patientResults.length > 0,
        `No patient results in ${testFile}`,
      );

      // Verify each patient result has at least one order observation
      for (const patientResult of result.data.patientResults) {
        assert.ok(
          patientResult.orderObservations.length > 0,
          `No order observations in patient result for ${testFile}`,
        );
      }
    });
  }
});

test("ORU_R30 Integration Tests - Event type validation", async (t) => {
  await t.test("R30 messages have ORC with NW or RE", () => {
    const r30Files = testFiles.filter((f) => f.includes("_r30"));

    for (const testFile of r30Files) {
      const filePath = join(testDataDir, testFile);
      const messageContent = readFileSync(filePath, "utf-8");
      const result = parseORU_R30(messageContent);

      assert.strictEqual(result.success, true);
      assert.ok(result.data);

      // Verify message type is ORU
      const msgType = result.data.msh.getMessageType();
      assert.strictEqual(
        msgType.messageCode,
        "ORU",
        `Expected ORU message code in ${testFile}`,
      );
    }
  });

  await t.test("R31 messages parse correctly", () => {
    const r31Files = testFiles.filter((f) => f.includes("_r31"));

    for (const testFile of r31Files) {
      const filePath = join(testDataDir, testFile);
      const messageContent = readFileSync(filePath, "utf-8");
      const result = parseORU_R30(messageContent);

      assert.strictEqual(
        result.success,
        true,
        `Failed to parse R31 message ${testFile}`,
      );
      assert.ok(result.data);
    }
  });

  await t.test("R32 messages have existing order references", () => {
    const r32Files = testFiles.filter((f) => f.includes("_r32"));

    for (const testFile of r32Files) {
      const filePath = join(testDataDir, testFile);
      const messageContent = readFileSync(filePath, "utf-8");
      const result = parseORU_R30(messageContent);

      assert.strictEqual(result.success, true);
      assert.ok(result.data);

      // R32 messages should have ORC with RE (existing order)
      const firstOrc = result.data.patientResults[0].orderObservations[0].orc;
      assert.ok(firstOrc, `Expected ORC segment in ${testFile}`);
    }
  });
});

test("ORU_R30 Integration Tests - Point of Care validations", async (t) => {
  await t.test("Glucose meter message has valid glucose reading", () => {
    const filePath = join(testDataDir, "01_glucose_meter_r30.hl7");
    const messageContent = readFileSync(filePath, "utf-8");
    const result = parseORU_R30(messageContent);

    assert.strictEqual(result.success, true);
    assert.ok(result.data);

    const obxList = result.data.patientResults[0].orderObservations[0].obxList;
    assert.ok(obxList.length > 0, "Expected at least one OBX");
  });

  await t.test("Blood pressure message has systolic and diastolic", () => {
    const filePath = join(testDataDir, "02_blood_pressure_r30.hl7");
    const messageContent = readFileSync(filePath, "utf-8");
    const result = parseORU_R30(messageContent);

    assert.strictEqual(result.success, true);
    assert.ok(result.data);

    const obxList = result.data.patientResults[0].orderObservations[0].obxList;
    assert.ok(
      obxList.length >= 2,
      "Expected at least 2 OBX segments (systolic and diastolic)",
    );
  });

  await t.test("ABG message has multiple parameters", () => {
    const filePath = join(testDataDir, "06_arterial_blood_gas_r32.hl7");
    const messageContent = readFileSync(filePath, "utf-8");
    const result = parseORU_R30(messageContent);

    assert.strictEqual(result.success, true);
    assert.ok(result.data);

    const obxList = result.data.patientResults[0].orderObservations[0].obxList;
    assert.ok(
      obxList.length >= 6,
      `Expected at least 6 OBX segments for ABG, got ${obxList.length}`,
    );
  });

  await t.test("Multiple vitals message has complete vital signs", () => {
    const filePath = join(testDataDir, "11_multiple_vitals_r30.hl7");
    const messageContent = readFileSync(filePath, "utf-8");
    const result = parseORU_R30(messageContent);

    assert.strictEqual(result.success, true);
    assert.ok(result.data);

    const obxList = result.data.patientResults[0].orderObservations[0].obxList;
    assert.ok(
      obxList.length >= 7,
      `Expected at least 7 OBX segments for complete vitals, got ${obxList.length}`,
    );
  });
});

test("ORU_R30 Integration Tests - Round-trip encoding", async (t) => {
  for (const testFile of testFiles) {
    await t.test(`Round-trip encode/decode ${testFile}`, () => {
      const filePath = join(testDataDir, testFile);
      const messageContent = readFileSync(filePath, "utf-8");

      // Parse original message
      const result = parseORU_R30(messageContent);
      assert.strictEqual(result.success, true);
      assert.ok(result.data);

      // Encode the parsed message
      const encoded = result.data.message.encode();

      // Parse the encoded message
      const result2 = parseORU_R30(encoded);
      assert.strictEqual(
        result2.success,
        true,
        `Round-trip failed for ${testFile}: ${result2.error}`,
      );
      assert.ok(result2.data);

      // Verify same number of patient results
      assert.strictEqual(
        result2.data.patientResults.length,
        result.data.patientResults.length,
        `Patient result count mismatch in round-trip for ${testFile}`,
      );
    });
  }
});
