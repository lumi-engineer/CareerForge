import { NextRequest, NextResponse } from "next/server";
import { improveResumeWithOpenRouter, hasOpenRouterKey } from "@/lib/openrouter";
import { improveResumeLocally } from "@/lib/resume-improver";
import { analyzeResume } from "@/lib/resume-analyzer";
import { requireAuth, AuthError } from "@/lib/auth";
import type { AnalysisResult, ImproveResumeResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<ImproveResumeResponse>> {
  try {
    await requireAuth();

    const body = await request.json();
    const { originalText, analysis, targetJob } = body as {
      originalText?: string;
      analysis?: AnalysisResult;
      targetJob?: string;
    };

    if (!originalText || !analysis) {
      return NextResponse.json(
        { success: false, error: "Missing resume text or analysis data." },
        { status: 400 }
      );
    }

    let improved;
    let engine: "openrouter" | "built-in" = "built-in";

    if (hasOpenRouterKey() && analysis.parsedResume) {
      try {
        improved = await improveResumeWithOpenRouter(originalText, analysis.parsedResume, targetJob);
        engine = "openrouter";
      } catch (err) {
        console.warn("OpenRouter improve failed, using built-in:", err);
        improved = improveResumeLocally(originalText, analysis);
      }
    } else if (hasOpenRouterKey()) {
      try {
        improved = await improveResumeWithOpenRouter(
          originalText,
          {
            name: analysis.profile.name,
            jobTitle: analysis.profile.jobTitle,
            jobCategory: analysis.profile.jobCategory,
            yearsExperience: analysis.profile.yearsExperience,
            industry: analysis.profile.industry,
            skills: { technical: analysis.skills.detected, soft: [] },
            experience: [],
            education: [],
          },
          targetJob
        );
        engine = "openrouter";
      } catch {
        improved = improveResumeLocally(originalText, analysis);
      }
    } else {
      improved = improveResumeLocally(originalText, analysis);
    }

    const improvedAnalysis = analyzeResume(improved.improvedText);

    return NextResponse.json({
      success: true,
      data: {
        ...improved,
        engine,
        improvedAnalysis: {
          overallScore: improvedAnalysis.overallScore,
          layoutScore: improvedAnalysis.layoutScore,
          contentScore: improvedAnalysis.contentScore,
        },
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error("Resume improvement error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to improve resume. Please try again.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
