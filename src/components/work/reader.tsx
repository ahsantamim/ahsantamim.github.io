"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { DraftTag, articleMeta } from "@/components/article-row";
import { ProjectPlate } from "@/components/project-plate";
import { articles, getArticle, type Article } from "@/data/articles";
import { getProject, projects, type Project } from "@/data/projects";

/**
 * Reading overlay for case studies (`?case=slug`) and articles (`?note=slug`).
 * A native <dialog>: focus is trapped, Escape closes it, and the URL can be shared.
 */
export function Reader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const caseSlug = searchParams.get("case");
  const noteSlug = searchParams.get("note");
  const project = caseSlug ? getProject(caseSlug) : undefined;
  const article = !project && noteSlug ? getArticle(noteSlug) : undefined;
  const openKey = project ? `case:${project.slug}` : article ? `note:${article.slug}` : null;

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (openKey && !el.open) el.showModal();
    if (!openKey && el.open) el.close();
    scroller.current?.scrollTo({ top: 0 });
  }, [openKey]);

  const hrefWith = (key: "case" | "note", slug: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.delete("case");
    params.delete("note");
    if (slug) params.set(key, slug);
    const query = params.toString();
    return query ? `/work?${query}` : "/work";
  };

  const close = () => router.replace(hrefWith("case", null), { scroll: false });

  return (
    <dialog
      ref={dialog}
      className="reader"
      aria-labelledby="reader-title"
      onClose={() => openKey && close()}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === dialog.current) close();
      }}
    >
      {openKey && (
        <div ref={scroller} className="h-full overflow-x-hidden overflow-y-auto overscroll-contain">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/95 px-(--gutter) py-3 backdrop-blur-sm lg:px-12">
            <p className="label text-faint">{project ? `Case study ${project.number}` : "Engineering note"}</p>
            <button
              type="button"
              onClick={close}
              className="group -mr-2 inline-flex min-h-11 items-center gap-2 px-2 text-sm text-muted hover:text-ink"
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

          <div className="px-(--gutter) pt-12 pb-20 lg:px-12 lg:pt-16">
            {project && (
              <CaseStudy
                project={project}
                prevHref={hrefWith("case", neighbour(projects, project, -1).slug)}
                nextHref={hrefWith("case", neighbour(projects, project, 1).slug)}
                prevTitle={neighbour(projects, project, -1).title}
                nextTitle={neighbour(projects, project, 1).title}
              />
            )}
            {article && (
              <ArticleView
                article={article}
                nextHref={hrefWith("note", neighbour(articles, article, 1).slug)}
                nextTitle={neighbour(articles, article, 1).title}
              />
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

function neighbour<T>(list: T[], item: T, step: 1 | -1) {
  const index = list.indexOf(item);
  return list[(index + step + list.length) % list.length];
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-9 lg:grid-cols-12 lg:gap-x-10">
      <h3 className="label pt-1 text-faint lg:col-span-3">{title}</h3>
      <div className="max-w-[68ch] min-w-0 leading-relaxed text-muted lg:col-span-9">{children}</div>
    </section>
  );
}

function Code({ code, caption }: { code: string; caption?: string }) {
  return (
    <figure className="my-2 min-w-0">
      <pre
        tabIndex={0}
        className="overflow-x-auto border border-line bg-surface p-5 font-mono text-[0.8125rem] leading-relaxed text-ink"
      >
        <code>{code}</code>
      </pre>
      {caption && <figcaption className="mt-3 text-sm text-faint">{caption}</figcaption>}
    </figure>
  );
}

function CaseStudy({
  project,
  prevHref,
  nextHref,
  prevTitle,
  nextTitle,
}: {
  project: Project;
  prevHref: string;
  nextHref: string;
  prevTitle: string;
  nextTitle: string;
}) {
  return (
    <article>
      <p className="label text-muted">{project.status}</p>
      <h2 id="reader-title" className="h2 mt-5 max-w-[16ch]">
        {project.title}
      </h2>
      <p className="lead mt-8 max-w-[62ch] text-muted">{project.overview}</p>

      <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-6 text-sm sm:grid-cols-3">
        <div>
          <dt className="label mb-2 text-faint">Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt className="label mb-2 text-faint">Category</dt>
          <dd>{project.categories.join(", ")}</dd>
        </div>
        <div>
          <dt className="label mb-2 text-faint">Technologies</dt>
          <dd>{project.stack.join(", ")}</dd>
        </div>
      </dl>

      <ProjectPlate diagram={project.diagram} parallax={false} className="my-12" />

      <Block title="Problem">
        <p>{project.problem}</p>
      </Block>
      <Block title="Context">
        <p>{project.context}</p>
      </Block>
      <Block title="My role">
        <ul className="space-y-2">
          {project.responsibilities.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[0.75em] h-px w-3 flex-none bg-faint" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Block>
      <Block title="Workflow">
        <ol className="space-y-3">
          {project.workflow.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="label w-6 flex-none pt-1 text-faint">0{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Block>
      <Block title="Decisions">
        <div className="space-y-7">
          {project.decisions.map((decision) => (
            <div key={decision.title}>
              <h4 className="text-lg font-medium tracking-tight text-ink">{decision.title}</h4>
              <p className="mt-2">{decision.body}</p>
            </div>
          ))}
        </div>
      </Block>
      {project.snippet && (
        <Block title="Code">
          <Code code={project.snippet.code} caption={project.snippet.caption} />
        </Block>
      )}
      <Block title="Challenges">
        <div className="space-y-7">
          {project.challenges.map((challenge) => (
            <div key={challenge.title}>
              <h4 className="text-lg font-medium tracking-tight text-ink">{challenge.title}</h4>
              <p className="mt-2">{challenge.body}</p>
            </div>
          ))}
        </div>
      </Block>
      <Block title="Outcomes">
        <p>{project.outcomes ?? "No figures are published for this project. I only list results I can verify and am free to share."}</p>
      </Block>
      {project.links.length > 0 && (
        <Block title="Links">
          <ul className="space-y-2">
            {project.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="link-draw text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Block>
      )}
      <Block title="Note">
        <p>{project.disclosure}</p>
      </Block>

      <nav aria-label="More case studies" className="mt-6 grid border-t border-line sm:grid-cols-2">
        <Link
          href={prevHref}
          replace
          scroll={false}
          className="group flex min-h-24 flex-col justify-center gap-2 border-b border-line py-6 sm:border-r sm:border-b-0 sm:pr-6"
        >
          <span className="label flex items-center gap-2 text-faint">
            <ArrowLeft
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:-translate-x-1"
            />
            Previous
          </span>
          <span className="text-lg font-medium tracking-tight">{prevTitle}</span>
        </Link>
        <Link
          href={nextHref}
          replace
          scroll={false}
          className="group flex min-h-24 flex-col justify-center gap-2 py-6 sm:items-end sm:pl-6 sm:text-right"
        >
          <span className="label flex items-center gap-2 text-faint">
            Next
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
            />
          </span>
          <span className="text-lg font-medium tracking-tight">{nextTitle}</span>
        </Link>
      </nav>
    </article>
  );
}

function ArticleView({ article, nextHref, nextTitle }: { article: Article; nextHref: string; nextTitle: string }) {
  const { date, reading } = articleMeta(article);
  return (
    <article className="mx-auto max-w-[44rem] min-w-0">
      <p className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-muted">
        <span>{article.category}</span>
        {date && <span>{date}</span>}
        <span>{reading}</span>
        {article.status === "draft" && <DraftTag />}
      </p>
      <h2 id="reader-title" className="mt-6 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
        {article.title}
      </h2>
      <p className="lead mt-6 text-muted">{article.description}</p>

      <div className="mt-10 border-t border-line pt-10 text-[1.0625rem] leading-[1.75] text-ink/85">
        {article.body.map((block, index) => {
          if (block.type === "h")
            return (
              <h3 key={index} className="mt-12 mb-4 text-2xl leading-tight font-medium tracking-tight text-ink">
                {block.text}
              </h3>
            );
          if (block.type === "list")
            return (
              <ul key={index} className="my-6 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-[0.85em] h-px w-3 flex-none bg-faint" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          if (block.type === "code") return <Code key={index} code={block.code} />;
          return (
            <p key={index} className="my-5">
              {block.text}
            </p>
          );
        })}
      </div>

      <Link
        href={nextHref}
        replace
        scroll={false}
        className="group mt-14 flex min-h-24 flex-col justify-center gap-2 border-t border-b border-line py-6"
      >
        <span className="label flex items-center gap-2 text-faint">
          Next note
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
          />
        </span>
        <span className="text-lg font-medium tracking-tight">{nextTitle}</span>
      </Link>
    </article>
  );
}
