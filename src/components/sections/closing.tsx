import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleRow } from "@/components/article-row";
import { Button } from "@/components/button";
import { articles } from "@/data/articles";
import { mailto, site } from "@/data/site";

export function Insights() {
  return (
    <section className="section-y" aria-labelledby="insights-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="insights-title" className="h2" data-split>
            Latest writing
          </h2>
          <Link
            href="/work#insights"
            className="group inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink"
          >
            <span className="link-draw">Explore All Insights</span>
            <ArrowRight
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
            />
          </Link>
        </div>

        <ul className="mt-14 border-b border-line lg:mt-20">
          {articles.slice(0, 3).map((article) => (
            <li key={article.slug}>
              <ArticleRow article={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Contact() {
  const contacts = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "LinkedIn", value: site.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: site.linkedin },
    { label: "GitHub", value: site.github.replace(/^https?:\/\/(www\.)?/, ""), href: site.github },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      aria-labelledby="contact-title"
    >
      {/* Slow concentric rings, drifting against the scroll. */}
      <div
        className="pointer-events-none absolute top-1/2 right-[-35%] aspect-square w-[120%] -translate-y-1/2 sm:right-[-20%] sm:w-[85%] lg:right-[-8%] lg:w-[58%]"
        aria-hidden="true"
      >
        <svg viewBox="-400 -400 800 800" className="size-full" fill="none" stroke="currentColor" data-parallax="9">
          <g className="spin-slow">
            <circle r="390" strokeOpacity="0.1" strokeDasharray="2 14" />
            <circle r="310" strokeOpacity="0.16" />
            <line x1="-310" x2="310" strokeOpacity="0.1" />
            <line y1="-310" y2="310" strokeOpacity="0.1" />
            <circle cx="310" r="4" fill="currentColor" stroke="none" fillOpacity="0.7" />
          </g>
          <g className="spin-slow-reverse">
            <circle r="220" strokeOpacity="0.22" strokeDasharray="60 10" />
            <circle r="130" strokeOpacity="0.3" />
            <circle cy="-220" r="4" fill="currentColor" stroke="none" fillOpacity="0.9" />
          </g>
          <circle r="46" strokeOpacity="0.5" />
        </svg>
      </div>

      <div className="wrap section-y relative">
        <h2 id="contact-title" className="display max-w-[13ch]" data-split>
          Have an idea? Let&rsquo;s engineer it into reality.
        </h2>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="lead max-w-[52ch] text-muted">
              Whether you&rsquo;re building a new digital product, improving an existing platform, or
              looking for an engineering partner, I&rsquo;d love to hear about it.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href={mailto("Project enquiry")} variant="solid" className="w-full sm:w-auto">
                Start a Project
              </Button>
              <Button href={`mailto:${site.email}`} icon="diagonal" className="w-full sm:w-auto">
                Get in Touch
              </Button>
            </div>
          </div>

          <dl className="self-end border-t border-line lg:col-span-5 lg:col-start-8">
            {contacts.map((contact) => (
              <div key={contact.label} className="grid grid-cols-[6rem_1fr] items-center border-b border-line">
                <dt className="label text-faint">{contact.label}</dt>
                <dd>
                  <a
                    href={contact.href}
                    className="group flex min-h-14 items-center justify-between gap-4 hover:text-ink"
                    {...(contact.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span className="link-draw break-all">{contact.value}</span>
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
