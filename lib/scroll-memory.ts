const HOME_SCROLL_KEY = "5am-home-scroll";
const RESTORE_KEY = "5am-home-restore";

export function saveHomeScroll(y: number): void {
  try {
    window.sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(y)));
  } catch {
    // ignore quota / private mode
  }
}

export function requestHomeScrollRestore(): void {
  try {
    window.sessionStorage.setItem(RESTORE_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}

/** Returns the saved landing scroll position once, if a restore was requested. */
export function consumeHomeScrollRestore(): number | null {
  try {
    if (window.sessionStorage.getItem(RESTORE_KEY) !== "1") return null;
    window.sessionStorage.removeItem(RESTORE_KEY);
    const y = Number(window.sessionStorage.getItem(HOME_SCROLL_KEY));
    return Number.isFinite(y) && y > 0 ? y : null;
  } catch {
    return null;
  }
}
