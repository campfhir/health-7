import { test } from "node:test";
import assert from "node:assert";
import { readFileSync, readdirSync } from "fs";
import { join, basename } from "path";
import { parseORU_R01 } from "./ORU_R01_Parser";

const testDataDir = join(__dirname, "..", "testdata", "ORU_R01");

// Get all .hl7 files from the testdata directory
const testFiles = readdirSync(testDataDir).filter((file) =>
  file.endsWith(".hl7"),
);

test("ORU_R01 Integration Tests - Parse validated example messages", async (t) => {
  for (const testFile of testFiles) {
    await t.test(`Parse ${testFile}`, () => {
      const filePath = join(testDataDir, testFile);
      const messageContent = readFileSync(filePath, "utf-8");

      const result = parseORU_R01(messageContent);

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

test("ORU_R01 Integration Tests - Specific message validations", async (t) => {
  await t.test("CBC message has expected OBX count", () => {
    const filePath = join(testDataDir, "01_cbc_complete_blood_count.hl7");
    const messageContent = readFileSync(filePath, "utf-8");
    const result = parseORU_R01(messageContent);

    assert.strictEqual(result.success, true);
    assert.ok(result.data);

    const obxCount =
      result.data.patientResults[0].orderObservations[0].obxList.length;
    assert.ok(obxCount >= 20, `Expected at least 20 OBX segments, got ${obxCount}`);
  });

  await t.test("Microbiology message has specimen information", () => {
    const filePath = join(
      testDataDir,
      "04_wound_culture_microbiology.hl7",
    );
    const messageContent = readFileSync(filePath, "utf-8");
    const result = parseORU_R01(messageContent);

    assert.strictEqual(result.success, true);
    assert.ok(result.data);

    const obxCount =
      result.data.patientResults[0].orderObservations[0].obxList.length;
    assert.ok(obxCount >= 25, `Expected at least 25 OBX segments for microbiology, got ${obxCount}`);
  });

  await t.test("Multiple patients message has 2 patient results", () => {
    const filePath = join(testDataDir, "13_multiple_patients.hl7");
    const messageContent = readFileSync(filePath, "utf-8");
    const result = parseORU_R01(messageContent);

    assert.strictEqual(result.success, true);
    assert.ok(result.data);
    assert.strictEqual(
      result.data.patientResults.length,
      2,
      "Expected 2 patient results",
    );
  });

  await t.test("Multiple orders message has 2 order observations", () => {
    const filePath = join(
      testDataDir,
      "14_multiple_orders_single_patient.hl7",
    );
    const messageContent = readFileSync(filePath, "utf-8");
    const result = parseORU_R01(messageContent);

    assert.strictEqual(result.success, true);
    assert.ok(result.data);
    assert.strictEqual(
      result.data.patientResults[0].orderObservations.length,
      2,
      "Expected 2 order observations",
    );
  });

  await t.test("Critical value message has abnormal flag", () => {
    const filePath = join(
      testDataDir,
      "15_critical_value_notification.hl7",
    );
    const messageContent = readFileSync(filePath, "utf-8");
    const result = parseORU_R01(messageContent);

    assert.strictEqual(result.success, true);
    assert.ok(result.data);

    // Verify at least one OBX has critical values
    const obxList = result.data.patientResults[0].orderObservations[0].obxList;
    const hasCriticalValues = obxList.some((obx) => {
      const abnormalFlags = obx.getAbnormalFlags();
      return abnormalFlags.includes("HH") || abnormalFlags.includes("LL");
    });
    assert.ok(hasCriticalValues, "Expected critical value flags");
  });
});

test("ORU_R01 Integration Tests - Round-trip encoding", async (t) => {
  for (const testFile of testFiles) {
    await t.test(`Round-trip encode/decode ${testFile}`, () => {
      const filePath = join(testDataDir, testFile);
      const messageContent = readFileSync(filePath, "utf-8");

      // Parse original message
      const result = parseORU_R01(messageContent);
      assert.strictEqual(result.success, true);
      assert.ok(result.data);

      // Encode the parsed message
      const encoded = result.data.message.encode();

      // Parse the encoded message
      const result2 = parseORU_R01(encoded);
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
