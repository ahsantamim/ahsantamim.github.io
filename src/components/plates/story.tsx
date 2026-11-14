"use client";

import { useRef } from "react";
import { MOTION_OK, MOTION_REDUCED, gsap, useGSAP } from "@/lib/gsap";

/* The project's easing tokens: --ease-out-expo for entrances and exits, --ease-in-out-quart for travel. */
export const OUT_EASE = "expo.out";
export const TRAVEL = "power3.inOut";
const SPEED = 1.6;
/** Reduced motion plays the same story as fades only, a little slower. */
const REDUCED_SPEED = 0.9;
/** The first run waits for the plate's scroll draw-in. */
const LEAD = 1.4;

type Targets = gsap.TweenTarget;

export type Kit = {
  tl: gsap.core.Timeline;
  reduced: boolean;
  q: (selector: string) => Element[];
  /** Overlay elements by role, optionally one index: `[data-s-<name>]` or `[data-s-<name>="<k>"]`. */
  pick: (name: string, k?: number | string) => Element[];
  show: (targets: Targets, at: number, duration?: number) => void;
  hide: (targets: Targets, at: number) => void;
  pop: (targets: Targets, at: number) => void;
  draw: (targets: Targets, at: number, duration: number) => void;
  /** Bars that fill along one axis from their start edge, the gaps shrinking as they go. */
  fill: (targets: Targets, at: number, axis?: "x" | "y", amount?: number) => void;
  travel: (path: string, at: number, duration: number) => void;
  /** The cursor travels to (x, y) and presses; returns the press time. */
  click: (x: number, y: number, at: number) => number;
  caption: (index: number, at: number, end: number) => void;
  end: (at: number) => void;
};

/**
 * A plate's scripted loop in the hero's style. Every overlay element carries
 * `data-s` and starts hidden; the build function scripts one loop with the kit.
 * The loop plays only while the plate is on screen and the tab is visible.
 * Under reduced motion nothing travels or scales: the same story fades through its frames.
 */
export function useStory(build: (kit: Kit) => void) {
  const root = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, reduced: MOTION_REDUCED }, (context) => {
        const reduced = Boolean(context.conditions?.reduced);
        const group = root.current;
        const svg = group?.ownerSVGElement;
        if (!group || !svg) return;
        const q = gsap.utils.selector(group);
        const [packet, cursor] = [q("[data-s-packet]")[0], q("[data-s-cursor]")[0]];

        const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { duration: 0.5, ease: OUT_EASE } });
        tl.set(q("[data-s]"), { autoAlpha: 0 }, 0);

        const show: Kit["show"] = (targets, at, duration = 0.5) => {
          tl.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration, immediateRender: false }, at);
        };
        const kit: Kit = {
          tl,
          reduced,
          q,
          pick: (name, k) => q(k === undefined ? `[data-s-${name}]` : `[data-s-${name}="${k}"]`),
          show,
          hide: (targets, at) => {
            tl.to(targets, { autoAlpha: 0, duration: 0.3 }, at);
          },
          pop: (targets, at) => {
            if (reduced) return show(targets, at, 0.3);
            tl.fromTo(
              targets,
              { autoAlpha: 0, scale: 0.94, y: 6, transformOrigin: "50% 50%" },
              { autoAlpha: 1, scale: 1, y: 0, immediateRender: false },
              at,
            );
          },
          draw: (targets, at, duration) => {
            if (reduced) return show(targets, at, 0.3);
            tl.fromTo(
              targets,
              { drawSVG: "0%", autoAlpha: 1 },
              { drawSVG: "100%", duration, ease: TRAVEL, immediateRender: false },
              at,
            );
          },
          fill: (targets, at, axis = "x", amount = 0.14) => {
            if (reduced) return show(targets, at, 0.3);
            const prop = axis === "x" ? "scaleX" : "scaleY";
            tl.fromTo(
              targets,
              { [prop]: 0, autoAlpha: 1, transformOrigin: axis === "x" ? "0% 50%" : "50% 100%" },
              { [prop]: 1, duration: 0.45, stagger: { amount, ease: "power2.out" }, immediateRender: false },
              at,
            );
          },
          travel: (path, at, duration) => {
            if (reduced || !packet) return;
            tl.to(packet, { autoAlpha: 1, duration: 0.1, ease: "none" }, at)
              .fromTo(
                packet,
                { motionPath: { path, start: 0, end: 0 } },
                { motionPath: { path, start: 0, end: 1 }, duration, ease: TRAVEL, immediateRender: false },
                at,
              )
              .to(packet, { autoAlpha: 0, duration: 0.1, ease: "none" }, at + duration - 0.08);
          },
          click: (x, y, at) => {
            const press = at + 0.55;
            if (reduced || !cursor) return press;
            tl.set(cursor, { x: x + 42, y: y + 66, scale: 1, transformOrigin: "0% 0%" }, at)
              .to(cursor, { autoAlpha: 1, duration: 0.2 }, at)
              .to(cursor, { x, y, duration: 0.55, ease: TRAVEL }, at)
              .to(cursor, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }, press)
              .to(cursor, { autoAlpha: 0, duration: 0.3 }, press + 0.25);
            return press;
          },
          caption: (index, at, end) => {
            const caption = q("[data-s-cap]")[index];
            if (reduced) show(caption, at, 0.3);
            else tl.fromTo(caption, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, immediateRender: false }, at);
            tl.to(caption, { autoAlpha: 0, duration: 0.2 }, end);
          },
          end: (at) => {
            tl.set({}, {}, at);
          },
        };

        build(kit);
        tl.timeScale(reduced ? REDUCED_SPEED : SPEED).seek(0, false);
        gsap.set(group, { autoAlpha: 1 });

        let inView = false;
        let started = false;
        let lead: gsap.core.Tween | null = null;
        const sync = () => {
          if (!inView || document.hidden) {
            lead?.kill();
            lead = null;
            tl.pause();
          } else if (started) {
            tl.play();
          } else if (!lead) {
            lead = gsap.delayedCall(reduced ? 0 : LEAD, () => {
              started = true;
              tl.play();
            });
          }
        };
        const observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          sync();
        });
        observer.observe(svg);
        document.addEventListener("visibilitychange", sync);

        return () => {
          observer.disconnect();
          document.removeEventListener("visibilitychange", sync);
          lead?.kill();
        };
      });
    },
    { scope: root },
  );

  return root;
}

