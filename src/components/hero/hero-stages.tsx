"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MOTION_OK, MOTION_REDUCED, gsap, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/asset";

/* Real tool logos in their own colours, fetched by the taste skill's icons.mjs into public/icons. */
const TOOLS = {
  figma: { name: "Figma", w: 27, h: 40 },
  react: { name: "React", w: 40, h: 36 },
  typescript: { name: "TypeScript", w: 40, h: 40 },
  python: { name: "Python", w: 40, h: 40 },
  docker: { name: "Docker", w: 40, h: 29 },
  aws: { name: "AWS", w: 40, h: 24 },
} as const;
type Tool = keyof typeof TOOLS;

const STAGES: ReadonlyArray<{ id: string; label: string; note: string; tools: readonly Tool[]; duration: number }> = [
  { id: "design", label: "Design", note: "Tokens & components", tools: ["figma"], duration: 6 },
  { id: "build", label: "Build", note: "Code & integrations", tools: ["react", "typescript", "python"], duration: 7 },
  { id: "ship", label: "Ship", note: "v1.0 is live", tools: ["docker", "aws"], duration: 6.5 },
];
const STARTS = STAGES.reduce<number[]>((acc, stage, i) => [...acc, i ? acc[i - 1] + STAGES[i - 1].duration : 0], []);
const TOTAL = STARTS[2] + STAGES[2].duration;
/** Drawings crossfade over this long; captions leave a little later. */
const CROSS = 0.6;
const CAP_OUT = 0.4;
/** The finished frame of a stage: just before it starts to fade out. */
const composed = (i: number) => STARTS[i] + STAGES[i].duration - CROSS - 0.05;

const SHAPES = {
  circle: "M320 42 C412.8 42 488 117.2 488 210 C488 302.8 412.8 378 320 378 C227.2 378 152 302.8 152 210 C152 117.2 227.2 42 320 42 Z",
  editor: "M162 104 H478 V316 H162 Z",
  wide: "M320 30 C484 30 612 110 612 210 C612 310 484 390 320 390 C156 390 28 310 28 210 C28 110 156 30 320 30 Z",
  panel: "M80 100 H560 V320 H80 Z",
};

const CODE = [
  [0, 140],
  [16, 176],
  [16, 118],
  [32, 150],
  [16, 92],
  [0, 58],
] as const;
const NODES = [
  { label: "Frontend", x: 60, y: 70 },
  { label: "API", x: 476, y: 70 },
  { label: "Database", x: 60, y: 306 },
  { label: "Cloud", x: 476, y: 306 },
];
const LINKS = [
  "M257 186 C216 186 206 92 164 92",
  "M383 186 C424 186 434 92 476 92",
  "M257 234 C216 234 206 328 164 328",
  "M383 234 C424 234 434 328 476 328",
];
const CHECKS = ["CI pipeline", "QA on staging", "Deploy"];

const mono = { fontFamily: "var(--font-mono)", textTransform: "uppercase" as const, letterSpacing: "0.08em" };
const thin = { vectorEffect: "non-scaling-stroke" as const };

/**
 * Design, build, ship: one canvas, three short line drawings on one looping
 * timeline, with a backdrop silhouette that morphs between them. Design and
 * Shipped pop up on the left, Build on the right. It loops without stopping,
 * resting only while the browser tab is hidden.
 *
 * The markup alone is the finished Ship frame, which is what visitors without
 * JS or with reduced motion see.
 */
const SPEED = 1.6;

