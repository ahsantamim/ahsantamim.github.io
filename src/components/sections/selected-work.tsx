import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectPlate } from "@/components/project-plate";
import { featured, type Project } from "@/data/projects";

const href = (project: Project) => `/work?case=${project.slug}`;

/**
 * Four projects as one bento on shared hairlines, one screen tall from xl:
 * the first project leads down the left with its live diagram at reading
 * size; the other three stack on the right, text beside a smaller plate.
 * Between md and xl the lead sets its plate beside its text.
 * Below xl the cells stack and the section grows with them.
 */
export function SelectedWork() {
  const [lead, ...rest] = featured;
  return (
    <section
      className="py-[clamp(4.5rem,9vw,8rem)] xl:flex xl:h-svh xl:min-h-[46rem] xl:flex-col xl:pt-[calc(var(--nav-h)+1.5rem)] xl:pb-10"
      aria-labelledby="work-title"
    >
      <div className="wrap flex min-h-0 flex-1 flex-col">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="work-title" className="h2 lg:col-span-6" data-split>
            Selected work
          </h2>
          <div className="flex flex-col items-start gap-2 self-end lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-muted">
              Four projects, each labelled for what it is: production work, an implemented workflow, or a learning
              project.
            </p>
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
        </div>

        <ul className="mt-10 grid min-h-0 flex-1 border-t border-l border-line lg:mt-12 xl:grid-cols-12 xl:grid-rows-3">
          <li className="border-r border-b border-line xl:col-span-6 xl:row-span-3 2xl:col-span-7">
            <LeadTile project={lead} />
          </li>
          {rest.map((project) => (
            <li key={project.slug} className="min-h-0 border-r border-b border-line xl:col-span-6 2xl:col-span-5">
              <SideTile project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Status always; the stack only where the tile has room for it. */
function Meta({ project, stack = true, className = "" }: { project: Project; stack?: boolean; className?: string }) {
  return (
    <p className={`label flex flex-wrap gap-x-2 gap-y-1 text-faint ${className}`}>
      <span>{project.status}</span>
      {stack && (
        <>
          <span aria-hidden="true">/</span>
          <span>{project.stack.slice(0, 3).join(", ")}</span>
        </>
      )}
    </p>
  );
}

function Arrow() {
  return (
    <span className="bento-arrow flex-none">
      <ArrowUpRight size={22} strokeWidth={1.25} aria-hidden="true" />
    </span>
  );
}

function LeadTile({ project }: { project: Project }) {
  return (
    <Link
      href={href(project)}
      className="bento-cell flex h-full flex-col md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:flex"
      data-cursor="View Project"
    >
      <div className="p-5 md:self-end lg:p-7 xl:order-last xl:self-auto xl:border-t xl:border-line">
        <div className="flex items-start justify-between gap-6">
          <h3 className="h3 max-w-[20ch]">
            <span className="link-draw">{project.title}</span>
          </h3>
          <Arrow />
        </div>
        <p className="mt-3 max-w-[58ch] text-muted">{project.summary}</p>
        <Meta project={project} className="mt-5" />
      </div>
      <ProjectPlate
        diagram={project.diagram}
        parallax={false}
        bare
        className="order-first aspect-[8/5] border-b border-line md:border-r md:border-b-0 xl:aspect-auto xl:min-h-0 xl:flex-1 xl:border-r-0"
      />
    </Link>
  );
}

function SideTile({ project }: { project: Project }) {
  return (
    <Link
      href={href(project)}
      className="bento-cell grid h-full sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]"
      data-cursor="View Project"
    >
      <div className="bento-text flex min-h-0 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl leading-tight font-medium tracking-[-0.02em] lg:text-[1.375rem]">
            <span className="link-draw">{project.title}</span>
          </h3>
          <Arrow />
        </div>
        <p className="bento-summary mt-2 line-clamp-2 max-w-[48ch] text-[0.9375rem] leading-6 text-muted">{project.summary}</p>
        <Meta project={project} stack={false} className="mt-4 sm:mt-auto sm:pt-3" />
      </div>
      <ProjectPlate
        diagram={project.diagram}
        parallax={false}
        bare
        className="order-first aspect-[8/5] border-b border-line sm:order-none sm:aspect-auto sm:border-b-0 sm:border-l"
      />
    </Link>
  );
}
