export const COLOR_MODE_EVENT = "@variablelab/theme-toggle.colorModeChange";

export const COLOR_MODE_STORAGE_KEY = "@variablelab/theme-toggle.colorMode";

/**
 * Storage key written by `@vlandoss/theme-toggle` 1.x. On init its value is
 * moved to {@link COLOR_MODE_STORAGE_KEY} unless that key is already set, and
 * the legacy key is removed (see `migrateLegacyColorMode`).
 */
export const LEGACY_COLOR_MODE_STORAGE_KEY = "@vlandoss/theme-toggle.colorMode";

export const COLOR_MODE = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
} as const;

export type ColorMode = (typeof COLOR_MODE)[keyof typeof COLOR_MODE];
