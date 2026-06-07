import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/resume-analyzer";
import { improveResumeWithAI } from "@/lib/openai";
import { improveResumeLocally, hasOpenAIKey } from "@/lib/resume-improver";
import type { AnalysisResult, ImproveResumeResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<ImproveResumeResponse>> {
  try {
    const body = await request.json();
    const { originalText, analysis } = body as {
      originalText?: string;
      analysis?: AnalysisResult;
    };

    if (!originalText || !analysis) {
      return NextResponse.json(
        { success: false, error: "Missing resume text or analysis data." },
        { status: 400 }
      );
    }

    const improved = hasOpenAIKey()
      ? await improveResumeWithAI(originalText, analysis)
      : improveResumeLocally(originalText, analysis);

    const improvedAnalysis = analyzeResume(improved.improvedText);

    return NextResponse.json({
      success: true,
      data: {
        ...improved,
        engine: hasOpenAIKey() ? "openai" : "built-in",
        improvedAnalysis: {
          overallScore: improvedAnalysis.overallScore,
          layoutScore: improvedAnalysis.layoutScore,
          contentScore: improvedAnalysis.contentScore,
        },
      },
    });
  } catch (error) {
    console.error("Resume improvement error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to improve resume. Please try again.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
