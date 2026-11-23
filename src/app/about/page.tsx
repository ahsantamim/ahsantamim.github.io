import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PortraitStage } from "@/components/about/portrait-stage";
import { Button } from "@/components/button";
import { PageShell } from "@/components/page-shell";
import { about } from "@/data/about";
import { site } from "@/data/site";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

export const metadata: Metadata = {
  title: about.title,
  description: about.description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: `${about.title} — ${site.name}`,
    description: about.description,
    firstName: "Ahsanul",
    lastName: "Karim",
  },
  twitter: {
    card: "summary_large_image",
    title: `${about.title} — ${site.name}`,
    description: about.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/about#page`,
      url: `${site.url}/about`,
      name: `${about.title} — ${site.name}`,
      description: about.description,
      isPartOf: { "@id": `${site.url}/#website` },
      mainEntity: { "@id": `${site.url}/#person` },
      breadcrumb: { "@id": `${site.url}/about#breadcrumb` },
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      jobTitle: site.title,
      image: `${site.url}/about/portrait.webp`,
      worksFor: { "@type": "Organization", name: "NSBH" },
      homeLocation: { "@type": "Place", name: "Dhaka, Bangladesh" },
      alumniOf: about.education.entries.map((entry) => ({
        "@type": "CollegeOrUniversity",
        name: entry.school,
        url: entry.schoolUrl,
      })),
      hasCredential: about.education.entries.map((entry) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: entry.degree,
        recognizedBy: { "@type": "CollegeOrUniversity", name: entry.school },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${site.url}/about#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "About", item: `${site.url}/about` },
      ],
    },
  ],
};

/**
 * Desktop: the intro sits on the left with the portrait on the right. Over
 * the first screen of scroll the intro fades back while the portrait crosses
 * to the left column and turns to face the reader; the rest of the page then
 * reads in the right column beside it. The portrait layer spans both columns
 * under the text. Phones show the portrait first, then the text.
 */
export default function About() {
  const { intro, story, motive, education, closing } = about;

  return (
    <PageShell>
      <div id="about-story" className="wrap grid lg:grid-cols-12 lg:gap-x-12">
        <div className="relative z-10 lg:col-span-6 lg:col-start-1 lg:row-start-1">
          <header id="about-intro" className="flex flex-col justify-center pt-10 pb-(--section-y) lg:min-h-svh lg:pt-(--nav-h) lg:pb-16">
            <h1 className="text-[clamp(2.75rem,5vw,5.25rem)] leading-[0.98] font-medium tracking-[-0.04em]">
              {intro.lines.map((line, index) => (
                <span key={line} className="line-mask">
                  <span style={delay(index)}>
                    {line}
                    {index === intro.lines.length - 1 && (
                      <>
                        {" "}
                        <em className="font-serif font-normal tracking-[-0.02em]">{intro.accent}</em>
                      </>
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <p className="enter-fade lead mt-8 max-w-[50ch] text-muted" style={delay(4)}>
              {intro.lead}
            </p>

            <dl className="enter-fade mt-10 grid border-t border-line sm:grid-cols-2 sm:gap-x-8" style={delay(5)}>
              {intro.facts.map((fact) => (
                <div key={fact.label} className="border-b border-line py-4">
                  <dt className="label text-faint">{fact.label}</dt>
                  <dd className="mt-1.5 tracking-[-0.01em]">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="enter-fade mt-10 flex flex-col gap-3 sm:flex-row" style={delay(6)}>
              <Button href="/#contact" variant="solid" icon="diagonal" className="btn-glow w-full sm:w-auto">
                Let&rsquo;s Talk
              </Button>
              <Button href={site.resume} icon="download" download className="btn-glow w-full sm:w-auto">
                Download Resume
              </Button>
            </div>
          </header>
        </div>

        <div className="relative z-10 lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:pt-[40svh]">
          <section className="border-t border-line py-(--section-y) lg:py-[clamp(5rem,10vw,9rem)]" aria-labelledby="story-title">
            <h2 id="story-title" className="h2 max-w-[14ch]" data-split>
              {story.title}
            </h2>
            <div className="mt-10 max-w-[60ch] space-y-6 text-lg leading-[1.6] tracking-[-0.005em] text-muted" data-rise>
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-2">
              <li>
                <TextLink href="/work">See the projects</TextLink>
              </li>
              <li>
                <TextLink href="/#experience">Read the full journey</TextLink>
              </li>
            </ul>
          </section>

          <section className="border-t border-line py-(--section-y) lg:py-[clamp(5rem,10vw,9rem)]" aria-labelledby="motive-title">
            <h2 id="motive-title" className="h2" data-split>
              {motive.title}
            </h2>
            <p
              className="mt-10 max-w-[30ch] font-serif text-[clamp(1.5rem,2.3vw,2.25rem)] leading-[1.18] tracking-[-0.01em] italic"
              data-scrub-words
            >
              {motive.statement}
            </p>
            <ul className="mt-14 border-t border-line" data-scrub-rise>
              {motive.reasons.map((reason) => (
                <li key={reason.title} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8">
                  <h3 className="text-lg font-medium tracking-[-0.015em]">{reason.title}</h3>
                  <p className="max-w-[46ch] leading-[1.6] text-muted">{reason.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-line py-(--section-y) lg:py-[clamp(5rem,10vw,9rem)]" aria-labelledby="education-title">
            <h2 id="education-title" className="h2" data-split>
              {education.title}
            </h2>
            <ol className="mt-10 border-t border-line">
              {education.entries.map((entry) => (
                <li key={entry.degree} className="border-b border-line py-7">
                  <p className="label text-faint">
                    <time dateTime={entry.start.iso}>{entry.start.label}</time>
                    {" \u2014 "}
                    <time dateTime={entry.end.iso}>{entry.end.label}</time>
                  </p>
                  <h3 className="h3 mt-4 max-w-[22ch]">{entry.degree}</h3>
                  <p className="mt-3 text-muted">
                    {entry.school}, {entry.location}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-[56ch] leading-[1.6] text-muted">{education.note}</p>
          </section>
        </div>

        <aside
          className="pointer-events-none order-first pt-(--nav-h) lg:order-none lg:col-span-12 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:pt-0"
          aria-label="Portrait"
        >
          <div className="enter-blur lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-end lg:pt-(--nav-h) lg:pb-10">
            <PortraitStage track="about-story" intro="about-intro" className="mt-6 w-full lg:mt-0 lg:ml-auto lg:w-[calc(50%-1.5rem)]" />
          </div>
        </aside>
      </div>

      <section className="section-y border-t border-line" aria-labelledby="closing-title">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 id="closing-title" className="h2 max-w-[18ch] lg:col-span-8" data-split>
            {closing.title}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
            <Button href="/#contact" variant="solid" className="w-full sm:w-auto">
              Start a Project
            </Button>
            <Button href="/work" className="w-full sm:w-auto">
              Explore My Work
            </Button>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </PageShell>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex min-h-11 items-center gap-2 text-ink">
      <span className="link-draw">{children}</span>
      <ArrowRight
        size={16}
        strokeWidth={1.75}
        aria-hidden="true"
        className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
      />
    </Link>
  );
}
