import { NextRequest, NextResponse } from "next/server";
import { generateDocxBuffer } from "@/lib/docx-export";
import { requireAuth, AuthError } from "@/lib/auth";
import type { ParsedResume } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { text, structuredResume, fileName } = body as {
      text?: string;
      structuredResume?: ParsedResume;
      fileName?: string;
    };

    if (!text && !structuredResume) {
      return NextResponse.json({ success: false, error: "No resume content provided." }, { status: 400 });
    }

    const buffer = await generateDocxBuffer(structuredResume, text);
    const safeName = (fileName ?? "Resume").replace(/[^\w\s-]/g, "").trim() || "Resume";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}.docx"`,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    console.error("DOCX export error:", error);
    return NextResponse.json({ success: false, error: "Failed to export DOCX." }, { status: 500 });
  }
}
