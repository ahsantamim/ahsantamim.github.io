"use client";

import { useRef } from "react";
import { FINE_POINTER, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * Contextual cursor label. The system cursor is never hidden: this adds a
 * small disc (blended, so it reads on dark and on inverted rows) that follows the pointer and names the action ("View Project",
 * "Read") over any element carrying `data-cursor="…"`.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = root.current;
    const discEl = disc.current;
    const labelEl = label.current;
    if (!el || !discEl || !labelEl) return;
    const mm = gsap.matchMedia();

    mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
      gsap.set(discEl, { scale: 0, xPercent: -50, yPercent: -50 });
      let current: string | null = null;

      const show = (text: string) => {
        labelEl.textContent = text;
        gsap.to(discEl, { scale: 1, duration: 0.45, ease: "expo.out", overwrite: true });
      };
      const hide = () => {
        gsap.to(discEl, { scale: 0, duration: 0.3, ease: "power2.out", overwrite: true });
      };

      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        xTo(event.clientX);
        yTo(event.clientY);
        const target = (event.target as Element | null)?.closest?.("[data-cursor]");
        const next = target?.getAttribute("data-cursor") ?? null;
        if (next !== current) {
          current = next;
          if (next) show(next);
          else hide();
        }
      };
      const out = () => {
        current = null;
        hide();
      };

      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", out);
      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", out);
      };
    });
  });

  return (
    <div ref={root} className="cursor mix-blend-difference" aria-hidden="true">
      <div
        ref={disc}
        className="flex size-24 scale-0 items-center justify-center rounded-full bg-white text-black"
      >
        <span ref={label} className="label max-w-20 text-center text-[0.625rem] leading-tight" />
      </div>
    </div>
  );
}
