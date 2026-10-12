---
"@variablelab/theme-toggle": major
---

Renamed from `@vlandoss/theme-toggle`. The package now lives at [withvariablelab/theme-toggle](https://github.com/withvariablelab/theme-toggle); `@vlandoss/theme-toggle` will not receive further releases.

**Breaking changes**

- Install and import `@variablelab/theme-toggle` instead of `@vlandoss/theme-toggle` (the inline script moves to `https://unpkg.com/@variablelab/theme-toggle/dist/initial.js`).
- The `localStorage` key is now `@variablelab/theme-toggle.colorMode` (was `@vlandoss/theme-toggle.colorMode`).
- The change event is now `@variablelab/theme-toggle.colorModeChange` (was `@vlandoss/theme-toggle.colorModeChange`). Update any `document.addEventListener(...)` listeners, or read the name from `window.__COLOR_MODE__.CUSTOM_EVENT`.

**Automatic migration**

Users keep their saved color mode. On init, both the inline script and `useColorMode` check for the 1.x key: if `@variablelab/theme-toggle.colorMode` is absent and `@vlandoss/theme-toggle.colorMode` exists, its value is copied to the new key and the old key is removed. A value already stored under the new key always wins.
