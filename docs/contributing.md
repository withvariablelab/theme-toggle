# Contributing

theme-toggle takes bug reports, fixes and small features. To set up the repo and run its checks, see the [development guide](development.md).

## Issues

- A bug report says what you expected, what happened, and which browser, React version and theme-toggle version you use.
- A new feature, or a change to the hook or the inline script, starts as an issue before any pull request.

## Pull requests

1. Branch from `main` with a prefix: `feat/`, `fix/`, `docs/`, `chore/` or `test/`.
2. Write commits as [Conventional Commits](https://www.conventionalcommits.org), such as `docs: fix the inline script URL`. The pull request title takes the same form, because it becomes the squash commit.
3. Run `rr check` and `pnpm test` before you push.
4. A pull request from a `feat/` or `fix/` branch, or with the `preview` label, publishes a preview to npm under the `pr-<number>` tag: `pnpm add @variablelab/theme-toggle@pr-123`.

CI has to pass, and a maintainer squash-merges.

## Changesets

A change to what ships to npm, the README and the LICENSE included, needs a changeset. Run `pnpm changeset`, pick the bump (`patch` for a fix, `minor` for a feature, `major` for a breaking change), and write one sentence for the changelog. Changes to tests, CI or `docs/` need none. Nobody edits versions or `CHANGELOG.md` by hand.

## Releases

When changesets land on `main`, `vland-bot` opens or updates a "chore: update versions" pull request. A maintainer merges it, and that publishes the new version to npm.
