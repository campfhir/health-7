# kindling

Healthcare data parsers, builders and generators for TypeScript. One repository, several npm
packages under the [`@campfhir`](https://www.npmjs.com/org/campfhir) organization, each published
as its own bundle with its own version.

## Packages

| Package | Folder | What it does | Status |
|---|---|---|---|
| [`@campfhir/hl7`](https://www.npmjs.com/package/@campfhir/hl7) | [`packages/hl7`](packages/hl7) | Build and parse HL7 v2 messages (v2.3, 2.3.1, 2.4, 2.5, 2.5.1) | published |
| `@campfhir/x12` | `packages/x12` | X12 EDI transaction sets | planned |
| `@campfhir/pdmp` | `packages/pdmp` | PDMP (prescription drug monitoring) reporting formats | planned |
| `@campfhir/fhir-r4` | `packages/fhir-r4` | FHIR R4 resources | planned |
| `@campfhir/fhir-r5` | `packages/fhir-r5` | FHIR R5 resources | planned |

See [ROADMAP.md](ROADMAP.md) for where each package is heading.

## What every package shares

- **A fluent, type-safe API.** Builders are chainable and typed against the standard; parsers
  return structured data that round-trips back to the wire format.
- **Zero runtime dependencies**, dual CJS/ESM builds, and support for Node.js, Bun, browsers and
  edge runtimes.
- **Versioned subpaths** when the standard has versions (`@campfhir/hl7/segments/v2.5.1`).
- **Tests next to the code** (`*.test.ts`, Vitest), run on Node 20, 22 and 24 in CI.
- **One toolchain.** Lint, TypeScript and build settings live at the repository root; each package
  only adds its own `package.json`, `tsconfig.json`, `tsup.config.ts` and `vitest.config.ts`.

## Repository layout

```
.
├── packages/
│   └── hl7/                 # @campfhir/hl7 — src/, codegen/, examples/, docs/, README.md
├── .github/
│   ├── workflows/           # ci.yml, publish.yml, bump-version.yml, tag-releases.yml
│   └── scripts/             # release helpers (all workspace-aware)
├── eslint.config.mjs        # shared lint config
├── tsconfig.base.json       # shared compiler options; packages extend it
├── pnpm-workspace.yaml      # packages/*
└── package.json             # private root: fans scripts out to every package
```

## Development

```bash
pnpm install          # once, at the root
pnpm lint             # eslint across every package
pnpm typecheck        # tsc --noEmit in every package
pnpm test             # vitest in every package
pnpm build            # tsup in every package
pnpm verify           # everything CI runs, in order

pnpm --filter @campfhir/hl7 test   # one package (or `cd packages/hl7 && pnpm test`)
```

Adding a package, the release process and how publishing works are described in
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
