import type { Diagram } from "@/data/projects";
import { LiveSvg } from "@/components/live-svg";
import { TENANT_X } from "@/components/plates/tenants-geometry";
import { TenantsStory } from "@/components/plates/tenants-story";
import { D, Label, S } from "@/components/plates/parts";
import { Settlement } from "@/components/plates/settlement";
import { Search } from "@/components/plates/search";
import { Hiring } from "@/components/plates/hiring";

/**
 * Project "plates": schematic line drawings of each project's architecture or
 * workflow. They stand in for screenshots, which cannot be shown for
 * confidential work, and they are drawn from the workflow in the data file,
 * so they describe the real shape of the system and invent nothing.
 *
 * Strokes carry `data-stroke` (drawn on scroll), labels carry `data-fade`.
 * Each drawing ends with a live layer that loops only while the plate is on
 * screen: a scripted story in the hero's style (tenants, settlement, search,
 * hiring), or ambient packets, flowing dashes and spinners (the rest).
 */

/* ───────────── Live layer pieces ───────────── */

function Live({ children }: { children: React.ReactNode }) {
  return <g data-fade>{children}</g>;
}

/** A glowing packet that travels along `d` on a loop (driven by LiveSvg). */
function Packet({ d, dur = 2.4, delay = 0, linear = false }: { d: string; dur?: number; delay?: number; linear?: boolean }) {
  return (
    <g
      className="packet"
      opacity="0"
      data-packet
      data-path={d}
      data-dur={dur}
      data-delay={delay}
      data-linear={linear || undefined}
    >
      <circle r={8} className="fill-motion" fillOpacity={0.22} stroke="none" />
      <circle r={2.75} className="fill-motion" stroke="none" />
    </g>
  );
}

/** Dashes streaming along a connector, drawn over the static line. */
function Flow({ d, reverse = false }: { d: string; reverse?: boolean }) {
  return (
    <path
      d={d}
      className="flow stroke-motion"
      data-flow
      data-reverse={reverse || undefined}
      strokeDasharray="3 13"
      strokeOpacity={0.9}
      vectorEffect="non-scaling-stroke"
    />
  );
}

function Spinner({
  cx,
  cy,
  r,
  dash = "4 6",
  reverse = false,
  dur = 14,
  opacity = 0.7,
}: {
  cx: number;
  cy: number;
  r: number;
  dash?: string;
  reverse?: boolean;
  dur?: number;
  opacity?: number;
}) {
  return (
    <circle
      data-spin
      data-reverse={reverse || undefined}
      data-dur={dur}
      cx={cx}
      cy={cy}
      r={r}
      className="stroke-motion"
      strokeDasharray={dash}
      strokeOpacity={opacity}
      vectorEffect="non-scaling-stroke"
    />
  );
}

function Ripple({ cx, cy, delay = 0 }: { cx: number; cy: number; delay?: number }) {
  return <circle data-ripple data-delay={delay} cx={cx} cy={cy} r={6} className="stroke-motion" opacity="0" vectorEffect="non-scaling-stroke" />;
}

/* ───────────── Drawings ───────────── */

function Tenants() {
  const tenants = TENANT_X;
  return (
    <>
      {tenants.map((x, i) => (
        <g key={x}>
          <rect {...S} x={x - 46} y={56} width={92} height={48} />
          <Label x={x} y={85} dim>{`Tenant ${String.fromCharCode(65 + i)}`}</Label>
          <path {...S} d={`M${x} 104 V150 Q${x} 176 ${x < 400 ? x + 26 : x > 400 ? x - 26 : x} 176 H400`} strokeOpacity="0.55" />
        </g>
      ))}
      <line {...S} x1={400} y1={176} x2={400} y2={212} />
      <rect {...S} x={220} y={212} width={360} height={76} />
      <Label x={400} y={246}>Shared application</Label>
      <Label x={400} y={268} dim>React · Refine · FastAPI</Label>
      <line {...S} x1={400} y1={288} x2={400} y2={330} />
      <rect {...D} data-march x={300} y={330} width={200} height={40} strokeDasharray="5 5" />
      <Label x={400} y={355} dim>Tenant scope</Label>
      <line {...S} x1={400} y1={370} x2={400} y2={400} />
      {tenants.map((x) => (
        <g key={x}>
          <path {...S} d={`M400 400 H${x} V416`} strokeOpacity="0.55" />
          <rect {...S} x={x - 46} y={416} width={92} height={36} />
          <line {...S} x1={x - 46} y1={428} x2={x + 46} y2={428} strokeOpacity="0.4" />
        </g>
      ))}
      <Label x={400} y={480} dim>Isolated data per tenant</Label>

      <TenantsStory />
    </>
  );
}

