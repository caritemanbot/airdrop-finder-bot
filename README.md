# Airdrop Finder

A Telegram bot that tracks Web3/TON news with AI-powered analysis (Gemini), and is scaffolded to grow into a full project/airdrop discovery, wallet-tracking, and reputation platform.

## ⚠️ Build status — read this first

This repo is being built **incrementally so that every shipped file is real, working code — not a stub.** Current status:

| Module | Status |
|---|---|
| Bot bootstrap, logging, DB, error handling | ✅ Working |
| News ingestion (NewsData.io) + Gemini AI analysis + Telegram broadcast | ✅ Working |
| Admin commands (`/stats`, `/forcescan`, `/addsource`, `/removesource`, `/settings`, `/reload`, `/broadcast`, `/export`, `/import`) | ✅ Working |
| Analytics daily snapshot | ✅ Working |
| Prisma schema for all 15 planned models (users, groups, projects, airdrops, wallets, votes, reputation, reminders, logs, settings, sources, scam domains, analytics) | ✅ Defined, ready to migrate |
| Project discovery engine | 🚧 Not yet implemented (folder scaffolded: `modules/projects/`) |
| Airdrop detection engine | 🚧 Not yet implemented (folder scaffolded: `modules/airdrop/`) |
| TON wallet tracker (TonCenter API) | 🚧 Not yet implemented (folder scaffolded: `modules/wallet/`) |
| Scam/URL detection | 🚧 Not yet implemented (folder scaffolded: `modules/scam/`) |
| Reputation / leaderboard | 🚧 Not yet implemented (folder scaffolded: `modules/reputation/`) |
| Auto-poll on new project | 🚧 Not yet implemented (folder scaffolded: `modules/poll/`) |
| Reminders (claim/snapshot/TGE/deadline) | 🚧 Not yet implemented (folder scaffolded: `modules/reminders/`) |

Why: project/airdrop discovery, wallet monitoring, and scam detection each depend on real source lists and API choices (which data feeds count as "sources," which TON API, which scam blacklist) that need to be confirmed rather than faked. Shipping stub logic for those would violate the "no fake data / no placeholders" requirement more than shipping them later, for real.

## Features (implemented)

- **News engine**: polls NewsData.io every 10 minutes for TON/Telegram/Blockchain/Crypto/Web3/AI news, de-duplicates by `article_id`, stores in PostgreSQL, and never reprocesses the same article twice.
- **AI analysis**: every new article is sent to Gemini, which returns a structured JSON summary, category, importance score (1–10), TON relevance score (1–10), potential opportunity, and potential risk.
- **Telegram broadcast**: analyzed articles are posted to your group in clean HTML with a "Read More" inline button.
- **Admin toolkit**: source management, forced re-scan, group settings, JSON export/import, broadcast.
- **Structured logging**: every request, scheduler run, and error is logged to console, a daily rotating file under `logs/`, and the `Log` table in Postgres.
- **Resilience**: all outbound HTTP calls retry on network errors, 429, and 5xx via `axios-retry` with exponential backoff.

## Tech stack

- Node.js 18+, `node-telegram-bot-api` (long polling)
- PostgreSQL + Prisma ORM
- Google Gemini (`@google/genai`) for AI analysis
- NewsData.io for news ingestion
- `node-cron` for scheduling
- Deployable to Railway

## Installation (local)

```bash
git clone <your-repo-url>
cd airdrop-finder
npm install
cp .env.example .env
# fill in .env with real values (see below)
npx prisma migrate dev --name init
npm start
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `BOT_TOKEN` | ✅ | Telegram bot token from [@BotFather](https://t.me/BotFather) |
| `GROUP_ID` | ✅ | Telegram group/channel chat ID the bot posts to |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEWSDATA_API_KEY` | ✅ | Free key from [newsdata.io](https://newsdata.io/register) |
| `GEMINI_API_KEY` | ✅ | Free key from [Google AI Studio](https://aistudio.google.com/apikey) |
| `ADMIN_IDS` | optional | Comma-separated Telegram user IDs allowed to run admin commands |
| `TONCENTER_API_KEY` | optional | Free key from [toncenter.com](https://toncenter.com/) — raises rate limits for the (not-yet-built) wallet tracker |
| `NODE_ENV` | optional | `development` or `production` |
| `LOG_LEVEL` | optional | `debug` \| `info` \| `warn` \| `error` |

## Railway deployment

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo**.
3. Add a **PostgreSQL** plugin to the project — Railway auto-injects `DATABASE_URL`.
4. In the service's **Variables** tab, add `BOT_TOKEN`, `NEWSDATA_API_KEY`, `GEMINI_API_KEY`, `GROUP_ID`, and optionally `ADMIN_IDS`, `TONCENTER_API_KEY`.
5. Set the **Start Command** to `npm start` (Railway runs `npm install` and the `postinstall` script — `prisma generate` — automatically).
6. After first deploy, run the initial migration once via Railway's shell (or a one-off deploy command): `npx prisma migrate deploy`.
7. Confirm the bot is polling by checking the deploy logs for `Telegram bot started (polling mode)`.

## GitHub deployment

```bash
git init
git add .
git commit -m "Initial commit: Airdrop Finder core (news + AI + admin)"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Commands

**Public**
- `/start` — welcome message
- `/help` — command list

**Admin only** (must be in `ADMIN_IDS`)
- `/stats` — live counts (news, projects, airdrops, users, wallets, active sources)
- `/forcescan` — run the news ingestion + broadcast pipeline immediately
- `/addsource TYPE name url` — register a source (`TYPE` = `NEWS`, `PROJECT`, or `AIRDROP`)
- `/removesource TYPE url` — deactivate a source
- `/settings` — show/initialize the current group's settings
- `/reload` — refresh the active-source count from the database
- `/broadcast text` — send an announcement to the configured group
- `/export` — export active sources as JSON
- `/import [json]` — bulk-import sources from JSON (same shape as `/export`)

## Architecture

```
config/        env validation, constants (cron schedules, keyword filters)
database/      Prisma client singleton, wired to the logger
middlewares/   admin auth guard, error-handling wrapper for bot handlers
modules/       one folder per domain (ai, news, projects, airdrop, wallet,
               reminders, reputation, poll, scam, admin, analytics) —
               each holds its own service/controller
repositories/  Prisma data-access functions, one file per model group
scheduler/     node-cron jobs, one file per job, registered from index.js
utils/         logger, retrying HTTP client, in-memory rate limiter
prisma/        schema.prisma — the full data model for every planned feature
logs/          daily rotating log files (also mirrored into the DB Log table)
index.js       bootstraps DB connection, bot polling, command routing,
               and schedulers; handles graceful shutdown
```

Clean separation: **controllers** format Telegram output and orchestrate a request, **services** hold business logic (fetch/analyze/ingest), **repositories** are the only files that touch Prisma directly for their model.

## Roadmap (next iterations)

1. Project discovery service + Gemini project analysis + auto-poll on new project
2. Airdrop detection tied to discovered projects (reward/deadline/tasks extraction)
3. Reminder scheduler (claim/snapshot/TGE/deadline) firing from the `Reminder` table
4. TON wallet tracker via TonCenter's free public API (`getTransactions` polling per tracked address)
5. Scam/URL detection middleware on every group message (blacklist + typosquat heuristics against the `ScamDomain` table)
6. Reputation scoring + `/leaderboard` (daily/weekly/monthly)
