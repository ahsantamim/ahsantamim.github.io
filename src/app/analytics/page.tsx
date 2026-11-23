import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/dashboard";
import { PageShell } from "@/components/page-shell";
import { site } from "@/data/site";

const description =
  "Live traffic for this site, straight from Cloudflare Web Analytics. No cookies and no individual tracking: only totals.";

export const metadata: Metadata = {
  title: "Site Analytics",
  description,
  alternates: { canonical: "/analytics" },
  robots: { index: false, follow: false },
  openGraph: {
    url: "/analytics",
    title: `Site Analytics — ${site.name}`,
    description,
  },
};

export default function Analytics() {
  return (
    <PageShell>
      <header className="wrap pt-[calc(var(--nav-h)+5rem)] pb-14 lg:pt-[calc(var(--nav-h)+8rem)] lg:pb-20">
        <h1 className="display max-w-[14ch]">
          <span className="line-mask">
            <span style={{ "--i": 0 } as React.CSSProperties}>Site Analytics,</span>
          </span>
          <span className="line-mask">
            <span style={{ "--i": 1 } as React.CSSProperties} className="text-faint">
              in the open
            </span>
          </span>
        </h1>
        <p className="enter-fade lead mt-8 max-w-[52ch] text-muted" style={{ "--i": 3 } as React.CSSProperties}>
          {description}
        </p>
      </header>

      <section className="wrap pb-(--section-y)" aria-label="Traffic report">
        <AnalyticsDashboard />
      </section>
    </PageShell>
  );
}
