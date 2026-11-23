"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/data/site";
import type { AnalyticsPayload } from "./types";

/**
 * The analytics PIN, remembered for this browser tab once it has worked.
 * The Worker checks the PIN; nothing here decides access on its own.
 */
const KEY = "analytics-pin";
const listeners = new Set<() => void>();

function read() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function savePin(pin: string | null) {
  try {
    if (pin) sessionStorage.setItem(KEY, pin);
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the PIN simply is not remembered.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** `undefined` until the browser has been read, so the server render stays neutral. */
export function usePin() {
  return useSyncExternalStore<string | null | undefined>(subscribe, read, () => undefined);
}

export class PinError extends Error {}

export async function fetchReport(pin: string, range: number, signal?: AbortSignal) {
  if (!site.analyticsApi) throw new Error("Analytics are not connected yet.");
  const response = await fetch(`${site.analyticsApi}/?range=${range}`, {
    headers: { Authorization: `Bearer ${pin}` },
    signal,
  });
  const body = await response.json().catch(() => ({}));
  if (response.status === 401) throw new PinError(body.error ?? "Wrong password.");
  if (!response.ok) throw new Error(body.error ?? "Analytics are unavailable right now.");
  return body as AnalyticsPayload;
}

export type Summary = { views: number; visits: number; from: string; to: string };

export async function fetchSummary(signal?: AbortSignal) {
  if (!site.analyticsApi) throw new Error("Analytics are not connected yet.");
  const response = await fetch(`${site.analyticsApi}/summary`, { signal });
  if (!response.ok) throw new Error("Summary unavailable");
  return (await response.json()) as Summary;
}
