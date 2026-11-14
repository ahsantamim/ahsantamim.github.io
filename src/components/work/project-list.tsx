import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectPlate } from "@/components/project-plate";
import type { Project } from "@/data/projects";

/**
 * The archive list, in resume order: each row a hairline cell with its text
 * beside the project's live diagram. Plain markup so it can render on the
 * server and inside the client filter.
 */
export function ProjectList({ projects, query = "" }: { projects: Project[]; query?: string }) {
  if (projects.length === 0) {
    return (
      <p className="border-t border-b border-line py-16 text-muted">
        No projects in this category yet. Choose another filter to see the rest of the work.
      </p>
    );
  }

  return (
    <ol className="border-t border-l border-line">
      {projects.map((project) => {
        const params = new URLSearchParams(query);
        params.set("case", project.slug);
        return (
          <li key={project.slug} className="border-r border-b border-line">
            <Link
              href={`/work?${params}`}
              scroll={false}
              className="bento-cell grid lg:grid-cols-12"
              data-cursor="View Project"
            >
              <div className="flex flex-col p-5 sm:p-7 lg:col-span-5 lg:p-8 xl:p-10">
                <p className="label flex flex-wrap gap-x-4 gap-y-1 text-faint">
                  <span>{project.number}</span>
                  {project.company && <span className="text-ink">{project.company}</span>}
                  {project.period && <span>{project.period}</span>}
                </p>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <h3 className="h3 max-w-[18ch]">
                    <span className="link-draw">{project.title}</span>
                  </h3>
                  <span className="bento-arrow flex-none">
                    <ArrowUpRight size={26} strokeWidth={1.25} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-4 max-w-[52ch] text-muted">{project.summary}</p>
                <dl className="mt-8 grid gap-4 text-sm text-muted sm:grid-cols-2 lg:mt-auto lg:grid-cols-1 lg:pt-10 2xl:grid-cols-2">
                  <div>
                    <dt className="label mb-1 text-faint">Role</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div>
                    <dt className="label mb-1 text-faint">Type</dt>
                    <dd>{project.status}</dd>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1 2xl:col-span-2">
                    <dt className="label mb-1 text-faint">Stack</dt>
                    <dd>{project.stack.join(", ")}</dd>
                  </div>
                </dl>
              </div>
              <ProjectPlate
                diagram={project.diagram}
                parallax={false}
                bare
                className="order-first aspect-[8/5] border-b border-line lg:order-none lg:col-span-7 lg:border-b-0 lg:border-l"
              />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
