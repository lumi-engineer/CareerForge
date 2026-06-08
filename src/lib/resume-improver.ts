import type { AnalysisResult } from "./types";

export interface ImprovedResumeResult {
  improvedText: string;
  changesSummary: string[];
  estimatedScore: number;
}

const ACTION_VERB_MAP: Record<string, string> = {
  worked: "Contributed",
  helped: "Supported",
  did: "Executed",
  made: "Created",
  used: "Leveraged",
  was: "Served as",
  responsible: "Managed",
  involved: "Participated in",
};

const SECTION_HEADERS = [
  "PROFESSIONAL SUMMARY",
  "WORK EXPERIENCE",
  "EXPERIENCE",
  "EDUCATION",
  "SKILLS",
  "CERTIFICATIONS",
  "PROJECTS",
];

function extractContactBlock(text: string): string {
  const lines = text.split("\n").filter((l) => l.trim());
  const contactLines: string[] = [];

  for (const line of lines.slice(0, 6)) {
    const trimmed = line.trim();
    if (
      trimmed.includes("@") ||
      /linkedin|phone|\(\d{3}\)|\d{3}[-.\s]\d{3}/i.test(trimmed) ||
      (contactLines.length === 0 && trimmed.length < 50 && !SECTION_HEADERS.some((h) => trimmed.toUpperCase().includes(h)))
    ) {
      contactLines.push(trimmed);
    } else if (contactLines.length > 0) {
      break;
    }
  }

  return contactLines.slice(0, 3).join("\n") || lines[0]?.trim() || "Your Name\nemail@example.com | (555) 000-0000 | linkedin.com/in/yourprofile";
}

function buildSummary(analysis: AnalysisResult): string {
  const { name, jobTitle, yearsExperience, industry } = analysis.profile;
  const topSkills = analysis.skills.detected.slice(0, 4).join(", ");
  const skillPhrase = topSkills ? ` Skilled in ${topSkills}.` : "";

  return `${yearsExperience}+ years of experience as a ${jobTitle} in the ${industry} sector.${skillPhrase} Proven track record of delivering measurable results, collaborating cross-functionally, and driving continuous improvement. Seeking to leverage expertise in a challenging ${jobTitle} role.`.replace(
    name,
    "Professional"
  );
}

function enhanceBullet(line: string): string {
  const trimmed = line.trim();
  if (!trimmed) return trimmed;

  const isBullet = /^[-•*]\s?/.test(trimmed) || /^\d+\.\s/.test(trimmed);
  const prefix = isBullet ? trimmed.match(/^[-•*\d.]+\s?/)?.[0] ?? "- " : "- ";
  let content = trimmed.replace(/^[-•*\d.]+\s?/, "").trim();

  for (const [weak, strong] of Object.entries(ACTION_VERB_MAP)) {
    const regex = new RegExp(`^${weak}\\b`, "i");
    if (regex.test(content)) {
      content = content.replace(regex, strong);
      break;
    }
  }

  if (!/^(Led|Managed|Developed|Created|Implemented|Achieved|Delivered|Optimized|Increased|Reduced|Built|Designed|Coordinated|Streamlined|Spearheaded)/i.test(content)) {
    content = `Delivered results by ${content.charAt(0).toLowerCase()}${content.slice(1)}`;
  }

  if (!/\d+%|\$\d+|\d+\+|%\s|team of \d+/i.test(content) && content.length > 20) {
    content = content.replace(/\.$/, "") + " with measurable impact on team and project outcomes.";
  }

  return `${prefix}${content}`;
}

function extractSectionContent(text: string, keywords: string[]): string[] {
  const lines = text.split("\n");
  let inSection = false;
  const content: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const upper = trimmed.toUpperCase();

    if (SECTION_HEADERS.some((h) => upper === h || upper.startsWith(h))) {
      const isTarget = keywords.some((k) => upper.includes(k.toUpperCase()));
      inSection = isTarget;
      if (isTarget) continue;
      if (inSection) break;
      continue;
    }

    if (inSection && trimmed) {
      content.push(trimmed);
    }
  }

  if (content.length === 0) {
    return lines.filter((l) => {
      const t = l.trim();
      return t.length > 10 && !SECTION_HEADERS.some((h) => t.toUpperCase().includes(h));
    });
  }

  return content;
}

