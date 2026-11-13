"use client";

import { useRef } from "react";
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/** Card starts, oldest first; the gaps shrink so the row lands as one wave. */
const STARTS = [0, 0.16, 0.29, 0.39];

/**
 * Entrance for the journey cards, played once when they come into view, in
 * the hero's motion language. Each card sharpens out of a blur like the hero
 * captions; its tenure bar then fills leftward from the role's start, and the length
 * tag pops in as the bar settles.
 *
 * Markup roles: [data-role] per card, newest first, holding [data-bar] and
 * [data-chip]. The markup alone is the finished state, for reduced motion
 * and no JS.
 */
export function JourneyMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ paused: true });

        /* Cards are newest first; the entrance runs oldest first, so right to left. */
        const cards = q("[data-role]").reverse();
        cards.forEach((card, i) => {
          const at = STARTS[i] ?? STARTS[STARTS.length - 1] + (i - STARTS.length + 1) * 0.1;
          tl.fromTo(
            card,
            { autoAlpha: 0, y: 12, filter: "blur(6px)" },
            { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "expo.out" },
            at,
          )
            .fromTo(
              card.querySelector("[data-bar]"),
              { scaleX: 0 },
              { scaleX: 1, transformOrigin: "right center", duration: 0.8, ease: "power3.out" },
              at + 0.2,
            )
            .fromTo(
              card.querySelector("[data-chip]"),
              { autoAlpha: 0, y: 4, scale: 0.9, filter: "blur(4px)" },
              { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" },
              at + 0.7,
            );
        });

        ScrollTrigger.create({ trigger: root.current, start: "top 75%", once: true, onEnter: () => tl.play() });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
