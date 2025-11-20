# HL7 Mapper - Developer Guide

## Parsing, Modifying, and Re-encoding Messages

This guide demonstrates how to work with HL7 messages in a developer-friendly way.

## Quick Answer: Is it Easy?

**YES!** The relationship between OBR (test orders) and OBX (results) is intuitive:

```typescript
ParsedORU_R01
  └─ patientResults[]           // Array of patients
       └─ orderObservations[]   // Array of test orders per patient
            ├─ orc?: ORC        // Optional order control
            ├─ obr: OBR         // Test order (e.g., "CBC", "Glucose")
            └─ obxList: OBX[]   // Results for this test
```

## Basic Example

```typescript
import { parseORU_R01 } from "./src/parsers/v2.5.1/ORU_R01_Parser";
import { createORU_R01 } from "./src/builders/v2.5.1/ORU_R01";
import { OBX, OBR } from "./src/segments/v2.5.1";

// 1. Parse existing message
const parseResult = parseORU_R01(hl7Message);
const patientResult = parseResult.data.patientResults[0];

// 2. Modify - add a result
const newObx = new OBX()
  .setId("3")
  .valueType("NM")
  .observationIdentifier("718-7", "Hemoglobin", "LN")
  .observationSubId("1")
  .observationValue("14.5")
  .units("g/dL")
  .referenceRange("13.5-17.5")
  .abnormalFlags("N")
  .observationResultStatus("F");

patientResult.orderObservations[0].obxList.push(newObx);

// 3. Re-encode
const rebuilt = createORU_R01(parseResult.data.msh, [patientResult]);
const reencoded = rebuilt.encode();
```

## Adding OBX Results

### Add to Beginning
```typescript
patientResult.orderObservations[0].obxList.unshift(newObx);
```

### Add to Middle
```typescript
// Insert at position 2
patientResult.orderObservations[0].obxList.splice(2, 0, newObx);
```

### Add to End
```typescript
patientResult.orderObservations[0].obxList.push(newObx);
```

## Adding OBR Test Orders

### Add to Beginning
```typescript
patientResult.orderObservations.unshift({
  obr: sodiumObr,
  obxList: [sodiumObx]
});
```

### Add to Middle
```typescript
// Insert at position 1 (between first and second order)
patientResult.orderObservations.splice(1, 0, {
  obr: potassiumObr,
  obxList: [potassiumObx]
});
```

### Add to End
```typescript
patientResult.orderObservations.push({
  obr: creatinineObr,
  obxList: [creatinineObx]
});
```

## Adding OBR with ORC (Order Control)

```typescript
const newOrc = new ORC()
  .orderControl("NW")
  .placerOrderNumber("ORD123")
  .fillerOrderNumber("LAB456")
  .orderingProvider("123", "SMITH", "JANE");

patientResult.orderObservations.push({
  orc: newOrc,        // Optional but preserved in round-trip
  obr: newObr,
  obxList: [newObx]
});
```

## Complete Example with Multiple Operations

