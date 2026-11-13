import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { capabilities } from "@/data/content";

/** Each capability links to the matching filter on the work page. */
const related: Record<string, string> = {
  "Full-Stack Development": "/work?filter=Full-Stack",
  "AI-Native Engineering": "/work?filter=AI+%26+Automation",
  "Product Engineering": "/work",
  "Quality Engineering": "/work?filter=QA+%26+Testing",
  "Backend & Systems": "/work?filter=Backend+%26+Systems",
  "DevOps & Infrastructure": "/work?filter=DevOps+%26+Infrastructure",
};

const S = { "data-stroke": true, vectorEffect: "non-scaling-stroke" as const };

/* One wireframe mark per capability, in the plates' line language; strokes draw in on first view. */
const GLYPHS: Record<string, React.ReactNode> = {
  "01": (
    <>
      <path {...S} d="M24 8 L42 17 L24 26 L6 17 Z" />
      <path {...S} d="M6 24 L24 33 L42 24" strokeOpacity="0.6" />
      <path {...S} d="M6 31 L24 40 L42 31" strokeOpacity="0.35" />
    </>
  ),
  "02": (
    <>
      {[
        [10, 10],
        [38, 10],
        [10, 38],
        [38, 38],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path {...S} d={`M24 24 L${x} ${y}`} strokeOpacity="0.5" />
          <circle {...S} cx={x} cy={y} r="3.5" />
        </g>
      ))}
      <circle {...S} cx="24" cy="24" r="6" />
    </>
  ),
  "03": (
    <>
      <path {...S} d="M24 6 L40 15 L40 33 L24 42 L8 33 L8 15 Z" />
      <path {...S} d="M8 15 L24 24 L40 15 M24 24 L24 42" strokeOpacity="0.6" />
    </>
  ),
  "04": (
    <>
      <circle {...S} cx="21" cy="21" r="13" />
      <path {...S} d="M30.5 30.5 L42 42" />
      <path {...S} d="M15 21 L19.5 25.5 L27.5 17" strokeOpacity="0.7" />
    </>
  ),
  "05": (
    <>
      <ellipse {...S} cx="24" cy="11" rx="15" ry="5" />
      <path {...S} d="M9 11 V37 A15 5 0 0 0 39 37 V11" />
      <path {...S} d="M9 24 A15 5 0 0 0 39 24" strokeOpacity="0.5" />
    </>
  ),
  "06": (
    <path
      {...S}
      d="M24 24 C19 15 6 15 6 24 C6 33 19 33 24 24 C29 15 42 15 42 24 C42 33 29 33 24 24 Z"
    />
  ),
};

/**
 * Six capabilities as a 3 x 2 specimen grid on shared hairlines, three columns
 * at every width. Cells invert on hover like the site's rows; phones show the
 * mark and title, the item line returns from lg.
 */
export function Capabilities() {
  return (
    <section className="py-[clamp(4.5rem,9vw,8rem)]" aria-labelledby="capabilities-title">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="capabilities-title" className="h2 lg:col-span-6" data-split>
            What I do
          </h2>
          <p className="max-w-[46ch] self-end text-muted lg:col-span-5 lg:col-start-8">
            Six areas, one engineer. Choose one to see the related work.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-3 border-t border-l border-line lg:mt-14" data-draw>
          {capabilities.map((capability) => (
            <li key={capability.title} className="border-r border-b border-line">
              <Link
                href={related[capability.title]}
                className="row-invert cell flex h-full flex-col p-3 sm:p-5 lg:p-7"
                data-cursor="Explore"
              >
                <span className="flex items-start justify-between">
                  <svg
                    viewBox="0 0 48 48"
                    className="size-7 sm:size-9 lg:size-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    aria-hidden="true"
                  >
                    {GLYPHS[capability.number]}
                  </svg>
                  <span className="label row-muted text-[0.625rem] text-faint sm:text-xs">{capability.number}</span>
                </span>

                <span className="mt-4 flex items-end justify-between gap-3 sm:mt-6">
                  <span className="hyphens-auto text-[0.8125rem] leading-snug font-medium tracking-[-0.01em] sm:text-lg lg:text-[1.375rem] lg:leading-tight lg:tracking-[-0.02em]">
                    {capability.title}
                  </span>
                  <span className="row-arrow hidden flex-none lg:block">
                    <ArrowUpRight size={22} strokeWidth={1.25} aria-hidden="true" />
                  </span>
                </span>
                <span className="row-muted mt-2 hidden max-w-[44ch] text-[0.9375rem] leading-6 text-muted lg:block">
                  {capability.items.join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
