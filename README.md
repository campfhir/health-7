# HL7v2 Message Builder & Parser

A modular TypeScript library for building and parsing HL7v2 messages.

## Features

- **Fluent Interface**: Type-safe segment construction with fluent API
- **Parser**: Parse HL7v2 message strings back into structured data
- **Round-trip Support**: Build messages and parse them back with full fidelity
- **Modular Architecture**: Organized by HL7 version for easy extension
- **Version Support**: HL7v2.3 and HL7v2.5.1
- **Date Input**: Segment date methods accept `Date` objects with optional HL7 layout format, in addition to pre-formatted strings
- **Value Extraction**: Path-based field/component extraction utility
- **Custom Segments**: Build Z-segments and other custom segments with a simple field-setter API
- **Message Editor**: Fluent API for inserting segments into, or updating field values in, any built message without modifying the builder
- **Comprehensive Tests**: 609 tests across 25 test files, co-located with source (Go style)

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
│   ├── dateUtils.ts          # Go-style date formatting utility (standalone, publishable)
│   ├── hl7DateUtils.ts       # HL7-specific date formatting wrapper and layout constants
│   ├── ValueExtractor.ts     # Path-based value extraction utility
│   ├── CustomSegment.ts      # Generic segment for Z-segments and custom use
│   └── MessageEditor.ts      # Fluent segment insertion API
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

## Runtime support

