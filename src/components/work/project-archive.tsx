"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProjectList } from "@/components/work/project-list";
import { categories, projects, type Category } from "@/data/projects";

const filters = ["All", ...categories] as const;

/** Filterable project list. The active filter lives in the URL (`?filter=`) so it can be linked to. */
export function ProjectArchive() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("filter");
  const active = categories.find((category) => category === requested) ?? "All";

  const visible =
    active === "All" ? projects : projects.filter((project) => project.categories.includes(active as Category));

  const select = (filter: (typeof filters)[number]) => {
    const params = new URLSearchParams(searchParams);
    if (filter === "All") params.delete("filter");
    else params.set("filter", filter);
    const query = params.toString();
    router.replace(query ? `/work?${query}` : "/work", { scroll: false });
  };

  const listQuery = active === "All" ? "" : `filter=${encodeURIComponent(active)}`;

  return (
    <>
      <FilterBar active={active} onSelect={select} />
      <p className="sr-only" role="status">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>
      <ProjectList projects={visible} query={listQuery} />
    </>
  );
}

export function FilterBar({
  active,
  onSelect,
}: {
  active: string;
  onSelect?: (filter: (typeof filters)[number]) => void;
}) {
  return (
    <div role="group" aria-label="Filter projects by category" className="mb-10 flex flex-wrap gap-2">
      {filters.map((filter) => {
        const count =
          filter === "All" ? projects.length : projects.filter((p) => p.categories.includes(filter)).length;
        const pressed = filter === active;
        return (
          <button
            key={filter}
            type="button"
            aria-pressed={pressed}
            onClick={() => onSelect?.(filter)}
            className={`inline-flex min-h-11 items-center gap-2.5 border px-4 text-sm transition-colors duration-300 active:scale-[0.98] ${
              pressed
                ? "border-invert bg-invert text-invert-ink"
                : "border-line text-muted hover:border-faint hover:text-ink"
            }`}
          >
            {filter}
            <span className={`label text-[0.625rem] ${pressed ? "text-invert-muted" : "text-faint"}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
