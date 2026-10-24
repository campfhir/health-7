# Project notes for Claude

## Validating HL7 facts

When confirming anything about the HL7 v2 standard (which version introduced a segment or
event, field tables, data types, message structures), use **only** these sources:

- https://www.hl7.org (official HL7 International)
- https://www.hl7.eu (e.g. `https://www.hl7.eu/HL7v2x/v23/hl7v23segmROL.htm`)
- https://hl7-definition.caristix.com/v2
- https://hapifhir.github.io/hapi-hl7v2/v23/apidocs (HAPI HL7 v2.3 generated structures, javadoc
  e.g. `.../ca/uhn/hl7v2/model/v23/segment/IN2.html`). Use it as a cross-check for field types and
  repeatability: a getter returning `X[]` or a `getXReps()` method means the field repeats. HAPI is
  generated code, so it confirms a fact only alongside a spec source, not on its own.
- https://github.com/hapifhir/hapi-hl7v2 (HAPI source). The field definitions in
  `hapi-structures-v23/.../model/v23/segment/*.java` are a machine-readable v2.3 field table. Use it
  as a fact source for `packages/hl7/codegen/validate/hapi-v23.mjs`. HAPI is dual licensed (MPL 1.1 / GPL) and this
  project is MIT, so do not copy HAPI code into this repository or generate code from it without a
  license decision.

Do not rely on other sites (vendor guides, blogs, whitepapers, package docs) or on memory alone.
If those sources cannot confirm a fact, say so and flag it as unverified instead of
guessing. Cite the page used in the PR or commit when a spec decision is made.

## Repository layout

This is a pnpm workspace. Every npm package lives in `packages/<name>` and publishes as
`@campfhir/<name>`; `packages/hl7` is `@campfhir/hl7`. Lint and TypeScript settings are shared
from the root (`eslint.config.mjs`, `tsconfig.base.json`). The release workflows discover packages
by scanning `packages/*/package.json`. See `CONTRIBUTING.md` for adding a package and releasing.

## Workflow

- From the root, `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` run in every package;
  all must pass. CI also runs `pnpm codegen:check` and `pnpm smoke`. `pnpm verify` runs everything.
- To run one package's scripts use `pnpm --filter @campfhir/hl7 <script>` or `cd packages/hl7`.
- `@campfhir/hl7`: after adding/moving segments, parsers or builders run
  `pnpm codegen && pnpm barrels && pnpm exports` inside `packages/hl7`. Versions are described in
  `packages/hl7/codegen/schemas/`; see `packages/hl7/codegen/README.md`.
