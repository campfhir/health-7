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

CI, version bumps, staged npm publishing and release tags are shared by every package in the
repository and described in [CONTRIBUTING.md](../../CONTRIBUTING.md). In short: run **Bump
version** with `hl7` as the package on a release branch, merge to `main`, and approve the staged
version on npm.
