# portfolio-analytics

A small Cloudflare Worker that serves the numbers behind `/analytics`. It holds
the Cloudflare API token, asks the GraphQL Analytics API for Web Analytics data,
caches the answer for 10 minutes, and returns totals only.

```bash
npx wrangler login                       # once
npx wrangler secret put CF_API_TOKEN        # token with Account Analytics: Read only
npx wrangler secret put ANALYTICS_PASSWORD  # PIN for the full report
npx wrangler deploy
```

Local: put `CF_API_TOKEN=...` and `ANALYTICS_PASSWORD=...` in `.dev.vars` (gitignored) and run `npx wrangler dev`.

`GET /summary` is public and returns only visit and view totals for 90 days.
The full report (`GET /?range=7|30|90`) needs `Authorization: Bearer <PIN>` and returns
totals, a daily series, and top pages, referrers, countries, devices and browsers.
