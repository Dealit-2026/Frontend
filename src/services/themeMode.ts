export type ThemeMode = "regular" | "auction";

const THEME_MODE_STORAGE_KEY = "dealit:theme-mode";

export function readStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "regular";
  }

  return window.localStorage.getItem(THEME_MODE_STORAGE_KEY) === "auction"
    ? "auction"
    : "regular";
}

export function writeStoredThemeMode(mode: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
}
