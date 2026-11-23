"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { fetchReport, PinError, savePin, usePin } from "./pin";
import { PinForm } from "./pin-form";
import { TrafficChart } from "./traffic-chart";
import { RANGES, type AnalyticsPayload, type Count, type Range } from "./types";

type Result = AnalyticsPayload | { error: string };

const number = new Intl.NumberFormat("en");
const decimal = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });
const time = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" });
const regions = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: string) {
  try {
    return regions.of(code) ?? code;
  } catch {
    return code;
  }
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * The full report. It needs the password: the Worker refuses the data
 * without it, so the form below is the real gate, not decoration.
 */
export function AnalyticsDashboard() {
  const pin = usePin();
  const [rejected, setRejected] = useState("");

  if (pin === undefined) return <Skeleton />;
  if (!pin) {
    return (
      <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Lock size={20} strokeWidth={1.75} className="text-faint" aria-hidden="true" />
          <h2 className="h3 mt-5 max-w-[16ch]">This report is private.</h2>
          <p className="mt-4 max-w-[40ch] leading-[1.6] text-muted">
            Enter the password to see traffic, pages, referrers and countries.
          </p>
        </div>
        <div className="max-w-md lg:col-span-5 lg:col-start-8">
          <PinForm onUnlock={() => setRejected("")} initialError={rejected} />
        </div>
      </div>
    );
  }
  return <Report pin={pin} onRejected={setRejected} />;
}

function Report({ pin, onRejected }: { pin: string; onRejected: (message: string) => void }) {
  const [range, setRange] = useState<Range>(30);
  const [results, setResults] = useState<Partial<Record<Range, Result>>>({});
  const result = results[range];

  useEffect(() => {
    if (results[range]) return;
    const controller = new AbortController();
    fetchReport(pin, range, controller.signal)
      .then((payload) => setResults((current) => ({ ...current, [range]: payload })))
      .catch((error: Error) => {
        if (controller.signal.aborted) return;
        if (error instanceof PinError) {
          onRejected("That password no longer works.");
          savePin(null);
          return;
        }
        setResults((current) => ({ ...current, [range]: { error: error.message || "Analytics are unavailable right now." } }));
      });
    return () => controller.abort();
  }, [pin, range, results, onRejected]);

  function retry() {
    setResults((current) => {
      const next = { ...current };
      delete next[range];
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div role="radiogroup" aria-label="Time range" className="inline-flex border border-line">
          {RANGES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={range === value}
              onClick={() => setRange(value)}
              className={`label min-h-11 px-4 transition-colors duration-300 ${
                range === value ? "bg-ink text-bg" : "text-muted hover:text-ink"
              }`}
            >
              {value} days
            </button>
          ))}
        </div>
        <p className="label text-faint" aria-live="polite">
          {result && "generatedAt" in result
            ? `Updated ${time.format(new Date(result.generatedAt))} · refreshes every 10 min`
            : !result
              ? "Loading…"
              : ""}
        </p>
      </div>

      {!result && <Skeleton />}
      {result && "error" in result && (
        <div className="py-20 text-center">
          <p className="text-lg tracking-[-0.01em]">{result.error}</p>
          <button type="button" onClick={retry} className="btn btn-outline mt-8">
            <span>Try again</span>
          </button>
        </div>
      )}
      {result && "totals" in result && <ReportBody data={result} />}
    </div>
  );
}

function ReportBody({ data }: { data: AnalyticsPayload }) {
  const { totals } = data;
  const topCountry = data.countries[0];

  const stats = [
    { label: "Page views", value: number.format(totals.views) },
    { label: "Visits", value: number.format(totals.visits) },
    { label: "Views per visit", value: totals.visits ? decimal.format(totals.views / totals.visits) : "—" },
    { label: "Top country", value: topCountry ? countryName(topCountry.key) : "—" },
  ];

  return (
    <>
      <dl className="grid grid-cols-2 border-b border-line lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`py-8 pr-6 ${index % 2 ? "pl-6" : ""} ${index ? "lg:pl-6" : "lg:pl-0"} ${
              index % 2 ? "border-l border-line" : ""
            } ${index === 2 ? "lg:border-l" : ""} ${index > 1 ? "border-t border-line lg:border-t-0" : ""}`}
          >
            <dt className="label text-faint">{stat.label}</dt>
            <dd className="h3 mt-3 truncate tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section className="border-b border-line py-10" aria-labelledby="traffic-title">
        <h2 id="traffic-title" className="label mb-8 text-faint">
          Page views per day
        </h2>
        <TrafficChart days={data.daily} />
      </section>

      <div className="grid gap-x-12 md:grid-cols-2 xl:grid-cols-3">
        <Ranking title="Top pages" items={data.pages} />
        <Ranking title="Referrers" items={data.referrers} />
        <Ranking title="Countries" items={data.countries} format={countryName} />
        <Ranking title="Devices" items={data.devices} format={capitalize} />
        <Ranking title="Browsers" items={data.browsers} />
      </div>
    </>
  );
}

function Ranking({ title, items, format = (key) => key }: { title: string; items: Count[]; format?: (key: string) => string }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const top = items[0]?.count ?? 0;

  return (
    <section className="border-b border-line py-10" aria-label={title}>
      <h2 className="label mb-6 flex justify-between text-faint">
        <span>{title}</span>
        <span>Views</span>
      </h2>
      {items.length === 0 ? (
        <p className="text-muted">No data yet.</p>
      ) : (
        <ol className="space-y-1">
          {items.map((item) => (
            <li key={item.key} className="relative flex items-center justify-between gap-4 px-3 py-2.5">
              <span
                className="absolute inset-y-0 left-0 bg-ink/[0.06]"
                style={{ width: `${(item.count / top) * 100}%` }}
                aria-hidden="true"
              />
              <span className="relative truncate" title={format(item.key)}>
                {format(item.key)}
              </span>
              <span className="relative shrink-0 text-muted tabular-nums">
                {number.format(item.count)}
                <span className="ml-3 inline-block w-10 text-right text-faint">
                  {total ? Math.round((item.count / total) * 100) : 0}%
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Skeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="grid grid-cols-2 border-b border-line lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="py-8 pr-6">
            <div className="h-3 w-20 bg-ink/10" />
            <div className="mt-4 h-9 w-28 bg-ink/10" />
          </div>
        ))}
      </div>
      <div className="border-b border-line py-10">
        <div className="h-[240px] bg-ink/[0.04]" />
      </div>
    </div>
  );
}
