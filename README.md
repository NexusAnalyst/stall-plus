# Stall Plus

Static StallPlus site for privacy guards, personal item protectors, and an automated privacy news feed.

## Local development

```sh
python3 -m http.server 5173
```

Open <http://localhost:5173/>.

## Refresh news locally

1. Copy `.env.example` to `.env` and add API keys.
2. Run:

```sh
npm run update-news
```

The script rewrites `data/why-stallplus-news.json`.

Run scoring tests:

```sh
npm run test:news
```

## Automated daily updates

GitHub Actions runs `npm run update-news` daily at 12:00 UTC and on manual dispatch. When the feed changes, the workflow commits to `main` and Vercel deploys the static site.

### Required GitHub Secrets

Add these repository secrets before the workflow can run:

- `NEWSAPI_AI_KEY`
- `NEWSDATA_KEY`
- `NEWSAPI_ORG_KEY`

Rotate any keys that were previously committed in source.

### Hybrid review workflow

The updater splits results into two buckets:

- **`articles`**: high-confidence matches (confidence >= 70 and category gate passed). Rendered on the public site.
- **`pendingReview`**: medium-confidence matches (40-69) or high-confidence items that failed a category gate. Stored in JSON only; not shown on the site.

When `pendingReview` has items, the workflow opens or updates a GitHub Issue titled `News feed: N articles need review`.

To approve a pending item:

1. Open a PR editing `data/why-stallplus-news.json`.
2. Move the item from `pendingReview` to `articles`.
3. Add `"reviewStatus": "approved"` so carry-forward logic keeps it for up to 7 days.
4. Remove the item from `pendingReview`.

See [style-guide.md](style-guide.md) for news framing rules, confidence thresholds, and category gates.

## Vercel

This project is configured for Vercel as a static site. The Vercel project is connected to the GitHub repository and deploys from `main`.

News JSON is cached for 5 minutes at the CDN (`/data/*`).
