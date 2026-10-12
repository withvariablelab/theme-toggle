import { COLOR_MODE_STORAGE_KEY, LEGACY_COLOR_MODE_STORAGE_KEY } from "./const.ts";

/**
 * Carries a color mode persisted by `@vlandoss/theme-toggle` 1.x over to the
 * current storage key, so upgrading does not reset the user's choice.
 *
 * Only acts when the current key is absent and the legacy key exists: the
 * legacy value is copied and the legacy key removed. A value already stored
 * under the current key always wins.
 */
export function migrateLegacyColorMode() {
  const legacyColorMode = localStorage.getItem(LEGACY_COLOR_MODE_STORAGE_KEY);

  if (legacyColorMode === null || localStorage.getItem(COLOR_MODE_STORAGE_KEY) !== null) {
    return;
  }

  localStorage.setItem(COLOR_MODE_STORAGE_KEY, legacyColorMode);
  localStorage.removeItem(LEGACY_COLOR_MODE_STORAGE_KEY);
}
