"use client";

import { useId, useRef } from "react";
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/* Three circles on an equilateral triangle; their shared centre is the centroid. */
const R = 112;
const SETS = [
  { id: "eng", label: "Engineering", cx: 230, cy: 170, lx: 186, ly: 140, dx: -1, dy: -0.6 },
  { id: "product", label: "Product", cx: 370, cy: 170, lx: 414, ly: 140, dx: 1, dy: -0.6 },
  { id: "ai", label: "AI", cx: 300, cy: 291.24, lx: 300, ly: 350, dx: 0, dy: 1 },
] as const;
const CORE = { x: 300, y: 210.41 };

const mono = { fontFamily: "var(--font-mono)", textTransform: "uppercase" as const };
const thin = { vectorEffect: "non-scaling-stroke" as const };

/**
 * Engineering, product, and AI as overlapping circles, with the work in the
 * region all three share. On first view the circles draw in and slide
 * together, then the centre fills; a slow pulse runs only while on screen.
 *
 * The markup alone is the finished drawing, for reduced motion and no JS.
 */
export function Intersection({ className = "" }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const pulse = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true });
        pulse.fromTo(
          q("[data-ripple]"),
          { scale: 1, autoAlpha: 0.7, svgOrigin: `${CORE.x} ${CORE.y}` },
          { scale: 4, autoAlpha: 0, duration: 2.4, ease: "expo.out" },
        );

        const intro = gsap.timeline({ paused: true, onComplete: () => onScreen && pulse.play() });
        q("[data-set]").forEach((set, i) => {
          const { dx, dy } = SETS[i];
          intro.fromTo(
            set,
            { x: dx * 36, y: dy * 36, autoAlpha: 0 },
            { x: 0, y: 0, autoAlpha: 1, duration: 1.3, ease: "expo.out" },
            i * 0.12,
          );
        });
        intro
          .fromTo(q("[data-ring]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, stagger: 0.12, ease: "power2.inOut" }, 0)
          .fromTo(
            q("[data-label]"),
            { autoAlpha: 0, filter: "blur(4px)" },
            { autoAlpha: 1, filter: "blur(0px)", duration: 0.6, stagger: 0.12, ease: "power2.out" },
            0.5,
          )
          .fromTo(q("[data-core]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 1.1)
          .fromTo(
            q("[data-dot]"),
            { scale: 0.5, autoAlpha: 0, svgOrigin: `${CORE.x} ${CORE.y}` },
            { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2.5)" },
            1.3,
          );

        let onScreen = false;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 80%",
          end: "bottom 10%",
          onToggle: (self) => {
            onScreen = self.isActive;
            if (onScreen) intro.play();
            if (onScreen && intro.progress() === 1) pulse.play();
            else pulse.pause();
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      viewBox="20 20 560 400"
      role="img"
      aria-label="Diagram: engineering, product, and AI overlap, and the work sits where all three meet."
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <defs>
        <pattern id={`${uid}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" fillOpacity="0.09" stroke="none" />
        </pattern>
        {SETS.slice(1).map((s) => (
          <clipPath key={s.id} id={`${uid}-${s.id}`}>
            <circle cx={s.cx} cy={s.cy} r={R} />
          </clipPath>
        ))}
      </defs>
      <rect x="0" y="0" width="600" height="440" fill={`url(#${uid}-grid)`} stroke="none" />

      {SETS.map((s) => (
        <g key={s.id} data-set>
          <circle cx={s.cx} cy={s.cy} r={R} fill="currentColor" fillOpacity="0.035" stroke="none" />
          <circle data-ring cx={s.cx} cy={s.cy} r={R} strokeOpacity="0.55" {...thin} />
          <text
            data-label
            x={s.lx}
            y={s.ly}
            textAnchor="middle"
            fontSize="14"
            letterSpacing="1.6"
            fill="currentColor"
            stroke="none"
            style={mono}
          >
            {s.label}
          </text>
        </g>
      ))}

      <g data-core clipPath={`url(#${uid}-ai)`}>
        <circle
          cx={SETS[0].cx}
          cy={SETS[0].cy}
          r={R}
          clipPath={`url(#${uid}-product)`}
          className="fill-motion"
          fillOpacity="0.22"
          stroke="none"
        />
      </g>

      <circle data-ripple cx={CORE.x} cy={CORE.y} r={6} className="stroke-motion" opacity="0" {...thin} />
      <g data-dot>
        <circle cx={CORE.x} cy={CORE.y} r={9} className="fill-motion" fillOpacity="0.25" stroke="none" />
        <circle cx={CORE.x} cy={CORE.y} r={3.5} className="fill-motion" stroke="none" />
      </g>
    </svg>
  );
}
