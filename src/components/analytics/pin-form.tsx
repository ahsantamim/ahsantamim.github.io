"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { fetchReport, PinError, savePin } from "./pin";

/** Four-digit PIN entry. The Worker checks it; on success the PIN is kept for this tab. */
export function PinForm({
  onUnlock,
  initialError,
  autoFocus = true,
}: {
  onUnlock: () => void;
  initialError?: string;
  autoFocus?: boolean;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [checking, setChecking] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pin.length < 4 || checking) return;
    setChecking(true);
    setError("");
    try {
      await fetchReport(pin, 7);
      savePin(pin);
      onUnlock();
    } catch (err) {
      setError(err instanceof PinError ? "That password is not right." : (err as Error).message);
      setPin("");
    } finally {
      setChecking(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="analytics-pin" className="label text-faint">
        Password
      </label>
      <div className="mt-3 flex items-end gap-4">
        <input
          id="analytics-pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          autoFocus={autoFocus}
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "analytics-pin-error" : undefined}
          placeholder="••••"
          className="contact-input text-2xl tracking-[0.5em] tabular-nums"
        />
        <button type="submit" disabled={pin.length < 4 || checking} className="btn btn-solid shrink-0 disabled:opacity-40">
          <span>{checking ? "Checking" : "Unlock"}</span>
          {checking ? (
            <LoaderCircle size={16} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </div>
      <p id="analytics-pin-error" role="alert" className="mt-3 min-h-6 text-sm text-muted">
        {error}
      </p>
    </form>
  );
}
