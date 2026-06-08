import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.analysis.findUnique({
      where: { id },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!record) {
      return NextResponse.json({ success: false, error: "Analysis not found." }, { status: 404 });
    }

    const data = JSON.parse(record.resultJson);
    return NextResponse.json({
      success: true,
      data,
      meta: {
        userEmail: record.user.email,
        userName: record.user.name,
        fileName: record.fileName,
        createdAt: record.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Analysis fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to load analysis." }, { status: 500 });
  }
}
