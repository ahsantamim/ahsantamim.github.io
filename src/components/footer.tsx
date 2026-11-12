import { Suspense } from "react";
import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";
import { Year } from "@/components/year";

const links = [
  { label: "Email", href: `mailto:${site.email}` },
  { label: "LinkedIn", href: site.linkedin },
  { label: "GitHub", href: site.github },
  { label: "Resume", href: site.resume, download: true },
];

export function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="wrap grid gap-10 pt-14 pb-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-xl font-medium tracking-tight">{site.name}</p>
          <p className="mt-1 text-muted">{site.title}</p>
        </div>

        <ul className="flex flex-wrap gap-x-8 gap-y-3 md:col-span-5 md:items-start">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                download={link.download}
                className="link-draw inline-flex min-h-11 items-center text-muted hover:text-ink md:min-h-0"
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="md:col-span-2 md:justify-self-end">
          <a href="#top" className="group inline-flex min-h-11 items-center gap-3 text-muted hover:text-ink">
            <span className="link-draw">Back to top</span>
            <span className="flex size-9 items-center justify-center border border-line transition-colors duration-300 group-hover:border-invert group-hover:bg-invert group-hover:text-invert-ink">
              <ArrowUp
                size={15}
                strokeWidth={1.75}
                aria-hidden="true"
                className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </div>
      </div>

      {/* The name, set as large as the page allows, drifting sideways with scroll. */}
      <p
        aria-hidden="true"
        data-drift="-6"
        className="pointer-events-none pl-(--gutter) text-[clamp(3rem,13.4vw,15rem)] leading-[0.82] font-medium tracking-[-0.05em] whitespace-nowrap text-surface select-none [-webkit-text-stroke:1px_var(--color-line)]"
      >
        {site.name}
      </p>

      <div className="wrap flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-line py-6 text-sm text-faint">
        <p>
          &copy;{" "}
          <Suspense fallback={null}>
            <Year />
          </Suspense>{" "}
          {site.name}
        </p>
        <p>Product names and logos are trademarks of their owners.</p>
        <p>
          {site.location} / Working globally
        </p>
      </div>
    </footer>
  );
}
