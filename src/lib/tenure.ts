const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** A month as one number (year * 12 + month), so spans are plain subtraction. */
export type MonthIndex = number;

export function monthIndex(date: Date): MonthIndex {
  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

/** "Sep 2024" -> index; "Present" -> now. */
function parse(text: string, now: MonthIndex): MonthIndex {
  const [month, year] = text.trim().split(" ");
  if (!year) return now;
  return Number(year) * 12 + MONTHS.indexOf(month);
}

export type Tenure = { start: MonthIndex; end: MonthIndex; startYear: number; length: string };

/** Reads "Sep 2024 — Jan 2026" and counts both end months, as LinkedIn does. */
export function tenure(dates: string, now: MonthIndex): Tenure {
  const [from, to = "Present"] = dates.split("—");
  const start = parse(from, now);
  const end = parse(to, now);
  const total = Math.max(1, end - start + 1);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [years && `${years} yr${years > 1 ? "s" : ""}`, months && `${months} mo${months > 1 ? "s" : ""}`];
  return { start, end, startYear: Math.floor(start / 12), length: parts.filter(Boolean).join(" ") };
}
