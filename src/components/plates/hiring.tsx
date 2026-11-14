"use client";

import { D, Label, S } from "@/components/plates/parts";
import { Captions, Check, Cursor, Highlight, Packet, StoryLayer, Wire, role, useStory, vis } from "@/components/plates/story";

const CARDS = [90, 152, 214, 276];
const center = (y: number) => y + 22;
const apply = (y: number) => `M190 ${center(y)} H215 V220 H240`;
const TO_MCQ = "M410 220 H445";
const TO_INTERVIEW = "M565 220 H600";
const ROWS = [340, 370, 400];
const shortlist = (n: number) => `M675 250 V${ROWS[n] + 10}`;
const SQUARES = [477, 499, 521];

const STEPS = [
  { label: "Apply", note: "Candidate profile" },
  { label: "Screen", note: "OpenRouter · GPT" },
  { label: "MCQ", note: "Automated test" },
  { label: "Interview", note: "AI interview" },
  { label: "Shortlist", note: "Ready for the recruiter" },
];
const CAPTION_AT = [0, 0.9, 2.2, 3.3, 4.6];
const OUT = 6.2;
const RUN = 6.8;
/** Candidates take turns; each one who passes joins the shortlist. */
const ORDER = [0, 2, 1];
const SCORE = [0.86, 0.72, 0.92];
/** The candidate of the finished frame. */
const STILL = ORDER[ORDER.length - 1];

/**
 * Synchro Hire's AI hiring pipeline: candidates apply, AI screening scores
 * them (with Redis caching the API), an automated MCQ test and an AI
 * interview follow, and each candidate who passes joins the shortlist.
 */
export function Hiring() {
  return (
    <>
      <Label x={50} y={74} anchor="start" dim>Candidates</Label>
      {CARDS.map((y) => (
        <g key={y}>
          <rect {...S} x={50} y={y} width={140} height={44} />
          <circle {...S} cx={72} cy={center(y)} r={9} strokeOpacity="0.6" />
          <rect data-fade x={90} y={y + 15} width={72} height={5} fill="currentColor" fillOpacity="0.5" stroke="none" />
          <rect data-fade x={90} y={y + 26} width={50} height={4} fill="currentColor" fillOpacity="0.25" stroke="none" />
          <path {...S} d={`M190 ${center(y)} H215`} strokeOpacity="0.55" />
        </g>
      ))}
      <path {...S} d={`M215 ${center(CARDS[0])} V${center(CARDS[3])}`} strokeOpacity="0.55" />
      <path {...S} d="M215 220 H240" strokeOpacity="0.55" />

      <rect {...S} x={240} y={190} width={170} height={60} />
      <Label x={325} y={213}>AI screening</Label>
      <Label x={325} y={232} dim>OpenRouter · GPT</Label>
      <rect data-fade x={256} y={241} width={138} height={2} className="fill-line" stroke="none" />
      <path {...S} d={TO_MCQ} strokeOpacity="0.55" />
      <rect {...S} x={445} y={190} width={120} height={60} />
      <Label x={505} y={213}>MCQ test</Label>
      {SQUARES.map((x) => (
        <rect key={x} {...S} x={x} y={226} width={12} height={12} strokeOpacity="0.5" />
      ))}
      <path {...S} d={TO_INTERVIEW} strokeOpacity="0.55" />
      <rect {...S} x={600} y={190} width={150} height={60} />
      <Label x={675} y={213}>AI interview</Label>

      <path {...S} d="M675 250 V300" strokeOpacity="0.55" />
      <rect {...S} x={600} y={300} width={150} height={140} />
      <Label x={675} y={466} dim>Shortlist</Label>

      <path {...D} d="M325 250 V320" strokeDasharray="4 6" strokeOpacity="0.5" />
      <rect {...S} x={240} y={320} width={170} height={56} />
      <Label x={325} y={344}>Redis</Label>
      <Label x={325} y={364} dim>API cache</Label>

      <HiringStory />
    </>
  );
}

