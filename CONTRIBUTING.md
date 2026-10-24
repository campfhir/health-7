# Contributing

## Setup

```bash
pnpm install
pnpm verify   # lint, typecheck, codegen check, tests, build, smoke test
```

`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm codegen:check` at the root run
the same-named script in every package (`pnpm -r`). To work on one package either `cd` into it or
use `pnpm --filter <name> <script>`. Package-specific scripts (for example `codegen`, `barrels`
and `exports` in `@campfhir/hl7`) are documented in that package's README.

## Adding a package

Each npm package is a folder under `packages/`. The folder name is the unscoped package name
(`packages/x12` publishes `@campfhir/x12`). CI and the release workflows discover packages by
scanning `packages/*/package.json`, so nothing else has to be registered.

1. Create `packages/<name>/` with:
   - `package.json`: `"name": "@campfhir/<name>"`, `"version": "0.1.0"`, `"license": "MIT"`,
     `"files": ["dist"]`, `"publishConfig": { "access": "public", "provenance": true }`,
     `"repository": { "type": "git", "url": "git+https://github.com/campfhir/kindling.git", "directory": "packages/<name>" }`,
     an `"exports"` map (with `require`, `import` and `types` conditions for every entry) and the
     standard scripts: `build`, `clean`, `test`, `typecheck`, `lint` (`eslint .`). Add
     `codegen:check` only if the package has generated files.
   - `tsconfig.json` extending `../../tsconfig.base.json` (set `rootDir`, `outDir`, `include`).
   - `tsup.config.ts` and `vitest.config.ts` (copy them from `packages/hl7`).
   - `src/` with tests next to the code (`*.test.ts`), and a `README.md` (npm shows it on the
     package page).
2. Follow the shared conventions: a fluent, chainable builder API typed against the standard,
   parsers whose output round-trips back to the wire format, zero runtime dependencies, dual
   CJS/ESM output, and versioned subpaths when the standard has versions.
3. Run `pnpm install` (adds the package to `pnpm-lock.yaml`), then `pnpm verify`.
4. Add the package to the tables in [README.md](README.md) and [ROADMAP.md](ROADMAP.md).
5. On npmjs.com, add a **trusted publisher** for the package: GitHub Actions, owner `campfhir`,
   repository `kindling`, workflow `publish.yml`. Without it the Publish workflow cannot
   authenticate. If npm will not accept a trusted-publisher configuration for a package that has
   never been published, a maintainer publishes the first version by hand
   (`cd packages/<name> && pnpm build && npm publish --access public`) and then adds the trusted
   publisher.

Dependencies between packages (for example a shared core used by several formats) would use
`"workspace:*"` specifiers. The Publish workflow currently stages with `npm stage publish`,
which does not rewrite `workspace:` specifiers, so switch that step to pack with pnpm first
(`pnpm pack`, then stage the tarball) before adding the first cross-package dependency.

## Release pipeline

Packages are versioned and released independently. Only the package whose version changed is
published.

- Every PR and push to `main` runs **lint, typecheck, codegen check, tests (Node 20/22/24),
  build and a smoke test** of every built entry point of every package
  (`.github/workflows/ci.yml`).
- To prepare a release, run **Bump version** from the Actions tab with the release branch
  selected and the package to bump (`hl7`, `x12`, …) as input. It commits the bump to that branch
  and starts CI on it; it refuses to run on `main`. You can also edit the package's `version` by
  hand in the PR.
- Merging to `main` runs **Publish** (`.github/workflows/publish.yml`). It lists every package
  whose `package.json` version is not on npm, then, in one job per package, re-runs lint,
  typecheck, tests, build and the smoke test for that package and **stages** it with
  `npm stage publish`. A maintainer approves the staged version with 2FA
  (`npm stage approve <stage-id>` or the *Staged Packages* tab on npmjs.com) to make it live.
- Staging uses npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) from
  `publish.yml`: no long-lived token. Each package needs its own trusted-publisher entry pointing
  at `campfhir/kindling` and `publish.yml`.
- `tag-releases.yml` tags every version that is live on npm as `<name>@<version>`
  (e.g. `@campfhir/hl7@0.11.0`), hourly and on pushes to `main`, using the `gitHead` npm records.
  Versions published without one are listed in `.github/release-tags.json`. Versions of
  `@campfhir/hl7` up to 0.10.0 keep their existing `v<version>` tags.

## Standards facts

Decisions about what a standard says must be backed by the sources listed in
[CLAUDE.md](CLAUDE.md) and cited in the PR; unverifiable facts are flagged, not guessed.
