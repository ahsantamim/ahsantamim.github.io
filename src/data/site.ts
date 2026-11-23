import { asset } from "@/lib/asset";

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

  email: "ahsanulkarim.dev@gmail.com",
  whatsapp: {
    display: "+880 1775-288311",
    /** Digits only, as wa.me expects. */
    number: "8801775288311",
  },
  linkedin: "https://www.linkedin.com/in/ahsanul-karim-2258601b1/",
  github: "https://github.com/ahsantamim",
  resume: asset("/Ahsanul_Karim_Resume.pdf"),
  /** The Cloudflare Worker behind /analytics (see analytics-worker/). */
  analyticsApi: process.env.NEXT_PUBLIC_ANALYTICS_API ?? "",
  /** Meeting slots are offered in this zone. */
  timeZone: "Asia/Dhaka",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
] as const;

export function mailto(subject: string, body?: string) {
  const query = `subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
  return `mailto:${site.email}?${query}`;
}

export function whatsapp(text?: string) {
  return `https://wa.me/${site.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const projectTypes = [
  "Web app",
  "AI / LLM integration",
  "SaaS / MVP",
  "API & backend",
  "Mobile app",
  "QA & test automation",
  "Something else",
] as const;