function HiringStory() {
  const root = useStory(({ tl, reduced, q, pick, show, hide, pop, draw, fill, travel, click, caption, end }) => {
    ORDER.forEach((k, n) => {
      const b = n * RUN;
      const y = CARDS[k];
      tl.addLabel(`candidate-${n + 1}`, b);
      CAPTION_AT.forEach((at, i) => caption(i, b + at, b + (i < CAPTION_AT.length - 1 ? CAPTION_AT[i + 1] - 0.2 : OUT)));

      /* Apply: the candidate's profile goes to screening. */
      show(pick("card", k), click(120, center(y), b + 0.1), 0.3);
      draw(pick("apply", k), b + CAPTION_AT[1], 0.6);
      travel(apply(y), b + CAPTION_AT[1], 0.6);

      /* Screen: the model scores the profile; the cache answers alongside it. */
      show(pick("screen"), b + 1.45, 0.3);
      fill(pick("score", k), b + 1.55, "x");
      show(pick("cache"), b + 1.55, 0.3);
      hide(pick("cache"), b + 2.2);

      /* MCQ: the answers check off as the candidate lands. */
      draw(pick("to-mcq"), b + CAPTION_AT[2], 0.35);
      travel(TO_MCQ, b + CAPTION_AT[2], 0.35);
      fill(pick("answer"), b + 2.5, "y", 0.3);

      /* Interview: question, then answer. */
      draw(pick("to-interview"), b + CAPTION_AT[3], 0.35);
      travel(TO_INTERVIEW, b + CAPTION_AT[3], 0.35);
      pop(pick("ask"), b + 3.7);
      pop(pick("reply"), b + 4.05);

      /* Shortlist: a new row lands, and the candidate is checked off. */
      draw(pick("to-short", n), b + CAPTION_AT[4], 0.5);
      travel(shortlist(n), b + CAPTION_AT[4], 0.5);
      pop(pick("row", n), b + 5.05);
      pop(pick("passed", k), b + 5.1);
      if (!reduced) draw(q(`[data-s-passed="${k}"] path`), b + 5.25, 0.3);

      hide(
        [
          ...pick("card", k),
          ...pick("apply", k),
          ...pick("score", k),
          ...pick("passed", k),
          ...pick("to-short", n),
          ...pick("screen"),
          ...pick("answer"),
          ...pick("ask"),
          ...pick("reply"),
          ...pick("to-mcq"),
          ...pick("to-interview"),
        ],
        b + OUT,
      );
    });
    hide(pick("row"), (ORDER.length - 1) * RUN + OUT);
    end(ORDER.length * RUN);
  });

  return (
    <StoryLayer root={root}>
      <Captions steps={STEPS} />
      {CARDS.map((y, k) => (
        <g key={y}>
          <Highlight name="card" k={k} x={50} y={y} width={140} height={44} on={k === STILL} />
          <Wire name="apply" k={k} d={apply(y)} on={k === STILL} />
          <Check name="passed" k={k} cx={190} cy={y} on={k === STILL} />
          {ORDER.includes(k) && (
            <rect
              {...role("score", k)}
              x={256}
              y={240.5}
              width={138 * SCORE[ORDER.indexOf(k)]}
              height={3}
              className="fill-motion"
              stroke="none"
              opacity={vis(k === STILL)}
            />
          )}
        </g>
      ))}
      <rect {...role("screen")} x={240} y={190} width={170} height={60} className="fill-motion" fillOpacity="0.12" stroke="none" />
      <Highlight name="cache" x={240} y={320} width={170} height={56} />
      <Wire name="to-mcq" d={TO_MCQ} on />
      <Wire name="to-interview" d={TO_INTERVIEW} on />
      {SQUARES.map((x) => (
        <rect key={x} {...role("answer")} x={x} y={226} width={12} height={12} className="fill-motion" stroke="none" />
      ))}
      <rect {...role("ask")} x={614} y={224} width={60} height={10} className="fill-faint" stroke="none" />
      <rect {...role("reply")} x={678} y={237} width={58} height={10} className="fill-motion" fillOpacity="0.7" stroke="none" />
      {ROWS.map((y, n) => (
        <g key={y}>
          <Wire name="to-short" k={n} d={shortlist(n)} on={n === ORDER.length - 1} />
          <g {...role("row", n)}>
            <circle cx={624} cy={y + 10} r={7} className="stroke-motion" vectorEffect="non-scaling-stroke" />
            <rect x={638} y={y + 6} width={92} height={4} fill="currentColor" fillOpacity="0.8" stroke="none" />
            <rect x={638} y={y + 14} width={60} height={3} className="fill-faint" stroke="none" />
          </g>
        </g>
      ))}
      <Packet />
      <Cursor />
    </StoryLayer>
  );
}
