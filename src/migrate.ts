import { COLOR_MODE_STORAGE_KEY, LEGACY_COLOR_MODE_STORAGE_KEY } from "./const.ts";

/**
 * Carries a color mode persisted by `@vlandoss/theme-toggle` 1.x over to the
 * current storage key, so upgrading does not reset the user's choice.
 *
 * When the legacy key exists, its value is copied only if the current key is
 * absent (a value already stored under the current key always wins), and the
 * legacy key is then removed either way, so no stale 1.x entry is left behind.
 */
export function migrateLegacyColorMode() {
  const legacyColorMode = localStorage.getItem(LEGACY_COLOR_MODE_STORAGE_KEY);

  if (legacyColorMode === null) {
    return;
  }

  if (localStorage.getItem(COLOR_MODE_STORAGE_KEY) === null) {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, legacyColorMode);
  }

  localStorage.removeItem(LEGACY_COLOR_MODE_STORAGE_KEY);
}