```typescript
// Parse original message
const parseResult = parseORU_R01(originalMessage);
const patientResult = parseResult.data.patientResults[0];

// 1. Add OBX to existing CBC test
const hgbObx = new OBX()
  .setId("3")
  .valueType("NM")
  .observationIdentifier("718-7", "Hemoglobin", "LN")
  .observationSubId("1")
  .observationValue("14.5")
  .units("g/dL")
  .referenceRange("13.5-17.5")
  .abnormalFlags("N")
  .observationResultStatus("F");

patientResult.orderObservations[0].obxList.push(hgbObx);

// 2. Add new Sodium test at beginning
const sodiumObr = new OBR()
  .setId("1")
  .placerOrderNumber("ORD001")
  .fillerOrderNumber("LAB001")
  .universalServiceIdentifier("NA", "Sodium", "L")
  .observationDateTime("20231115110000")
  .resultStatus("F");

const sodiumObx = new OBX()
  .setId("1")
  .valueType("NM")
  .observationIdentifier("2951-2", "Sodium", "LN")
  .observationSubId("1")
  .observationValue("140")
  .units("mmol/L")
  .referenceRange("136-145")
  .abnormalFlags("N")
  .observationResultStatus("F");

patientResult.orderObservations.unshift({
  obr: sodiumObr,
  obxList: [sodiumObx]
});

// 3. Add new Potassium test in middle
patientResult.orderObservations.splice(1, 0, {
  obr: potassiumObr,
  obxList: [potassiumObx]
});

// 4. Add new Creatinine test at end
patientResult.orderObservations.push({
  obr: creatinineObr,
  obxList: [creatinineObx]
});

// 5. Re-encode and verify
const rebuilt = createORU_R01(parseResult.data.msh, [patientResult]);
const reencoded = rebuilt.encode();

// 6. Verify by re-parsing
const reParseResult = parseORU_R01(reencoded);
console.log("Success:", reParseResult.success); // true
console.log("Orders:", reParseResult.data.patientResults[0].orderObservations.length); // Original + 3
```

## Key Features

✅ **Easy to understand hierarchy** - Clear parent-child relationships  
✅ **Standard array operations** - Use `push()`, `unshift()`, `splice()`  
✅ **Full round-trip support** - Parse → Modify → Encode → Parse works perfectly  
✅ **ORC preservation** - Order control segments are maintained  
✅ **Type safety** - TypeScript interfaces guide you  
✅ **Validation** - Built-in `verify()` method catches errors before encoding  

## Message Structure Details

### ORU_R01 Message Hierarchy

```
MSH                           // Message Header (required)
[                             // Patient Results (repeating)
  PID                         // Patient ID (optional)
  [PV1]                       // Patient Visit (optional)
  {                           // Order Observations (repeating)
    [ORC]                     // Common Order (optional)
    OBR                       // Observation Request (required)
    {OBX}                     // Observation Results (repeating, required)
  }
]
```

### Parsed Data Structure

```typescript
interface ParsedORU_R01 {
  message: HL7Message;              // Raw message object
  msh: MSH;                         // Message header
  patientResults: ParsedPatientResult[];
}

interface ParsedPatientResult {
  pid?: PID;                        // Patient demographics
  pv1?: PV1;                        // Visit information
  orderObservations: ParsedOrderObservation[];
}

interface ParsedOrderObservation {
  orc?: ORC;                        // Order control info
  obr: OBR;                         // Test order
  obxList: OBX[];                   // Test results
}
```

## Accessing Data

```typescript
const parseResult = parseORU_R01(message);

// Get first patient
const patient = parseResult.data.patientResults[0];

// Get patient name
const patientName = patient.pid?.fields[4]; // Field array access

// Get first test order
const firstOrder = patient.orderObservations[0];

// Get test name
const testName = firstOrder.obr.fields[3]; // Universal Service ID

// Get all results for this test
const results = firstOrder.obxList;

// Check if test has order control
if (firstOrder.orc) {
  const orderControl = firstOrder.orc.fields[0]; // Order control code
}

// Iterate through all results
results.forEach(obx => {
  const observationId = obx.fields[2];     // OBX-3: Observation ID
  const value = obx.fields[4];              // OBX-5: Observation Value
  const units = obx.fields[5];              // OBX-6: Units
  const abnormalFlags = obx.getAbnormalFlags(); // Helper method
});
```

## Creating New Segments

### OBX (Result)
```typescript
const obx = new OBX()
  .setId("1")                                    // OBX-1: Set ID
  .valueType("NM")                               // OBX-2: Value Type (NM=Numeric)
  .observationIdentifier("2345-7", "Glucose", "LN") // OBX-3: Test ID
  .observationSubId("1")                         // OBX-4: Sub-ID
  .observationValue("95")                        // OBX-5: Result Value
  .units("mg/dL")                                // OBX-6: Units
  .referenceRange("70-100")                      // OBX-7: Reference Range
  .abnormalFlags("N")                            // OBX-8: Flags (N=Normal, H=High, L=Low)
  .observationResultStatus("F")                  // OBX-11: Status (F=Final)
  .dateTimeOfObservation("20231115120000");      // OBX-14: Observation Date/Time
```

