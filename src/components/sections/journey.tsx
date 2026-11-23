import Image from "next/image";
import { asset } from "@/lib/asset";
import {
  ArrowDown,
  ArrowLeftRight,
  Infinity as InfinityIcon,
  Network,
  ShieldCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { JourneyRoles } from "@/components/journey-roles";
import { JourneyMotion } from "@/components/journey-motion";
import { arsenal, arsenalIcons, journey } from "@/data/content";
import { site } from "@/data/site";
import { monthIndex } from "@/lib/tenure";

/**
 * The roles as cards, newest first, as the data is ordered: one row on
 * desktop, two on phones. Each card opens its full job description in a side
 * drawer.
 */
export function Journey() {
  const now = monthIndex(new Date());

  return (
    <section id="experience" className="py-[clamp(4.5rem,9vw,8rem)]" aria-labelledby="journey-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="journey-title" className="h2" data-split>
            Professional journey
          </h2>
          <a href={site.resume} download className="group inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink">
            <span className="link-draw">Download resume</span>
            <ArrowDown
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-y-0.5"
            />
          </a>
        </div>

        <JourneyMotion className="mt-10 lg:mt-14">
          <JourneyRoles roles={journey} now={now} />
        </JourneyMotion>
      </div>
    </section>
  );
}

/** Concepts have no logo; each gets a line glyph in the text colour. */
const GLYPHS: Record<string, LucideIcon> = {
  "Multi-agent dev pipelines": Workflow,
  "REST APIs": Network,
  "Auth & RBAC": ShieldCheck,
  Transactions: ArrowLeftRight,
  Caching: Zap,
  "CI/CD": InfinityIcon,
};

/**
 * The toolkit as one hairline row per layer of a product, each tool a chip
 * with its real logo in brand colour. Under the pointer the other chips in
 * the row step back. Each row's chips arrive with the hero's blur-in.
 */
export function Arsenal() {
  return (
    <section className="py-[clamp(4.5rem,9vw,8rem)]" aria-labelledby="arsenal-title">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="arsenal-title" className="h2 lg:col-span-6" data-split>
            Technical arsenal
          </h2>
          <p className="max-w-[46ch] self-end text-muted lg:col-span-5 lg:col-start-8">
            The tools I work with, grouped by where they sit in a product.
          </p>
        </div>

        <dl className="mt-10 border-b border-line lg:mt-14">
          {arsenal.map((group) => (
            <div key={group.category} className="grid gap-3 border-t border-line py-4 lg:grid-cols-12 lg:items-center lg:gap-x-12">
              <dt className="label flex items-baseline gap-3 text-faint lg:col-span-2">
                {group.category}
                <span className="text-line">{String(group.items.length).padStart(2, "0")}</span>
              </dt>
              <dd className="lg:col-span-10">
                <ul className="arsenal-list flex flex-wrap gap-2" data-rise>
                  {group.items.map((item) => {
                    const logo = arsenalIcons[item];
                    const Glyph = GLYPHS[item];
                    return (
                      <li
                        key={item}
                        className="inline-flex h-9 cursor-default items-center gap-2 border border-line pr-3 pl-2 text-sm sm:h-10 sm:gap-2.5 sm:pr-3.5 sm:pl-2.5 sm:text-[0.9375rem] tracking-[-0.01em] text-muted transition-colors duration-300 hover:border-faint"
                      >
                        {logo ? (
                          <Image
                            src={asset(`/icons/${logo.icon}.svg`)}
                            alt=""
                            width={20}
                            height={20}
                            className={`tool-logo size-5 object-contain ${logo.ink ? "tool-ink" : ""}`}
                          />
                        ) : (
                          Glyph && <Glyph size={18} strokeWidth={1.5} aria-hidden="true" className="flex-none" />
                        )}
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
