"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

const num = (el: Element, key: string, fallback = 0) => Number(el.getAttribute(`data-${key}`)) || fallback;
const flag = (el: Element, key: string) => el.hasAttribute(`data-${key}`);

/**
 * An SVG whose children opt into looping GSAP motion with data attributes:
 *
 *   data-packet data-path="M…"   rides the path, easing in and out (data-linear for constant speed)
 *   data-flow                    dashes stream along the stroke (data-reverse flips direction)
 *   data-march                   a dashed outline crawls around its shape
 *   data-spin                    a circle rotates about its centre (data-reverse, data-dur)
 *   data-ripple                  a ring expands and fades from its centre
 *   data-breathe                 a bar grows from its base and settles back
 *   data-blink                   a stroke brightens and dims
 *
 * data-dur and data-delay tune any of them. Everything plays only while the
 * SVG is on screen, and nothing is built for reduced-motion visitors.
 */
export function LiveSvg({ className = "", children, ...props }: React.SVGProps<SVGSVGElement>) {
  const svg = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const root = svg.current;
        if (!root) return;
        const q = gsap.utils.selector(root);
        const loops: gsap.core.Animation[] = [];
        const loop = (animation: gsap.core.Animation, delay = 0) => {
          animation.pause();
          if (delay) animation.totalTime(delay);
          loops.push(animation);
        };

        q("[data-packet]").forEach((el) => {
          const dur = num(el, "dur", 2.4);
          const fade = Math.min(0.3, dur * 0.12);
          gsap.set(el, { transformOrigin: "50% 50%" });
          const tl = gsap.timeline({ repeat: -1 });
          tl.to(el, {
            motionPath: { path: el.getAttribute("data-path") ?? "" },
            duration: dur,
            ease: flag(el, "linear") ? "none" : "power2.inOut",
          }, 0)
            .fromTo(el, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: fade, ease: "power2.out" }, 0)
            .to(el, { autoAlpha: 0, scale: 0.4, duration: fade, ease: "power2.in" }, dur - fade);
          loop(tl, num(el, "delay"));
        });

        q("[data-flow]").forEach((el) => {
          loop(
            gsap.fromTo(
              el,
              { strokeDashoffset: 0 },
              { strokeDashoffset: flag(el, "reverse") ? 32 : -32, duration: num(el, "dur", 1.1), ease: "none", repeat: -1 },
            ),
          );
        });

        q("[data-march]").forEach((el) => {
          loop(gsap.fromTo(el, { strokeDashoffset: 0 }, { strokeDashoffset: -20, duration: 1.4, ease: "none", repeat: -1 }));
        });

        q("[data-spin]").forEach((el) => {
          const origin = `${el.getAttribute("cx")} ${el.getAttribute("cy")}`;
          loop(
            gsap.to(el, {
              rotation: flag(el, "reverse") ? -360 : 360,
              svgOrigin: origin,
              duration: num(el, "dur", 14),
              ease: "none",
              repeat: -1,
            }),
          );
        });

        q("[data-ripple]").forEach((el) => {
          loop(
            gsap.fromTo(
              el,
              { scale: 1, autoAlpha: 0.8, transformOrigin: "50% 50%" },
              { scale: 5, autoAlpha: 0, duration: num(el, "dur", 2.4), ease: "expo.out", repeat: -1, repeatDelay: 0.4 },
            ),
            num(el, "delay"),
          );
        });

        q("[data-breathe]").forEach((el) => {
          loop(
            gsap.fromTo(
              el,
              { scaleY: 1, transformOrigin: "50% 100%" },
              { scaleY: 1.6, duration: num(el, "dur", 2.2), ease: "power3.inOut", repeat: -1, yoyo: true, repeatDelay: 0.6 },
            ),
          );
        });

        q("[data-blink]").forEach((el) => {
          loop(
            gsap.fromTo(
              el,
              { attr: { "stroke-opacity": 0.35 } },
              { attr: { "stroke-opacity": 1 }, duration: 0.9, ease: "sine.inOut", repeat: -1, yoyo: true },
            ),
            num(el, "delay"),
          );
        });

        const observer = new IntersectionObserver(([entry]) => {
          loops.forEach((animation) => (entry.isIntersecting ? animation.play() : animation.pause()));
        });
        observer.observe(root);

        return () => observer.disconnect();
      });
    },
    { scope: svg },
  );

  return (
    <svg ref={svg} className={`plate-live ${className}`} {...props}>
      {children}
    </svg>
  );
}