### OBR (Test Order)
```typescript
const obr = new OBR()
  .setId("1")                                    // OBR-1: Set ID
  .placerOrderNumber("ORD123")                   // OBR-2: Placer Order Number
  .fillerOrderNumber("LAB456")                   // OBR-3: Filler Order Number
  .universalServiceIdentifier("CBC", "Complete Blood Count", "L") // OBR-4: Test ID
  .observationDateTime("20231115120000")         // OBR-7: Observation Date/Time
  .resultStatus("F");                            // OBR-25: Result Status (F=Final)
```

### ORC (Order Control)
```typescript
const orc = new ORC()
  .orderControl("RE")                            // ORC-1: Order Control (NW=New, RE=Result)
  .placerOrderNumber("ORD123")                   // ORC-2: Placer Order Number
  .fillerOrderNumber("LAB456")                   // ORC-3: Filler Order Number
  .orderingProvider("123", "SMITH", "JANE");     // ORC-12: Ordering Provider
```

## Common Use Cases

### 1. Add a Single Result to Existing Test
```typescript
const newResult = new OBX()
  .setId("3")
  .valueType("NM")
  .observationIdentifier("718-7", "Hemoglobin", "LN")
  .observationValue("14.5")
  .units("g/dL");

parseResult.data.patientResults[0].orderObservations[0].obxList.push(newResult);
```

### 2. Add a Complete New Test
```typescript
const newTest = {
  obr: new OBR().setId("3").universalServiceIdentifier("NA", "Sodium", "L"),
  obxList: [
    new OBX().setId("1").valueType("NM").observationValue("140")
  ]
};

parseResult.data.patientResults[0].orderObservations.push(newTest);
```

### 3. Find and Modify Specific Result
```typescript
const patient = parseResult.data.patientResults[0];

// Find CBC order
const cbcOrder = patient.orderObservations.find(order => {
  const testId = order.obr.fields[3]?.components[0]?.subComponents[0];
  return testId === "CBC";
});

if (cbcOrder) {
  // Add new result to CBC
  cbcOrder.obxList.push(newObx);
}
```

### 4. Remove a Result
```typescript
const cbcOrder = parseResult.data.patientResults[0].orderObservations[0];

// Remove second result
cbcOrder.obxList.splice(1, 1);
```

### 5. Update a Result Value
```typescript
const cbcOrder = parseResult.data.patientResults[0].orderObservations[0];
const wbcResult = cbcOrder.obxList[0];

// Update value
wbcResult.observationValue("8.5");
// Update abnormal flag
wbcResult.abnormalFlags("N");
```

## Validation

Always validate before encoding:

```typescript
const message = createORU_R01(msh, patientResults);

const validation = message.verify();
if (!validation.valid) {
  console.error("Validation errors:");
  validation.errors.forEach(err => console.error("  -", err));
  return;
}

const encoded = message.encode();
```

## Error Handling

```typescript
const parseResult = parseORU_R01(hl7Message);

if (!parseResult.success) {
  console.error("Parse failed:", parseResult.error);
  return;
}

// Safe to access data
const data = parseResult.data;
```

## Testing Your Changes

Run the modification tests:

```bash
npx tsx --test src/parsers/v2.5.1/ORU_R01_Modification.test.ts
```

Or run all tests:

```bash
npm test
```

## Examples

See complete working examples in:
- `examples/parse-modify-encode-example.ts` - Comprehensive demonstration
- `examples/verify-encoding.ts` - Round-trip verification
- `src/parsers/v2.5.1/ORU_R01_Modification.test.ts` - Test suite with 9 scenarios

