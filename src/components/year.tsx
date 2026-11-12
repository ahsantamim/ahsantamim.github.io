"use client";

/** Current year, rendered on the client so the static shell never bakes in a stale date. */
export function Year() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
