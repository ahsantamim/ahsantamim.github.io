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

export function Capabilities() {
  return (
    <section className="section-y" aria-labelledby="capabilities-title">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="capabilities-title" className="h2 lg:col-span-6" data-split>
            What I do
          </h2>
          <p className="max-w-[46ch] self-end text-muted lg:col-span-5 lg:col-start-8">
            Six areas, one engineer. Choose a row to see the related work.
          </p>
        </div>

        <ul className="mt-14 border-b border-line lg:mt-20">
          {capabilities.map((capability) => (
            <li key={capability.title}>
              <Link
                href={related[capability.title]}
                className="row-invert grid gap-x-8 gap-y-5 border-t border-line py-8 lg:grid-cols-12 lg:py-10"
                data-cursor="Explore"
              >
                <span className="label row-muted pt-2 text-faint lg:col-span-1">{capability.number}</span>
                <span className="h3 lg:col-span-5">{capability.title}</span>
                <span className="row-muted grid gap-x-8 gap-y-1.5 text-muted sm:grid-cols-2 lg:col-span-5">
                  {capability.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </span>
                <span className="row-arrow hidden justify-self-end lg:col-span-1 lg:block">
                  <ArrowUpRight size={32} strokeWidth={1.25} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