/* ───────────── Shared overlay parts ───────────── */

export const thin = { vectorEffect: "non-scaling-stroke" as const };
const code = { fontFamily: "var(--font-mono)", letterSpacing: "0.4px" };
const caps = { fontFamily: "var(--font-mono)", textTransform: "uppercase" as const, letterSpacing: "1.2px" };
/** Overlay elements outside the finished frame start at opacity 0 in the markup. */
export const vis = (on: boolean) => (on ? undefined : 0);
/** `data-s` plus its role, as spreadable props. */
export const role = (name: string, k: number | string | true = true) => ({ "data-s": true, [`data-s-${name}`]: k });

/** The story layer. The markup is the finished frame, hidden until the loop takes over. */
export function StoryLayer({ root, children }: { root: React.RefObject<SVGGElement | null>; children: React.ReactNode }) {
  return (
    <g ref={root} className="motion-safe:invisible" aria-hidden="true">
      {children}
    </g>
  );
}

/** One caption per step across the top of the plate; the last is the finished frame's. */
export function Captions({ steps }: { steps: readonly { label: string; note: string }[] }) {
  return steps.map((step, i) => (
    <g key={step.label} {...role("cap")} opacity={vis(i === steps.length - 1)}>
      <text x={74} y={30} fontSize="12" className="fill-motion" stroke="none" style={caps}>
        {String(i + 1).padStart(2, "0")}
      </text>
      <text x={102} y={30} fontSize="12" fill="currentColor" stroke="none" style={caps}>
        {step.label}
      </text>
      <text x={726} y={30} fontSize="12" textAnchor="end" className="fill-faint" stroke="none" style={caps}>
        {step.note}
      </text>
    </g>
  ));
}

/** A code-style chip: a framed line of mono text, centred on `cx`. */
export function Chip({
  name,
  k,
  x,
  y,
  width,
  text,
  on = false,
  children,
}: {
  name: string;
  k?: number | string;
  x: number;
  y: number;
  width: number;
  text: string;
  on?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <g {...role(name, k)} opacity={vis(on)}>
      {children}
      <rect x={x} y={y} width={width} height={30} className="fill-bg stroke-motion" {...thin} />
      <text x={x + width / 2} y={y + 20} fontSize="12" textAnchor="middle" fill="currentColor" stroke="none" style={code}>
        {text}
      </text>
    </g>
  );
}

/** A frame that lights a box: motion stroke and a faint tint. */
export function Highlight({ name, k, x, y, width, height, on = false }: { name: string; k?: number | string; x: number; y: number; width: number; height: number; on?: boolean }) {
  return (
    <rect
      {...role(name, k)}
      x={x}
      y={y}
      width={width}
      height={height}
      className="fill-motion/10 stroke-motion"
      strokeWidth="1.5"
      opacity={vis(on)}
      {...thin}
    />
  );
}

/** A motion-coloured copy of a connector that draws as the request travels it. */
export function Wire({ name, k, d, on = false }: { name: string; k?: number | string; d: string; on?: boolean }) {
  return <path {...role(name, k)} d={d} className="stroke-motion" strokeWidth="1.5" opacity={vis(on)} {...thin} />;
}

/** A filled check badge. */
export function Check({ name, k, cx, cy, on = false }: { name: string; k?: number | string; cx: number; cy: number; on?: boolean }) {
  return (
    <g {...role(name, k)} opacity={vis(on)}>
      <circle cx={cx} cy={cy} r={9} className="fill-motion" stroke="none" />
      <path d={`M${cx - 4.5} ${cy + 0.5} l3 3 l5.5 -6`} className="stroke-bg" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export function Packet() {
  return (
    <g {...role("packet")} opacity="0">
      <circle r={8} className="fill-motion" fillOpacity={0.22} stroke="none" />
      <circle r={2.75} className="fill-motion" stroke="none" />
    </g>
  );
}

export function Cursor() {
  return (
    <path
      {...role("cursor")}
      d="M0 0 L0 17 L4.6 12.6 L8 20 L11 18.8 L7.6 11.6 L13.6 11.6 Z"
      className="fill-motion stroke-bg"
      strokeWidth="1"
      opacity="0"
    />
  );
}
