/**
 * Read-only bridge between the portfolio's /analytics page and Cloudflare's
 * GraphQL Analytics API. The browser never sees the API token: it calls this
 * Worker, which returns aggregate counts only (no per-visitor data).
 *
 *   GET /summary           public: visit and view totals for the last 90 days
 *   GET /?range=7|30|90    full report, needs `Authorization: Bearer <PIN>`
 */

interface Env {
  CF_API_TOKEN: string;
  /** PIN that unlocks the full report (Worker secret). */
  ANALYTICS_PASSWORD: string;
  CF_ACCOUNT_ID: string;
  CF_SITE_TAG: string;
  ALLOWED_ORIGINS: string;
}

type Count = { key: string; count: number };
type Day = { date: string; views: number; visits: number };

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

const RANGES = [7, 30, 90] as const;
const CACHE_MS = 10 * 60 * 1000;
const TOP = 8;
// Cloudflare currently answers long ranges with nothing until its rollups
// catch up, so every range is fetched in week-long pieces and summed here.
const CHUNK_DAYS = 7;
const DAY_MS = 86_400_000;

const QUERY = /* GraphQL */ `
  query Site($account: String!, $filter: AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject!) {
    viewer {
      accounts(filter: { accountTag: $account }) {
        daily: rumPageloadEventsAdaptiveGroups(limit: 10, filter: $filter, orderBy: [date_ASC]) {
          count
          sum { visits }
          dimensions { date }
        }
        pages: rumPageloadEventsAdaptiveGroups(limit: 25, filter: $filter, orderBy: [count_DESC]) {
          count
          dimensions { key: requestPath }
        }
        referrers: rumPageloadEventsAdaptiveGroups(limit: 25, filter: $filter, orderBy: [count_DESC]) {
          count
          dimensions { key: refererHost }
        }
        countries: rumPageloadEventsAdaptiveGroups(limit: 25, filter: $filter, orderBy: [count_DESC]) {
          count
          dimensions { key: countryName }
        }
        devices: rumPageloadEventsAdaptiveGroups(limit: 10, filter: $filter, orderBy: [count_DESC]) {
          count
          dimensions { key: deviceType }
        }
        browsers: rumPageloadEventsAdaptiveGroups(limit: 25, filter: $filter, orderBy: [count_DESC]) {
          count
          dimensions { key: userAgentBrowser }
        }
      }
    }
  }
`;

type Group = { count: number; sum?: { visits: number }; dimensions: { key?: string; date?: string } };
type ChunkResult = Record<"daily" | "pages" | "referrers" | "countries" | "devices" | "browsers", Group[]>;

const isoDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

async function queryChunk(env: Env, from: string, to: string): Promise<ChunkResult> {
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.CF_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        account: env.CF_ACCOUNT_ID,
        filter: {
          siteTag: env.CF_SITE_TAG,
          date_geq: from,
          date_leq: to,
          bot: 0,
          requestHost_neq: "localhost",
        },
      },
    }),
  });
  if (!response.ok) throw new Error(`Cloudflare API responded ${response.status}`);
  const json = (await response.json()) as {
    data?: { viewer: { accounts: ChunkResult[] } };
    errors?: { message: string }[] | null;
  };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  const account = json.data?.viewer.accounts[0];
  if (!account) throw new Error("Account not found");
  return account;
}

function mergeTop(
  chunks: ChunkResult[],
  field: Exclude<keyof ChunkResult, "daily">,
  emptyLabel: string,
  skip: string[] = [],
): Count[] {
  const totals = new Map<string, number>();
  for (const chunk of chunks) {
    for (const group of chunk[field]) {
      const key = group.dimensions.key || emptyLabel;
      if (skip.includes(key)) continue;
      totals.set(key, (totals.get(key) ?? 0) + group.count);
    }
  }
  return [...totals]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP);
}

const ownHosts = (env: Env) =>
  env.ALLOWED_ORIGINS.split(",").map((origin) => new URL(origin.trim()).hostname);

