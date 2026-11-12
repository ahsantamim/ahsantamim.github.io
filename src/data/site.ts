/**
 * Site-wide identity and contact details.
 *
 * Everything marked PLACEHOLDER is not real yet. Replace it before deploying.
 */
export const site = {
  name: "Ahsanul Karim",
  monogram: "AK",
  title: "AI-Native Full-Stack Software Engineer",
  location: "Bangladesh",
  /** PLACEHOLDER: set NEXT_PUBLIC_SITE_URL to the production domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  description:
    "Full-stack software engineer working across AI, frontend, backend, and product engineering. I help businesses turn ideas into digital products, from concept and design to development and deployment.",

  /** PLACEHOLDER: public contact email. */
  email: "hello@example.com",
  /** PLACEHOLDER: LinkedIn profile URL. */
  linkedin: "https://www.linkedin.com/in/your-handle",
  /** PLACEHOLDER: GitHub profile URL. */
  github: "https://github.com/your-handle",
  /** PLACEHOLDER: public/resume.pdf is a stand-in file. Replace it with the real resume. */
  resume: "/resume.pdf",

  /** Set `show` to false to hide the indicator everywhere. Confirmed true on 2026-11-11. */
  availability: {
    show: true,
    label: "Available for selected projects & opportunities",
    short: "Available",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export function mailto(subject: string) {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}
