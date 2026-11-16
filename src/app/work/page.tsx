import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticleRow } from "@/components/article-row";
import { PageShell } from "@/components/page-shell";
import { ContractWork } from "@/components/sections/contract-work";
import { FilterBar, ProjectArchive } from "@/components/work/project-archive";
import { ProjectList } from "@/components/work/project-list";
import { Reader } from "@/components/work/reader";
import { articles } from "@/data/articles";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const description =
  "A collection of products, engineering challenges, technical experiments, and lessons from building software.";

export const metadata: Metadata = {
  title: "Selected Work & Engineering Notes",
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    url: "/work",
    title: `Selected Work & Engineering Notes — ${site.name}`,
    description,
  },
};

export default function Work() {
  return (
    <PageShell>
      <header className="wrap pt-[calc(var(--nav-h)+5rem)] pb-16 lg:pt-[calc(var(--nav-h)+8rem)] lg:pb-24">
        <h1 className="display max-w-[14ch]">
          <span className="line-mask">
            <span style={{ "--i": 0 } as React.CSSProperties}>Selected Work &amp;</span>
          </span>
          <span className="line-mask">
            <span style={{ "--i": 1 } as React.CSSProperties}>Engineering Notes</span>
          </span>
        </h1>
        <p className="enter-fade lead mt-8 max-w-[52ch] text-muted" style={{ "--i": 3 } as React.CSSProperties}>
          {description}
        </p>
      </header>

      <section id="projects" className="border-t border-line pt-14 pb-(--section-y)" aria-labelledby="projects-title">
        <div className="wrap">
          <h2 id="projects-title" className="h2 mb-10">
            Projects
          </h2>
          {/* The filter reads the URL on the client; the full list is the server-rendered fallback. */}
          <Suspense
            fallback={
              <>
                <FilterBar active="All" />
                <ProjectList projects={projects} />
              </>
            }
          >
            <ProjectArchive />
          </Suspense>
        </div>
      </section>

      <div id="independent" className="border-t border-line">
        <ContractWork />
      </div>

      <section id="insights" className="section-y border-t border-line" aria-labelledby="notes-title">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12">
            <h2 id="notes-title" className="h2 lg:col-span-6" data-split>
              Insights
            </h2>
            <p className="max-w-[46ch] self-end text-muted lg:col-span-5 lg:col-start-8">
              Notes on testing, architecture, and working with AI. Pieces marked Draft are still being
              edited.
            </p>
          </div>
          <ul className="mt-14 border-b border-line lg:mt-20">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleRow article={article} stay />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Suspense>
        <Reader />
      </Suspense>
    </PageShell>
  );
}
