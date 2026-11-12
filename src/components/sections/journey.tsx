import { arsenal, journey } from "@/data/content";

export function Journey() {
  return (
    <section className="section-y" aria-labelledby="journey-title">
      <div className="wrap">
        <h2 id="journey-title" className="h2" data-split>
          Professional journey
        </h2>

        <ol className="relative mt-14 lg:mt-20">
          {/* The rail fills as the section is scrolled. */}
          <span className="absolute top-0 bottom-0 left-0 w-px bg-line lg:left-[25%]" aria-hidden="true">
            <span className="block size-full origin-top bg-ink" data-grow />
          </span>

          {journey.map((entry) => (
            <li key={entry.position} className="grid gap-6 pb-14 pl-8 last:pb-0 lg:grid-cols-12 lg:gap-x-12 lg:pb-20 lg:pl-0">
              <div className="lg:col-span-3 lg:pr-10 lg:text-right">
                <p className="label text-ink">{entry.dates ?? "[Add dates]"}</p>
                <p className="label mt-2 text-faint">{entry.kind ?? "[Employment or contract]"}</p>
              </div>

              <div className="lg:col-span-9 lg:pl-12">
                <h3 className="h3" data-split>
                  {entry.position}
                </h3>
                <p className="mt-2 text-muted">{entry.organisation}</p>

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                  <ul className="space-y-2 text-muted">
                    {entry.responsibilities.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-[0.7em] h-px w-3 flex-none bg-faint" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-relaxed">
                    <span className="label mb-2 block text-faint">Technologies</span>
                    {entry.technologies.join(", ")}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Arsenal() {
  return (
    <section className="section-y" aria-labelledby="arsenal-title">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="arsenal-title" className="h2 lg:col-span-6" data-split>
            Technical arsenal
          </h2>
          <p className="max-w-[46ch] self-end text-muted lg:col-span-5 lg:col-start-8">
            The tools I work with, grouped by where they sit in a product.
          </p>
        </div>

        <dl className="mt-14 border-b border-line lg:mt-20">
          {arsenal.map((group) => (
            <div key={group.category} className="grid gap-4 border-t border-line py-7 lg:grid-cols-12 lg:gap-x-12 lg:py-9">
              <dt className="label pt-2 text-faint lg:col-span-3">{group.category}</dt>
              <dd className="lg:col-span-9">
                <ul className="arsenal-list flex flex-wrap gap-x-3 gap-y-1 text-[clamp(1.375rem,2.3vw,2.125rem)] leading-[1.25] tracking-[-0.025em] text-muted">
                  {group.items.map((item, index) => (
                    <li key={item} className="cursor-default transition-colors duration-300">
                      {item}
                      {index < group.items.length - 1 && (
                        <span className="ml-3 text-line" aria-hidden="true">
                          /
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
