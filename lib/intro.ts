const INTRO_PLAYED_KEY = "5am-intro-played";
export const INTRO_BOOT_STYLE_ID = "intro-boot-hide-nav";

export function hasIntroPlayed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(INTRO_PLAYED_KEY) === "1";
  } catch {
    return true;
  }
}

export function markIntroPlayed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INTRO_PLAYED_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
  clearIntroBootStyle();
}

export function clearIntroBootStyle(): void {
  if (typeof window === "undefined") return;
  document.getElementById(INTRO_BOOT_STYLE_ID)?.remove();
}

export const INTRO_VIDEO_SRC = "/assets/videos/intro_anim.mp4";
export const NAVBAR_ID = "site-navbar";

/**
 * Runs before paint. Hides the navbar via an injected stylesheet (does not
 * mutate <html> attributes, so React hydration stays clean).
 */
export const INTRO_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(INTRO_PLAYED_KEY)};if(localStorage.getItem(k)==="1"||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var s=document.createElement("style");s.id=${JSON.stringify(INTRO_BOOT_STYLE_ID)};s.textContent=${JSON.stringify(`#${NAVBAR_ID}{transform:translate3d(0,-100%,0)}`)};document.head.appendChild(s);}catch(e){}})();`;