function formatExperience(lines: string[]): string {
  const formatted: string[] = [];
  for (const line of lines) {
    if (/^\d{4}|present|intern|engineer|manager|analyst|developer|designer|consultant/i.test(line) && line.length < 80) {
      formatted.push(`\n${line}`);
    } else if (line.startsWith("-") || line.startsWith("•") || /^\d+\./.test(line)) {
      formatted.push(enhanceBullet(line));
    } else if (line.length > 15) {
      formatted.push(enhanceBullet(`- ${line}`));
    } else {
      formatted.push(line);
    }
  }
  return formatted.join("\n").trim();
}

function buildSkillsSection(analysis: AnalysisResult): string {
  const existing = analysis.skills.detected;
  const recommended = analysis.skills.missing.slice(0, 4).map((g) => g.skill);
  const technical = [...new Set([...existing, ...recommended])];
  const soft = ["Communication", "Leadership", "Project Management", "Problem Solving"].filter(
    (s) => !technical.includes(s)
  );

  return `Technical: ${technical.join(", ") || "Add your technical skills here"}
Soft Skills: ${soft.join(", ")}`;
}

export function improveResumeLocally(
  originalText: string,
  analysis: AnalysisResult
): ImprovedResumeResult {
  const changesSummary: string[] = [];
  const contact = extractContactBlock(originalText);

  const hasSummary = analysis.sections.find((s) => s.name === "Professional Summary")?.found;
  const summary = hasSummary
    ? extractSectionContent(originalText, ["SUMMARY", "PROFILE", "OBJECTIVE"]).join("\n")
    : buildSummary(analysis);

  if (!hasSummary) {
    changesSummary.push("Added a professional summary tailored to your job title and experience.");
  } else {
    changesSummary.push("Kept and refined your professional summary section.");
  }

  const experienceLines = extractSectionContent(originalText, ["EXPERIENCE", "EMPLOYMENT", "WORK"]);
  const experience = formatExperience(experienceLines);
  if (experienceLines.length > 0) {
    changesSummary.push("Rewrote experience bullets with stronger action verbs and impact language.");
  } else {
    changesSummary.push("Structured work experience section — add role details and quantified achievements.");
  }

  const educationLines = extractSectionContent(originalText, ["EDUCATION"]);
  const education =
    educationLines.length > 0
      ? educationLines.join("\n")
      : "Degree | University Name | Year\n(Add your educational background)";

  if (educationLines.length === 0) {
    changesSummary.push("Added education section placeholder — fill in your degree details.");
  }

  const skills = buildSkillsSection(analysis);
  changesSummary.push(
    `Updated skills section with ${analysis.skills.detected.length} detected skills and ${Math.min(4, analysis.skills.missing.length)} recommended additions.`
  );

  const hasCertifications = analysis.sections.find((s) => s.name === "Certifications")?.found;
  let certifications = "";
  if (hasCertifications) {
    certifications = extractSectionContent(originalText, ["CERTIFICATION"]).join("\n");
  } else if (analysis.skills.missing.length > 0) {
    certifications = `Consider pursuing: ${analysis.skills.missing
      .slice(0, 2)
      .map((g) => g.skill)
      .join(", ")} certification(s)`;
    changesSummary.push("Suggested certifications based on identified skill gaps.");
  }

  const missingSections = analysis.sections.filter((s) => !s.found).map((s) => s.name);
  if (missingSections.length > 0) {
    changesSummary.push(`Addressed missing sections: ${missingSections.join(", ")}.`);
  }

  changesSummary.push("Reorganized layout for ATS compatibility with standard section headers.");

  const improvedText = [
    contact,
    "",
    "PROFESSIONAL SUMMARY",
    summary,
    "",
    "WORK EXPERIENCE",
    experience || "Job Title | Company Name | Start – End\n- Describe achievements with metrics (%, $, team size)",
    "",
    "EDUCATION",
    education,
    "",
    "SKILLS",
    skills,
    ...(certifications
      ? ["", "CERTIFICATIONS", certifications]
      : []),
  ].join("\n");

  const estimatedScore = Math.min(95, analysis.overallScore + 12 + (hasSummary ? 0 : 5) + (educationLines.length > 0 ? 3 : 0));

  return {
    improvedText,
    changesSummary,
    estimatedScore,
  };
}

export function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}
