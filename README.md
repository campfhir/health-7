# HL7v2 Message Builder & Parser

A modular TypeScript library for building and parsing HL7v2 messages.

## Features

- **Fluent Interface**: Type-safe segment construction with fluent API
- **Parser**: Parse HL7v2 message strings back into structured data
- **Round-trip Support**: Build messages and parse them back with full fidelity
- **Modular Architecture**: Organized by HL7 version for easy extension
- **Version Support**: HL7v2.3 and HL7v2.5.1
- **Value Extraction**: Path-based field/component extraction utility
- **Comprehensive Tests**: 428 tests across 22 test files, co-located with source (Go style)

## Project Structure

```
src/
├── index.ts                  # Core type exports
├── types/                    # Version-agnostic core types
│   ├── encoding.ts           # HL7 encoding characters
│   ├── segment.ts            # Base segment types and classes
│   ├── message.ts            # Message container
│   ├── schema.ts             # Message schema definitions
│   └── parser.ts             # Parser utilities and interfaces
├── utils/
│   └── ValueExtractor.ts     # Path-based value extraction utility
├── segments/                 # Segment definitions by version
│   ├── v2.3/                 # 46 segments (ACC, AIG, AIL, ..., UB2)
│   └── v2.5.1/               # 50 segments (ACC, AIG, AIL, ..., UB2)
├── parsers/                  # Message parsers by version
│   ├── testdata/             # 30 sample HL7 messages for integration tests
│   │   ├── ORU_R01/          # 15 lab result messages
│   │   └── ORU_R30/          # 15 point-of-care observation messages
│   ├── v2.3/                 # 49 parsers (ADT A01-A47, ORU_R01, MFN_M02, SIU S12-S26)
│   └── v2.5.1/               # 58 parsers (ADT A01-A47, ORU R01/R30/R31/R32, MFN_M02, SIU S12-S26)
├── builders/                 # Message builders by version
│   ├── v2.3/                 # 53 builders (ADT A01-A47, ORU_R01, MFN_M02, SIU S12-S26)
│   └── v2.5.1/               # 55 builders (ADT A01-A47, ORU R01/R30/R31/R32, MFN_M02, SIU S12-S26)
```

## Installation

```bash
npm install
npm run build
```

## Testing

```bash
npm test
```