async function build(env: Env, range: number): Promise<AnalyticsPayload> {
  const todayStart = Date.parse(isoDate(Date.now()));
  const firstDay = todayStart - (range - 1) * DAY_MS;

  const spans: [string, string][] = [];
  for (let start = firstDay; start <= todayStart; start += CHUNK_DAYS * DAY_MS) {
    const end = Math.min(start + (CHUNK_DAYS - 1) * DAY_MS, todayStart);
    spans.push([isoDate(start), isoDate(end)]);
  }
  const chunks = await Promise.all(spans.map(([from, to]) => queryChunk(env, from, to)));

  const byDate = new Map<string, Day>();
  for (let day = firstDay; day <= todayStart; day += DAY_MS) {
    const date = isoDate(day);
    byDate.set(date, { date, views: 0, visits: 0 });
  }
  for (const chunk of chunks) {
    for (const group of chunk.daily) {
      const day = group.dimensions.date && byDate.get(group.dimensions.date);
      if (!day) continue;
      day.views += group.count;
      day.visits += group.sum?.visits ?? 0;
    }
  }
  const daily = [...byDate.values()];

  return {
    range,
    from: isoDate(firstDay),
    to: isoDate(todayStart),
    totals: {
      views: daily.reduce((sum, day) => sum + day.views, 0),
      visits: daily.reduce((sum, day) => sum + day.visits, 0),
    },
    daily,
    pages: mergeTop(chunks, "pages", "/"),
    // Moving between the site's own pages is not a referral.
    referrers: mergeTop(chunks, "referrers", "Direct", ownHosts(env)),
    countries: mergeTop(chunks, "countries", "Unknown"),
    devices: mergeTop(chunks, "devices", "Unknown"),
    browsers: mergeTop(chunks, "browsers", "Unknown"),
    generatedAt: new Date().toISOString(),
  };
}

// The Cache API is unavailable on workers.dev, so each isolate keeps its own
// short-lived copy and shares one in-flight request per range.
const cache = new Map<number, { at: number; body: Promise<AnalyticsPayload> }>();

function getPayload(env: Env, range: number) {
  const hit = cache.get(range);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.body;
  const body = build(env, range);
  cache.set(range, { at: Date.now(), body });
  body.catch(() => cache.delete(range));
  return body;
}

function corsHeaders(env: Env, origin: string | null): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((value) => value.trim());
  if (!origin || !allowed.includes(origin)) return { Vary: "Origin" };
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization",
    Vary: "Origin",
  };
}

// A short PIN can be guessed, so each address gets a few wrong tries per
// window. Per isolate only: a speed bump, not a vault.
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; since: number }>();

function isLocked(ip: string) {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.since > LOCK_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function recordFailure(ip: string) {
  const entry = failures.get(ip);
  if (entry && Date.now() - entry.since <= LOCK_MS) entry.count += 1;
  else failures.set(ip, { count: 1, since: Date.now() });
}

function pinMatches(env: Env, header: string | null) {
  const given = header?.replace(/^Bearer\s+/i, "") ?? "";
  const expected = env.ANALYTICS_PASSWORD ?? "";
  if (!expected || given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(env, request.headers.get("Origin"));
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: cors });

    const url = new URL(request.url);

    try {
      if (url.pathname === "/summary") {
        const { totals, from, to, generatedAt } = await getPayload(env, 90);
        return Response.json(
          { ...totals, from, to, generatedAt },
          { headers: { ...cors, "Cache-Control": "public, max-age=300" } },
        );
      }

      const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
      if (isLocked(ip)) {
        return Response.json({ error: "Too many wrong attempts. Try again in 15 minutes." }, { status: 429, headers: cors });
      }
      if (!pinMatches(env, request.headers.get("Authorization"))) {
        recordFailure(ip);
        return Response.json({ error: "Wrong password." }, { status: 401, headers: cors });
      }
      failures.delete(ip);

      const requested = Number(url.searchParams.get("range") ?? 30);
      const range = (RANGES as readonly number[]).includes(requested) ? requested : 30;
      const payload = await getPayload(env, range);
      return Response.json(payload, {
        headers: { ...cors, "Cache-Control": "private, no-store" },
      });
    } catch (error) {
      console.error(error);
      return Response.json({ error: "Analytics are unavailable right now." }, { status: 502, headers: cors });
    }
  },
};
