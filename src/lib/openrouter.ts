import type { AnalysisResult } from "./types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.0-flash-exp:free";

export function hasOpenRouterKey(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export interface AIInsights {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detectedJobTitle?: string;
  detectedJobCategory?: string;
}

export interface AIImproveResult {
  improvedText: string;
  changesSummary: string[];
  estimatedScore: number;
}

async function parseJsonResponse<T>(text: string): Promise<T> {
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

async function chatJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
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
      temperature: 0.4,
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

export async function analyzeWithOpenRouter(
  resumeText: string,
  localAnalysis: Omit<
    AnalysisResult,
    "id" | "timestamp" | "originalText" | "benchmarkComparisons" | "bestMatchArchetype" | "courses"
  >
): Promise<AIInsights> {
  const systemPrompt =
    "You are an expert career coach and resume analyst. Always respond with valid JSON only, no markdown.";

  const userPrompt = `Analyze this resume and return JSON with keys: summary, strengths (array), weaknesses (array), recommendations (array), detectedJobTitle, detectedJobCategory.

Local analysis detected:
- Job: ${localAnalysis.profile.jobTitle}
- Category: ${localAnalysis.profile.jobCategory}
- Industry: ${localAnalysis.profile.industry}
- Overall score: ${localAnalysis.overallScore}/100

Resume text:
---
${resumeText.slice(0, 6000)}
---`;

  return chatJson<AIInsights>(systemPrompt, userPrompt);
}

export async function improveResumeWithOpenRouter(
  originalText: string,
  analysis: AnalysisResult
): Promise<AIImproveResult> {
  const feedbackSummary = analysis.feedback
    .map((f) => `${f.category}: ${f.suggestions.join("; ")}`)
    .join("\n");

  const systemPrompt =
    "You are an expert resume writer. Always respond with valid JSON only, no markdown.";

  const userPrompt = `Rewrite this resume to be ATS-friendly and achievement-focused.

Rules:
- Preserve all factual info (names, companies, dates, degrees)
- Use strong action verbs and quantifiable metrics where reasonable
- Keep plain text with clear section headers
- Target 400-600 words
- Do NOT invent employers, degrees, or certifications

Profile: ${analysis.profile.jobTitle}, ${analysis.profile.yearsExperience}+ years, ${analysis.profile.industry}
Score: ${analysis.overallScore}/100
Feedback:
${feedbackSummary}

Missing skills: ${analysis.skills.missing.map((g) => g.skill).join(", ") || "none"}

Original resume:
---
${originalText.slice(0, 6000)}
---

Return JSON: { "improvedText": "...", "changesSummary": ["..."], "estimatedScore": 85 }`;

  const parsed = await chatJson<AIImproveResult>(systemPrompt, userPrompt);

  if (!parsed.improvedText || !Array.isArray(parsed.changesSummary)) {
    throw new Error("Invalid response from OpenRouter.");
  }

  return {
    improvedText: parsed.improvedText,
    changesSummary: parsed.changesSummary,
    estimatedScore: Math.min(100, Math.max(0, parsed.estimatedScore ?? analysis.overallScore + 15)),
  };
}
