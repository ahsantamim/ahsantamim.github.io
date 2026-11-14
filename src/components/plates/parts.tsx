/** Strokes carry `data-stroke` (drawn on scroll); labels and dashed shapes carry `data-fade`. */
export const S = { "data-stroke": true, vectorEffect: "non-scaling-stroke" as const };
/** Dashed shapes fade in: drawing a stroke would replace its dash pattern. */
export const D = { "data-fade": true, vectorEffect: "non-scaling-stroke" as const };

export function Label({
  x,
  y,
  children,
  anchor = "middle",
  dim = false,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
  dim?: boolean;
}) {
  return (
    <text
      data-fade
      x={x}
      y={y}
      textAnchor={anchor}
      fill="currentColor"
      className={dim ? "fill-muted" : undefined}
      stroke="none"
      fontSize="13"
      letterSpacing="1.2"
      style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
    >
      {children}
    </text>
  );
}
