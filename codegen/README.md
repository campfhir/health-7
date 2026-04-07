# codegen

Internal build tool for generating HL7 segment wrappers, parser stubs, and builder stubs from schema definitions.

## Usage

```sh
pnpm codegen           # generate everything
pnpm codegen --dry-run # print what would be written without touching files
```

## How it works

Codegen reads every `VersionSchema` registered in `generate.ts` and produces files under `src/`. Versions are processed in order — bases before derived versions.

### Two kinds of versions

**Base versions** (e.g. `v2.3`) have no `baseVersion`. Their segments are hand-written. Codegen generates:
- `src/parsers/v2.3/<MessageType>_Parser.ts` — parser stub with full switch-case skeleton
- `src/builders/v2.3/<MessageType>.ts` — builder stub

**Derived versions** (e.g. `v2.5.1`) extend a base. Codegen generates:
- `src/segments/v2.5.1/<SEG>.ts` — thin wrapper that extends the base segment class
- `src/parsers/v2.5.1/<MessageType>_Parser.ts` — override that swaps in v2.5.1 segment classes
- `src/builders/v2.5.1/<MessageType>.ts` — builder stub

### Skipping completed files

Files containing a `const _TODO =` syntax error are stubs — codegen will overwrite them. Once a developer removes that line (i.e. completes the file), codegen will skip it forever.

Parser overrides (in derived versions) are skipped if the file already exists at all, since they typically don't need hand-editing.

---

## Directory structure

```
codegen/
  schemas/
    v2.3/
      ORU_R01.ts       # MessageSchema definition
      MFN_M02.ts
      ADT_A28.ts
      version.ts       # VersionSchema — registers all v2.3 messages
      index.ts
    v2.5.1/
      ORU_R01.ts       # Spreads v2.3 schema with version: "2.5.1"
      MFN_M02.ts
      ADT_A28.ts       # { ...ADT_A28_V2_3, version: "2.5.1" }
      ORU_R30.ts
      version.ts       # VersionSchema — segments list + all v2.5.1 messages
      index.ts
  generators/
    segment.ts         # Generates segment wrapper files
    baseParser.ts      # Generates base parser stubs (for base versions)
    parser.ts          # Generates parser override files (for derived versions)
    builder.ts         # Generates builder stub files
  generate.ts          # Entry point — registers VERSIONS, runs generate()
  types.ts             # VersionConfig / ParserConfig / BuilderConfig interfaces
  README.md            # This file
```

---

## Adding a new message type

1. **Define the schema in the base version:**

   Create `codegen/schemas/v2.3/ADT_A31.ts`:

   ```ts
   import { MessageSchema } from "../../../src/types/schema";

   export const ADT_A31_SCHEMA: MessageSchema = {
     messageType: "ADT",
     triggerEvent: "A31",
     version: "2.3",
     structure: [
       { name: "MSH", required: true, repeating: false },
       { name: "EVN", required: true, repeating: false },
       { name: "PID", required: true, repeating: false },
       // ...
     ],
   };
   ```

2. **Add it to the base version schema:**

   In `codegen/schemas/v2.3/version.ts`, import and add to `messages`.

3. **Spread into derived versions:**

   In `codegen/schemas/v2.5.1/ADT_A31.ts`:

   ```ts
   import { ADT_A31_SCHEMA as base } from "../v2.3/ADT_A31";
   export const ADT_A31_SCHEMA = { ...base, version: "2.5.1" };
   ```

   Then add to `codegen/schemas/v2.5.1/version.ts`.

4. **Run codegen:**

   ```sh
   pnpm codegen
   ```

   This generates the parser stub in `src/parsers/v2.3/` and the override + builder in `src/parsers/v2.5.1/` and `src/builders/v2.5.1/`.

5. **Complete the base parser stub:**

   Open `src/parsers/v2.3/ADT_A31_Parser.ts`. Fill in:
   - The `ParsedADT_A31` type interface
   - State variables above the `for` loop
   - Assignments in each `switch` case
   - The final `return` value

   Remove all `const _TODO =` lines when done. The file will now compile.

---

## Adding a new HL7 version

1. Create `codegen/schemas/vX.X/` with message schema files and a `version.ts`:

   ```ts
   export const V_X_X: VersionSchema = {
     version: "vX.X",
     baseVersion: "v2.5.1",   // omit if this is a new base version
     segments: ["MSH", "PID", ...],
     messages: [...],
   };
   ```

2. Register it in `codegen/generate.ts`:

   ```ts
   import { V_X_X } from "./schemas/vX.X/version.ts";
   const VERSIONS: VersionSchema[] = [V2_3, V2_5_1, V_X_X];
   ```

3. Run `pnpm codegen`.
