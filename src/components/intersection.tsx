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

/** Seconds each circle holds the spotlight in the loop. */
const FOCUS = 1.7;
const RING_REST = 0.55;
const LABEL_DIM = 0.35;

/**
 * Engineering, product, and AI as overlapping circles, with the work in the
 * region all three share. On first view the circles draw in and slide
 * together. Then a loop: the centre clears, each circle takes the spotlight
 * in turn, and all three light up as the centre fills again. It runs only
 * while on screen and the tab is visible.
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
        const sets = q("[data-set]");
        const rings = q("[data-ring]");
        const glows = q("[data-glow]");
        const labels = q("[data-label]");
        const core = q("[data-core]");

        /* The core clip is drawn from the circles at rest, so it only shows while none of them is scaled. */
        const loop = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "sine.inOut" } });
        loop.to(core, { autoAlpha: 0, duration: 0.6 }, 0);
        SETS.forEach((s, i) => {
          const at = 0.4 + i * FOCUS;
          loop
            .to(sets[i], { scale: 1.05, svgOrigin: `${s.cx} ${s.cy}`, duration: 0.7, ease: "power3.inOut" }, at)
            .to(glows[i], { autoAlpha: 1, duration: 0.7 }, at)
            .to(rings[i], { opacity: 1, duration: 0.7 }, at)
            .to(labels[i], { opacity: 1, duration: 0.5 }, at)
            .to(labels.filter((_, j) => j !== i), { opacity: LABEL_DIM, duration: 0.5 }, at)
            .to(sets[i], { scale: 1, duration: 0.7, ease: "power3.inOut" }, at + FOCUS - 0.5)
            .to(glows[i], { autoAlpha: 0, duration: 0.7 }, at + FOCUS - 0.5)
            .to(rings[i], { opacity: RING_REST, duration: 0.7 }, at + FOCUS - 0.5);
        });
        const meet = 0.4 + SETS.length * FOCUS;
        loop
          .to(labels, { opacity: 1, duration: 0.5 }, meet)
          .to(rings, { opacity: 1, duration: 0.5, stagger: 0.08 }, meet)
          .fromTo(
            core,
            { autoAlpha: 0, scale: 0.85, filter: "blur(6px)", svgOrigin: `${CORE.x} ${CORE.y}` },
            { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "expo.out", immediateRender: false },
            meet + 0.2,
          )
          .to(rings, { opacity: RING_REST, duration: 0.8 }, meet + 2.6)
          .to({}, { duration: 0.8 }, meet + 2.6);

        let onScreen = false;
        let introDone = false;
        const sync = () => {
          if (introDone && onScreen && !document.hidden) loop.play();
          else loop.pause();
        };

        const intro = gsap.timeline({
          paused: true,
          onComplete: () => {
            introDone = true;
            sync();
          },
        });
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
          .fromTo(core, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 1.1)
          .to({}, { duration: 1.2 });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top 80%",
          end: "bottom 10%",
          onToggle: (self) => {
            onScreen = self.isActive;
            if (onScreen) intro.play();
            sync();
          },
        });

        document.addEventListener("visibilitychange", sync);
        return () => document.removeEventListener("visibilitychange", sync);
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
          <circle data-glow cx={s.cx} cy={s.cy} r={R} className="fill-motion" fillOpacity="0.1" stroke="none" opacity="0" />
          <circle data-ring cx={s.cx} cy={s.cy} r={R} opacity={RING_REST} {...thin} />
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
    </svg>
  );
}
