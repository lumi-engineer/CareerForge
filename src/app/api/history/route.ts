import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const analyses = await prisma.analysis.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, name: true } },
      },
      take: 100,
    });

    const items = analyses.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      jobTitle: a.jobTitle,
      jobCategory: a.jobCategory,
      overallScore: a.overallScore,
      userEmail: a.user.email,
      userName: a.user.name,
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ success: false, error: "Failed to load history." }, { status: 500 });
  }
}
