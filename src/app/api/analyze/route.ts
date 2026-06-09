import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/resume-analyzer";
import { compareAgainstBenchmarks, getBestMatchingArchetype } from "@/lib/benchmark-resumes";
import { scrapeCourses } from "@/lib/course-scraper";
import { analyzeWithOpenRouter, hasOpenRouterKey } from "@/lib/openrouter";
import { requireAuth, AuthError, ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { AnalyzeResponse, AnalysisResult } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const user = await requireAuth();

    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No resume file provided." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Please upload a PDF file." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be under 10MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParse = (await import("pdf-parse")).default;
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text?.trim() ?? "";

    if (text.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not extract enough text from the PDF. Ensure it contains selectable text, not just images.",
        },
        { status: 400 }
      );
    }

    const analysis = analyzeResume(text);
    const profile: AnalysisResult["profile"] = {
      ...analysis.profile,
      jobCategory: String(analysis.profile.jobCategory),
    };

    const benchmarkComparisons = compareAgainstBenchmarks(analysis);
    const bestMatch = getBestMatchingArchetype(benchmarkComparisons);

    const missingSkillNames = analysis.skills.missing.map((g) => g.skill);
    const courses = await scrapeCourses(
      missingSkillNames,
      analysis.skills.detected,
      profile.jobTitle,
      profile.yearsExperience
    );

    let aiInsights;
    if (hasOpenRouterKey()) {
      try {
        aiInsights = await analyzeWithOpenRouter(text, {
          profile,
          overallScore: analysis.overallScore,
          layoutScore: analysis.layoutScore,
          contentScore: analysis.contentScore,
          sections: analysis.sections,
          feedback: analysis.feedback,
          skills: analysis.skills,
          rawTextLength: analysis.rawTextLength,
        });

        if (aiInsights.detectedJobTitle) {
          profile.jobTitle = aiInsights.detectedJobTitle;
        }
        if (aiInsights.detectedJobCategory) {
          profile.jobCategory = aiInsights.detectedJobCategory;
        }
      } catch (err) {
        console.warn("OpenRouter analysis skipped:", err);
      }
    }

    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...analysis,
      profile,
      originalText: text,
      benchmarkComparisons,
      bestMatchArchetype: bestMatch.name,
      courses,
      aiInsights,
      analyzedWith: hasOpenRouterKey() && aiInsights ? "openrouter" : "local",
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