The package ships dual CJS/ESM builds with fully-specified import paths, so it
runs on Node.js (CommonJS `require` and native ESM `import`) and on
[Deno](https://deno.com/) via the `npm:` specifier. There are no Node-only
runtime dependencies.

### Deno

Import any entry point with the `npm:` specifier and the same subpaths used on
Node:

```typescript
import { ParserUtils, MessageEditor } from "npm:@campfhir/hl7";
import { parseADT_A01 } from "npm:@campfhir/hl7/parsers/v2.5.1";
import { MSH, PID } from "npm:@campfhir/hl7/segments/v2.5.1";

const result = parseADT_A01(messageString);
```

The package is also published to [JSR](https://jsr.io/), which serves the
TypeScript sources directly — no build step, native types:

```bash
deno add jsr:@campfhir/hl7
```

```typescript
import { ParserUtils } from "@campfhir/hl7";
import { parseADT_A01 } from "@campfhir/hl7/parsers/v2.5.1";
import { MSH, PID } from "@campfhir/hl7/segments/v2.5.1";
```

Either source (the `npm:` specifier or JSR) exposes the same entry points; pick
whichever fits your project. To pin the npm build via an import map instead, add
to `deno.json`:

```json
{
  "imports": {
    "@campfhir/hl7": "npm:@campfhir/hl7@^0.2.0",
    "@campfhir/hl7/": "npm:/@campfhir/hl7/"
  }
}
```

## Imports

Core types, utilities, and the message editor are exported from the package root:

```typescript
import { BaseSegment, HL7Message, ParserUtils, extractValue, CustomSegment, MessageEditor } from '@campfhir/hl7';

// Date formatting utility (Go-style layout strings)
import { dateUtils, DateOnly, DateTime } from '@campfhir/hl7';
```

HL7-specific date helpers are imported directly:

```typescript
import { formatHL7Date, DateLayout, DateTimeLayout, TimeLayout } from '@campfhir/hl7/utils/hl7DateUtils';
```

Versioned segments can be imported as a group or individually:

```typescript
// All segments for a version
import { MSH, PID, OBX } from '@campfhir/hl7/segments/v2.5.1';

// Individual segment (also gives access to types)
import { MSH } from '@campfhir/hl7/segments/v2.5.1/MSH';
```

Builders and parsers are imported individually or via the barrel (create*/parse* functions only):

```typescript
// Barrel — create*/parse* functions only
import { createORU_R01 } from '@campfhir/hl7/builders/v2.5.1';
import { parseORU_R01 } from '@campfhir/hl7/parsers/v2.5.1';

// Per-file — includes types like PatientResult, OrderObservation
import { createORU_R01, PatientResult } from '@campfhir/hl7/builders/v2.5.1/ORU_R01';
import { parseORU_R01 } from '@campfhir/hl7/parsers/v2.5.1/ORU_R01_Parser';
```

## Usage Examples

### Building an ORU^R01 Message

```typescript
import { MSH } from '@campfhir/hl7/segments/v2.5.1/MSH';
import { PID } from '@campfhir/hl7/segments/v2.5.1/PID';
import { PV1 } from '@campfhir/hl7/segments/v2.5.1/PV1';
import { OBR } from '@campfhir/hl7/segments/v2.5.1/OBR';
import { OBX } from '@campfhir/hl7/segments/v2.5.1/OBX';
import { createORU_R01, PatientResult } from '@campfhir/hl7/builders/v2.5.1/ORU_R01';

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
  .dateTimeOfBirth(new Date(1980, 0, 15))   // Date object — formatted as YYYYMMDD
  // .dateTimeOfBirth('19800115')            // pre-formatted string also accepted
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
import { parseORU_R01 } from '@campfhir/hl7/parsers/v2.5.1/ORU_R01_Parser';
import { ParserUtils } from '@campfhir/hl7';

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
import { extractValue } from '@campfhir/hl7';

const message = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M|||123 Main St^Apt 4^Springfield^IL^62701^USA`;

extractValue('MSH-3', message);      // 'LAB'
extractValue('PID-5.1', message);    // 'Doe'
extractValue('PID-5.2', message);    // 'John'
extractValue('PID-11.3', message);   // 'Springfield'
extractValue('OBX-5', message);      // string[] — all OBX-5 values
```

**Path syntax**: `Segment[-FieldIndex[.ComponentIndex[.SubcomponentIndex]]]`

### Date Formatting

All segment methods that accept date/time values support both pre-formatted strings and `Date` objects. Strings pass through unchanged for backwards compatibility.

```typescript
import { DateLayout, DateTimeLayout, TimeLayout } from '@campfhir/hl7/utils/hl7DateUtils';

// Date object — use layout aliases or Go-style layout strings
pid.dateTimeOfBirth(new Date(1980, 0, 15));                  // default: YYYYMMDD → '19800115'
pid.dateTimeOfBirth(new Date(1980, 0, 15), 'Date');          // alias → '19800115'
pid.dateTimeOfBirth(new Date(1980, 0, 15), 'DateTime');      // alias → '19800115090503'
obr.observationDateTime(new Date(), DateTimeLayout);         // constant → 'YYYYMMDDHHmmss'

// Pre-formatted string — passes through unchanged
pid.dateTimeOfBirth('19800115');
```

Layout aliases: `"Date"` → `YYYYMMDD`, `"DateTime"` → `YYYYMMDDHHmmss`, `"Time"` → `HHmmss`, `"TimeWithSeconds"` → `HHmmss.SSS`

`dateUtils` (exported from package root) is a standalone Go-style date utility usable independently of the HL7 layer:

```typescript
import { dateUtils, DateOnly } from '@campfhir/hl7';

dateUtils.format(new Date(), DateOnly);       // { ok: true, val: '20250119' }
dateUtils.parse('20250119', DateOnly);        // { ok: true, val: Date }
```

### Custom Segments

`CustomSegment` lets you build Z-segments or any non-standard segment without type safety restrictions. Fields use 1-based HL7 numbering.

```typescript
import { CustomSegment } from '@campfhir/hl7';

const zpd = new CustomSegment('ZPD')
  .setField(1, 'extra-patient-data')
  .setField(2, ['comp1', 'comp2'])             // components
  .setField(3, [['sub1a', 'sub1b'], ['sub2']]); // subcomponents

zpd.encode(); // ZPD|extra-patient-data|comp1^comp2|sub1a&sub1b^sub2
```

### Message Editor

`MessageEditor` lets you insert segments into, or update field values in, any built message without modifying the builder. All operations are applied at `encode()` time and can be freely chained.

#### Inserting segments

```typescript
import { MessageEditor, CustomSegment } from '@campfhir/hl7';
import { NTE } from '@campfhir/hl7/segments/v2.5.1';
import { createORU_R01 } from '@campfhir/hl7/builders/v2.5.1/ORU_R01';

const message = createORU_R01(msh, patientResults);

const encoded = new MessageEditor(message)
  // insert after last PID (default)
  .insert(new CustomSegment('ZPD').setField(1, 'patient-extra'))
  .after('PID').commit()

  // insert a typed NTE after every OBX
  .insert(new NTE().setId('1').comment('auto-note'))
  .after('OBX').each().commit()

  // insert before the 2nd OBR
  .insert(new CustomSegment('ZOR').setField(1, 'order-extra'))
  .before('OBR').nth(2).commit()

  // append at end of message
  .append(new CustomSegment('ZMH').setField(1, 'message-footer'))

  .encode();
```

**Insertion modes** — chain before calling `commit()`:
- `.last()` — target the last matching segment (default)
- `.each()` — insert relative to every matching segment
- `.nth(n)` — insert relative to the Nth matching segment

#### Updating field values

`update()` uses the same path syntax as `extractValue` to set a field, component, or subcomponent value. All occurrences of a repeating segment are updated. Invalid paths are silently ignored.

```typescript
// single update
new MessageEditor(message)
  .update('PID-5.1', 'Smith')
  .encode();

// bulk update
new MessageEditor(message)
  .update({
    'MSH-3': 'NEW_LAB',
    'PID-5.1': 'Smith',
    'PID-3.4.1': 'GEN',   // subcomponent — assigning authority namespace
  })
  .encode();

// chain updates with insertions
new MessageEditor(message)
  .update('PID-5.1', 'Smith')
  .insert(new CustomSegment('ZPD').setField(1, 'extra'))
  .after('PID').commit()
  .encode();
```

**Path syntax**: `Segment-FieldIndex[.ComponentIndex[.SubcomponentIndex]]` — same as `extractValue`.

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
