"use client";

import { D, Label, S } from "@/components/plates/parts";
import { Captions, Check, Chip, Cursor, Highlight, Packet, StoryLayer, Wire, role, useStory } from "@/components/plates/story";

const ORDER = "M160 130 V230 H280";
const PAYOUT = "M520 230 H640 V130";
const REPAY = "M110 130 V375 H150";
const SETTLE = "M400 330 V270";
const CELLS = [0, 1, 2, 3, 4, 5].map((i) => 174 + i * 78);

const STEPS = [
  { label: "Order", note: "Deferred payment terms" },
  { label: "Approval", note: "Operations portal" },
  { label: "Payout", note: "Supplier paid upfront" },
  { label: "Repayment", note: "Buyer pays on schedule" },
  { label: "Settled", note: "NSBH reconciles" },
];
const CAPTION_AT = [0, 1.9, 2.9, 4.6, 6.6];
const OUT = 8.6;

/**
 * NSBH's B2B commerce flow: a buyer orders on deferred terms, operations
 * approve it, the supplier is paid upfront, the buyer repays on a schedule,
 * and NSBH settles the record.
 */
export function Settlement() {
  return (
    <>
      <rect {...S} x={70} y={70} width={180} height={60} />
      <Label x={160} y={97}>Buyer</Label>
      <Label x={160} y={117} dim>Partner portal</Label>
      <rect {...S} x={550} y={70} width={180} height={60} />
      <Label x={640} y={97}>Supplier</Label>
      <Label x={640} y={117} dim>Partner portal</Label>
      <path {...D} d="M250 100 H550" strokeDasharray="4 6" strokeOpacity="0.5" />
      <Label x={400} y={90} dim>Goods</Label>

      <path {...S} d={ORDER} strokeOpacity="0.55" />
      <path {...S} d={PAYOUT} strokeOpacity="0.55" />
      <rect {...S} x={280} y={190} width={240} height={80} />
      <Label x={400} y={226}>NSBH</Label>
      <Label x={400} y={250} dim>Operations portal</Label>

      <path {...S} d="M400 270 V330" strokeOpacity="0.55" />
      <path {...S} d={REPAY} strokeOpacity="0.55" />
      <rect {...S} x={150} y={330} width={500} height={90} />
      {CELLS.map((x) => (
        <rect key={x} {...S} x={x} y={352} width={62} height={46} strokeOpacity="0.5" />
      ))}
      <Label x={150} y={448} anchor="start" dim>Repayment schedule</Label>
      <Label x={650} y={448} anchor="end" dim>Paid / due</Label>

      <SettlementStory />
    </>
  );
}

function SettlementStory() {
  const root = useStory(({ reduced, q, pick, show, hide, pop, draw, fill, travel, click, caption, end }) => {
    CAPTION_AT.forEach((at, i) => caption(i, at, i < CAPTION_AT.length - 1 ? CAPTION_AT[i + 1] - 0.2 : OUT));

    /* Order: the buyer places it; it lands at NSBH with its terms. */
    show(pick("buyer"), click(172, 104, 0.1), 0.3);
    draw(pick("order"), 0.9, 0.8);
    travel(ORDER, 0.9, 0.8);
    pop(pick("order-chip"), 1.65);
    show(pick("hub"), 1.65, 0.4);

    /* Approval: the operations portal signs it off. */
    pop(pick("approved"), 2.3);
    if (!reduced) draw(q("[data-s-approved] path"), 2.4, 0.3);
    hide(pick("order-chip"), CAPTION_AT[2]);

    /* Payout: the supplier is paid before the buyer pays anything. */
    draw(pick("payout"), CAPTION_AT[2], 0.8);
    travel(PAYOUT, CAPTION_AT[2], 0.8);
    show(pick("supplier"), 3.65, 0.3);
    pop(pick("paid"), 3.65);

    /* Repayment: the buyer's instalments fill the schedule as the payment lands. */
    draw(pick("repay"), CAPTION_AT[3], 0.8);
    travel(REPAY, CAPTION_AT[3], 0.8);
    fill(pick("cell"), 5.35, "y", 0.9);

    /* Settled: the full schedule reports back to NSBH. */
    show(pick("schedule"), CAPTION_AT[4], 0.4);
    travel(SETTLE, CAPTION_AT[4], 0.5);
    pop(pick("settled"), 7.05);

    hide(q("[data-s]:not([data-s-cap]):not([data-s-packet]):not([data-s-cursor])"), OUT);
    end(OUT + 0.6);
  });

  return (
    <StoryLayer root={root}>
      <Captions steps={STEPS} />
      <Highlight name="buyer" x={70} y={70} width={180} height={60} on />
      <Highlight name="supplier" x={550} y={70} width={180} height={60} on />
      <rect {...role("hub")} x={280} y={190} width={240} height={80} className="fill-motion" fillOpacity="0.12" stroke="none" />
      <Highlight name="schedule" x={150} y={330} width={500} height={90} on />
      <Wire name="order" d={ORDER} on />
      <Wire name="payout" d={PAYOUT} on />
      <Wire name="repay" d={REPAY} on />
      {CELLS.map((x) => (
        <rect key={x} {...role("cell")} x={x} y={352} width={62} height={46} className="fill-motion" fillOpacity="0.85" stroke="none" />
      ))}
      <Chip name="order-chip" x={300} y={146} width={200} text="Order · deferred terms" />
      <Check name="approved" cx={520} cy={190} on />
      <Chip name="paid" x={660} y={160} width={120} text="Paid upfront" on />
      <Chip name="settled" x={420} y={285} width={110} text="Settled" on />
      <Packet />
      <Cursor />
    </StoryLayer>
  );
}