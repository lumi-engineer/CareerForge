import type { ParsedResume, AnalysisResult, SkillGap, ResumeSection, ResumeFeedback } from "./types";
import { analyzeResume } from "./resume-analyzer";

export function parsedResumeToPlainText(parsed: ParsedResume): string {
  const lines: string[] = [
    parsed.name,
    [parsed.email, parsed.phone, parsed.linkedin, parsed.location].filter(Boolean).join(" | "),
    "",
  ];

  if (parsed.summary) {
    lines.push("PROFESSIONAL SUMMARY", parsed.summary, "");
  }

  if (parsed.experience.length > 0) {
    lines.push("WORK EXPERIENCE");
    for (const exp of parsed.experience) {
      lines.push(`${exp.title} | ${exp.company} | ${exp.dates}`);
      for (const bullet of exp.bullets) {
        lines.push(`- ${bullet}`);
      }
      lines.push("");
    }
  }

  if (parsed.education.length > 0) {
    lines.push("EDUCATION");
    for (const edu of parsed.education) {
      lines.push(`${edu.degree} | ${edu.institution}${edu.year ? ` | ${edu.year}` : ""}`);
    }
    lines.push("");
  }

  const allSkills = [...parsed.skills.technical, ...parsed.skills.soft];
  if (allSkills.length > 0) {
    lines.push("SKILLS", allSkills.join(", "), "");
  }

  if (parsed.certifications?.length) {
    lines.push("CERTIFICATIONS", parsed.certifications.join("\n"));
  }

  return lines.join("\n").trim();
}

export function mergeAIWithLocalAnalysis(
  rawText: string,
  parsed: ParsedResume,
  local: ReturnType<typeof analyzeResume>
): Pick<
  AnalysisResult,
  "profile" | "overallScore" | "layoutScore" | "contentScore" | "sections" | "feedback" | "skills" | "rawTextLength"
> {
  const allSkills = [...new Set([...parsed.skills.technical, ...parsed.skills.soft, ...local.skills.detected])];

  const profile = {
    name: parsed.name || local.profile.name,
    jobTitle: parsed.jobTitle || local.profile.jobTitle,
    jobCategory: parsed.jobCategory || local.profile.jobCategory,
    jobConfidence: local.profile.jobConfidence,
    yearsExperience: parsed.yearsExperience || local.profile.yearsExperience,
    industry: parsed.industry || local.profile.industry,
  };

  const sections: ResumeSection[] = local.sections.map((s) => ({ ...s }));
  const sectionMap: Record<string, boolean> = {
    "Contact Information": Boolean(parsed.email || parsed.phone),
    "Professional Summary": Boolean(parsed.summary),
    "Work Experience": parsed.experience.length > 0,
    Education: parsed.education.length > 0,
    Skills: allSkills.length > 0,
    Certifications: (parsed.certifications?.length ?? 0) > 0,
  };

  for (const section of sections) {
    if (sectionMap[section.name] !== undefined) {
      section.found = sectionMap[section.name];
      section.score = section.found ? 100 : 0;
    }
  }

  const feedback: ResumeFeedback[] = [...local.feedback];
  if (parsed.experience.some((e) => e.bullets.some((b) => /\d+%|\$\d+|\d+\+/.test(b)))) {
    const contentFb = feedback.find((f) => f.category === "Content Quality");
    if (contentFb) contentFb.score = Math.min(100, contentFb.score + 10);
  }

  const missing: SkillGap[] = local.skills.missing;
  const detected = allSkills.slice(0, 20);

  return {
    profile,
    overallScore: local.overallScore,
    layoutScore: Math.round((sections.filter((s) => s.found).length / sections.length) * 100),
    contentScore: local.contentScore,
    sections,
    feedback,
    skills: { detected, missing, inDemand: local.skills.inDemand },
    rawTextLength: rawText.length,
  };
}

export function applyATSToScores(
  base: { overallScore: number; contentScore: number },
  ats: { overall: number }
): { overallScore: number; contentScore: number } {
  const overallScore = Math.round(base.overallScore * 0.4 + ats.overall * 0.6);
  const contentScore = Math.round(base.contentScore * 0.5 + ats.overall * 0.5);
  return { overallScore, contentScore };
}
