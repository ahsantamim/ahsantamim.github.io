"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * The hero is sticky, so the page slides up over it. While the first screen
 * of scroll passes, its content sinks back: a slower drift upward, a slight
 * shrink, and a fade. Scrubbed, so scrolling back up plays it in reverse.
 */
export function HeroParallax({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.to(content.current, {
          yPercent: -14,
          scale: 0.92,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: () => window.innerHeight,
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: content },
  );

  return (
    <div ref={content} className={className}>
      {children}
    </div>
  );
}
