# Development

How to work on theme-toggle in a clone. The [contributing guide](contributing.md) covers how a change gets in.

## Setup

[mise](https://mise.jdx.dev) pins Node 24 and pnpm in `mise.toml`, with checksums in `mise.lock`, and puts `node_modules/.bin` on the `PATH`, so the tools run by name:

```sh
mise install
pnpm install
playwright install chromium   # the browser the tests run in
lefthook install              # the git hooks in lefthook.yml
```

pnpm doesn't run lefthook's own install script, so the hooks need `lefthook install` once. After changing a version in `mise.toml`, run `mise lock` and commit both files.

## Tasks

```sh
pnpm test      # the functional tests, in a real browser
rr check       # Biome's format and lint, then the type check
rr jsc --fix   # apply Biome's fixes
rr pack        # build dist/ with tsdown, as prepublishOnly does
```

The suite in `test/functional` runs in Vitest Browser Mode with Playwright. It covers both entry points: the `useColorMode` hook (`src/index.ts`) and the inline script (`src/initial.ts`).

## CI

- **On each pull request to `main`:** `pnpm rr check`, `pnpm test` and the build with `pnpm rr pack` (CI), and zizmor on the workflows (Workflow audit).
- **Git hooks** ([lefthook](https://lefthook.dev)): on commit, Biome's fixes on the staged files and the type check; on push, the tests.
- **Every Monday:** `pnpm audit` on the lockfile, which keeps an issue labeled `dependency-audit` open while it finds known vulnerabilities (Dependency audit).
