import { ViewTransition } from "react";
import { Footer } from "@/components/footer";
import { ScrollMotion } from "@/components/motion/scroll-motion";

/**
 * Wraps each page: a quick cross-fade between Home and Work (React
 * ViewTransition), one scroll-motion controller, and the footer.
 * Updates inside a page, such as opening a case study, do not transition.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>
        <ScrollMotion>
          <main id="main">{children}</main>
          <Footer />
        </ScrollMotion>
      </div>
    </ViewTransition>
  );
}
