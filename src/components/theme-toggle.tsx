"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_KEY, storedTheme, type Theme } from "@/lib/theme";

const root = () => document.documentElement;
const read = (): Theme => (root().getAttribute("data-theme") === "light" ? "light" : "dark");

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "dark");
  const next: Theme = theme === "dark" ? "light" : "dark";

  // React's dev remount resets <html> attributes; production keeps the inline script's value.
  useLayoutEffect(() => {
    root().setAttribute("data-theme", storedTheme());
  }, []);

  const toggle = () => {
    const apply = () => root().setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`flex size-11 items-center justify-center text-muted transition-colors duration-300 hover:text-ink ${className}`}
    >
      <Sun className="light:hidden" size={18} strokeWidth={1.75} aria-hidden="true" />
      <Moon className="hidden light:block" size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
