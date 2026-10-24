# Roadmap

Goal: well-tested TypeScript implementations of the data formats healthcare systems exchange,
published to npm as separate `@campfhir/*` packages from this repository, all with the same
fluent builder/parser style.

| Package | Scope | Status |
|---|---|---|
| `@campfhir/hl7` | HL7 v2 messages. v2.3 completion first, then v2.5.1 parity — see the [package roadmap](packages/hl7/ROADMAP.md) | 🚧 in progress |
| `@campfhir/x12` | X12 EDI transaction sets used in healthcare (eligibility, claims, remittance, …) | ⬜ not started |
| `@campfhir/pdmp` | Prescription drug monitoring program (PDMP) reporting formats | ⬜ not started |
| `@campfhir/fhir-r4` | FHIR R4 resources: typed builders, parsing and validation | ⬜ not started |
| `@campfhir/fhir-r5` | FHIR R5 resources | ⬜ not started |

Scope for the planned packages is a placeholder until work starts; each package keeps its own
detailed roadmap in its folder.

The release pipeline (CI, version bumps, staged npm publishing, tags) is described in
[CONTRIBUTING.md](CONTRIBUTING.md).
