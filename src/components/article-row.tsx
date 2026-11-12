import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/data/articles";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function articleMeta(article: Article) {
  const date = article.status === "published" && article.date ? dateFormat.format(new Date(`${article.date}T00:00:00Z`)) : null;
  return { date, reading: `${article.readingMinutes} min read` };
}

export function DraftTag() {
  return <span className="label border border-faint px-2 py-1 text-[0.625rem] text-muted">Draft</span>;
}

/** One article in a list. Used on the homepage and on /work. */
export function ArticleRow({ article, stay = false }: { article: Article; stay?: boolean }) {
  const { date, reading } = articleMeta(article);
  return (
    <Link
      href={`/work?note=${article.slug}`}
      scroll={!stay}
      className="row-invert grid gap-x-8 gap-y-4 border-t border-line py-8 lg:grid-cols-12 lg:py-10"
      data-cursor="Read"
    >
      <span className="row-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-faint lg:col-span-3 lg:flex-col lg:items-start">
        <span className="label">{article.category}</span>
        <span className="label">{date ? `${date} · ${reading}` : reading}</span>
        {article.status === "draft" && <DraftTag />}
      </span>
      <span className="lg:col-span-8">
        <span className="h3 block max-w-[26ch]">{article.title}</span>
        <span className="row-muted mt-4 block max-w-[62ch] text-muted">{article.description}</span>
      </span>
      <span className="row-arrow hidden justify-self-end lg:col-span-1 lg:block">
        <ArrowUpRight size={32} strokeWidth={1.25} aria-hidden="true" />
      </span>
    </Link>
  );
}
