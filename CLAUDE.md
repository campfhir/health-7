# Project notes for Claude

## Validating HL7 facts

When confirming anything about the HL7 v2 standard (which version introduced a segment or
event, field tables, data types, message structures), use **only** these sources:

- https://www.hl7.org (official HL7 International)
- https://www.hl7.eu (e.g. `https://www.hl7.eu/HL7v2x/v23/hl7v23segmROL.htm`)
- https://hl7-definition.caristix.com/v2

Do not rely on other sites (vendor guides, blogs, whitepapers, package docs) or on memory alone.
If those three sources cannot confirm a fact, say so and flag it as unverified instead of
guessing. Cite the page used in the PR or commit when a spec decision is made.

## Workflow

- `pnpm lint`, `pnpm typecheck`, `pnpm test` must pass; CI also runs `pnpm codegen:check`.
- After adding/moving segments, parsers or builders: `pnpm codegen && pnpm barrels && pnpm exports`.
- Versions are described in `codegen/schemas/`; see `codegen/README.md`.
