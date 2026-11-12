import { philosophy } from "@/data/content";

export function Philosophy() {
  return (
    <section className="section-y bg-surface" aria-labelledby="philosophy-title">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <h2 id="philosophy-title" className="sr-only">
              Engineering philosophy
            </h2>
            <p
              className="font-serif text-[clamp(2rem,4.4vw,4.25rem)] leading-[1.08] tracking-[-0.015em] italic"
              data-scrub-words
            >
              {philosophy.statement}
            </p>
          </div>
        </div>

        <ol className="lg:col-span-4 lg:col-start-9">
          {philosophy.principles.map((principle, index) => (
            <li key={principle} className="border-t border-line py-10 last:border-b lg:py-14">
              <p className="label text-faint">0{index + 1}</p>
              <p className="mt-5 text-[clamp(1.375rem,1.9vw,1.75rem)] leading-[1.25] tracking-[-0.02em]" data-split>
                {principle}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