function Ledger() {
  const steps = ["Transaction", "Financing", "Schedule", "Payments", "Reconciled"];
  const bars = [1, 1, 1, 0.55, 0, 0];
  return (
    <>
      {steps.map((step, i) => {
        const x = 96 + i * 152;
        return (
          <g key={step}>
            <circle {...S} cx={x} cy={130} r={30} />
            <circle data-fade cx={x} cy={130} r={5} fill="currentColor" stroke="none" fillOpacity={i < 4 ? 1 : 0.35} />
            {i < steps.length - 1 && <line {...S} x1={x + 30} y1={130} x2={x + 122} y2={130} strokeOpacity="0.6" />}
            <Label x={x} y={196} dim={i !== 2}>{step}</Label>
          </g>
        );
      })}
      <path {...S} d="M400 208 V262 H120 V290" strokeOpacity="0.5" />
      <path {...S} d="M400 262 H680 V290" strokeOpacity="0.5" />
      <rect {...S} x={96} y={290} width={608} height={132} />
      {bars.map((paid, i) => {
        const x = 124 + i * 96;
        return (
          <g key={i}>
            <rect {...S} x={x} y={318} width={72} height={76} strokeOpacity="0.6" />
            {paid > 0 && (
              <rect
                data-fade
                data-breathe={paid < 1 || undefined}
                x={x}
                y={318 + 76 * (1 - paid)}
                width={72}
                height={76 * paid}
                fill="currentColor"
                fillOpacity="0.9"
                stroke="none"
              />
            )}
          </g>
        );
      })}
      <Label x={96} y={452} anchor="start" dim>Installment schedule</Label>
      <Label x={704} y={452} anchor="end" dim>Paid / due</Label>

      <Live>
        {steps.slice(0, -1).map((step, i) => (
          <Flow key={step} d={`M${126 + i * 152} 130 H${218 + i * 152}`} />
        ))}
        <Packet d="M96 130 H704" dur={5} linear />
        <Packet d="M96 130 H704" dur={5} delay={2.5} linear />
        <Spinner cx={400} cy={130} r={40} dash="2 7" />
        <Ripple cx={400} cy={130} />
        <Packet d="M400 208 V262 H120 V290" dur={2.8} />
        <Packet d="M400 208 V262 H680 V290" dur={2.8} delay={1.4} />
      </Live>
    </>
  );
}

function Pipeline() {
  const top = ["Requirement", "Test cases", "Review"];
  const bottom = ["Retest", "Report", "Execute"];
  const loop = "M150 120 H650 V380 H150 Z";
  return (
    <>
      {top.map((label, i) => {
        const x = 150 + i * 250;
        return (
          <g key={label}>
            <rect
              {...(i === 2 ? D : S)}
              data-march={i === 2 || undefined}
              x={x - 92}
              y={84}
              width={184}
              height={72}
              strokeDasharray={i === 2 ? "5 5" : undefined}
            />
            <Label x={x} y={126}>{label}</Label>
            {i < 2 && <line {...S} x1={x + 92} y1={120} x2={x + 158} y2={120} strokeOpacity="0.6" />}
          </g>
        );
      })}
      <Label x={650} y={72} dim>Person</Label>
      <path {...S} d="M650 156 V344" strokeOpacity="0.6" />
      {bottom.map((label, i) => {
        const x = 150 + i * 250;
        return (
          <g key={label}>
            <rect
              {...(i === 1 ? D : S)}
              data-march={i === 1 || undefined}
              x={x - 92}
              y={344}
              width={184}
              height={72}
              strokeDasharray={i === 1 ? "5 5" : undefined}
            />
            <Label x={x} y={386}>{label}</Label>
            {i < 2 && <line {...S} x1={x + 92} y1={380} x2={x + 158} y2={380} strokeOpacity="0.6" />}
          </g>
        );
      })}
      <Label x={400} y={440} dim>Person confirms</Label>
      <Label x={650} y={440} dim>Agent + browser</Label>
      <path {...S} d="M150 344 V156" strokeOpacity="0.6" />
      <circle {...S} cx={400} cy={250} r={44} />
      <circle {...S} cx={400} cy={250} r={18} strokeOpacity="0.5" />
      <circle data-fade cx={400} cy={250} r={4} fill="currentColor" stroke="none" />
      <Label x={400} y={318} dim>AI agent</Label>

      <Live>
        <Flow d="M242 120 H308" />
        <Flow d="M492 120 H558" />
        <Flow d="M650 156 V344" />
        <Flow d="M558 380 H492" />
        <Flow d="M308 380 H242" />
        <Flow d="M150 344 V156" />
        <Packet d={loop} dur={9} linear />
        <Packet d={loop} dur={9} delay={4.5} linear />
        <Spinner cx={400} cy={250} r={58} dash="2 9" opacity={0.6} />
        <Spinner cx={400} cy={250} r={30} dash="10 6" reverse dur={9} opacity={0.8} />
        <Ripple cx={400} cy={250} />
        <Ripple cx={400} cy={250} delay={1.2} />
      </Live>
    </>
  );
}

