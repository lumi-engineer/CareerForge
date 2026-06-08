# CareerForge

Forge your career path with AI-powered resume analysis and personalized course recommendations.

## Features

- **Email Sign Up** — Create an account to analyze and save your resume history
- **Resume Scanner** — Detects job title, career category, and industry across 150+ roles
- **Gemini AI Analysis** — Google Gemini free tier powers smart resume analysis and rewriting
- **Analysis History** — View all users' resume analyses in one place
- **Benchmark Comparison** — Compare against 8 professional resume archetypes
- **Course Suggestions** — Personalized recommendations based on skill gaps

## Getting Started

```bash
npm install
npm run db:push
cp .env.example .env.local   # add your GEMINI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Gemini API (Free)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a free API key
3. Add it to `.env.local`:

```
GEMINI_API_KEY=your-key-here
```

The free tier includes generous limits for `gemini-1.5-flash`. Without a key, local analysis still works but Gemini insights and AI resume rewriting use the built-in engine.

## Usage

1. **Sign up** at `/signup` with your email
2. **Upload** your PDF resume at `/analyze`
3. **Review** scores, Gemini AI insights, and course recommendations
4. **Improve** your resume with one click
5. **Browse** everyone's analyses at `/history`

## Tech Stack

- Next.js 15, TypeScript, Tailwind CSS 4
- Prisma + SQLite (user accounts & history)
- Google Gemini API (free tier)
- pdf-parse for PDF extraction
