# Contact verification and visit counter

The Astro site is static on GitHub Pages. This Cloudflare Worker is the small API companion for the public visit count and verified contact flow.

## Setup

1. Create a Cloudflare account and install Wrangler (`npm install --global wrangler`).
2. From this folder, create a KV namespace: `npx wrangler kv namespace create PORTFOLIO_KV`.
3. Put the returned namespace ID in `wrangler.toml` in place of `REPLACE_WITH_KV_NAMESPACE_ID`.
4. Configure these Worker secrets/variables:
   - `RESEND_API_KEY` (secret): API key from Resend.
   - `FROM_EMAIL` (variable): sender on a domain verified with Resend, e.g. `Portfolio <hello@yourdomain.com>`.
   - `SITE_ORIGIN` (variable): the site origin only, e.g. `https://mcjh0n.github.io` (no repository path).
5. Deploy with `npx wrangler deploy`.
6. In GitHub repository Settings → Secrets and variables → Actions → Variables, add `PUBLIC_API_BASE` with the Worker URL, e.g. `https://john-mark-portfolio-api.<account>.workers.dev`.
7. Push to `main`; the Pages workflow rebuilds the site with the API URL.

The visitor enters a six-digit code sent to their email. The Worker sends the inquiry to John only after that code is correct. Codes expire after 10 minutes and have a five-attempt limit. Requests are rate-limited by IP. The visit count increments once per browser tab session. Cloudflare KV counters can be approximate during simultaneous requests.

Never put `RESEND_API_KEY` or other secrets in the public Astro site or GitHub Pages variables. Configure those only as Worker secrets. Until the Worker is configured, the form clearly directs visitors to the `mailto:` address and the visit count reports that setup is pending.
