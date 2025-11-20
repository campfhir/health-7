# HL7v2 Message Builder & Parser

A modular TypeScript library for building and parsing HL7v2 messages. No third-party dependencies required.

## Features

- **Fluent Interface**: Type-safe segment construction with fluent API
- **Parser**: Parse HL7v2 message strings back into structured data
- **Round-trip Support**: Build messages and parse them back with full fidelity
- **Modular Architecture**: Organized by HL7 version for easy extension
- **Version Support**: HL7v2.5.1 (extensible to other versions)
- **Message Schemas**: Define valid segment structures
- **Zero Dependencies**: No external dependencies required (runtime)
- **Comprehensive Tests**: 108 tests co-located with source files (Go style)

## Project Structure

```
src/
├── types/              # Core type definitions
│   ├── encoding.ts     # HL7 encoding characters
│   ├── segment.ts      # Base segment types and classes
│   ├── message.ts      # Message container
│   ├── schema.ts       # Message schema definitions
│   └── parser.ts       # Parser utilities and interfaces
├── segments/           # Segment builders by version
│   └── v2.5.1/
│       ├── MSH.ts      # Message Header
│       ├── PID.ts      # Patient Identification
│       ├── PV1.ts      # Patient Visit
│       ├── OBR.ts      # Observation Request
│       ├── OBX.ts      # Observation Result
│       └── index.ts
├── parsers/            # Message parsers by version
│   └── v2.5.1/
│       ├── MSHParser.ts       # MSH segment parser
│       ├── PIDParser.ts       # PID segment parser
│       ├── PV1Parser.ts       # PV1 segment parser
│       ├── OBRParser.ts       # OBR segment parser
│       ├── OBXParser.ts       # OBX segment parser
│       ├── ORU_R01_Parser.ts  # ORU^R01 message parser
│       └── index.ts
├── schemas/            # Message schemas by version
│   └── v2.5.1/
│       ├── ORU_R01.ts  # Observation Result schema
│       └── index.ts
├── builders/           # Message builders by version
│   └── v2.5.1/
│       ├── ORU_R01.ts  # ORU^R01 message builder
│       └── index.ts
└── index.ts            # Main export file
```

## Installation

```bash
npm install
npm run build
```

## Testing

Run the comprehensive test suite (108 tests):

```bash
npm test
```

Tests are written in TypeScript and run directly without compilation using `tsx`. See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Usage Example

### Building an ORU^R01 Message (Observation Result)

```typescript
import {
  MSH,
  PID,
  PV1,
  OBR,
  OBX,
  createORU_R01,
  PatientResult,
} from './src';

// Create MSH (Message Header)
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

// Create PID (Patient Identification)
const pid = new PID()
  .setId('1')
  .patientIdentifierList('12345', '', '', 'MRN', 'MR')
  .patientName('Doe', 'John', 'Q')
  .dateTimeOfBirth('19800115')
  .administrativeSex('M');

// Create PV1 (Patient Visit) - Optional
const pv1 = new PV1()
  .setId('1')
  .patientClass('I')
  .assignedPatientLocation('ICU', '101', 'A', 'Main')
  .attendingDoctor('1234', 'Smith', 'Jane');

// Create OBR (Observation Request)
const obr = new OBR()
  .setId('1')
  .placerOrderNumber('ORD123456')
  .fillerOrderNumber('LAB987654')
  .universalServiceIdentifier('CBC', 'Complete Blood Count', 'LN')
  .observationDateTime('20250119120000')
  .resultStatus('F');

// Create OBX (Observation Results)
const obx1 = new OBX()
  .setId('1')
  .valueType('NM')
  .observationIdentifier('718-7', 'Hemoglobin', 'LN')
  .observationValue('15.5')
  .units('g/dL', 'grams per deciliter', 'UCUM')
  .referenceRange('13.5-17.5')
  .observationResultStatus('F');

// Compose the message
const patientResult: PatientResult = {
  pid,
  pv1,
  orderObservations: [
    {
      obr,
      obxList: [obx1],
    },
  ],
};

const message = createORU_R01(msh, [patientResult]);

// Encode to HL7 format
const encodedMessage = message.encode();
console.log(encodedMessage);
```

### Parsing an ORU^R01 Message

