import { parseORU_R01 } from "../src/parsers/v2.5.1/ORU_R01_Parser";
import { createORU_R01 } from "../src/builders/v2.5.1/ORU_R01";
import { OBX, OBR } from "../src/segments/v2.5.1";

const originalMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20231115140500||ORU^R01|MSG001|P|2.5|||AL||
PID|1||123456789^^^MRN||DOE^JOHN^A||19750225|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^L|||20231115120000
OBX|1|NM|6690-2^WBC^LN|1|7.5|10*3/uL|4.0-11.0|N|||F
OBX|2|NM|789-8^RBC^LN|1|4.8|10*6/uL|4.5-5.9|N|||F
OBR|2|ORD456|LAB789|GLU^Glucose^L|||20231115130000
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL|70-100|N|||F`;

console.log("=== Automatic Set ID Renumbering Demo ===\n");

// Parse the message
const parseResult = parseORU_R01(originalMessage);
if (!parseResult.success || !parseResult.data) {
  console.error("Parse failed");
  process.exit(1);
}

const patient = parseResult.data.patientResults[0];

console.log("Original Set IDs:");
patient.orderObservations.forEach((order, idx) => {
  console.log(`  OBR[${idx}] Set ID: ${order.obr.fields[0]?.components[0]?.subComponents[0]}`);
  order.obxList.forEach((obx, obxIdx) => {
    console.log(`    OBX[${obxIdx}] Set ID: ${obx.fields[0]?.components[0]?.subComponents[0]}`);
  });
});
console.log();

// Add new OBR at the beginning with random Set ID
const sodiumObr = new OBR()
  .setId("999") // Don't worry about the Set ID - we'll renumber automatically!
  .placerOrderNumber("NEWORDER")
  .fillerOrderNumber("NEWLAB")
  .universalServiceIdentifier("NA", "Sodium", "L")
  .observationDateTime("20231115110000");

const sodiumObx = new OBX()
  .setId("888") // Random ID is fine
  .valueType("NM")
  .observationIdentifier("2951-2", "Sodium", "LN")
  .observationSubId("1")
  .observationValue("140")
  .units("mmol/L");

patient.orderObservations.unshift({
  obr: sodiumObr,
  obxList: [sodiumObx],
});

// Add new OBX to the middle of CBC with random Set ID
const hgbObx = new OBX()
  .setId("777") // Random ID
  .valueType("NM")
  .observationIdentifier("718-7", "Hemoglobin", "LN")
  .observationSubId("1")
  .observationValue("14.5")
  .units("g/dL");

patient.orderObservations[1].obxList.splice(1, 0, hgbObx);

console.log("After adding segments (Set IDs are wrong):");
patient.orderObservations.forEach((order, idx) => {
  console.log(`  OBR[${idx}] Set ID: ${order.obr.fields[0]?.components[0]?.subComponents[0]}`);
  order.obxList.forEach((obx, obxIdx) => {
    console.log(`    OBX[${obxIdx}] Set ID: ${obx.fields[0]?.components[0]?.subComponents[0]}`);
  });
});
console.log();

// Option 1: Encode WITHOUT automatic renumbering (preserves wrong IDs)
const withoutRenumber = createORU_R01(parseResult.data.msh, [patient]);
const encodedWithout = withoutRenumber.encode(); // No renumberSetIds option

console.log("Encoded WITHOUT renumberSetIds option:");
encodedWithout.split('\r').forEach((seg) => {
  if (seg.startsWith('OBR') || seg.startsWith('OBX')) {
    const setId = seg.split('|')[1];
    console.log(`  ${seg.substring(0, 3)}|${setId}|... (Set ID: ${setId})`);
  }
});
console.log();

// Option 2: Encode WITH automatic renumbering (fixes all Set IDs)
const withRenumber = createORU_R01(parseResult.data.msh, [patient]);
const encodedWith = withRenumber.encode({ renumberSetIds: true }); // ✅ Automatic renumbering

console.log("Encoded WITH renumberSetIds: true option:");
encodedWith.split('\r').forEach((seg) => {
  if (seg.startsWith('OBR') || seg.startsWith('OBX')) {
    const setId = seg.split('|')[1];
    console.log(`  ${seg.substring(0, 3)}|${setId}|... (Set ID: ${setId})`);
  }
});
console.log();

// Verify by re-parsing
const verifyResult = parseORU_R01(encodedWith);
if (verifyResult.success && verifyResult.data) {
  console.log("✅ Verification: All Set IDs are now sequential");
  const verifyPatient = verifyResult.data.patientResults[0];
  verifyPatient.orderObservations.forEach((order, idx) => {
    const obrId = order.obr.fields[0]?.components[0]?.subComponents[0];
    console.log(`  OBR[${idx}] Set ID: ${obrId} ${obrId === String(idx + 1) ? "✓" : "✗"}`);
    order.obxList.forEach((obx, obxIdx) => {
      const obxId = obx.fields[0]?.components[0]?.subComponents[0];
      console.log(`    OBX[${obxIdx}] Set ID: ${obxId} ${obxId === String(obxIdx + 1) ? "✓" : "✗"}`);
    });
  });
}

console.log("\n=== Summary ===");
console.log("✅ Use encode({ renumberSetIds: true }) for automatic Set ID management");
console.log("✅ No need to manually track or update Set IDs when adding/removing segments");
console.log("✅ Works for both OBR and OBX segments");
console.log("✅ Ensures maximum compatibility with receiving systems");
