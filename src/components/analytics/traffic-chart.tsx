"use client";

import { useRef, useState } from "react";
import type { Day } from "./types";

const H = 240;
const number = new Intl.NumberFormat("en");
const shortDate = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

/** Rounds up to 1, 2 or 5 times a power of ten so gridlines land on clean values. */
function niceMax(value: number) {
  if (value <= 4) return 4;
  const power = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find((m) => m * power >= value) ?? 10;
  return step * power;
}

/**
 * Daily page views as a single area. The plot is drawn in a stretched
 * 1000-wide viewBox; the crosshair, marker and tooltip are HTML so they
 * stay crisp at any width.
 */
export function TrafficChart({ days }: { days: Day[] }) {
  const plot = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const max = niceMax(Math.max(...days.map((day) => day.views), 0));
  const last = Math.max(days.length - 1, 1);
  const x = (i: number) => (i / last) * 1000;
  const y = (v: number) => H - (v / max) * H;
  const line = days.map((day, i) => `${i ? "L" : "M"}${x(i)},${y(day.views)}`).join("");
  const area = `${line}L1000,${H}L0,${H}Z`;
  const grid = [0, 0.5, 1].map((t) => t * max);

  function onMove(event: React.PointerEvent) {
    const box = plot.current?.getBoundingClientRect();
    if (!box) return;
    const ratio = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1);
    setActive(Math.round(ratio * last));
  }

  const point = active === null ? null : days[active];
  const left = active === null ? 0 : (active / last) * 100;

  return (
    <figure>
      <div className="grid grid-cols-[auto_1fr] gap-x-4">
        <div className="relative w-8" style={{ height: H }} aria-hidden="true">
          {grid.map((value) => (
            <span
              key={value}
              className="label absolute right-0 -translate-y-1/2 text-faint tabular-nums"
              style={{ top: y(value) }}
            >
              {number.format(value)}
            </span>
          ))}
        </div>

        <div
          ref={plot}
          className="relative touch-pan-y"
          style={{ height: H }}
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setActive(null)}
          aria-hidden="true"
        >
          <svg viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {grid.map((value) => (
              <line
                key={value}
                x1="0"
                x2="1000"
                y1={y(value)}
                y2={y(value)}
                stroke="var(--color-line)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path d={area} fill="var(--color-motion)" fillOpacity="0.12" />
            <path
              d={line}
              fill="none"
              stroke="var(--color-motion)"
              strokeWidth="2"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {point && (
            <>
              <div className="pointer-events-none absolute inset-y-0 w-px bg-faint/60" style={{ left: `${left}%` }} />
              <div
                className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-motion"
                style={{ left: `${left}%`, top: y(point.views) }}
              />
              <div
                className="pointer-events-none absolute top-0 z-10 min-w-36 border border-line bg-surface px-3 py-2.5 text-sm shadow-lg"
                style={{
                  left: `${left}%`,
                  transform: `translateX(${left > 70 ? "calc(-100% - 12px)" : "12px"})`,
                }}
              >
                <p className="label text-faint">{longDate.format(new Date(point.date))}</p>
                <p className="mt-1.5 flex justify-between gap-6">
                  <span className="text-muted">Page views</span>
                  <span className="tabular-nums">{number.format(point.views)}</span>
                </p>
                <p className="flex justify-between gap-6">
                  <span className="text-muted">Visits</span>
                  <span className="tabular-nums">{number.format(point.visits)}</span>
                </p>
              </div>
            </>
          )}
        </div>

        <div />
        <div className="label mt-3 flex justify-between text-faint" aria-hidden="true">
          <span>{days[0] && shortDate.format(new Date(days[0].date))}</span>
          <span>{days.length > 2 && shortDate.format(new Date(days[Math.floor(days.length / 2)].date))}</span>
          <span>{days.at(-1) && shortDate.format(new Date(days.at(-1)!.date))}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>Page views and visits per day</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Page views</th>
            <th scope="col">Visits</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <th scope="row">{longDate.format(new Date(day.date))}</th>
              <td>{day.views}</td>
              <td>{day.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
