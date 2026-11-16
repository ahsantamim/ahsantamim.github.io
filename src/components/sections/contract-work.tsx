import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { contractWork, type ContractProject } from "@/data/contract-work";

const domain = (href: string) => new URL(href).hostname.replace(/^www\./, "");

/** Live client sites on the bento hairlines; keep the count a multiple of six so both grids fill without a gap. */
export function ContractWork() {
  return (
    <section className="section-y" aria-labelledby="contract-title">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="contract-title" className="h2 lg:col-span-6" data-split>
            Independent work
          </h2>
          <p className="max-w-[46ch] self-end text-muted lg:col-span-5 lg:col-start-8">
            Websites and products built as an independent contractor, all live. Each card opens the site in a new tab.
          </p>
        </div>

        <ul className="mt-10 grid border-t border-l border-line md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {contractWork.map((project) => (
            <li key={project.href} className="border-r border-b border-line">
              <Card project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Card({ project }: { project: ContractProject }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="bento-cell flex h-full flex-col p-4 sm:p-5"
      data-cursor="Visit Site"
    >
      <div className="plate aspect-[16/10]">
        <Image
          src={project.image}
          alt={`${project.name} homepage`}
          width={1440}
          height={900}
          sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
          className="plate-inner h-full w-full object-cover object-top"
        />
      </div>
      <div className="flex flex-1 flex-col pt-5 sm:px-1">
        <p className="label flex flex-wrap gap-x-2 gap-y-1 text-faint">
          <span>{project.kind}</span>
          <span aria-hidden="true">/</span>
          <span>{domain(project.href)}</span>
        </p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <h3 className="text-xl leading-tight font-medium tracking-[-0.02em] lg:text-[1.375rem]">
            <span className="link-draw">{project.name}</span>
          </h3>
          <span className="bento-arrow flex-none">
            <ArrowUpRight size={22} strokeWidth={1.25} aria-hidden="true" />
          </span>
        </div>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-6 text-muted">{project.summary}</p>
        <span className="sr-only">(opens in a new tab)</span>
      </div>
    </a>
  );
}
