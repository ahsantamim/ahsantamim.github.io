"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChartLine, X } from "lucide-react";
import { fetchSummary, usePin, type Summary } from "./pin";
import { PinForm } from "./pin-form";

const number = new Intl.NumberFormat("en");

/**
 * About-section entry to /analytics. Everyone sees the visit count; the full
 * report asks for the password first (skipped if this tab already has it).
 */
export function AnalyticsGate() {
  const router = useRouter();
  const pin = usePin();
  const dialog = useRef<HTMLDialogElement>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchSummary(controller.signal)
      .then(setSummary)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  function open() {
    if (pin) router.push("/analytics");
    else dialog.current?.showModal();
  }

  function unlocked() {
    dialog.current?.close();
    router.push("/analytics");
  }

  return (
    <>
      <button type="button" onClick={open} className="group inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink">
        <ChartLine size={16} strokeWidth={1.75} aria-hidden="true" />
        <span className="link-draw">Show site analytics</span>
        {summary && (
          <span className="label ml-1 border border-line px-2 py-1 text-faint tabular-nums">
            {number.format(summary.visits)} {summary.visits === 1 ? "visit" : "visits"}
          </span>
        )}
      </button>

      <dialog
        ref={dialog}
        className="analytics-gate"
        aria-labelledby="analytics-gate-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="relative p-8 sm:p-10">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="absolute top-4 right-4 inline-flex size-11 items-center justify-center text-muted hover:text-ink"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <p className="label text-faint">Site analytics</p>
          <h2 id="analytics-gate-title" className="h3 mt-4 max-w-[16ch]">
            {summary ? `${number.format(summary.visits)} visits in the last 90 days.` : "Visitor numbers are public."}
          </h2>
          <p className="mt-4 max-w-[38ch] leading-[1.6] text-muted">
            The full report, with pages, referrers and countries, is private. Enter the password to open it.
          </p>
          <div className="mt-8">
            <PinForm onUnlock={unlocked} />
          </div>
        </div>
      </dialog>
    </>
  );
}
