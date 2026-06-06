import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/resume-analyzer";
import { scrapeCourses } from "@/lib/course-scraper";
import type { AnalyzeResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No resume file provided." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Please upload a PDF file." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size must be under 10MB." },
        { status: 400 }
      );
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
    const missingSkillNames = analysis.skills.missing.map((g) => g.skill);
    const courses = await scrapeCourses(
      missingSkillNames,
      analysis.skills.detected,
      analysis.profile.jobTitle,
      analysis.profile.yearsExperience
    );

    const result = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...analysis,
      courses,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze resume. Please try again." },
      { status: 500 }
    );
  }
}
