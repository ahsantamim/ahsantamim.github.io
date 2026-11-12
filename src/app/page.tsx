import { PageShell } from "@/components/page-shell";
import { Capabilities } from "@/components/sections/capabilities";
import { Contact, Insights } from "@/components/sections/closing";
import { Hero } from "@/components/sections/hero";
import { Identity } from "@/components/sections/identity";
import { Arsenal, Journey } from "@/components/sections/journey";
import { Philosophy } from "@/components/sections/philosophy";
import { SelectedWork } from "@/components/sections/selected-work";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <div className="relative z-10 rounded-t-[1.75rem] border-t border-ink/15 bg-bg sm:rounded-t-[2.5rem]">
        <Identity />
        <SelectedWork />
        <Capabilities />
        <Philosophy />
        <Journey />
        <Arsenal />
        <Insights />
        <Contact />
      </div>
    </PageShell>
  );
}
