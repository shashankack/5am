export const INTRO_PLAYED_KEY = "5am-intro-played";
export const INTRO_BOOT_STYLE_ID = "intro-boot-hide-nav";
export const INTRO_PENDING_CLASS = "intro-pending";

export function hasIntroPlayed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return (
      window.sessionStorage.getItem(INTRO_PLAYED_KEY) === "1" ||
      document.cookie.split("; ").includes(`${INTRO_PLAYED_KEY}=1`)
    );
  } catch {
    return true;
  }
}

export function markIntroPlayed(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
  try {
    document.cookie = `${INTRO_PLAYED_KEY}=1; path=/; SameSite=Lax`;
  } catch {
    // ignore cookie-blocked contexts
  }
  clearIntroBootStyle();
}

export function clearIntroBootStyle(): void {
  if (typeof window === "undefined") return;
  document.documentElement.classList.remove(INTRO_PENDING_CLASS);
  document.getElementById(INTRO_BOOT_STYLE_ID)?.remove();
}

export const INTRO_VIDEO_SRC = "/assets/videos/intro_anim.mp4";
export const NAVBAR_ID = "site-navbar";
