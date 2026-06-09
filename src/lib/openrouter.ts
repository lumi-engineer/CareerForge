import type { ParsedResume, ATSScore, AIInsights } from "./types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.0-flash-exp:free";

export function hasOpenRouterKey(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export interface AIImproveResult {
  improvedText: string;
  structuredResume?: ParsedResume;
  changesSummary: string[];
  estimatedScore: number;
}

export interface TailorResult {
  tailoredText: string;
  structuredResume: ParsedResume;
  changesSummary: string[];
  keywordMatches: string[];
  estimatedAtsScore: number;
}

export interface CoverLetterResult {
  coverLetter: string;
  highlights: string[];
}

async function parseJsonResponse<T>(text: string): Promise<T> {
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

async function chatJson<T>(systemPrompt: string, userPrompt: string, temperature = 0.3): Promise<T> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-Title": "CareerForge",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter error (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return parseJsonResponse<T>(content);
}

const PARSE_SYSTEM = `You are an expert resume parser. Extract ALL information from messy resume text into clean structured JSON. Fix OCR errors, merge broken lines, and infer missing structure. Never invent employers or degrees not present in the source. Always respond with valid JSON only.`;

export async function parseResumeWithAI(rawText: string): Promise<ParsedResume> {
  const userPrompt = `Parse this resume text into structured JSON with this exact schema:
{
  "name": "string",
  "email": "string or null",
  "phone": "string or null",
  "linkedin": "string or null",
  "location": "string or null",
  "summary": "string or null",
  "jobTitle": "current or most recent job title",
  "jobCategory": "career category e.g. Technology, Healthcare",
  "yearsExperience": number,
  "industry": "string",
  "skills": { "technical": ["..."], "soft": ["..."] },
  "experience": [{ "title": "", "company": "", "dates": "", "location": "", "bullets": ["..."] }],
  "education": [{ "degree": "", "institution": "", "year": "", "details": "" }],
  "certifications": ["..."],
  "languages": ["..."]
}

Raw resume text (may be poorly extracted — reconstruct intelligently):
---
${rawText.slice(0, 12000)}
---`;

  return chatJson<ParsedResume>(PARSE_SYSTEM, userPrompt);
}

export async function scoreATSWithAI(rawText: string, parsed: ParsedResume): Promise<ATSScore> {
  const userPrompt = `Score this resume for ATS (Applicant Tracking System) compatibility. Return JSON:
{
  "overall": 0-100,
  "keywordMatch": 0-100,
  "formatting": 0-100,
  "sections": 0-100,
  "readability": 0-100,
  "suggestions": ["actionable suggestion 1", "..."]
}

Parsed resume:
${JSON.stringify(parsed, null, 2)}

Raw text excerpt:
${rawText.slice(0, 4000)}`;

  return chatJson<ATSScore>(
    "You are an ATS scoring expert. Respond with valid JSON only.",
    userPrompt
  );
}

export async function analyzeWithOpenRouter(
  rawText: string,
  parsed: ParsedResume
): Promise<AIInsights> {
  const userPrompt = `Analyze this structured resume. Return JSON:
{ "summary": "2-3 sentences", "strengths": ["..."], "weaknesses": ["..."], "recommendations": ["..."], "detectedJobTitle": "...", "detectedJobCategory": "..." }

Structured resume:
${JSON.stringify(parsed, null, 2)}`;

  return chatJson<AIInsights>(
    "You are an expert career coach. Respond with valid JSON only.",
    userPrompt
  );
}

export async function improveResumeWithOpenRouter(
  originalText: string,
  parsed: ParsedResume,
  targetJob?: string
): Promise<AIImproveResult> {
  const userPrompt = `Rewrite this resume to be ATS-optimized and achievement-focused.
${targetJob ? `Target role: ${targetJob}` : ""}

Rules:
- Preserve all factual information
- Use strong action verbs and metrics
- Return improved plain-text resume AND updated structured JSON

Return JSON:
{
  "improvedText": "full plain text resume",
  "structuredResume": { same schema as parsed resume },
  "changesSummary": ["change 1", "..."],
  "estimatedScore": 85
}

Structured resume:
${JSON.stringify(parsed, null, 2)}

Raw text:
${originalText.slice(0, 8000)}`;

  const result = await chatJson<AIImproveResult>(
    "You are an expert resume writer. Respond with valid JSON only.",
    userPrompt
  );

  if (!result.improvedText || !Array.isArray(result.changesSummary)) {
    throw new Error("Invalid response from OpenRouter.");
  }

  return {
    ...result,
    estimatedScore: Math.min(100, Math.max(0, result.estimatedScore ?? 75)),
  };
}

export async function tailorResumeWithAI(
  parsed: ParsedResume,
  rawText: string,
  targetJobDescription: string
): Promise<TailorResult> {
  const userPrompt = `Tailor this resume for the target job description below.
Match keywords naturally, reorder bullets for relevance, emphasize matching skills.

Return JSON:
{
  "tailoredText": "full plain text tailored resume",
  "structuredResume": { updated structured resume schema },
  "changesSummary": ["what changed and why"],
  "keywordMatches": ["keywords from JD now in resume"],
  "estimatedAtsScore": 0-100
}

Current resume:
${JSON.stringify(parsed, null, 2)}

Target job description:
${targetJobDescription.slice(0, 6000)}`;

  return chatJson<TailorResult>(
    "You are an expert resume tailor for ATS optimization. Respond with valid JSON only.",
    userPrompt,
    0.4
  );
}

export async function generateCoverLetterWithAI(
  parsed: ParsedResume,
  targetJobDescription: string,
  companyName?: string
): Promise<CoverLetterResult> {
  const userPrompt = `Write a professional cover letter for this candidate applying to the job below.
${companyName ? `Company: ${companyName}` : ""}

Return JSON:
{
  "coverLetter": "full cover letter text with proper paragraphs",
  "highlights": ["key selling points used in the letter"]
}

Candidate resume:
${JSON.stringify(parsed, null, 2)}

Job description:
${targetJobDescription.slice(0, 6000)}`;

  return chatJson<CoverLetterResult>(
    "You are an expert cover letter writer. Respond with valid JSON only.",
    userPrompt,
    0.5
  );
}
