# CareerForge

Forge your career path with AI-powered resume analysis and personalized course recommendations.

## Features

- **Resume Scanner** — Upload a PDF resume for automatic extraction of job title, skills, experience, and layout analysis
- **Resume Feedback** — Compare your resume against best practices with scores for layout, content, skills alignment, and ATS compatibility
- **Web Scraping** — AI-powered course discovery across Coursera, Udemy, edX, LinkedIn Learning, and more
- **Course Suggestions** — Personalized recommendations based on your skill gaps and in-demand market skills

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- pdf-parse for PDF text extraction

## Usage

1. Visit the homepage and click **Analyze My Resume**
2. Upload your PDF resume (max 10MB, text-selectable PDFs work best)
3. Review your scores, feedback, skill gaps, and recommended courses

## Project Structure

```
src/
├── app/
│   ├── api/analyze/    # Resume analysis API endpoint
│   ├── analyze/        # Upload page
│   ├── results/        # Analysis results dashboard
│   └── page.tsx        # Landing page
├── components/         # UI components
└── lib/
    ├── resume-analyzer.ts  # Resume parsing & feedback engine
    ├── course-scraper.ts   # Course recommendation engine
    └── types.ts
```
