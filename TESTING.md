# Testing Guide

This project uses Node.js's built-in test runner with `tsx` to run TypeScript tests directly. Tests are co-located with source files following the Go style convention.

## Why tsx?

- **Direct TypeScript execution**: No build step required, tests run directly from `.ts` files
- **Accurate line numbers**: Stack traces point to the actual TypeScript source lines
- **Fast feedback**: No waiting for compilation before running tests
- **Better debugging**: Debug TypeScript directly in your IDE

## Test Organization

Tests are located next to the source files they test with a `.test.ts` suffix:

```
src/
├── types/
│   ├── encoding.ts
│   ├── encoding.test.ts       # Tests for encoding.ts
│   ├── segment.ts
│   ├── segment.test.ts        # Tests for segment.ts
│   └── ...
├── segments/v2.5.1/
│   ├── MSH.ts
│   ├── MSH.test.ts            # Tests for MSH.ts
│   └── ...
├── parsers/v2.5.1/
│   ├── MSHParser.ts
│   ├── MSHParser.test.ts      # Tests for MSHParser.ts
│   └── ...
└── builders/v2.5.1/
    ├── ORU_R01.ts
    ├── ORU_R01.test.ts        # Tests for ORU_R01.ts
    └── ...
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests for specific pattern
```bash
npx tsx --test 'src/segments/**/*.test.ts'
npx tsx --test 'src/parsers/**/MSH*.test.ts'
```

## Writing Tests

Tests use Node.js's built-in `node:test` and `node:assert` modules:

```typescript
import { test } from 'node:test';
import assert from 'node:assert';
import { MyClass } from './my-class';

test('MyClass does something', () => {
  const instance = new MyClass();
  const result = instance.doSomething();
  
  assert.strictEqual(result, 'expected value');
});

test('MyClass throws on invalid input', () => {
  const instance = new MyClass();
  
  assert.throws(() => {
    instance.doSomething('invalid');
  }, /Error message pattern/);
});
```

## Test Structure

### Core Types Tests (`src/types/*.test.ts`)
- **encoding.test.ts**: Tests for encoding character definitions
- **segment.test.ts**: Tests for base segment functionality
- **message.test.ts**: Tests for HL7 message container
- **parser.test.ts**: Tests for parser utilities

### Segment Builder Tests (`src/segments/v2.5.1/*.test.ts`)
- Test segment creation with builder pattern
- Test field encoding
- Test fluent interface
- Test round-trip consistency (build → encode → parse)

### Segment Parser Tests (`src/parsers/v2.5.1/*.test.ts`)
- Test parsing valid segments
- Test field extraction
- Test error handling for invalid segments
- Test round-trip consistency (parse → encode)

### Message Tests (`src/builders/v2.5.1/*.test.ts`, `src/parsers/v2.5.1/*Parser.test.ts`)
- Test complete message construction
- Test message validation
- Test segment ordering
- Test complex scenarios (multiple patients, multiple observations)
- Test round-trip consistency

## Test Coverage

Current test coverage includes:

- ✅ Core types (encoding, segment, message, parser utils)
- ✅ Segment builders (MSH, PID, PV1, OBR, OBX)
- ✅ Segment parsers (MSH, PID, PV1, OBR, OBX)
- ✅ Message builder (ORU_R01)
- ✅ Message parser (ORU_R01)

## Test Patterns

### Builder Tests
```typescript
test('MSH builder creates valid segment', () => {
  const msh = new MSH()
    .sendingApplication('LAB')
    .receivingApplication('EMR')

  assert.strictEqual(msh.name, 'MSH');
  assert.ok(msh.fields.length > 0);
});
```

### Parser Tests
```typescript
test('MSHParser parses valid MSH segment', () => {
  const parser = new MSHParser();
  const mshString = 'MSH|^~\\&|LAB|Hospital|EMR|Clinic';
  
  const result = parser.parse(mshString);
  
  assert.strictEqual(result.success, true);
  assert.ok(result.data);
});
```

### Round-Trip Tests
```typescript
test('MSH round-trip consistency', () => {
  const original = 'MSH|^~\\&|LAB|Hospital|EMR|Clinic';
  
  const parseResult = parser.parse(original);
  assert.ok(parseResult.data);
  
  const reEncoded = parseResult.data.encode();
  assert.strictEqual(reEncoded, original);
});
```

### Error Handling Tests
```typescript
test('Parser fails on invalid segment', () => {
  const parser = new MSHParser();
  const result = parser.parse('PID|1||12345');
  
  assert.strictEqual(result.success, false);
  assert.ok(result.error);
  assert.ok(result.error.includes('Not a valid MSH segment'));
});
```

## Dependencies

Testing uses minimal dependencies:

- `node:test` - Node.js test runner (built-in)
- `node:assert` - Assertion library (built-in)
- `tsx` - TypeScript execution engine (dev dependency, via npx)
- `@types/node` - TypeScript type definitions for Node.js (dev dependency)

## CI/CD Integration

The test suite can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test
```

## Test Output

Tests provide detailed output with TypeScript line numbers:

```
✔ MSH builder creates valid segment (0.49ms)
✔ MSH encodes correctly with all fields (0.14ms)
✔ MSH messageType with two components (0.05ms)
...
ℹ tests 108
ℹ pass 91
ℹ fail 17
```

Failed tests show assertion details with **TypeScript source locations**:

```
✖ parseORU_R01 parses valid message (1.53ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  false !== true

  at TestContext.<anonymous> (/path/to/src/parsers/v2.5.1/ORU_R01_Parser.test.ts:17:10)
```

Note the `.test.ts` file path - this points directly to your TypeScript source!

## Best Practices

1. **Co-locate tests**: Keep tests next to the code they test
2. **Test one thing**: Each test should verify a single behavior
3. **Use descriptive names**: Test names should clearly describe what they verify
4. **Test edge cases**: Include tests for error conditions and boundary cases
5. **Round-trip testing**: Always test that data can be encoded and decoded correctly
6. **Keep tests fast**: Tests should run quickly to encourage frequent execution
7. **No external dependencies**: Use only Node.js built-in modules

## Adding New Tests

When adding new functionality:

1. Create a `.test.ts` file next to your source file
2. Import the test runner and assertions:
   ```typescript
   import { test } from 'node:test';
   import assert from 'node:assert';
   ```
3. Write tests for success cases, error cases, and edge cases
4. Run `npm test` to verify all tests pass
5. Commit tests alongside the implementation

## Debugging Tests

To debug a specific test:

```bash
# Run specific test file with more verbose output
npx tsx --test src/segments/v2.5.1/MSH.test.ts

# Use Node.js debugger (works with TypeScript!)
npx tsx --inspect-brk --test src/segments/v2.5.1/MSH.test.ts
```

### VSCode Debugging

Add this to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run Current Test File",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["tsx", "--test", "${file}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Then open any `.test.ts` file and press F5 to debug it directly!
