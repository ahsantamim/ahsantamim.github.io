"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { site } from "@/data/site";

/** Call slots, in Dhaka time (UTC+6, no daylight saving). */
const SLOTS = ["10:00", "11:30", "14:00", "15:30", "17:00", "19:00", "21:00"];
const DHAKA_OFFSET_HOURS = 6;
const BOOKING_WINDOW_DAYS = 60;
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export type Meeting = { date: string | null; time: string | null };

/** Calendar days are plain UTC midnights, keyed as YYYY-MM-DD. */
const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const fromKey = (key: string) => new Date(`${key}T00:00:00Z`);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);

function dhakaToday() {
  return fromKey(new Intl.DateTimeFormat("en-CA", { timeZone: site.timeZone }).format(new Date()));
}

/** The instant a Dhaka slot happens, for showing it in the visitor's own zone. */
export function slotInstant(date: string, time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = fromKey(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h - DHAKA_OFFSET_HOURS, m));
}

export function formatMeeting({ date, time }: Meeting) {
  if (!date || !time) return null;
  const day = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(fromKey(date));
  const visitorZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const local =
    visitorZone === site.timeZone
      ? null
      : new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        }).format(slotInstant(date, time));
  return { dhaka: `${day}, ${time} (Dhaka, GMT+6)`, local };
}

export function MeetingPicker({ value, onChange }: { value: Meeting; onChange: (next: Meeting) => void }) {
  const [today] = useState(dhakaToday);
  const first = addDays(today, 1);
  const last = addDays(today, BOOKING_WINDOW_DAYS);
  const [month, setMonth] = useState(() => new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1)));

  const days = useMemo(() => {
    const lead = (month.getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: count }, (_, i) => addDays(month, i)),
    ];
  }, [month]);

  const shift = (step: number) =>
    setMonth(new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + step, 1)));
  const canPrev = month > new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1));
  const canNext = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1)) <= last;
  const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(month);
  const summary = formatMeeting(value);

  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_9.5rem] sm:gap-8">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[0.9375rem] font-medium tracking-tight" aria-live="polite">
            {monthLabel}
          </p>
          <div className="-mr-2 flex">
            <button
              type="button"
              onClick={() => shift(-1)}
              disabled={!canPrev}
              aria-label="Previous month"
              className="flex size-10 items-center justify-center text-muted hover:text-ink disabled:opacity-30"
            >
              <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => shift(1)}
              disabled={!canNext}
              aria-label="Next month"
              className="flex size-10 items-center justify-center text-muted hover:text-ink disabled:opacity-30"
            >
              <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-7 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="label pb-2 text-[0.625rem] text-faint">
              {d}
            </span>
          ))}
          {days.map((day, i) => {
            if (!day) return <span key={`blank-${i}`} />;
            const key = dayKey(day);
            const disabled = day < first || day > last;
            const selected = value.date === key;
            const isToday = key === dayKey(today);
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                aria-label={new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "UTC" }).format(day)}
                onClick={() => onChange({ date: key, time: value.time })}
                className={`relative flex aspect-square items-center justify-center text-sm tabular-nums transition-colors duration-200 disabled:text-faint/50 ${
                  selected ? "bg-invert text-invert-ink" : "enabled:hover:bg-surface"
                }`}
              >
                {day.getUTCDate()}
                {isToday && <span className="absolute bottom-1.5 size-1 rounded-full bg-faint" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="label text-faint">Time · GMT+6</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-1">
          {SLOTS.map((slot) => {
            const selected = value.time === slot;
            return (
              <button
                key={slot}
                type="button"
                disabled={!value.date}
                aria-pressed={selected}
                onClick={() => onChange({ date: value.date, time: slot })}
                className={`min-h-10 border text-sm tabular-nums transition-colors duration-200 disabled:opacity-35 ${
                  selected
                    ? "border-invert bg-invert text-invert-ink"
                    : "border-line enabled:hover:border-faint"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
        {!value.date && <p className="mt-3 text-xs text-faint">Pick a day first.</p>}
      </div>

      {summary && (
        <p className="text-sm text-muted sm:col-span-2" aria-live="polite">
          <span className="text-ink">{summary.dhaka}</span>
          {summary.local && <> · your time {summary.local}</>}
        </p>
      )}
    </div>
  );
}
