"use client";

import { useRef } from "react";
import { EASE, MOTION_OK, ScrollTrigger, SplitText, gsap, useGSAP } from "@/lib/gsap";

/**
 * One scroll-motion controller per page.
 *
 * Sections stay Server Components and opt in with data attributes:
 *
 *   data-split            heading lines rise from a mask when scrolled into view
 *   data-rise             a group whose direct children rise and sharpen out of a blur, staggered
 *   data-parallax="12"    element drifts by ±N percent of its height while in view
 *   data-scrub-words      words go from grey to white as the block is scrolled
 *   data-scrub-rise       direct children rise in one after another, tied to scroll
 *   data-grow             a line scales from 0 to 1 on the Y axis with scroll
 *   data-drift="-8"       element moves horizontally by N percent with scroll
 *   data-draw             SVG strokes inside draw themselves when in view
 *
 * Nothing is hidden in CSS, so the page is complete without JavaScript and
 * for visitors who prefer reduced motion.
 */
export function ScrollMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);

        q("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 108,
                duration: 1.1,
                ease: EASE,
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
        });

        q("[data-rise]").forEach((el) => {
          gsap.from(el.children, {
            y: 12,
            autoAlpha: 0,
            filter: "blur(6px)",
            duration: 0.7,
            ease: EASE,
            stagger: { amount: 0.3 },
            clearProps: "filter",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        q("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 10;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        q("[data-drift]").forEach((el) => {
          const amount = Number(el.dataset.drift) || -8;
          gsap.fromTo(
            el,
            { xPercent: 0 },
            {
              xPercent: amount,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
            },
          );
        });

        q("[data-scrub-words]").forEach((el) => {
          const split = SplitText.create(el, { type: "words", wordsClass: "scrub-word" });
          gsap.fromTo(
            split.words,
            { opacity: 0.22 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.5,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.4 },
            },
          );
        });

        q("[data-scrub-rise]").forEach((el) => {
          gsap.fromTo(
            el.children,
            { y: 24, autoAlpha: 0.15 },
            {
              y: 0,
              autoAlpha: 1,
              ease: "none",
              stagger: 0.3,
              scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 70%", scrub: 0.4 },
            },
          );
        });

        q("[data-grow]").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top 70%",
                end: "bottom 60%",
                scrub: 0.4,
              },
            },
          );
        });

        q("[data-draw]").forEach((el) => {
          const strokes = el.querySelectorAll("[data-stroke]");
          const fills = el.querySelectorAll("[data-fade]");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          });
          tl.from(strokes, {
            drawSVG: "0%",
            duration: 1.4,
            ease: "power3.inOut",
            stagger: 0.035,
          }).from(fills, { autoAlpha: 0, duration: 0.6, stagger: 0.03 }, 0.5);
        });
      });

      // Fonts change line breaks; recalculate trigger positions once they land.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
