import OpenAI from "openai";
import type { AnalysisResult } from "./types";

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured. Add it to your .env.local file.");
  }
  return new OpenAI({ apiKey });
}

export interface ImprovedResumeResult {
  improvedText: string;
  changesSummary: string[];
  estimatedScore: number;
}

export async function improveResumeWithAI(
  originalText: string,
  analysis: AnalysisResult
): Promise<ImprovedResumeResult> {
  const client = getClient();

  const feedbackSummary = analysis.feedback
    .map((f) => `${f.category} (${f.score}/${f.maxScore}): ${f.suggestions.join("; ")}`)
    .join("\n");

  const missingSkills = analysis.skills.missing.map((g) => g.skill).join(", ");
  const sectionsMissing = analysis.sections.filter((s) => !s.found).map((s) => s.name).join(", ");

  const systemPrompt = `You are an expert resume writer and career coach. Rewrite resumes to be ATS-friendly, achievement-focused, and aligned with current hiring standards in 2026.

Rules:
- Preserve all factual information from the original (names, companies, dates, degrees)
- Add quantifiable metrics where reasonable based on context
- Use strong action verbs (Led, Developed, Achieved, Optimized, etc.)
- Include missing sections if data can be inferred: ${sectionsMissing || "none"}
- Weave in relevant in-demand skills naturally: ${missingSkills || "general professional skills"}
- Keep format as plain text with clear section headers
- Target 400-600 words, one-page equivalent
- Do NOT invent employers, degrees, or certifications that aren't in the original
- Return ONLY valid JSON with keys: improvedText, changesSummary (array of strings), estimatedScore (0-100)`;

  const userPrompt = `Rewrite this resume for a ${analysis.profile.jobTitle} with ${analysis.profile.yearsExperience}+ years experience in ${analysis.profile.industry}.

Current scores — Overall: ${analysis.overallScore}, Layout: ${analysis.layoutScore}, Content: ${analysis.contentScore}

Feedback to address:
${feedbackSummary}

Original resume:
---
${originalText}
---`;

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 4096,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  const parsed = JSON.parse(content) as ImprovedResumeResult;

  if (!parsed.improvedText || !Array.isArray(parsed.changesSummary)) {
    throw new Error("Invalid response format from OpenAI.");
  }

  return {
    improvedText: parsed.improvedText,
    changesSummary: parsed.changesSummary,
    estimatedScore: Math.min(100, Math.max(0, parsed.estimatedScore ?? analysis.overallScore + 15)),
  };
}