```typescript
import { parseORU_R01, ParserUtils } from './src';

const hl7String = `MSH|^~\\&|LAB|General Hospital|EMR|Main Campus|20250119120000||ORU^R01^ORU_R01|MSG00001|P|2.5.1|||||
PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M|||123 Main St^^Springfield^IL^62701^USA||555-1234
PV1|1|I|ICU^101^A^Main||||1234^Smith^Jane
OBR|1|ORD123456|LAB987654|CBC^Complete Blood Count^LN|||20250119120000|||||||||1234^Smith^Jane|||||||||F
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL^grams per deciliter^UCUM|13.5-17.5||||F|||20250119120000`;

const parseResult = parseORU_R01(hl7String);

if (parseResult.success) {
  const parsed = parseResult.data!;
  
  // Access MSH data
  const mshFields = parsed.msh.fields;
  console.log('Sending App:', ParserUtils.getComponent(mshFields[1], 0));
  console.log('Message Type:', ParserUtils.getComponent(mshFields[7], 0));
  
  // Access patient data
  const pidFields = parsed.patientResults[0].pid!.fields;
  console.log('Patient Name:', ParserUtils.getComponent(pidFields[4], 0)); // Family name
  console.log('DOB:', ParserUtils.getComponent(pidFields[6], 0));
  
  // Access observations
  const obxList = parsed.patientResults[0].orderObservations[0].obxList;
  obxList.forEach(obx => {
    const value = ParserUtils.getComponent(obx.fields[4], 0);
    const name = ParserUtils.getComponent(obx.fields[2], 1);
    console.log(`${name}: ${value}`);
  });
  
  // Re-encode the message (round-trip)
  const reEncoded = parsed.message.encode();
  console.log(reEncoded);
} else {
  console.error('Parse error:', parseResult.error);
}
```

### Value Extraction (Quick Access)

Extract values from HL7 messages using a simple path syntax:

```typescript
import { extractValue } from './src';

const message = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M|||123 Main St^Apt 4^Springfield^IL^62701^USA`;

// Extract entire segments
const msh = extractValue('MSH', message);

// Extract specific fields
const sendingApp = extractValue('MSH-3', message);  // 'LAB'

// Extract field components
const familyName = extractValue('PID-5.1', message);  // 'Doe'
const givenName = extractValue('PID-5.2', message);   // 'John'

// Extract subcomponents
const patientId = extractValue('PID-3.1', message);   // '12345'

// Extract address components
const city = extractValue('PID-11.3', message);      // 'Springfield'
const state = extractValue('PID-11.4', message);     // 'IL'

// Works with repeating segments (returns array)
const obxSegments = extractValue('OBX', message);    // string[]
const obxValues = extractValue('OBX-5', message);    // string[]
```

**Path Syntax**: `Segment[-FieldIndex[.ComponentIndex[.SubcomponentIndex]]]`

### Running the Examples

```bash
npm run build
node dist/examples/oru-example.js              # Builder example
node dist/examples/parser-example.js           # Parser and round-trip example
node dist/examples/value-extractor-example.js  # Value extraction examples
```

## Architecture

### Fluent Interface Pattern

Each segment uses a fluent interface pattern for easy construction:

```typescript
const msh = new MSH()
  .sendingApplication('APP')
  .receivingApplication('SYS');
```

### Message Schemas

Message schemas define the structure and rules for each message type:

```typescript
export const ORU_R01_SCHEMA: MessageSchema = {
  messageType: 'ORU',
  triggerEvent: 'R01',
  version: '2.5.1',
  structure: [
    { name: 'MSH', required: true, repeating: false },
    {
      name: 'PATIENT_RESULT',
      required: true,
      repeating: true,
      segments: [/* ... */],
    },
  ],
};
```

### Parser Architecture

Parsers convert HL7 strings back into structured segment objects:

```typescript
export class MSHParser implements SegmentParser<MSH> {
  parse(segmentString: string, encoding: EncodingCharacters): ParseResult<MSH> {
    // Parse the segment string and return structured data
  }
}
```

The `ORU_R01_Parser` orchestrates segment parsers to reconstruct the full message structure with proper grouping of patient results and order observations.

### Version Organization

All segments, builders, parsers, and schemas are organized by HL7 version (e.g., `v2.5.1`), making it easy to:
- Support multiple HL7 versions simultaneously
- Add new versions without affecting existing code
- Maintain version-specific business logic

## Extending the Library

### Adding a New Segment

1. Create a new file in `src/segments/v2.5.1/`
2. Extend `BaseSegment` and create a builder class
3. Create a parser in `src/parsers/v2.5.1/`
4. Export from respective `index.ts` files

### Adding a New Message Type

1. Define the schema in `src/schemas/v2.5.1/`
2. Create a builder in `src/builders/v2.5.1/`
3. Create a parser in `src/parsers/v2.5.1/`
4. Export from respective index files

### Adding a New HL7 Version

1. Create new directories: `segments/v2.X/`, `schemas/v2.X/`, `builders/v2.X/`, `parsers/v2.X/`
2. Implement version-specific segments, builders, and parsers
3. Export from `src/index.ts`

## Design Decisions

### No External Dependencies
The library is built with zero external dependencies to:
- Minimize bundle size
- Reduce security vulnerabilities
- Improve maintainability
- Ensure long-term stability

### Modular Architecture
Small, focused files make the codebase:
- Easy to navigate
- Simple to test
- Straightforward to extend
- Maintainable at scale

### Type Safety
TypeScript provides:
- Compile-time validation
- Better IDE support
- Self-documenting code
- Reduced runtime errors

## License

MIT
# health-7
