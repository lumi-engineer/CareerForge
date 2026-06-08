import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from "./types";

const DEFAULT_MODEL = "gemini-1.5-flash";

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenerativeAI(apiKey);
}

function getModel() {
  return getClient().getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? DEFAULT_MODEL,
  });
}

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export interface GeminiInsights {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detectedJobTitle?: string;
  detectedJobCategory?: string;
}

export interface GeminiImproveResult {
  improvedText: string;
  changesSummary: string[];
  estimatedScore: number;
}

async function parseJsonResponse<T>(text: string): Promise<T> {
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

export async function analyzeWithGemini(
  resumeText: string,
  localAnalysis: Omit<AnalysisResult, "id" | "timestamp" | "originalText" | "benchmarkComparisons" | "bestMatchArchetype" | "courses">
): Promise<GeminiInsights> {
  const model = getModel();

  const prompt = `You are an expert career coach and resume analyst. Analyze this resume and return ONLY valid JSON (no markdown).

Local analysis detected:
- Job: ${localAnalysis.profile.jobTitle}
- Category: ${localAnalysis.profile.jobCategory}
- Industry: ${localAnalysis.profile.industry}
- Overall score: ${localAnalysis.overallScore}/100

Resume text:
---
${resumeText.slice(0, 6000)}
---

Return JSON with these exact keys:
{
  "summary": "2-3 sentence professional assessment",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["actionable recommendation 1", "recommendation 2", "recommendation 3"],
  "detectedJobTitle": "most accurate job title from resume",
  "detectedJobCategory": "career category e.g. Healthcare, Technology, Education"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJsonResponse<GeminiInsights>(text);
}

export async function improveResumeWithGemini(
  originalText: string,
  analysis: AnalysisResult
): Promise<GeminiImproveResult> {
  const model = getModel();

  const feedbackSummary = analysis.feedback
    .map((f) => `${f.category}: ${f.suggestions.join("; ")}`)
    .join("\n");

  const prompt = `You are an expert resume writer. Rewrite this resume to be ATS-friendly and achievement-focused.

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

Missing skills to weave in: ${analysis.skills.missing.map((g) => g.skill).join(", ") || "none"}

Original resume:
---
${originalText.slice(0, 6000)}
---

Return ONLY valid JSON:
{
  "improvedText": "full rewritten resume as plain text",
  "changesSummary": ["change 1", "change 2", "change 3", "change 4"],
  "estimatedScore": 85
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = await parseJsonResponse<GeminiImproveResult>(text);

  if (!parsed.improvedText || !Array.isArray(parsed.changesSummary)) {
    throw new Error("Invalid response from Gemini.");
  }

  return {
    improvedText: parsed.improvedText,
    changesSummary: parsed.changesSummary,
    estimatedScore: Math.min(100, Math.max(0, parsed.estimatedScore ?? analysis.overallScore + 15)),
  };
}
