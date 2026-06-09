import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/resume-analyzer";
import { compareAgainstBenchmarks, getBestMatchingArchetype } from "@/lib/benchmark-resumes";
import { scrapeCourses } from "@/lib/course-scraper";
import {
  parseResumeWithAI,
  scoreATSWithAI,
  analyzeWithOpenRouter,
  hasOpenRouterKey,
} from "@/lib/openrouter";
import { extractTextFromFile, isSupportedResumeFile } from "@/lib/resume-extractor";
import { mergeAIWithLocalAnalysis, applyATSToScores, parsedResumeToPlainText } from "@/lib/ai-analysis-builder";
import { requireAuth, AuthError, ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { AnalyzeResponse, AnalysisResult, ParsedResume } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const user = await requireAuth();

    if (!hasOpenRouterKey()) {
      return NextResponse.json(
        { success: false, error: "OPENROUTER_API_KEY is required for AI resume analysis." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No resume file provided." }, { status: 400 });
    }

    if (!isSupportedResumeFile(file.type, file.name)) {
      return NextResponse.json(
        { success: false, error: "Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be under 10MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawText = await extractTextFromFile(buffer, file.type, file.name);

    if (rawText.length < 20) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not extract enough text. Try a text-based PDF or DOCX file.",
        },
        { status: 400 }
      );
    }

    let parsedResume: ParsedResume;
    try {
      parsedResume = await parseResumeWithAI(rawText);
    } catch (aiError) {
      console.error("AI parse failed:", aiError);
      return NextResponse.json(
        { success: false, error: "AI resume parsing failed. Please try again." },
        { status: 500 }
      );
    }

    const cleanText = parsedResumeToPlainText(parsedResume);
    const localAnalysis = analyzeResume(cleanText || rawText);
    const merged = mergeAIWithLocalAnalysis(rawText, parsedResume, localAnalysis);

    let atsScore;
    let aiInsights;
    try {
      [atsScore, aiInsights] = await Promise.all([
        scoreATSWithAI(rawText, parsedResume),
        analyzeWithOpenRouter(rawText, parsedResume),
      ]);
    } catch (aiError) {
      console.warn("ATS/insights AI step failed:", aiError);
    }

    if (aiInsights?.detectedJobTitle) merged.profile.jobTitle = aiInsights.detectedJobTitle;
    if (aiInsights?.detectedJobCategory) merged.profile.jobCategory = aiInsights.detectedJobCategory;

    const scores = atsScore
      ? applyATSToScores({ overallScore: merged.overallScore, contentScore: merged.contentScore }, atsScore)
      : { overallScore: merged.overallScore, contentScore: merged.contentScore };

    const benchmarkComparisons = compareAgainstBenchmarks(localAnalysis);
    const bestMatch = getBestMatchingArchetype(benchmarkComparisons);

    const missingSkillNames = merged.skills.missing.map((g) => g.skill);
    const courses = await scrapeCourses(
      missingSkillNames,
      merged.skills.detected,
      merged.profile.jobTitle,
      merged.profile.yearsExperience
    );

    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...merged,
      overallScore: scores.overallScore,
      contentScore: scores.contentScore,
      originalText: cleanText || rawText,
      parsedResume,
      atsScore,
      benchmarkComparisons,
      bestMatchArchetype: bestMatch.name,
      courses,
      aiInsights,
      analyzedWith: "openrouter",
    };

    try {
      await ensureUserRecord(user);
      await prisma.analysis.create({
        data: {
          id: result.id,
          userId: user.id,
          fileName: file.name,
          jobTitle: result.profile.jobTitle,
          jobCategory: result.profile.jobCategory,
          overallScore: result.overallScore,
          resultJson: JSON.stringify(result),
        },
      });
    } catch (dbError) {
      console.error("Analysis saved to session only (database unavailable):", dbError);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error("Resume analysis error:", error);
    return NextResponse.json({ success: false, error: "Failed to analyze resume. Please try again." }, { status: 500 });
  }
}
