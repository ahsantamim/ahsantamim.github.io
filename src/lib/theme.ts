export type Theme = "dark" | "light";

export const THEME_KEY = "theme";

/** Runs in <head> before first paint: a saved choice wins, otherwise the system preference. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function storedTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {}
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
