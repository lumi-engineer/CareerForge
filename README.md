# CareerForge

Forge your career path with AI-powered resume analysis and personalized course recommendations.

## Features

- **Google Sign In** — Supabase authentication with Google OAuth
- **Resume Scanner** — Detects job title across 150+ roles and 24 career fields
- **OpenRouter AI** — Resume analysis and rewriting via free-tier models
- **Analysis History** — View all users' resume analyses
- **Benchmark Comparison** — Compare against 8 professional resume archetypes
- **Course Suggestions** — Personalized recommendations based on skill gaps

## Getting Started

```bash
npm install
npm run db:push
cp .env.example .env.local   # fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODEL` | Model slug (default: `google/gemini-2.0-flash-exp:free`) |
| `DATABASE_URL` | SQLite path for analysis history |

## Supabase Setup (Google Login)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **Authentication → Providers → Google** and enable it
3. Add your Google OAuth Client ID & Secret from [Google Cloud Console](https://console.cloud.google.com/)
4. Under **Authentication → URL Configuration**, add redirect URL:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback` (production)

## OpenRouter Setup

1. Get a key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Add `OPENROUTER_API_KEY` to `.env.local`
3. Free models like `google/gemini-2.0-flash-exp:free` work without credits

## Usage

1. **Sign in** at `/login` with Google
2. **Upload** your PDF resume at `/analyze`
3. **Review** AI insights, scores, and course recommendations
4. **Improve** your resume with one click
5. **Browse** everyone's analyses at `/history`

## Deploying to Vercel

Add these **Environment Variables** in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jwtthwnknpwljmhjohmf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase **anon public** key (Settings → API) |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `DATABASE_URL` | `file:./dev.db` (local only — use Vercel Postgres or Turso for production) |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL, e.g. `https://your-app.vercel.app` |

Also add your Vercel URL to Supabase redirect URLs:
```
https://your-app.vercel.app/auth/callback
```

> **Note:** For production, SQLite won't persist on Vercel serverless. Consider switching to Supabase Postgres or Turso for the analysis history database.

### Fixing `MIDDLEWARE_INVOCATION_FAILED`

This error usually means Supabase env vars are missing on Vercel. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then redeploy.

Use the **anon public** key from Supabase Dashboard → Settings → API (starts with `eyJ...`), not a placeholder key.
