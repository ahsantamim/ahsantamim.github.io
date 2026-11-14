"use client";

import { TENANT_X, branch, inbound, outbound } from "@/components/plates/tenants-geometry";
import { Captions, Check, Chip, Cursor, Highlight, Packet, StoryLayer, TRAVEL, Wire, role, thin, useStory, vis } from "@/components/plates/story";

const STEPS = [
  { label: "Sign in", note: "Tenant user" },
  { label: "API call", note: "Refine data provider" },
  { label: "Resolve tenant", note: "FastAPI dependency" },
  { label: "Scoped query", note: "Tenant rows only" },
  { label: "Typed response", note: "Back to the same tenant" },
];

/** The request's legs inside one tenant's run. Everything else lands on one of their arrivals. */
const LEG = {
  inbound: { at: 0.9, dur: 0.75 },
  gate: { at: 2, dur: 0.4 },
  store: { at: 2.8, dur: 0.6 },
  back: { at: 3.8, dur: 0.5 },
  home: { at: 4.45, dur: 0.7 },
};
const arrive = (leg: keyof typeof LEG) => LEG[leg].at + LEG[leg].dur;
/** Captions change as the request sets off on each leg. */
const CAPTION_AT = [0, LEG.inbound.at, LEG.gate.at, LEG.store.at, LEG.back.at];
const OUT = 5.8;
const RUN = 6.4;
/** Tenants take turns in this order: B, D, A, E, C. */
const ORDER = [1, 3, 0, 4, 2];
/** The tenant of the finished frame. */
const STILL = 1;

/**
 * The multi-tenant plate's story. One tenant at a time signs in, its request
 * travels through the shared application, the tenant scope stamps it, only
 * that tenant's store answers (the others stay locked), and the response
 * returns to the same tenant.
 */
export function TenantsStory() {
  const root = useStory(({ tl, reduced, q, pick, show, hide, pop, draw, fill, travel, click, caption, end }) => {
    const [request, response, gate] = [pick("request"), pick("response"), pick("gate")];
    ORDER.forEach((k, n) => {
      const b = n * RUN;
      const x = TENANT_X[k];
      tl.addLabel(`tenant-${String.fromCharCode(65 + k)}`, b);
      CAPTION_AT.forEach((at, i) => caption(i, b + at, b + (i < CAPTION_AT.length - 1 ? CAPTION_AT[i + 1] - 0.2 : OUT)));

      /* Sign in: the card lights with the press. */
      show(pick("hl", k), click(x + 14, 84, b + 0.1), 0.3);

      /* API call: the chip lands as the request reaches the app. */
      draw(pick("wire", k), b + LEG.inbound.at, LEG.inbound.dur);
      travel(inbound(x), b + LEG.inbound.at, LEG.inbound.dur);
      pop(request, b + arrive("inbound") - 0.05);
      hide(request, b + LEG.gate.at);

      /* Resolve tenant: the gate and the stamp land together, on arrival. */
      travel("M400 288 V330", b + LEG.gate.at, LEG.gate.dur);
      show(gate, b + arrive("gate") - 0.05, 0.4);
      pop(pick("scope", k), b + arrive("gate") - 0.05);
      tl.to(gate, { autoAlpha: 0.4, duration: 0.6, ease: TRAVEL }, b + arrive("gate") + 0.4);

      /* Scoped query: the other stores lock as the request passes the fork; rows fill as it lands. */
      draw(pick("branch", k), b + LEG.store.at, LEG.store.dur);
      travel(`M400 370 V400 H${x} V428`, b + LEG.store.at, LEG.store.dur);
      show(q(`[data-s-lock]:not([data-s-lock="${k}"])`), b + LEG.store.at + 0.2, 0.4);
      fill(q(`[data-s-rows="${k}"] rect`), b + arrive("store") - 0.05);
      show(pick("rows", k), b + arrive("store") - 0.05, 0.1);

      /* Typed response: the chip leaves the app with it; the check lands with it at home. */
      travel(`M${x} 428 V400 H400 V370`, b + LEG.back.at, LEG.back.dur);
      travel(outbound(x), b + LEG.home.at, LEG.home.dur);
      pop(response, b + LEG.home.at);
      pop(pick("check", k), b + arrive("home") - 0.05);
      if (!reduced) draw(q(`[data-s-check="${k}"] path`), b + arrive("home") + 0.1, 0.3);

      hide(
        [
          ...response,
          ...gate,
          ...["hl", "wire", "branch", "scope", "rows", "check"].flatMap((name) => pick(name, k)),
          ...pick("lock"),
        ],
        b + OUT,
      );
    });
    end(ORDER.length * RUN);
  });

  return (
    <StoryLayer root={root}>
      <Captions steps={STEPS} />

      {TENANT_X.map((x, k) => (
        <g key={x}>
          <Wire name="wire" k={k} d={inbound(x)} on={k === STILL} />
          <Wire name="branch" k={k} d={branch(x)} on={k === STILL} />
          <Highlight name="hl" k={k} x={x - 46} y={56} width={92} height={48} on={k === STILL} />
          <Check name="check" k={k} cx={x + 46} cy={56} on={k === STILL} />
          <g {...role("rows", k)} className="fill-motion" opacity={vis(k === STILL)}>
            <rect x={x - 36} y={433} width={72} height={3} />
            <rect x={x - 36} y={439} width={52} height={3} />
            <rect x={x - 36} y={445} width={62} height={3} />
          </g>
          <g {...role("lock", k)} className="text-faint" opacity={vis(k !== STILL)}>
            <path d={`M${x - 3.5} 437 v-3 a3.5 3.5 0 0 1 7 0 v3`} stroke="currentColor" strokeWidth="1.2" {...thin} />
            <rect x={x - 5.5} y={437} width={11} height={8} fill="currentColor" stroke="none" />
          </g>
          <Chip name="scope" k={k} x={112} y={335} width={172} text={`tenant_id = ${String.fromCharCode(65 + k)}`} on={k === STILL}>
            <line x1={284} y1={350} x2={300} y2={350} className="stroke-motion" {...thin} />
          </Chip>
        </g>
      ))}

      <rect {...role("gate")} x={300} y={330} width={200} height={40} className="fill-motion" fillOpacity="0.12" stroke="none" opacity={0.4} />

      <Chip name="request" x={596} y={227} width={176} text="GET /subscriptions">
        <line x1={580} y1={242} x2={596} y2={242} className="stroke-motion" {...thin} />
      </Chip>
      <Chip name="response" x={596} y={227} width={176} text="200 · tenant rows" on>
        <line x1={580} y1={242} x2={596} y2={242} className="stroke-motion" {...thin} />
      </Chip>

      <Packet />
      <Cursor />
    </StoryLayer>
  );
}
