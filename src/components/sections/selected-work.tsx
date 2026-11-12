import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectPlate } from "@/components/project-plate";
import { projects } from "@/data/projects";

export function SelectedWork() {
  return (
    <section className="section-y" aria-labelledby="work-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="work-title" className="h2" data-split>
            Selected work
          </h2>
          <Link href="/work" className="group inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink">
            <span className="link-draw">All work and case studies</span>
            <ArrowRight
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
            />
          </Link>
        </div>

        <ol className="mt-14 lg:mt-20">
          {projects.map((project, index) => (
            <li key={project.slug} className="border-t border-line py-12 lg:py-20">
              <article className="grid gap-10 lg:grid-cols-12 lg:gap-x-12">
                <div
                  className={`flex flex-col lg:col-span-5 ${index % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""}`}
                >
                  <p
                    className="text-[clamp(4rem,9vw,8.5rem)] leading-[0.8] font-light tracking-[-0.05em] text-line"
                    aria-hidden="true"
                  >
                    {project.number}
                  </p>
                  <h3 className="h3 mt-8 max-w-[18ch]" data-split>
                    {project.title}
                  </h3>
                  <p className="mt-5 max-w-[48ch] text-muted">{project.summary}</p>

                  <dl className="mt-8 grid grid-cols-[7rem_1fr] gap-x-4 border-t border-line text-sm">
                    {[
                      ["Role", project.role],
                      ["Stack", project.stack.join(", ")],
                      ["Category", project.categories.join(", ")],
                      ["Type", project.status],
                    ].map(([term, value]) => (
                      <div key={term} className="col-span-2 grid grid-cols-subgrid border-b border-line py-3">
                        <dt className="label self-center text-faint">{term}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/work?case=${project.slug}`}
                    className="group mt-8 inline-flex min-h-11 items-center gap-2 self-start"
                  >
                    <span className="link-draw">View case study</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                <Link
                  href={`/work?case=${project.slug}`}
                  className={`block self-center lg:col-span-7 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                  data-cursor="View Project"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <ProjectPlate diagram={project.diagram} />
                </Link>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