function Stack() {
  return (
    <>
      <rect {...S} x={70} y={60} width={660} height={380} strokeOpacity="0.45" />
      <Label x={90} y={88} anchor="start" dim>AWS</Label>
      <rect {...D} data-march x={120} y={112} width={360} height={280} strokeDasharray="5 5" />
      <Label x={140} y={140} anchor="start" dim>Docker</Label>
      <rect {...S} x={160} y={164} width={280} height={84} />
      <Label x={300} y={202}>Django application</Label>
      <Label x={300} y={224} dim>Gunicorn</Label>
      <rect {...S} x={160} y={276} width={280} height={84} strokeOpacity="0.6" />
      <Label x={300} y={323} dim>Environment config</Label>
      <line {...S} x1={440} y1={206} x2={540} y2={206} />
      <path {...S} d="M540 176 a70 18 0 0 0 140 0 a70 18 0 0 0 -140 0 V316 a70 18 0 0 0 140 0 V176" />
      <path {...S} data-blink d="M540 222 a70 18 0 0 0 140 0" strokeOpacity="0.5" />
      <path {...S} data-blink data-delay={0.6} d="M540 268 a70 18 0 0 0 140 0" strokeOpacity="0.5" />
      <Label x={610} y={366}>PostgreSQL</Label>
      <path {...S} d="M300 20 V60" strokeOpacity="0.6" />
      <Label x={316} y={38} anchor="start" dim>Git push · image build</Label>

      <Live>
        <Packet d="M300 20 V164" dur={2.6} />
        <Flow d="M300 20 V60" />
        <Flow d="M440 206 H540" />
        <Packet d="M440 206 H540" dur={1.6} />
        <Packet d="M540 206 H440" dur={1.6} delay={0.8} />
        <Spinner cx={412} cy={186} r={10} dash="3 4" />
      </Live>
    </>
  );
}

const diagrams: Record<Diagram, () => React.ReactNode> = {
  tenants: Tenants,
  settlement: Settlement,
  search: Search,
  hiring: Hiring,
  ledger: Ledger,
  pipeline: Pipeline,
  stack: Stack,
};

const titles: Record<Diagram, string> = {
  tenants: "Diagram: several tenants share one application, with data isolated per tenant.",
  settlement:
    "Diagram: a buyer orders on deferred terms, operations approve it, the supplier is paid upfront, and the buyer repays on a schedule until NSBH settles it.",
  search:
    "Diagram: articles published in the CMS land in PostgreSQL and sync to Elasticsearch, where readers search across the full archive.",
  hiring:
    "Diagram: candidates pass AI screening, an automated MCQ test and an AI interview before joining the shortlist, with Redis caching the API.",
  ledger: "Diagram: a transaction moves from financing to an installment schedule, payments, and reconciliation.",
  pipeline: "Diagram: an AI agent drafts and executes test cases, with a person reviewing before and after.",
  stack: "Diagram: a Django application in a Docker container on AWS, connected to PostgreSQL.",
};

export function ProjectPlate({
  diagram,
  parallax = true,
  bare = false,
  className = "",
}: {
  diagram: Diagram;
  parallax?: boolean;
  /** No frame, ground or fixed ratio: the drawing fills a cell that already draws the lines. */
  bare?: boolean;
  className?: string;
}) {
  const Drawing = diagrams[diagram];
  return (
    <div className={`${bare ? "relative overflow-hidden" : "plate aspect-[8/5]"} ${className}`}>
      <div className="plate-inner absolute inset-0">
        <div className="absolute inset-[5%]" data-parallax={parallax ? "4" : undefined}>
          <LiveSvg
            viewBox="0 0 800 500"
            role="img"
            aria-label={titles[diagram]}
            className="size-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <Drawing />
          </LiveSvg>
        </div>
      </div>
    </div>
  );
}
