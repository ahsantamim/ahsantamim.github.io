"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Download } from "lucide-react";
import { CONTACT_EVENT } from "@/components/contact/contact-trigger";
import { ThemeToggle } from "@/components/theme-toggle";
import { nav, site } from "@/data/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener(CONTACT_EVENT, close);
    return () => window.removeEventListener(CONTACT_EVENT, close);
  }, []);

  // Lock scroll and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : href === pathname);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-line bg-bg/90 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-10 focus-visible:bg-invert focus-visible:px-4 focus-visible:py-2 focus-visible:text-invert-ink"
      >
        Skip to content
      </a>

      <div className="wrap flex h-(--nav-h) items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex min-h-11 items-center gap-3"
          aria-label={`${site.name}, home`}
          onClick={() => setOpen(false)}
        >
          <span className="flex size-9 items-center justify-center border border-ink text-[0.8125rem] font-semibold tracking-tight transition-colors duration-300 group-hover:bg-invert group-hover:text-invert-ink">
            {site.monogram}
          </span>
          <span className="hidden text-[0.9375rem] font-medium tracking-tight sm:block">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-[0.9375rem]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="link-draw text-muted hover:text-ink aria-[current=page]:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <a
            href={site.resume}
            download
            className="link-draw hidden items-center gap-2 text-[0.9375rem] text-muted hover:text-ink md:inline-flex"
          >
            Resume
            <Download size={14} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <ThemeToggle className="-mx-2" />
          <Link href="/#contact" className="btn btn-solid hidden min-h-10! px-4! text-sm! sm:inline-flex">
            <span>Let&rsquo;s Talk</span>
            <ArrowUpRight className="icon-diagonal" size={15} strokeWidth={1.75} aria-hidden="true" />
          </Link>

          <button
            ref={toggle}
            type="button"
            className="relative -mr-2 flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className={`absolute h-px w-6 bg-ink transition-transform duration-300 ease-(--ease-out-expo) ${
                open ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute h-px w-6 bg-ink transition-transform duration-300 ease-(--ease-out-expo) ${
                open ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </div>

    </header>

      {/* Mobile: a full-screen menu with large type, not a shrunken desktop bar.
          It sits outside the header: the header's backdrop blur would otherwise
          become the containing block for this fixed panel. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-x-0 top-(--nav-h) bottom-0 z-40 flex flex-col justify-between overflow-y-auto bg-bg transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="wrap pt-8">
          <ul>
            {nav.map((item, index) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="flex items-baseline justify-between py-5 text-[2.5rem] leading-none font-medium tracking-[-0.035em]"
                  style={{
                    transform: open ? "none" : "translateY(16px)",
                    opacity: open ? 1 : 0,
                    transition: `transform 0.6s var(--ease-out-expo) ${index * 50 + 60}ms, opacity 0.4s ease ${index * 50 + 60}ms`,
                  }}
                >
                  {item.label}
                  <span className="label text-faint">0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="wrap flex flex-col gap-5 pt-10 pb-8">
          <div className="grid grid-cols-2 gap-3">
            <a href={site.resume} download className="btn btn-outline">
              <span>Resume</span>
              <Download size={15} strokeWidth={1.75} aria-hidden="true" />
            </a>
            <Link href="/#contact" className="btn btn-solid" onClick={() => setOpen(false)}>
              <span>Let&rsquo;s Talk</span>
              <ArrowUpRight className="icon-diagonal" size={15} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
