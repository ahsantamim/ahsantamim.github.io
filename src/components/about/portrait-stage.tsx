"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import portrait from "../../../public/about/portrait.webp";

const DESKTOP = "(min-width: 64rem)";

/**
 * The portrait starts in the right column. On desktop, over the first screen
 * of scroll, it slides across to the left column while the intro (`intro`,
 * an element id) fades back, clearing the right column for the text that
 * follows; the rings behind it turn with the whole scroll. Phones and
 * reduced motion keep it still.
 */
export function PortraitStage({ track, intro, className = "" }: { track: string; intro: string; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const stage = scope.current!;
        // Selector strings are scoped to this component, so outside elements are passed as nodes.
        const trackEl = document.getElementById(track);
        const introEl = document.getElementById(intro);
        // From this column to the opposite one: the parent spans both columns and the gap.
        const travel = () => -((stage.parentElement?.clientWidth ?? 0) - stage.offsetWidth);

        gsap
          .timeline({
            scrollTrigger: {
              trigger: trackEl,
              start: "top top",
              end: () => `+=${window.innerHeight * 0.95}`,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(stage, { x: 0 }, { x: travel, ease: "power2.inOut", duration: 1 }, 0)
          .to(stage, { scale: 0.94, ease: "sine.out", duration: 0.5 }, 0)
          .to(stage, { scale: 1, ease: "sine.in", duration: 0.5 }, 0.5)
          .to(introEl, { autoAlpha: 0, y: -48, ease: "power1.in", duration: 0.5 }, 0);

        gsap.to(stage.querySelector("[data-rings]"), {
          rotation: 120,
          svgOrigin: "48 29",
          ease: "none",
          scrollTrigger: { trigger: trackEl, start: "top top", end: "bottom bottom", scrub: 0.8 },
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      <figure className="relative mx-auto w-full max-w-[26rem] lg:max-w-[min(100%,calc(100svh-var(--nav-h)-7rem))]">
        <div className="relative aspect-square w-full">
          {/* Measuring rings centred on the head, behind the photo. */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full overflow-visible"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <g data-rings>
              <circle cx="48" cy="29" r="47" strokeOpacity="0.1" strokeDasharray="0.4 2.2" vectorEffect="non-scaling-stroke" />
              <circle cx="48" cy="29" r="36" strokeOpacity="0.16" vectorEffect="non-scaling-stroke" />
              <circle cx="48" cy="29" r="27" strokeOpacity="0.22" strokeDasharray="9 1.6" vectorEffect="non-scaling-stroke" />
              <circle cx="84" cy="29" r="0.9" fill="currentColor" stroke="none" fillOpacity="0.8" />
              <circle cx="48" cy="2" r="0.7" fill="currentColor" stroke="none" fillOpacity="0.9" />
            </g>
            <line x1="48" y1="-20" x2="48" y2="100" strokeOpacity="0.09" vectorEffect="non-scaling-stroke" />
            <line x1="-8" y1="29" x2="108" y2="29" strokeOpacity="0.09" vectorEffect="non-scaling-stroke" />
          </svg>

          <Image
            src={portrait}
            alt="Ahsanul Karim, black and white portrait"
            fill
            sizes="(min-width: 64rem) 46vw, 92vw"
            loading="eager"
            fetchPriority="high"
            className="object-contain"
          />
        </div>

        <figcaption className="relative mt-4 flex items-center justify-between gap-6 border-t border-line pt-4 font-mono text-[0.6875rem] tracking-[0.08em] text-faint uppercase">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-ink">Ahsanul Karim</span>
            <span aria-hidden="true">/</span>
            <span>Dhaka, BD</span>
          </span>
          <span className="hidden whitespace-nowrap tabular-nums sm:inline">23.81&deg; N, 90.41&deg; E</span>
        </figcaption>
      </figure>
    </div>
  );
}