Tests use [Vitest](https://vitest.dev/) and run directly against TypeScript source via `tsx`.

## Imports

Core types are exported from the package root:

```typescript
import { BaseSegment, HL7Message, ParserUtils, extractValue } from '@nems.org/hl7';
```

Versioned segments, builders, and parsers are imported from their specific files:

```typescript
import { MSH } from '@nems.org/hl7/src/segments/v2.5.1/MSH';
import { PID } from '@nems.org/hl7/src/segments/v2.5.1/PID';
import { createORU_R01, PatientResult } from '@nems.org/hl7/src/builders/v2.5.1/ORU_R01';
import { parseORU_R01 } from '@nems.org/hl7/src/parsers/v2.5.1/ORU_R01_Parser';
```

## Usage Examples

### Building an ORU^R01 Message

```typescript
import { MSH } from './src/segments/v2.5.1/MSH';
import { PID } from './src/segments/v2.5.1/PID';
import { PV1 } from './src/segments/v2.5.1/PV1';
import { OBR } from './src/segments/v2.5.1/OBR';
import { OBX } from './src/segments/v2.5.1/OBX';
import { createORU_R01, PatientResult } from './src/builders/v2.5.1/ORU_R01';

const msh = new MSH()
  .sendingApplication('LAB')
  .sendingFacility('General Hospital')
  .receivingApplication('EMR')
  .receivingFacility('Main Campus')
  .dateTimeOfMessage('20250119120000')
  .messageType('ORU', 'R01', 'ORU_R01')
  .messageControlId('MSG00001')
  .processingId('P')
  .versionId('2.5.1');

const pid = new PID()
  .setId('1')
  .patientIdentifierList('12345', '', '', 'MRN', 'MR')
  .patientName('Doe', 'John', 'Q')
  .dateTimeOfBirth('19800115')
  .administrativeSex('M');

const pv1 = new PV1()
  .setId('1')
  .patientClass('I')
  .assignedPatientLocation('ICU', '101', 'A', 'Main')
  .attendingDoctor('1234', 'Smith', 'Jane');

const obr = new OBR()
  .setId('1')
  .placerOrderNumber('ORD123456')
  .fillerOrderNumber('LAB987654')
  .universalServiceIdentifier('CBC', 'Complete Blood Count', 'LN')
  .observationDateTime('20250119120000')
  .resultStatus('F');

const obx = new OBX()
  .setId('1')
  .valueType('NM')
  .observationIdentifier('718-7', 'Hemoglobin', 'LN')
  .observationValue('15.5')
  .units('g/dL', 'grams per deciliter', 'UCUM')
  .referenceRange('13.5-17.5')
  .observationResultStatus('F');

const patientResult: PatientResult = {
  pid,
  pv1,
  orderObservations: [{ obr, obxList: [obx] }],
};

const message = createORU_R01(msh, [patientResult]);
console.log(message.encode());
```

### Parsing an ORU^R01 Message

```typescript
import { parseORU_R01 } from './src/parsers/v2.5.1/ORU_R01_Parser';
import { ParserUtils } from './src';

const hl7String = `MSH|^~\\&|LAB|General Hospital|EMR|Main Campus|20250119120000||ORU^R01^ORU_R01|MSG00001|P|2.5.1
PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M|||123 Main St^^Springfield^IL^62701^USA||555-1234
PV1|1|I|ICU^101^A^Main||||1234^Smith^Jane
OBR|1|ORD123456|LAB987654|CBC^Complete Blood Count^LN|||20250119120000|||||||||1234^Smith^Jane|||||||||F
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL^grams per deciliter^UCUM|13.5-17.5||||F|||20250119120000`;

const result = parseORU_R01(hl7String);

if (result.success) {
  const parsed = result.data!;

  // Access MSH data
  console.log('Sending App:', ParserUtils.getComponent(parsed.msh.fields[1], 0));

  // Access patient data
  const pidFields = parsed.patientResults[0].pid!.fields;
  console.log('Patient Name:', ParserUtils.getComponent(pidFields[4], 0));

  // Access observations
  parsed.patientResults[0].orderObservations[0].obxList.forEach(obx => {
    const name = ParserUtils.getComponent(obx.fields[2], 1);
    const value = ParserUtils.getComponent(obx.fields[4], 0);
    console.log(`${name}: ${value}`);
  });

  // Re-encode (round-trip)
  console.log(parsed.message.encode());
} else {
  console.error('Parse error:', result.error);
}
```

### Value Extraction

Extract field values using a simple path syntax without fully parsing the message:

```typescript
import { extractValue } from './src';

const message = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M|||123 Main St^Apt 4^Springfield^IL^62701^USA`;

extractValue('MSH-3', message);      // 'LAB'
extractValue('PID-5.1', message);    // 'Doe'
extractValue('PID-5.2', message);    // 'John'
extractValue('PID-11.3', message);   // 'Springfield'
extractValue('OBX-5', message);      // string[] — all OBX-5 values
```

**Path syntax**: `Segment[-FieldIndex[.ComponentIndex[.SubcomponentIndex]]]`

### Examples

```bash
npx tsx examples/oru-example.ts                    # Build ORU^R01 message
npx tsx examples/parser-example.ts                 # Parse and round-trip
npx tsx examples/oru-r30-example.ts                # Build ORU^R30 (point-of-care)
npx tsx examples/parse-modify-encode-example.ts    # Parse, modify, re-encode
npx tsx examples/value-extractor-example.ts        # Value extraction
npx tsx examples/automatic-setid-renumbering.ts    # SetID auto-renumbering
```

## Architecture

### Fluent Interface

Each segment uses a fluent builder pattern:

```typescript
const msh = new MSH()
  .sendingApplication('APP')
  .receivingApplication('SYS');
```

### Parser Architecture

Parsers convert HL7 strings into structured segment objects. Each message parser orchestrates individual segment parsers to reconstruct the full message structure including groups (patient results, order observations):

```typescript
export class ORU_R01_Parser {
  parse(input: string): Result<ParsedORU_R01> { ... }
}

// or use the convenience function:
const result = parseORU_R01(hl7String);
```

### Version Organization

Segments, builders, and parsers are organized by HL7 version (`v2.3`, `v2.5.1`), supporting:
- Multiple versions simultaneously
- Adding new versions without affecting existing code
- Version-specific business logic

## Extending the Library

### Adding a New Segment

1. Create a file in `src/segments/v2.5.1/<SEGMENT>.ts`
2. Extend `BaseSegment` with typed setters/getters

### Adding a New Message Type

1. Create a builder in `src/builders/v2.5.1/<MSG_TYPE>.ts`
2. Create a parser in `src/parsers/v2.5.1/<MSG_TYPE>_Parser.ts`

### Adding a New HL7 Version

1. Create `src/segments/v2.X/`, `src/builders/v2.X/`, `src/parsers/v2.X/`
2. Implement version-specific segments, builders, and parsers

## Design Decisions

### Modular Architecture
Small, focused files organized by version make the codebase easy to navigate, test, extend, and maintain at scale.

### Type Safety
TypeScript provides compile-time validation, better IDE support, and self-documenting interfaces.

## License

MIT
