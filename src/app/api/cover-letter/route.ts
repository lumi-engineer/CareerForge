import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetterWithAI, hasOpenRouterKey } from "@/lib/openrouter";
import { requireAuth, AuthError } from "@/lib/auth";
import type { AnalysisResult, CoverLetterResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<CoverLetterResponse>> {
  try {
    await requireAuth();

    if (!hasOpenRouterKey()) {
      return NextResponse.json(
        { success: false, error: "OPENROUTER_API_KEY is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { analysis, targetJobDescription, companyName } = body as {
      analysis?: AnalysisResult;
      targetJobDescription?: string;
      companyName?: string;
    };

    if (!analysis?.parsedResume || !targetJobDescription?.trim()) {
      return NextResponse.json(
        { success: false, error: "Analysis data and target job description are required." },
        { status: 400 }
      );
    }

    const result = await generateCoverLetterWithAI(
      analysis.parsedResume,
      targetJobDescription.trim(),
      companyName?.trim()
    );

    return NextResponse.json({
      success: true,
      data: {
        text: result.coverLetter,
        highlights: result.highlights,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error("Cover letter error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate cover letter. Please try again." },
      { status: 500 }
    );
  }
}
