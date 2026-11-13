"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { JourneyEntry } from "@/data/content";
import { tenure, type MonthIndex } from "@/lib/tenure";

/** The logo alone, no tile; a mark without a file shows its monogram in a hairline square. */
function CompanyMark({ entry, className = "size-12" }: { entry: JourneyEntry; className?: string }) {
  if (!entry.logo) {
    return (
      <span
        className={`grid flex-none place-items-center rounded-xl border border-current/25 font-mono text-sm font-medium tracking-[0.04em] ${className}`}
        aria-hidden="true"
      >
        {entry.monogram}
      </span>
    );
  }
  return (
    <Image
      src={entry.logo}
      alt=""
      width={48}
      height={48}
      className={`flex-none rounded-xl object-contain ${entry.logoMono ? "logo-mono" : ""} ${className}`}
    />
  );
}

/**
 * The roles as cards, newest first. Each card leads with its start year and
 * ends on a mini timeline that runs right to left like the cards: the track is
 * the whole career, first start on the right to now on the left,
 * the bar is this role's share of it, and a tag at the bar's end gives its
 * length, so overlapping roles read at a glance. A card opens the full job in
 * the same side drawer the case studies use: a native <dialog>, so focus is
 * trapped and Escape or a backdrop click closes it.
 */
export function JourneyRoles({ roles, now }: { roles: JourneyEntry[]; now: MonthIndex }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const role = open === null ? null : roles[open];

  const spans = roles.map((entry) => tenure(entry.dates, now));
  const lo = Math.min(...spans.map((span) => span.start));
  const share = (months: number) => `${(months / (now + 1 - lo)) * 100}%`;

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open !== null && !el.open) el.showModal();
    if (open === null && el.open) el.close();
    scroller.current?.scrollTo({ top: 0 });
  }, [open]);

  return (
    <>
      <ol className="grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
        {roles.map((entry, index) => {
          const span = spans[index];
          const current = index === 0;
          return (
            <li key={`${entry.company}-${entry.position}`} className="border-r border-b border-line">
              <button
                type="button"
                onClick={() => setOpen(index)}
                aria-haspopup="dialog"
                className="row-invert cell flex size-full cursor-pointer flex-col p-4 text-left sm:p-5 lg:p-7"
                data-role
                data-cursor="Details"
              >
                <span className="flex w-full items-start justify-between gap-3">
                  <span className="text-[clamp(2.25rem,3.6vw,3.25rem)] leading-[0.85] font-light tracking-[-0.05em]">
                    {span.startYear}
                  </span>
                  <CompanyMark entry={entry} className="size-9 lg:size-11" />
                </span>
                <span className="mt-6 flex w-full items-end justify-between gap-3 lg:mt-8">
                  <span className="leading-snug font-medium tracking-[-0.015em] sm:text-lg lg:text-[1.375rem] lg:leading-tight lg:tracking-[-0.02em]">
                    {entry.position}
                  </span>
                  <span className="row-arrow hidden flex-none lg:block">
                    <ArrowUpRight size={22} strokeWidth={1.25} aria-hidden="true" />
                  </span>
                </span>
                <span className="row-muted mt-1 text-sm text-muted sm:text-base">
                  {entry.company} · {entry.location}
                </span>

                <span className="mt-auto block w-full pt-10" aria-hidden="true">
                  <span className="relative block h-px w-full bg-line">
                    <span
                      className="absolute -top-px h-[3px] bg-current"
                      style={{ right: share(span.start - lo), width: share(span.end + 1 - span.start) }}
                      data-bar
                    />
                    <span
                      className="label absolute bottom-2.5 border border-current/25 px-1.5 py-0.5 text-[0.625rem] whitespace-nowrap"
                      style={{ left: `min(calc(100% - 5.5rem), calc(100% - ${share(span.end + 1 - lo)}))` }}
                      data-chip
                    >
                      {span.length}
                    </span>
                  </span>
                </span>
                <span className={`label mt-3 ${current ? "" : "row-muted text-faint"}`}>{entry.dates}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <dialog
        ref={dialog}
        className="reader"
        aria-labelledby="role-title"
        onClose={() => setOpen(null)}
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === dialog.current) setOpen(null);
        }}
      >
        {role && open !== null && (
          <div ref={scroller} className="h-full overflow-x-hidden overflow-y-auto overscroll-contain">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/95 px-(--gutter) py-3 backdrop-blur-sm lg:px-12">
              <p className="label text-faint">Experience 0{open + 1}</p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="group -mr-2 inline-flex min-h-11 cursor-pointer items-center gap-2 px-2 text-sm text-muted hover:text-ink"
              >
                Close
                <X
                  size={18}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:rotate-90"
                />
              </button>
            </div>

            <article className="px-(--gutter) pt-12 pb-20 lg:px-12 lg:pt-16">
              <div className="flex items-center gap-4">
                <CompanyMark entry={role} />
                <div>
                  <p className="text-lg font-medium tracking-[-0.01em]">{role.company}</p>
                  <p className="label mt-1 text-faint">{role.location}</p>
                </div>
              </div>
              <h2 id="role-title" className="h2 mt-10 max-w-[16ch]">
                {role.position}
              </h2>
              <p className="label mt-6 text-ink">{role.dates}</p>
              <p className="lead mt-8 max-w-[62ch] text-muted">{role.summary}</p>

              <section className="mt-12 grid gap-4 border-t border-line py-9 lg:grid-cols-12 lg:gap-x-10">
                <h3 className="label pt-1 text-faint lg:col-span-3">What I did</h3>
                <ul className="max-w-[68ch] space-y-3 leading-relaxed text-muted lg:col-span-9">
                  {role.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[0.75em] h-px w-3 flex-none bg-faint" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
              <section className="grid gap-4 border-t border-line py-9 lg:grid-cols-12 lg:gap-x-10">
                <h3 className="label pt-1 text-faint lg:col-span-3">Technologies</h3>
                <p className="max-w-[68ch] leading-relaxed text-muted lg:col-span-9">{role.technologies.join(", ")}</p>
              </section>

              <nav aria-label="More experience" className="mt-6 grid border-t border-line sm:grid-cols-2">
                {([1, -1] as const).map((by) => {
                  const target = open + by;
                  const next = by === -1;
                  if (!roles[target]) return <span key={by} aria-hidden="true" className={next ? "" : "hidden sm:block sm:border-r sm:border-line"} />;
                  return (
                    <button
                      key={by}
                      type="button"
                      onClick={() => setOpen(target)}
                      className={`group flex min-h-24 cursor-pointer flex-col justify-center gap-2 py-6 text-left ${
                        next ? "sm:items-end sm:pl-6 sm:text-right" : "border-b border-line sm:border-r sm:border-b-0 sm:pr-6"
                      }`}
                    >
                      <span className="label flex items-center gap-2 text-faint">
                        {!next && (
                          <ArrowLeft
                            size={14}
                            aria-hidden="true"
                            className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:-translate-x-1"
                          />
                        )}
                        {next ? "Later role" : "Earlier role"}
                        {next && (
                          <ArrowRight
                            size={14}
                            aria-hidden="true"
                            className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
                          />
                        )}
                      </span>
                      <span className="text-lg font-medium tracking-tight">
                        {roles[target].position} · {roles[target].company}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </article>
          </div>
        )}
      </dialog>
    </>
  );
}