export function HeroStages({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const master = useRef<gsap.core.Timeline | null>(null);
  const reduced = useRef(false);

  const sync = () => {
    if (reduced.current) return;
    if (!document.hidden) master.current?.play();
    else master.current?.pause();
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, still: MOTION_REDUCED }, (context) => {
        const still = Boolean(context.conditions?.still);
        reduced.current = still;
        const q = gsap.utils.selector(root);
        const [design, build, ship] = q("[data-stage]");
        const num = q("[data-num]")[0];
        const counter = { v: 98 };

        const tl = gsap.timeline({
          repeat: -1,
          paused: true,
          defaults: { ease: "power3.inOut" },
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(counter.v));
          },
        });

        /*
         * Stage roots, backdrop and captions. Each drawing crossfades with the
         * next, Ship back into Design across the loop too, and every drawing
         * resets while it is invisible, so no frame ever jumps.
         */
        const cards = STAGES.map((stage) => q(`[data-cap="${stage.id}"]`)[0]);
        const roots = [design, build, ship];
        tl.set([build, ship], { autoAlpha: 0 }, 0)
          .set(design, { autoAlpha: 1 }, 0)
          .set(q("[data-backdrop]"), { morphSVG: SHAPES.circle }, 0)
          .set(cards, { autoAlpha: 0 }, 0)
          .set(q("[data-cap-check]"), { drawSVG: "0%" }, 0);
        roots.forEach((stage, i) => {
          const end = STARTS[i] + STAGES[i].duration;
          const next = roots[(i + 1) % roots.length];
          tl.to(stage, { autoAlpha: 0, duration: CROSS, ease: "sine.inOut" }, end - CROSS).fromTo(
            next,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: CROSS, ease: "sine.inOut", immediateRender: false },
            end - CROSS,
          );

          /* Design pops up on the left, Build on the right; Shipped pops up in the middle once the release is live. */
          const at = STARTS[i] + 0.2;
          tl.fromTo(
            cards[i],
            { autoAlpha: 0, scale: 0.9, y: 10, filter: "blur(6px)" },
            { autoAlpha: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "expo.out", immediateRender: false },
            at,
          )
            .fromTo(
              cards[i].querySelectorAll("[data-cap-icon]"),
              { scale: 0.7, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.45, stagger: 0.06, ease: "back.out(2)", immediateRender: false },
              at + 0.12,
            )
            .to(cards[i], { autoAlpha: 0, scale: 0.96, filter: "blur(4px)", duration: 0.3, ease: "power2.out" }, end - CAP_OUT);
        });
        tl.to(q("[data-cap-check]"), { drawSVG: "100%", duration: 0.4, ease: "power2.out" }, STARTS[2] + 0.55);
        const morph = { duration: CROSS + 0.3, ease: "sine.inOut" };
        tl.to(q("[data-backdrop]"), { morphSVG: SHAPES.editor, ...morph }, STARTS[1] - CROSS)
          .to(q("[data-backdrop]"), { morphSVG: SHAPES.wide, duration: 0.8, ease: "sine.inOut" }, STARTS[1] + 3.2)
          .to(q("[data-backdrop]"), { morphSVG: SHAPES.panel, ...morph }, STARTS[2] - CROSS)
          .to(q("[data-backdrop]"), { morphSVG: SHAPES.circle, ...morph, duration: CROSS }, TOTAL - CROSS);

        /* Design: a card is wireframed, its button is picked, and it hardens into the finished component. */
        let s = STARTS[0];
        const cursor = q("[data-d-cursor]");
        /* Reset at the start and again while hidden, before it fades back in at the end of the loop. */
        [0, STARTS[2]].forEach((at) => {
          tl.set(q("[data-d-wire]"), { autoAlpha: 0, scale: 0.94, transformOrigin: "50% 50%" }, at)
            .set(q("[data-d-wbar]"), { scaleX: 0, autoAlpha: 1, transformOrigin: "0% 50%" }, at)
            .set(q("[data-d-solid]"), { autoAlpha: 0 }, at)
            .set(q("[data-d-pick]"), { autoAlpha: 0 }, at)
            .set(q("[data-d-float]"), { autoAlpha: 0, y: 10 }, at)
            .set(cursor, { x: 470, y: 330, autoAlpha: 0, scale: 1, transformOrigin: "0% 0%" }, at)
            .set(q("[data-d-ring]"), { rotation: 0, svgOrigin: "320 210" }, at);
        });
        tl.to(q("[data-d-ring]"), { rotation: 36, duration: STAGES[0].duration, ease: "none" }, s)
          .to(q("[data-d-wire]"), { autoAlpha: 1, scale: 1, duration: 0.6, ease: "expo.out" }, s + 0.2)
          .to(q("[data-d-wbar]"), { scaleX: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }, s + 0.55)
          .to(q("[data-d-float]"), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.25, ease: "expo.out" }, s + 1.1)
          .to(cursor, { autoAlpha: 1, duration: 0.2, ease: "none" }, s + 1.7)
          .to(cursor, { x: 288, y: 262, duration: 0.9 }, s + 1.7)
          .to(cursor, { scale: 0.86, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" }, s + 2.65)
          .to(q("[data-d-pick]"), { autoAlpha: 1, duration: 0.2, ease: "none" }, s + 2.7)
          .to(q("[data-d-solid]"), { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, s + 3.1)
          .to(q("[data-d-wbar]"), { autoAlpha: 0, duration: 0.4, ease: "none" }, s + 3.1)
          .to(q("[data-d-wire]"), { autoAlpha: 0.3, duration: 0.4, ease: "none" }, s + 3.1)
          .to(cursor, { x: 430, y: 310, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, s + 3.6);

        /* Build: the code types in, the editor shrinks to a hub, and it wires up to four services. */
        s = STARTS[1];
        const lines = q("[data-b-line]");
        const caret = q("[data-b-caret]");
        tl.set(q("[data-b-editor]"), { scale: 1, svgOrigin: "320 210" }, 0)
          .set(lines, { scaleX: 0, transformOrigin: "0% 50%" }, 0)
          .set(caret, { autoAlpha: 1, x: 192, y: 150 }, 0)
          .set(q("[data-b-node]"), { autoAlpha: 0, scale: 0.9, transformOrigin: "50% 50%" }, 0)
          .set(q("[data-b-link]"), { drawSVG: "0%" }, 0)
          .set(q("[data-b-packet]"), { autoAlpha: 0 }, 0)
          .set(q("[data-b-done]"), { scale: 0.5, autoAlpha: 0, transformOrigin: "50% 50%" }, 0);
        CODE.forEach(([indent, width], i) => {
          const at = s + 0.3 + i * 0.42;
          tl.to(lines[i], { scaleX: 1, duration: 0.36, ease: "power1.out" }, at).to(
            caret,
            { x: 192 + indent + width + 4, y: 150 + i * 24, duration: 0.36, ease: "power1.out" },
            at,
          );
        });
        tl.to(caret, { autoAlpha: 0, duration: 0.2, ease: "none" }, s + 3)
          .to(q("[data-b-editor]"), { scale: 0.42, duration: 0.8 }, s + 3.2)
          .to(q("[data-b-link]"), { drawSVG: "100%", duration: 0.6, stagger: 0.08 }, s + 3.7)
          .to(q("[data-b-node]"), { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.8)" }, s + 3.9);
        q("[data-b-packet]").forEach((packet, i) => {
          const at = s + 4.5 + i * 0.14;
          tl.to(packet, { autoAlpha: 1, duration: 0.12, ease: "none" }, at)
            .fromTo(
              packet,
              { motionPath: { path: LINKS[i], start: 0, end: 0 } },
              { motionPath: { path: LINKS[i], start: 0, end: 1 }, duration: 0.8, ease: "power2.inOut", immediateRender: false },
              at,
            )
            .to(packet, { autoAlpha: 0, duration: 0.12, ease: "none" }, at + 0.72)
            .to(q("[data-b-done]")[i], { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.6)" }, at + 0.75);
        });

        /* Ship: the checklist ticks, the deploy goes live, the score lands. */
        s = STARTS[2];
        tl.set(q("[data-s-card]"), { autoAlpha: 0, y: 10 }, 0)
          .set(q("[data-s-box]"), { autoAlpha: 0 }, 0)
          .set(q("[data-s-check]"), { drawSVG: "0%" }, 0)
          .set(q("[data-s-bar]"), { scaleX: 0, transformOrigin: "0% 50%" }, 0)
          .set(q("[data-s-deploying]"), { autoAlpha: 1 }, 0)
          .set(q("[data-s-live]"), { autoAlpha: 0 }, 0)
          .set(q("[data-s-ripple]"), { autoAlpha: 0, scale: 1, transformOrigin: "50% 50%" }, 0)
          .set(q("[data-s-ring]"), { drawSVG: "0%" }, 0)
          .set(counter, { v: 0 }, 0)
          .to(q("[data-s-card]"), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.18, ease: "power3.out" }, s + 0.1)
          .to(q("[data-s-bar]"), { scaleX: 1, duration: 2.2, ease: "power1.inOut" }, s + 0.9);
        q("[data-s-box]").forEach((box, i) => {
          const at = s + 1 + i * 0.7;
          tl.to(box, { autoAlpha: 1, duration: 0.2, ease: "none" }, at).to(
            q("[data-s-check]")[i],
            { drawSVG: "100%", duration: 0.3, ease: "power2.out" },
            at + 0.1,
          );
        });
        tl.to(q("[data-s-deploying]"), { autoAlpha: 0, duration: 0.2, ease: "none" }, s + 3.1)
          .to(q("[data-s-live]"), { autoAlpha: 1, duration: 0.3, ease: "none" }, s + 3.2)
          .fromTo(
            q("[data-s-ripple]"),
            { scale: 1, autoAlpha: 0 },
            {
              keyframes: { scale: [1, 2.2, 3.6], autoAlpha: [0, 0.7, 0], easeEach: "sine.out" },
              duration: 1.4,
              ease: "none",
              immediateRender: false,
            },
            s + 3.2,
          )
          .to(q("[data-s-ring]"), { drawSVG: "0% 98%", duration: 1.1, ease: "power2.out" }, s + 3.4)
          .to(counter, { v: 98, duration: 1.1, ease: "power2.out" }, s + 3.4);

        master.current = tl;

        if (still) {
          tl.seek(composed(2), false);
          return () => {
            master.current = null;
          };
        }

        tl.timeScale(SPEED).seek(0, false);
        sync();

        return () => {
          master.current = null;
        };
      });
    },
    { scope: root },
  );

  useEffect(() => {
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <div
      ref={root}
      className={`relative mx-auto grid w-fit lg:w-full lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-8 ${className}`}
    >
      <div className="relative justify-self-center lg:col-start-2 lg:row-start-1">
        <div
          id="hero-stage"
          role="img"
          aria-label="Animation: a product is designed, built, and shipped, on a loop."
          className="aspect-[640/420] w-[min(calc(100vw-2.5rem),23rem,calc((100svh-32rem)*640/420))] min-w-[15rem]"
        >
          <Canvas />
        </div>
      </div>

      {/* Design and Shipped share the left slot, one shown at a time. Below lg all three share one spot, centred on the drawing's bottom edge. */}
      <div className="absolute bottom-0 left-1/2 z-10 grid -translate-x-1/2 translate-y-1/2 lg:static lg:col-start-1 lg:row-start-1 lg:translate-0 lg:justify-self-end">
        {[STAGES[0], STAGES[2]].map((stage) => (
          <SideCaption
            key={stage.id}
            stage={stage}
            className="col-start-1 row-start-1 items-start justify-self-center text-left lg:items-end lg:justify-self-end lg:text-right"
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 lg:static lg:col-start-3 lg:row-start-1 lg:translate-0 lg:justify-self-start">
        <SideCaption stage={STAGES[1]} className="items-end text-right lg:items-start lg:text-left" />
      </div>
    </div>
  );
}

function ToolTile({ tool }: { tool: Tool }) {
  return (
    <span data-cap-icon className="flex h-4 items-center justify-center">
      <Image
        src={asset(`/icons/${tool}.svg`)}
        alt=""
        width={TOOLS[tool].w}
        height={TOOLS[tool].h}
        className={`h-auto max-h-4 w-auto max-w-[21px] ${tool === "aws" ? "brightness-0 invert light:brightness-100 light:invert-0" : ""}`}
      />
    </span>
  );
}

/*
 * Plain text beside the drawing, hidden until the timeline shows it. Below lg it is one
 * line: logos, name, note.
 * Under reduced motion Shipped stays, the finished frame.
 */
function SideCaption({ stage, className }: { stage: (typeof STAGES)[number]; className: string }) {
  const ship = stage.id === "ship";
  return (
    <div
      data-cap={stage.id}
      aria-hidden="true"
      className={`flex flex-col max-lg:flex-row max-lg:items-center max-lg:gap-2 max-lg:whitespace-nowrap ${ship ? "motion-safe:invisible motion-safe:opacity-0" : "invisible opacity-0"} ${className}`}
    >
      <span className="flex items-center gap-2">
        {ship && (
          <span data-cap-icon className="flex h-4 items-center text-emerald-500">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path data-cap-check d="M5 12.5 L10 17.5 L19 7" />
            </svg>
          </span>
        )}
        {stage.tools.map((tool) => (
          <ToolTile key={tool} tool={tool} />
        ))}
      </span>
      <span className="mt-2.5 max-lg:mt-0 text-[clamp(0.9375rem,1.05vw,1rem)] leading-none font-medium tracking-[-0.02em] text-ink">
        {ship ? "Shipped" : stage.label}
      </span>
      <span className="label mt-1 text-[0.5625rem] whitespace-nowrap max-lg:mt-0 max-lg:ml-0.5 text-faint">{stage.note}</span>
    </div>
  );
}

function Text({
  x,
  y,
  children,
  size = 10,
  anchor = "start",
  className = "fill-faint",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
  className?: string;
}) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} stroke="none" className={className} style={mono}>
      {children}
    </text>
  );
}

function Canvas() {
  return (
    <svg viewBox="0 0 640 420" className="size-full overflow-visible" fill="none" stroke="currentColor" aria-hidden="true">
      <path data-backdrop d={SHAPES.panel} className="fill-surface" strokeOpacity="0.14" {...thin} />

      {/* Design */}
      <g data-stage opacity="0">
        <circle data-d-ring cx="320" cy="210" r="190" strokeOpacity="0.3" strokeDasharray="1 7" {...thin} />
        <Text x={230} y={130}>Card / v2</Text>
        <Text x={410} y={130} anchor="end">
          360 × 280
        </Text>
        <g data-d-wire>
          <rect x="230" y="140" width="180" height="140" strokeOpacity="0.6" strokeDasharray="4 4" className="fill-bg" {...thin} />
        </g>
        {[
          [246, 156, 148, 44],
          [246, 212, 96, 8],
          [246, 228, 130, 5],
          [246, 240, 104, 5],
          [246, 256, 56, 14],
        ].map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} data-d-wbar x={x} y={y} width={w} height={h} fill="currentColor" fillOpacity="0.14" stroke="none" />
        ))}
        <g data-d-solid>
          <rect x="230" y="140" width="180" height="140" strokeOpacity="0.85" className="fill-bg" {...thin} />
          <rect x="246" y="156" width="148" height="44" fill="currentColor" fillOpacity="0.07" strokeOpacity="0.25" {...thin} />
          <path d="M256 196 L282 172 L300 188 L314 178 L384 196 Z" fill="currentColor" fillOpacity="0.16" stroke="none" />
          <circle cx="368" cy="170" r="5" fill="currentColor" fillOpacity="0.4" stroke="none" />
          <rect x="246" y="212" width="96" height="8" fill="currentColor" fillOpacity="0.9" stroke="none" />
          <rect x="246" y="228" width="130" height="5" fill="currentColor" fillOpacity="0.4" stroke="none" />
          <rect x="246" y="240" width="104" height="5" fill="currentColor" fillOpacity="0.4" stroke="none" />
          <rect x="246" y="256" width="56" height="14" fill="currentColor" stroke="none" />
        </g>
        <g data-d-pick>
          <rect x="243" y="253" width="62" height="20" className="stroke-motion" {...thin} />
          {[
            [243, 253],
            [305, 253],
            [243, 273],
            [305, 273],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 2.5} y={y - 2.5} width="5" height="5" className="fill-bg stroke-motion" {...thin} />
          ))}
        </g>
        <g data-d-float>
          <rect x="98" y="150" width="96" height="64" className="fill-bg" strokeOpacity="0.3" {...thin} />
          <Text x={110} y={170}>Tokens</Text>
          <rect x="110" y="182" width="14" height="14" fill="currentColor" stroke="none" />
          <rect x="130" y="182" width="14" height="14" className="fill-muted" stroke="none" />
          <rect x="150" y="182" width="14" height="14" className="fill-line" strokeOpacity="0.3" {...thin} />
          <rect x="170" y="182" width="14" height="14" className="fill-motion" stroke="none" />
        </g>
        <g data-d-float>
          <rect x="446" y="196" width="96" height="64" className="fill-bg" strokeOpacity="0.3" {...thin} />
          <text x="458" y="230" fontSize="22" fill="currentColor" stroke="none" style={{ fontFamily: "var(--font-sans)" }}>
            Aa
          </text>
          <Text x={458} y={248}>Type 16 / 24</Text>
        </g>
        <path
          data-d-cursor
          d="M0 0 L0 17 L4.6 12.6 L8 20 L11 18.8 L7.6 11.6 L13.6 11.6 Z"
          className="fill-motion stroke-bg"
          strokeWidth="1"
          opacity="0"
        />
      </g>

      {/* Build */}
      <g data-stage opacity="0">
        {LINKS.map((d) => (
          <path key={d} data-b-link d={d} strokeOpacity="0.35" {...thin} />
        ))}
        {NODES.map(({ label, x, y }) => (
          <g key={label} data-b-node>
            <rect x={x} y={y} width="104" height="44" className="fill-bg" strokeOpacity="0.6" {...thin} />
            <Text x={x + 12} y={y + 26} size={11} className="fill-current">
              {label}
            </Text>
            <rect x={x + 84} y={y + 18} width="8" height="8" strokeOpacity="0.4" {...thin} />
            <rect data-b-done x={x + 84} y={y + 18} width="8" height="8" className="fill-motion" stroke="none" />
          </g>
        ))}
        <g data-b-editor>
          <rect x="170" y="112" width="300" height="196" className="fill-bg" strokeOpacity="0.7" {...thin} />
          <line x1="170" y1="136" x2="470" y2="136" strokeOpacity="0.3" {...thin} />
          {[186, 196, 206].map((cx) => (
            <circle key={cx} cx={cx} cy="124" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="none" />
          ))}
          <Text x={460} y={127} anchor="end">
            api / auth.ts
          </Text>
          {CODE.map(([indent, width], i) => (
            <rect
              key={i}
              data-b-line
              x={192 + indent}
              y={153 + i * 24}
              width={width}
              height="6"
              fill="currentColor"
              fillOpacity={i % 3 === 0 ? 0.8 : 0.4}
              stroke="none"
            />
          ))}
          <rect data-b-caret width="2" height="12" className="fill-motion" stroke="none" opacity="0" />
        </g>
        {LINKS.map((d) => (
          <circle key={d} data-b-packet r="3" className="fill-motion" stroke="none" opacity="0" />
        ))}
      </g>

      {/* Ship: the markup is its finished frame */}
      <g data-stage>
        <g data-s-card>
          <rect x="96" y="118" width="224" height="184" className="fill-bg" strokeOpacity="0.7" {...thin} />
          <Text x={114} y={145} size={11} className="fill-current">
            Release
          </Text>
          <Text x={302} y={145} anchor="end">
            v1.0
          </Text>
          <line x1="96" y1="160" x2="320" y2="160" strokeOpacity="0.2" {...thin} />
          {CHECKS.map((label, i) => {
            const y = 190 + i * 38;
            return (
              <g key={label}>
                <rect x="114" y={y - 10} width="14" height="14" strokeOpacity="0.45" {...thin} />
                <rect data-s-box x="114" y={y - 10} width="14" height="14" fill="currentColor" stroke="none" />
                <path data-s-check d={`M117.5 ${y - 3} l3.2 3.2 l5.8 -6.4`} className="stroke-bg" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <Text x={142} y={y + 1} size={11} className="fill-current">
                  {label}
                </Text>
              </g>
            );
          })}
        </g>
        <g data-s-card>
          <rect x="336" y="118" width="208" height="76" className="fill-bg" strokeOpacity="0.7" {...thin} />
          <text x="354" y="148" fontSize="15" fontWeight="500" fill="currentColor" stroke="none" style={{ fontFamily: "var(--font-sans)" }}>
            v1.0
          </text>
          <Text x={526} y={146} anchor="end">
            <tspan data-s-deploying opacity="0">Deploying</tspan>
          </Text>
          <g data-s-live>
            <Text x={526} y={146} anchor="end" className="fill-motion">
              Live
            </Text>
            <circle data-s-ripple cx="490" cy="143" r="3" className="stroke-motion" opacity="0" {...thin} />
            <circle cx="490" cy="143" r="3" className="fill-motion" stroke="none" />
          </g>
          <line x1="354" y1="172" x2="526" y2="172" strokeOpacity="0.2" {...thin} />
          <rect data-s-bar x="354" y="171" width="172" height="2" className="fill-motion" stroke="none" />
        </g>
        <g data-s-card>
          <rect x="336" y="210" width="208" height="92" className="fill-bg" strokeOpacity="0.7" {...thin} />
          <circle cx="380" cy="256" r="24" strokeOpacity="0.15" strokeWidth="2" />
          <circle data-s-ring cx="380" cy="256" r="24" className="stroke-motion" strokeWidth="2" transform="rotate(-90 380 256)" />
          <text
            data-num
            x="380"
            y="261"
            fontSize="14"
            fontWeight="500"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            98
          </text>
          <Text x={420} y={252} size={11} className="fill-current">
            Lighthouse
          </Text>
          <Text x={420} y={268}>Performance</Text>
        </g>
      </g>
    </svg>
  );
}
