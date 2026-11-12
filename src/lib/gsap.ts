"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, MorphSVGPlugin, useGSAP);

/** All motion is created inside this query so reduced-motion users get the static page. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";
/** Hover-driven effects only run where there is a real pointer. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export const EASE = "expo.out";

export { gsap, ScrollTrigger, SplitText, useGSAP };
