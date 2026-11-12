import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

/** The archive list. Plain markup so it can render on the server and inside the client filter. */
export function ProjectList({ projects, query = "" }: { projects: Project[]; query?: string }) {
  if (projects.length === 0) {
    return (
      <p className="border-t border-b border-line py-16 text-muted">
        No projects in this category yet. Choose another filter to see the rest of the work.
      </p>
    );
  }

  return (
    <ol className="border-b border-line">
      {projects.map((project) => {
        const params = new URLSearchParams(query);
        params.set("case", project.slug);
        return (
          <li key={project.slug}>
            <Link
              href={`/work?${params}`}
              scroll={false}
              className="row-invert grid gap-x-8 gap-y-5 border-t border-line py-9 lg:grid-cols-12 lg:py-12"
              data-cursor="View Project"
            >
              <span className="label row-muted pt-2 text-faint lg:col-span-1">{project.number}</span>
              <span className="lg:col-span-6">
                <span className="h3 block max-w-[22ch]">{project.title}</span>
                <span className="row-muted mt-4 block max-w-[58ch] text-muted">{project.summary}</span>
              </span>
              <span className="row-muted grid content-start gap-3 text-sm text-muted lg:col-span-4">
                <span>
                  <span className="label mb-1 block text-faint">Type</span>
                  {project.status}
                </span>
                <span>
                  <span className="label mb-1 block text-faint">Category</span>
                  {project.categories.join(", ")}
                </span>
                <span>
                  <span className="label mb-1 block text-faint">Stack</span>
                  {project.stack.join(", ")}
                </span>
              </span>
              <span className="row-arrow hidden justify-self-end lg:col-span-1 lg:block">
                <ArrowUpRight size={32} strokeWidth={1.25} aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
