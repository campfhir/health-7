# Testing Guide

Tests run with [Vitest](https://vitest.dev/) directly against the TypeScript source, so there is
no build step and stack traces point at `.ts` lines. Tests are co-located with the code they test
(Go style): `encoding.ts` is tested by `encoding.test.ts` in the same folder.

## Running tests

From this folder (`packages/hl7`), or from the repository root with
`pnpm --filter @campfhir/hl7 <script>`:

```bash
pnpm test                               # run everything once
pnpm test:watch                         # watch mode
pnpm vitest run src/segments/v2.3       # one folder
pnpm vitest run src/segments/v2.3/PID   # files matching a pattern
pnpm vitest run -t "round-trip"         # tests whose name matches
```

`pnpm test` at the repository root runs the tests of every package.

## Test layout

```
src/
├── types/                     # core: encoding, segment, message, parser utilities
│   ├── encoding.ts
│   └── encoding.test.ts
├── segments/<version>/        # one test file per segment (field positions, encoding, fluent API)
├── parsers/<version>/         # one test file per message parser (+ integration tests)
├── parsers/testdata/          # sample .hl7 messages read by the integration tests
├── builders/<version>/        # one test file per message builder
└── utils/                     # ValueExtractor, MessageEditor, date utilities, CustomSegment
```

Field-position tests for segments are generated from the segment sources with
`pnpm test:positions` (see `codegen/README.md`); do not edit those by hand.

## Writing tests

```typescript
import { test, expect, describe } from "vitest";
import { MSH } from "./MSH.ts";

describe("MSH", () => {
  test("sets the sending application in MSH-3", () => {
    const msh = new MSH().sendingApplication("LAB");
    expect(msh.encode()).toContain("|LAB|");
  });
});
```

Use `expect(() => ...).toThrow(/message/)` for inputs a builder or parser must reject, and
`expect(result.success).toBe(false)` plus a check on `result.error` for parser results.

Patterns used throughout the suite:

- **Builder tests** check that each fluent setter lands in the right field/component and that
  `encode()` produces the expected segment string.
- **Parser tests** parse a known segment or message, assert on the extracted values and on the
  error returned for invalid input.
- **Round-trip tests** parse a message, re-encode it and compare with the original (and the other
  direction: build, encode, parse).
- **Integration tests** read the sample messages in `src/parsers/testdata/` and parse every one.

Guidelines: keep each test about one behaviour, name it after that behaviour, cover error cases
and edge cases alongside the happy path, and add the test file in the same commit as the code.

## Debugging

```bash
pnpm vitest run src/segments/v2.3/PID.test.ts --reporter verbose
node --inspect-brk ./node_modules/vitest/vitest.mjs run src/segments/v2.3/PID.test.ts
```

In VS Code the [Vitest extension](https://marketplace.visualstudio.com/items?itemName=vitest.explorer)
runs and debugs individual tests from the editor.
