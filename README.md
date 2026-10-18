<p align="center">
  <img src="https://raw.githubusercontent.com/withvariablelab/theme-toggle/HEAD/brand/sign-readme.svg" width="64" alt="">
</p>

<h1 align="center"><a href="https://lab.variable.land/theme-toggle">theme-toggle</a></h1>

<p align="center">The theme is set before first paint.</p>

Light, dark and system color modes for React apps. A blocking script in `<head>` puts the `dark` class on `<html>` from the stored mode, and the `useColorMode` hook reads and changes it.

- `system` is the default. It resolves against the OS `prefers-color-scheme` and follows it live.
- The choice is stored in `localStorage`.
- You style the `dark` class with plain CSS.
- Every change dispatches a `CustomEvent`, so code outside React can follow it too.

## Install

```sh
pnpm add @variablelab/theme-toggle
```

It needs React 18 or later.

## Usage

theme-toggle ships two pieces that work together.

### 1. The inline script

Load the prebuilt script as the first thing in `<head>`, blocking, so the `dark` class is on `<html>` before the page paints.

```html
<head>
  <script src="https://unpkg.com/@variablelab/theme-toggle/dist/initial.js"></script>
  <!-- ...rest of head... -->
</head>
```

On load it reads the stored mode, or `system` when there is none, and toggles the `dark` class on `<html>`, resolving `system` against the OS preference. Then it stores the mode and exposes its runtime contract on `window.__COLOR_MODE__`.

### 2. The React hook

```tsx
import { useColorMode } from "@variablelab/theme-toggle";

function ThemeSwitch() {
  const { colorMode, setColorMode } = useColorMode();
  // colorMode -> "light" | "dark" | "system"

  return (
    <select value={colorMode} onChange={(e) => setColorMode(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

Calling `setColorMode` stores the choice in `localStorage`, toggles the `dark` class on `<html>` and dispatches the change event. While `colorMode` is `system`, the hook also follows the OS preference as it changes.

## Styling

Style the two themes with the `dark` class on `<html>`:

```css
:root {
  --bg: white;
  --fg: black;
}

.dark {
  --bg: black;
  --fg: white;
}

body {
  background: var(--bg);
  color: var(--fg);
}
```

## How it works

| Concern      | Value                                       |
| ------------ | ------------------------------------------- |
| DOM class    | `dark` on `document.documentElement`        |
| Storage key  | `@variablelab/theme-toggle.colorMode`       |
| Change event | `@variablelab/theme-toggle.colorModeChange` |

The change event is a `CustomEvent` dispatched on `document`, with the new value in `event.detail.colorMode`:

```ts
document.addEventListener("@variablelab/theme-toggle.colorModeChange", (event) => {
  console.log(event.detail.colorMode); // "light" | "dark" | "system"
});
```

The inline script also publishes these names on `window.__COLOR_MODE__` (`STORAGE_KEY`, `CUSTOM_EVENT`, `COLOR_MODE`), so other scripts can read them without importing the package.

## Upgrading from `@vlandoss/theme-toggle` 1.x

The package was renamed to `@variablelab/theme-toggle` in 2.0.0:

1. Replace the dependency and imports with `pnpm remove @vlandoss/theme-toggle && pnpm add @variablelab/theme-toggle`, and change the inline script URL to `https://unpkg.com/@variablelab/theme-toggle/dist/initial.js`.
2. Listeners of the change event must use the new name, `@variablelab/theme-toggle.colorModeChange`, or read it from `window.__COLOR_MODE__.CUSTOM_EVENT`.

Saved preferences carry over. On init, if the old `@vlandoss/theme-toggle.colorMode` key exists, its value is copied to the new key, unless the new key already holds a value: then that value wins. The old key is removed either way.

## Contributing

The [contributing guide](https://github.com/withvariablelab/theme-toggle/blob/main/docs/contributing.md) covers issues, pull requests and releases, and the [development guide](https://github.com/withvariablelab/theme-toggle/blob/main/docs/development.md) covers setting up the repo and running its checks.

## License

The code is [MIT](https://github.com/withvariablelab/theme-toggle/blob/main/LICENSE). The Sign in `brand/` is not: its use is set by [BRAND-USE.md](https://github.com/withvariablelab/brand/blob/main/BRAND-USE.md).

<p align="center">
  <a href="https://lab.variable.land"><img src="https://cdn.jsdelivr.net/gh/withvariablelab/brand@v0.3.1/.github/readme/logo.svg" width="24" alt="" align="absmiddle">&nbsp;Variable Land</a>
</p>
