import type { BuilderConfig } from "../types.ts";

/**
 * Generates a thin builder wrapper that re-exports a base message builder.
 *
 * Used when a message schema sets `baseMessage` — the generated file:
 *  - Re-exports the base class under the new message name
 *  - Re-exports the factory function under the new name
 */
export function generateWrapperBuilder(
  config: BuilderConfig,
  baseMsgName: string,
): string {
  const { name } = config;
  return `export { ${baseMsgName} as ${name}, create${baseMsgName} as create${name} } from "./${baseMsgName}";
`;
}
