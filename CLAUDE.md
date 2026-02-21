# Claude Will Replace You (CWRU)

## What Is This?
A humorous web tool where developers enter their profile and discover which Claude AI model will replace them at work. Includes a replacement percentage, countdown timer, personalized funny quotes, a downloadable certificate, and a leaderboard.

## Tech Stack
- **Runtime**: Bun (dev + package manager), Node.js/Edge (production on Vercel)
- **Backend**: Hono (edge-ready framework)
- **Frontend**: React 19 + Vite (SPA, no SSR)
- **Styling**: Tailwind CSS 4
- **AI**: Groq API (Llama models, free tier) with local fallback
- **Database**: Turso (libSQL) + Drizzle ORM
- **OG Images**: @vercel/og (Satori)
- **Deploy**: Vercel (Edge Functions + Static)

## Project Structure
```
claude-will-replace-you/
├── packages/
│   ├── api/                     # Hono backend
│   │   └── src/
│   │       ├── index.ts         # Entry + routes
│   │       ├── routes/
│   │       │   ├── analyze.ts   # POST /api/analyze
│   │       │   ├── leaderboard.ts
│   │       │   ├── result.ts    # GET /api/result/:id
│   │       │   ├── share.ts     # POST /api/result/:id/share
│   │       │   └── og.ts        # GET /api/og/:id (certificate PNG)
│   │       ├── lib/
│   │       │   ├── groq.ts      # Groq API + round-robin + fallback
│   │       │   ├── scoring.ts   # Algorithmic scoring engine
│   │       │   ├── fallback.ts  # Response bank + template engine
│   │       │   ├── models.ts    # 8 model tiers (3 real + 5 fictional)
│   │       │   └── db.ts        # Turso/Drizzle connection
│   │       └── prompts/
│   │           └── analyzer.ts  # LLM system prompt
│   └── web/                     # React frontend
│       └── src/
│           ├── App.tsx
│           ├── components/
│           │   ├── InputForm.tsx
│           │   ├── ResultCard.tsx
│           │   ├── Leaderboard.tsx
│           │   ├── ShareButtons.tsx
│           │   ├── ReplacementMeter.tsx
│           │   └── LoadingScreen.tsx
│           ├── pages/
│           │   ├── HomePage.tsx
│           │   ├── ResultPage.tsx
│           │   └── LeaderboardPage.tsx
│           ├── hooks/
│           │   └── useAnalysis.ts
│           └── lib/
│               └── api.ts
├── drizzle/
│   └── schema.ts
├── package.json                 # Bun workspace root
├── vercel.json
└── CLAUDE.md
```

## Key Architecture Decisions

### Scoring is ALWAYS algorithmic
The LLM does NOT decide the score, model, or days. Those are computed deterministically in `scoring.ts`. The LLM only generates humor text (headline, quote, skills analysis).

### Groq Round-Robin Strategy
Rate limits are per-model, so we use all three:
1. Llama 4 Scout 17B (1K RPD) ↔ Llama 3.3 70B (1K RPD) — round-robin
2. Llama 3.1 8B (14.4K RPD) — fallback
3. Local response bank — if all Groq models return 429

### 8 Model Tiers (3 real + 5 fictional)
| Tier | Model | Score Range | Exists? |
|------|-------|-------------|---------|
| 1 | Claude Haiku 4.5 | 85-100% | ✅ Real |
| 2 | Claude Sonnet 4.6 | 65-84% | ✅ Real |
| 3 | Claude Opus 4.6 | 45-64% | ✅ Real |
| 4 | Claude 5.0 "Titan" | 30-44% | 🔮 2027 |
| 5 | Claude 6.0 "Colossus" | 20-29% | 🔮 2029 |
| 6 | Claude 7.0 "Singularity" | 10-19% | 🔮 2032 |
| 7 | Claude 9.0 "Skynet" | 5-9% | 🔮 2035 |
| 8 | Claude ∞ "The One" | 0-4% | 🔮 ∞ |

Score = 100 - protection (higher = more replaceable).
Protection = experience(0-30) + role(0-20) + tech(0-15) + description(0-15) + github(0-5), capped at 100.

### Humor Style
Short, punchy, Israeli-tech-humor. Self-deprecating AI humor. The LLM and fallback bank MUST produce the same voice. See `prompts/analyzer.ts` for the full style guide with examples.

### OG Images / Share Pages
SPA doesn't work for OG meta tags (crawlers don't run JS). The Hono backend serves a minimal HTML page at `/r/:id` with OG tags, then redirects to the SPA.

## Database Schema
```sql
CREATE TABLE results (
  id TEXT PRIMARY KEY,            -- nanoid, 12 chars
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  experience INTEGER NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT,              -- JSON array
  github_url TEXT,
  model_key TEXT NOT NULL,        -- 'haiku'|'sonnet'|'opus'|'titan'|'colossus'|'singularity'|'skynet'|'infinity'
  model_name TEXT NOT NULL,
  score INTEGER NOT NULL,         -- 0-100
  days_left INTEGER NOT NULL,
  headline TEXT NOT NULL,
  quote TEXT NOT NULL,
  skills_analysis TEXT NOT NULL,  -- JSON array
  generated_by TEXT NOT NULL,     -- 'groq-scout'|'groq-70b'|'groq-8b'|'local-fallback'
  created_at TEXT DEFAULT (datetime('now')),
  share_count INTEGER DEFAULT 0
);
```

## API Endpoints
- `POST /api/analyze` — Submit profile → get result
- `GET /api/result/:id` — Get single result (for share page)
- `GET /api/og/:id` — Generate certificate PNG (Satori)
- `GET /api/leaderboard?sort=highest|lowest|recent&limit=20&offset=0` — Leaderboard
- `POST /api/result/:id/share` — Increment share count
- `GET /r/:id` — Share page (HTML with OG meta tags)

## Environment Variables
```
GROQ_API_KEY=gsk_...
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

## Commands
```bash
bun install              # Install all workspace deps
bun run dev              # Start API + frontend dev servers
bun run build            # Build for production
bun run db:push          # Push schema to Turso
```

## Important Notes
- Vercel doesn't support Bun runtime — Bun is for local dev only, production runs Node.js/Edge
- Hono has a Vercel adapter (`@hono/vercel`)
- All text content (headlines, quotes, skill comments) must work in both Hebrew and English
- Rate limit users: 5 requests per IP per 10 minutes
- The humor tone is critical — review fallback.ts examples before changing any humor-related code
