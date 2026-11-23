import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnalyticsGate } from "@/components/analytics/analytics-gate";
import { Intersection } from "@/components/intersection";
import { philosophy } from "@/data/content";

/**
 * Desktop: the diagram holds the left five columns across both rows; the
 * statement sits at its top edge and the principles at its bottom edge.
 * Small screens stack statement, diagram, principles.
 */
export function About() {
  return (
    <section id="about" className="py-[clamp(4.5rem,9vw,8rem)]" aria-labelledby="about-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-10">
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <h2 id="about-title" className="h2 max-w-[16ch]" data-split>
            More than writing code. <span className="text-faint">Building complete solutions.</span>
          </h2>
          <p
            className="mt-8 max-w-[34ch] font-serif text-[clamp(1.375rem,2vw,1.875rem)] leading-[1.2] tracking-[-0.01em] italic"
            data-scrub-words
          >
            {philosophy.statement}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-2">
            <Link href="/about" className="group inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink">
              <span className="link-draw">More about me</span>
              <ArrowRight
                size={16}
                strokeWidth={1.75}
                aria-hidden="true"
                className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
              />
            </Link>
            <AnalyticsGate />
          </div>
        </div>

        <Intersection className="w-full max-w-[38rem] lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center" />

        <ol
          className="grid border-t border-line sm:grid-cols-2 sm:gap-x-8 lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:self-end"
          data-scrub-rise
        >
          {philosophy.principles.map((principle, index) => (
            <li key={principle} className="border-b border-line py-5">
              <p className="label text-faint">0{index + 1}</p>
              <p className="mt-3 text-lg leading-[1.35] tracking-[-0.01em]">{principle}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