Run examples:
```bash
npx tsx examples/verify-encoding.ts
```

## Set ID Management

### Option 1: Automatic Renumbering (Recommended)

Use the `renumberSetIds` option when encoding to automatically correct Set IDs:

```typescript
// Add segments with any Set IDs (or don't worry about them)
patientResult.orderObservations.unshift({
  obr: newObr.setId("99"),  // Any ID is fine
  obxList: [newObx.setId("77")]
});

// Encode with automatic renumbering
const rebuilt = createORU_R01(parseResult.data.msh, [patientResult]);
const reencoded = rebuilt.encode({ renumberSetIds: true });

// After re-encoding, Set IDs will be automatically corrected to: 1, 2, 3
```

This is the **easiest and recommended approach** - just set `renumberSetIds: true` and the library handles everything.

### Option 2: Manual Renumbering

If you need precise control or want to renumber before encoding, you can do it manually:

```typescript
// Add new OBR at beginning
const newObr = new OBR().setId("1").universalServiceIdentifier("NA", "Sodium", "L");

// Manually renumber existing OBRs
patientResult.orderObservations[0].obr.setId("2"); // Was 1
patientResult.orderObservations[1].obr.setId("3"); // Was 2

// Insert new one at beginning
patientResult.orderObservations.unshift({
  obr: newObr,
  obxList: [newObx]
});

// Now Set IDs will be: 1, 2, 3
```

### Option 3: Default Behavior (Preserve Set IDs)

By default, without `renumberSetIds: true`, Set IDs are preserved as-is:

```typescript
// Add new OBR at beginning with Set ID 99
patientResult.orderObservations.unshift({
  obr: newObr.setId("99"),
  obxList: [newObx]
});

// Encode WITHOUT renumberSetIds option
const rebuilt = createORU_R01(parseResult.data.msh, [patientResult]);
const reencoded = rebuilt.encode(); // No options

// After re-encoding, Set IDs will be: 99, 1, 2 (preserved as-is)
```

### Do Set IDs Matter?

**It depends on your receiving system.** Many HL7 systems don't strictly enforce sequential Set IDs, but some do. Check your interface specifications.

**Best practice**: Use `renumberSetIds: true` when encoding to ensure maximum compatibility.

### Summary of Set ID Options

| Approach | When to Use | Pros | Cons |
|----------|-------------|------|------|
| **`encode({ renumberSetIds: true })`** | Most cases | Automatic, no manual work | Modifies original objects |
| **Manual renumbering** | Need precise control | Full control over IDs | More code to write |
| **Default (preserve)** | Set IDs already correct | No overhead | Easy to get wrong IDs |

### Examples

```typescript
// Recommended: Use automatic renumbering
const reencoded = rebuilt.encode({ renumberSetIds: true });

// Alternative: Manual control
patientResult.orderObservations.forEach((order, idx) => {
  order.obr.setId(String(idx + 1));
  order.obxList.forEach((obx, obxIdx) => obx.setId(String(obxIdx + 1)));
});
const reencoded = rebuilt.encode();

// Default: Preserve as-is (may have gaps or duplicates)
const reencoded = rebuilt.encode();
```

See `src/parsers/v2.5.1/ORU_R01_SetID.test.ts` for complete test cases demonstrating all behaviors.

## Summary

✅ **Parse**: `parseORU_R01(message)` - Returns structured data  
✅ **Modify**: Use standard array methods (`push`, `splice`, `unshift`)  
✅ **Encode**: `createORU_R01(msh, patientResults).encode({ renumberSetIds: true })` - Returns HL7 string  
✅ **Verify**: Round-trip works perfectly - all data preserved including ORC  
✅ **Set IDs**: Use `renumberSetIds: true` option for automatic sequential numbering  

The API is designed to be intuitive for developers familiar with JavaScript/TypeScript arrays and objects.
