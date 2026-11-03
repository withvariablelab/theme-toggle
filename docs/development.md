# Development

How to work on theme-toggle in a clone. The [contributing guide](contributing.md) covers how a change gets in.

## Setup

[mise](https://mise.jdx.dev) 2026.10.19 or later pins Node 24, pnpm 12 and [gitleaks](https://github.com/gitleaks/gitleaks) in `mise.toml`, with checksums in `mise.lock`, and puts `node_modules/.bin` on the `PATH`, so the tools run by name:

```sh
mise install
pnpm install
playwright install chromium   # the browser the tests run in
```

`pnpm install` also installs the git hooks in `lefthook.yml`, because `pnpm-workspace.yaml` allows lefthook's install script. With `CI` set, that script skips them, so after a `CI=1 pnpm install` run `pnpm lefthook install` to add them. After changing a version in `mise.toml`, run `mise lock` and commit both files.

## Tasks

```sh
pnpm test      # the functional tests, in a real browser
rr check       # Biome's format and lint, then the type check
rr jsc --fix   # apply Biome's fixes
rr pack        # build dist/ with tsdown, as prepublishOnly does
```

The suite in `test/functional` runs in Vitest Browser Mode with Playwright. It covers both entry points: the `useColorMode` hook (`src/index.ts`) and the inline script (`src/initial.ts`).

## CI

- **On each pull request to `main`:** CI sets up mise 2026.10.19 and the locked tools, then runs `pnpm rr check`, `pnpm test` and the build with `pnpm rr pack`. Beside them, gitleaks scans the pull request's commits for secrets, and the required `Test` check passes when both do. Workflow audit runs zizmor on the workflows.
- **Git hooks** ([lefthook](https://lefthook.dev)): `lefthook.yml` extends `lefthook/base.yml` from `@rrlab/cli`, whose jobs are listed in [its README](https://github.com/withvariablelab/dx/blob/main/run-run/cli/README.md#git-hooks), and its own `shared-hooks` job fails a commit, saying to run `pnpm install`, when that file is missing from `node_modules`. On commit, in parallel: Biome's fixes on the staged files, the type check when a TypeScript file or a tsconfig changes, and gitleaks on the staged changes. On push, the tests.
- **Every Monday:** `pnpm audit` on the lockfile, which keeps an issue labeled `dependency-audit` open while it finds known vulnerabilities (Dependency audit).
