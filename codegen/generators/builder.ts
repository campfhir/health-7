import type { BuilderConfig } from "../types.ts";

/**
 * Generates a builder stub for a message type.
 *
 * The generated file:
 *  - Has all imports and generic type parameters wired up
 *  - Has a skeleton verify() and encode() with TODO comments
 *  - Contains an intentional syntax error (`const _TODO =`) inside encode()
 *    so the file will NOT compile until the developer fills it in and removes it.
 */
export function generateBuilder(
  config: BuilderConfig,
  version: string,
  baseVersion: string,
): string {
  const { name, segments } = config;

  // MSH is always first and treated specially (no type param, just a base import)
  const allSegments = ["MSH", ...segments];

  // Import base-version classes for type constraints
  const baseImports = allSegments
    .map(
      (s) =>
        `import { ${s} as ${s}_base } from "../../segments/${baseVersion}/${s}";`,
    )
    .join("\n");

  // Import current-version classes for defaults
  const versionImports = allSegments
    .map((s) => `import { ${s} } from "../../segments/${version}/${s}";`)
    .join("\n");

  // Generic type parameters for the class (MSH separate, others templated)
  const classTypeParams = [
    `  TMSH extends MSH_base = MSH,`,
    ...segments.map((s) => `  T${s} extends ${s}_base = ${s},`),
  ].join("\n");

  // Same params for the factory function
  const fnTypeParams = [
    `  TMSH extends MSH_base = MSH`,
    ...segments.map((s) => `  T${s} extends ${s}_base = ${s}`),
  ].join(",\n  ");

  const typeArgs = ["TMSH", ...segments.map((s) => `T${s}`)].join(", ");

  return `// ⚠ GENERATED STUB — complete before use
// Re-run \`pnpm codegen --version=${version}\` to regenerate from scratch.
//
// Steps to complete:
//   1. Define data-shape interfaces for this message's groups (see TODO below).
//   2. Add group fields to the constructor and verify().
//   3. Implement encode() in HL7 segment order.
//   4. Remove the \`const _TODO =\` syntax error when done.

${baseImports}

${versionImports}
import { EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding";

// TODO: define data-shape interfaces for this message type.
//
// Example for a message with repeating order groups:
//
//   export interface OrderGroup<
//     TOBR extends OBR_base = OBR,
//     TOBX extends OBX_base = OBX,
//   > {
//     obr: TOBR;
//     obxList: TOBX[];
//   }
//
// Then add the group as a constructor field below.

export class ${name}<
${classTypeParams}
> {
  constructor(
    public msh: TMSH,
    // TODO: add message-specific group fields here, e.g.:
    //   public patientResults: PatientResult<...>[] = [],
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) {
      errors.push("MSH segment is required");
    }

    // TODO: add checks for required groups/segments, e.g.:
    //   if (this.patientResults.length === 0) {
    //     errors.push("At least one patient result is required");
    //   }

    return { valid: errors.length === 0, errors };
  }

  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        \`Cannot encode invalid ${name} message:\\n\${verification.errors.join("\\n")}\`,
      );
    }

    // FIXME: implement segment ordering then remove the line below.
    // Reference: src/schemas/${version}/${name}.ts for the structure.
    const _TODO =
    const segments: string[] = [];

    segments.push(this.msh.encode(this.encoding));

    // TODO: push remaining segments in HL7 order, e.g.:
    //   for (const group of this.groups) {
    //     segments.push(group.obr.encode(this.encoding));
    //     for (const obx of group.obxList) {
    //       segments.push(obx.encode(this.encoding));
    //     }
    //   }

    return segments.join("\\r");
  }
}

export function create${name}<
  ${fnTypeParams},
>(
  msh: TMSH,
  // TODO: mirror constructor params here
): ${name}<${typeArgs}> {
  return new ${name}(msh /* TODO: pass group fields */);
}
`;
}
