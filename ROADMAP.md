# Roadmap

Goal: a complete, well-tested TypeScript implementation of HL7 v2, published to npm as
[`@campfhir/hl7`](https://www.npmjs.com/package/@campfhir/hl7).

| Phase | Scope | Status |
|---|---|---|
| 1 | **HL7 v2.3 complete** — every segment and event type | 🚧 in progress |
| 2 | **HL7 v2.5.1 parity** with v2.3, plus 2.5.1-only segments/messages | ⬜ |
| 3 | Later versions (2.4, 2.6, 2.7, 2.8…) as demand dictates | ⬜ |

Detailed checklists:

- [Segments roadmap](docs/ROADMAP-SEGMENTS.md)
- [Event / message types roadmap](docs/ROADMAP-EVENTS.md)

## Release pipeline

- Every PR and push to `main`: **lint, typecheck, test, build** (`.github/workflows/ci.yml`).
- Merging to `main` publishes the package version in `package.json` to npm if that version isn't
  already on the registry (`.github/workflows/publish.yml`). Bump `version` in `package.json` in
  the PR to ship a release.
- Publishing uses npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) from
  `publish.yml` — no long-lived token. Provenance is attached automatically.
