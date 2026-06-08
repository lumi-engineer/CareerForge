import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/resume-analyzer";
import { improveResumeWithGemini, hasGeminiKey } from "@/lib/gemini";
import { improveResumeLocally } from "@/lib/resume-improver";
import { requireAuth, AuthError } from "@/lib/auth";
import type { AnalysisResult, ImproveResumeResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<ImproveResumeResponse>> {
  try {
    await requireAuth();

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

    let improved;
    let engine: "gemini" | "built-in" = "built-in";

    if (hasGeminiKey()) {
      try {
        improved = await improveResumeWithGemini(originalText, analysis);
        engine = "gemini";
      } catch (err) {
        console.warn("Gemini improve failed, using built-in:", err);
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
