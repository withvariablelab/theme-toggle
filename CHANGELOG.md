# @variablelab/theme-toggle

## 2.0.1

### Patch Changes

- [#14](https://github.com/withvariablelab/theme-toggle/pull/14) [`6cc642d`](https://github.com/withvariablelab/theme-toggle/commit/6cc642d1ae7d326ad188756ded6f756110685ae0) Thanks [@rqbazan](https://github.com/rqbazan)! - Put the Sign and the Tagline at the top of the README, and set the author to `rcrd <ricardo@variable.land>`.

## 2.0.0

### Major Changes

- [#8](https://github.com/withvariablelab/theme-toggle/pull/8) [`48299ee`](https://github.com/withvariablelab/theme-toggle/commit/48299ee6e6036b70ee27d3cd3b96a6886b134f24) Thanks [@rqbazan](https://github.com/rqbazan)! - Renamed from `@vlandoss/theme-toggle`. The package now lives at [withvariablelab/theme-toggle](https://github.com/withvariablelab/theme-toggle); `@vlandoss/theme-toggle` will not receive further releases.

  **Breaking changes**

  - Install and import `@variablelab/theme-toggle` instead of `@vlandoss/theme-toggle` (the inline script moves to `https://unpkg.com/@variablelab/theme-toggle/dist/initial.js`).
  - The `localStorage` key is now `@variablelab/theme-toggle.colorMode` (was `@vlandoss/theme-toggle.colorMode`).
  - The change event is now `@variablelab/theme-toggle.colorModeChange` (was `@vlandoss/theme-toggle.colorModeChange`). Update any `document.addEventListener(...)` listeners, or read the name from `window.__COLOR_MODE__.CUSTOM_EVENT`.

  **Automatic migration**

  Users keep their saved color mode. On init, both the inline script and `useColorMode` check for the 1.x key: if `@variablelab/theme-toggle.colorMode` is absent and `@vlandoss/theme-toggle.colorMode` exists, its value is copied to the new key. A value already stored under the new key always wins. Either way, the old key is removed.

## 1.0.0

### Major Changes

- [#2](https://github.com/withvariablelab/theme-toggle/pull/2) [`dd42ff8`](https://github.com/withvariablelab/theme-toggle/commit/dd42ff8bd1ca2b96c6484f8a323d17aa916e158a) Thanks [@rqbazan](https://github.com/rqbazan)! - Initial stable release. Ships the `useColorMode` React hook and an inline pre-paint script for `light` / `dark` / `system` color modes. The `system` mode resolves against the OS `prefers-color-scheme` and tracks it live, the choice is persisted to `localStorage`, a `dark` class is toggled on `<html>`, and a `CustomEvent` is dispatched on every change.
