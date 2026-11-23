/** The response of analytics-worker (keep in step with analytics-worker/src/index.ts). */
export type Count = { key: string; count: number };
export type Day = { date: string; views: number; visits: number };

export type AnalyticsPayload = {
  range: number;
  from: string;
  to: string;
  totals: { views: number; visits: number };
  daily: Day[];
  pages: Count[];
  referrers: Count[];
  countries: Count[];
  devices: Count[];
  browsers: Count[];
  generatedAt: string;
};

export const RANGES = [7, 30, 90] as const;
export type Range = (typeof RANGES)[number];
