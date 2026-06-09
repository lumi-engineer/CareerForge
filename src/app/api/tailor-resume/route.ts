import { NextRequest, NextResponse } from "next/server";
import { tailorResumeWithAI, hasOpenRouterKey } from "@/lib/openrouter";
import { requireAuth, AuthError } from "@/lib/auth";
import type { AnalysisResult, TailorResumeResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<TailorResumeResponse>> {
  try {
    await requireAuth();

    if (!hasOpenRouterKey()) {
      return NextResponse.json(
        { success: false, error: "OPENROUTER_API_KEY is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { analysis, targetJobDescription } = body as {
      analysis?: AnalysisResult;
      targetJobDescription?: string;
    };

    if (!analysis?.parsedResume || !targetJobDescription?.trim()) {
      return NextResponse.json(
        { success: false, error: "Analysis data and target job description are required." },
        { status: 400 }
      );
    }

    const result = await tailorResumeWithAI(
      analysis.parsedResume,
      analysis.originalText,
      targetJobDescription.trim()
    );

    return NextResponse.json({
      success: true,
      data: {
        tailoredText: result.tailoredText,
        structuredResume: result.structuredResume,
        changesSummary: result.changesSummary,
        keywordMatches: result.keywordMatches,
        estimatedAtsScore: result.estimatedAtsScore,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error("Tailor resume error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to tailor resume. Please try again." },
      { status: 500 }
    );
  }
}
