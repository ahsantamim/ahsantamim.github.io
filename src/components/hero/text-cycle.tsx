"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

const HOLD = 1.5;

/**
 * Loops through phrases letter by letter: the outgoing phrase lifts away and
 * blurs into the air while the next one condenses up out of a blur, the two
 * overlapping. The slot eases to each phrase's width so the centred line
 * re-balances instead of jumping. Without JS or with reduced motion, only the
 * first phrase shows.
 */
export function TextCycle({ phrases, className = "" }: { phrases: readonly string[]; className?: string }) {
  const slot = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, (context) => {
        const el = slot.current;
        if (!el) return;
        const items = gsap.utils.toArray<HTMLElement>("[data-phrase]", el);
        if (items.length < 2) return;
        const chars = items.map((item) => item.querySelectorAll<HTMLElement>("[data-char]"));

        gsap.set(items, { autoAlpha: 1 });
        chars.slice(1).forEach((set) => gsap.set(set, { autoAlpha: 0 }));

        let index = 0;
        const advance = () => context.advance();

        context.add("advance", () => {
          const from = index;
          index = (index + 1) % items.length;

          gsap
            .timeline()
            .to(
              chars[from],
              {
                yPercent: -40,
                autoAlpha: 0,
                filter: "blur(8px)",
                duration: 0.4,
                ease: "power2.inOut",
                stagger: 0.012,
              },
              0,
            )
            .to(el, { width: items[index].offsetWidth, duration: 0.8, ease: "expo.inOut" }, 0.05)
            .fromTo(
              chars[index],
              { yPercent: 50, autoAlpha: 0, filter: "blur(8px)" },
              {
                yPercent: 0,
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 0.7,
                ease: "expo.out",
                stagger: 0.014,
              },
              0.18,
            )
            .call(advance, [], `+=${HOLD}`);
        });

        gsap.delayedCall(HOLD + 0.4, advance);

        const onResize = () => gsap.set(el, { width: items[index].offsetWidth });
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      });
    },
    { scope: slot },
  );

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span ref={slot} className="relative inline-block whitespace-nowrap text-left" aria-hidden="true">
        {phrases.map((phrase, index) => (
          <span
            key={phrase}
            data-phrase
            className={index === 0 ? "inline-block" : "invisible absolute top-0 left-0"}
          >
            {phrase.split(" ").map((word, w) => (
              <span key={w}>
                {w > 0 && " "}
                <span className="inline-block">
                  {Array.from(word).map((char, c) => (
                    <span key={c} data-char className="inline-block will-change-[transform,opacity,filter]">
                      {char}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
