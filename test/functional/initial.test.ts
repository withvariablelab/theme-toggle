import { beforeEach, describe, expect, it, vi } from "vitest";
import { COLOR_MODE, COLOR_MODE_EVENT, COLOR_MODE_STORAGE_KEY, LEGACY_COLOR_MODE_STORAGE_KEY } from "../../src/const.ts";

// A fresh query string forces the browser to re-evaluate the side-effectful
// module; vi.resetModules() does not re-run native modules in Browser Mode.
let runId = 0;
async function runInitialScript() {
  runId += 1;
  const url = new URL("../../src/initial.ts", import.meta.url);
  url.searchParams.set("run", String(runId));
  await import(/* @vite-ignore */ url.href);
}

function stubPrefersDark(matches: boolean | undefined) {
  const matchMedia = vi.fn((_query: string) => ({ matches }));
  vi.stubGlobal("matchMedia", matchMedia);
  return matchMedia;
}

function hasDarkClass() {
  return document.documentElement.classList.contains(COLOR_MODE.DARK);
}

describe("initial.ts — explicit light/dark preference wins", () => {
  it('applies the dark class when "dark" is persisted, ignoring matchMedia', async () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, COLOR_MODE.DARK);
    const matchMedia = stubPrefersDark(false);

    await runInitialScript();

    expect(hasDarkClass()).toBe(true);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.DARK);
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it('removes the dark class when "light" is persisted', async () => {
    document.documentElement.classList.add(COLOR_MODE.DARK);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, COLOR_MODE.LIGHT);

    await runInitialScript();

    expect(hasDarkClass()).toBe(false);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.LIGHT);
  });
});

describe("initial.ts — system mode follows the OS preference", () => {
  it('applies the dark class when "system" is persisted and the OS prefers dark', async () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, COLOR_MODE.SYSTEM);
    stubPrefersDark(true);

    await runInitialScript();

    expect(hasDarkClass()).toBe(true);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.SYSTEM);
  });

  it('stays light when "system" is persisted and the OS prefers light', async () => {
    document.documentElement.classList.add(COLOR_MODE.DARK);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, COLOR_MODE.SYSTEM);
    stubPrefersDark(false);

    await runInitialScript();

    expect(hasDarkClass()).toBe(false);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.SYSTEM);
  });
});

describe("initial.ts — defaults to system on first visit", () => {
  it("resolves to dark when nothing is stored and the OS prefers dark", async () => {
    stubPrefersDark(true);

    await runInitialScript();

    expect(hasDarkClass()).toBe(true);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.SYSTEM);
  });

  it("resolves to light when nothing is stored and the OS prefers light", async () => {
    document.documentElement.classList.add(COLOR_MODE.DARK);
    stubPrefersDark(false);

    await runInitialScript();

    expect(hasDarkClass()).toBe(false);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.SYSTEM);
  });

  it("stays light when the media query result is unavailable", async () => {
    stubPrefersDark(undefined);

    await runInitialScript();

    expect(hasDarkClass()).toBe(false);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.SYSTEM);
  });
});

describe("initial.ts — migrates the @vlandoss/theme-toggle 1.x storage key", () => {
  it("adopts the legacy value and removes the legacy key when the current key is absent", async () => {
    localStorage.setItem(LEGACY_COLOR_MODE_STORAGE_KEY, COLOR_MODE.DARK);
    const matchMedia = stubPrefersDark(false);

    await runInitialScript();

    expect(hasDarkClass()).toBe(true);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.DARK);
    expect(localStorage.getItem(LEGACY_COLOR_MODE_STORAGE_KEY)).toBeNull();
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it('migrates a legacy "system" value and resolves it against the OS preference', async () => {
    localStorage.setItem(LEGACY_COLOR_MODE_STORAGE_KEY, COLOR_MODE.SYSTEM);
    stubPrefersDark(true);

    await runInitialScript();

    expect(hasDarkClass()).toBe(true);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.SYSTEM);
    expect(localStorage.getItem(LEGACY_COLOR_MODE_STORAGE_KEY)).toBeNull();
  });

  it("keeps the current key and leaves the legacy key untouched when both are present", async () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, COLOR_MODE.LIGHT);
    localStorage.setItem(LEGACY_COLOR_MODE_STORAGE_KEY, COLOR_MODE.DARK);

    await runInitialScript();

    expect(hasDarkClass()).toBe(false);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.LIGHT);
    expect(localStorage.getItem(LEGACY_COLOR_MODE_STORAGE_KEY)).toBe(COLOR_MODE.DARK);
  });
});

describe("initial.ts — runtime contract on window", () => {
  beforeEach(() => {
    stubPrefersDark(false);
  });

  it("uses the @variablelab/theme-toggle storage key and event name", async () => {
    await runInitialScript();

    expect(window.__COLOR_MODE__.STORAGE_KEY).toBe("@variablelab/theme-toggle.colorMode");
    expect(window.__COLOR_MODE__.CUSTOM_EVENT).toBe("@variablelab/theme-toggle.colorModeChange");
  });

  it("exposes the storage key, event name, and color-mode map on window", async () => {
    await runInitialScript();

    expect(window.__COLOR_MODE__).toEqual({
      STORAGE_KEY: COLOR_MODE_STORAGE_KEY,
      CUSTOM_EVENT: COLOR_MODE_EVENT,
      COLOR_MODE: {
        DARK: COLOR_MODE.DARK,
        LIGHT: COLOR_MODE.LIGHT,
        SYSTEM: COLOR_MODE.SYSTEM,
      },
    });
  });
});
