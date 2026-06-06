import type { ResumeFeedback, ResumeSection, SkillGap } from "./types";

const SKILL_KEYWORDS: Record<string, string[]> = {
  JavaScript: ["javascript", "js", "es6", "typescript", "node.js", "nodejs", "react", "vue", "angular"],
  Python: ["python", "django", "flask", "pandas", "numpy", "scikit"],
  "Data Analysis": ["data analysis", "analytics", "sql", "tableau", "power bi", "excel"],
  "Machine Learning": ["machine learning", "ml", "deep learning", "tensorflow", "pytorch", "ai"],
  "Cloud Computing": ["aws", "azure", "gcp", "cloud", "kubernetes", "docker"],
  DevOps: ["devops", "ci/cd", "jenkins", "terraform", "ansible"],
  "Project Management": ["project management", "agile", "scrum", "jira", "pmp"],
  Leadership: ["leadership", "team lead", "managed", "mentor", "supervised"],
  Communication: ["communication", "presentation", "stakeholder", "collaboration"],
  "UI/UX Design": ["ui", "ux", "figma", "sketch", "design system", "wireframe"],
  Java: ["java", "spring", "spring boot", "hibernate"],
  "C#/.NET": ["c#", ".net", "asp.net", "entity framework"],
  Go: ["golang", " go "],
  Rust: ["rust"],
  Cybersecurity: ["security", "cybersecurity", "penetration", "soc", "siem"],
  Marketing: ["marketing", "seo", "sem", "content marketing", "social media"],
  Sales: ["sales", "crm", "salesforce", "business development"],
  Finance: ["finance", "accounting", "financial modeling", "cfa", "cpa"],
};

const JOB_TITLE_PATTERNS = [
  /(?:^|\n)\s*(?:senior\s+|junior\s+|lead\s+|staff\s+|principal\s+)?([a-z\s\/]+(?:engineer|developer|manager|analyst|designer|architect|consultant|director|specialist|coordinator|administrator))\s*(?:\||,|\n|$)/gi,
];

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  Technology: ["software", "tech", "engineering", "developer", "it ", "saas"],
  Finance: ["finance", "banking", "investment", "fintech", "accounting"],
  Healthcare: ["healthcare", "medical", "clinical", "pharma", "hospital"],
  Marketing: ["marketing", "brand", "advertising", "digital marketing"],
  Education: ["education", "teaching", "academic", "university"],
  Consulting: ["consulting", "advisory", "strategy"],
};

const IN_DEMAND_SKILLS_2026 = [
  "Machine Learning",
  "Cloud Computing",
  "Python",
  "Cybersecurity",
  "Data Analysis",
  "DevOps",
  "JavaScript",
  "Project Management",
  "Communication",
  "Leadership",
];

function extractName(text: string): string {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  for (const line of lines.slice(0, 5)) {
    const cleaned = line.trim();
    if (
      cleaned.length > 2 &&
      cleaned.length < 50 &&
      !cleaned.includes("@") &&
      !cleaned.match(/\d{3}/) &&
      !cleaned.toLowerCase().includes("resume") &&
      !cleaned.toLowerCase().includes("curriculum")
    ) {
      const words = cleaned.split(/\s+/);
      if (words.length >= 2 && words.length <= 4 && /^[A-Za-z\s.'-]+$/.test(cleaned)) {
        return cleaned;
      }
    }
  }
  return "Professional";
}

function extractJobTitle(text: string): string {
  const lower = text.toLowerCase();
  const titles = [
    "software engineer",
    "full stack developer",
    "frontend developer",
    "backend developer",
    "data scientist",
    "data analyst",
    "product manager",
    "project manager",
    "ux designer",
    "ui designer",
    "devops engineer",
    "cloud architect",
    "machine learning engineer",
    "business analyst",
    "marketing manager",
    "sales manager",
    "financial analyst",
    "hr manager",
    "consultant",
  ];

  for (const title of titles) {
    if (lower.includes(title)) {
      return title
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }

  for (const pattern of JOB_TITLE_PATTERNS) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match?.[1]) {
      return match[1].trim().replace(/\s+/g, " ");
    }
  }

  return "Professional";
}

function extractYearsExperience(text: string): number {
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/gi,
    /experience[:\s]+(\d+)\+?\s*years?/gi,
  ];

  let maxYears = 0;
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const years = parseInt(match[1], 10);
      if (years > maxYears && years < 50) maxYears = years;
    }
  }

  if (maxYears === 0) {
    const yearMatches = text.match(/\b(19|20)\d{2}\b/g);
    if (yearMatches && yearMatches.length >= 2) {
      const years = yearMatches.map(Number);
      const earliest = Math.min(...years);
      const currentYear = new Date().getFullYear();
      maxYears = Math.min(currentYear - earliest, 30);
    }
  }

  return maxYears || 3;
}

function detectIndustry(text: string, jobTitle: string): string {
  const combined = `${text} ${jobTitle}`.toLowerCase();
  let bestMatch = "General";
  let bestScore = 0;

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    const score = keywords.filter((k) => combined.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = industry;
    }
  }

  return bestMatch;
}

function detectSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      found.push(skill);
    }
  }

  return found;
}

function analyzeSections(text: string): ResumeSection[] {
  const lower = text.toLowerCase();

  const sectionChecks: { name: string; keywords: string[]; feedback: { found: string; missing: string } }[] = [
    {
      name: "Contact Information",
      keywords: ["email", "phone", "linkedin", "@" ],
      feedback: {
        found: "Contact details are present and accessible.",
        missing: "Add email, phone, and LinkedIn URL at the top of your resume.",
      },
    },
    {
      name: "Professional Summary",
      keywords: ["summary", "profile", "objective", "about me"],
      feedback: {
        found: "Professional summary provides a strong opening.",
        missing: "Add a 2-3 sentence professional summary highlighting your value proposition.",
      },
    },
    {
      name: "Work Experience",
      keywords: ["experience", "employment", "work history", "professional experience"],
      feedback: {
        found: "Work experience section is well-structured.",
        missing: "Include a detailed work experience section with quantifiable achievements.",
      },
    },
    {
      name: "Education",
      keywords: ["education", "degree", "university", "bachelor", "master", "gpa"],
      feedback: {
        found: "Education credentials are documented.",
        missing: "Add your educational background including degrees and institutions.",
      },
    },
    {
      name: "Skills",
      keywords: ["skills", "technical skills", "competencies", "technologies"],
      feedback: {
        found: "Skills section helps recruiters quickly assess fit.",
        missing: "Add a dedicated skills section with both technical and soft skills.",
      },
    },
    {
      name: "Certifications",
      keywords: ["certification", "certified", "certificate", "license"],
      feedback: {
        found: "Certifications demonstrate continued learning.",
        missing: "Consider adding relevant certifications to stand out.",
      },
    },
  ];

  return sectionChecks.map(({ name, keywords, feedback }) => {
    const found = keywords.some((k) => lower.includes(k));
    return {
      name,
      found,
      score: found ? 100 : 0,
      feedback: found ? feedback.found : feedback.missing,
    };
  });
}

function generateFeedback(text: string, sections: ResumeSection[], skills: string[]): ResumeFeedback[] {
  const wordCount = text.split(/\s+/).length;
  const hasNumbers = /\d+%|\$\d+|\d+\+|\d+\s*(?:users|clients|projects|team)/i.test(text);
  const hasActionVerbs = /(?:led|managed|developed|created|implemented|increased|reduced|achieved|delivered|optimized)/i.test(text);
  const lineCount = text.split("\n").filter((l) => l.trim()).length;

  const layoutScore = sections.filter((s) => s.found).length;
  const layoutMax = sections.length;

  const contentFeedback: ResumeFeedback[] = [
    {
      category: "Layout & Structure",
      score: Math.round((layoutScore / layoutMax) * 100),
      maxScore: 100,
      suggestions: sections.filter((s) => !s.found).map((s) => s.feedback),
    },
    {
      category: "Content Quality",
      score: Math.min(100, Math.round((wordCount / 400) * 60 + (hasNumbers ? 20 : 0) + (hasActionVerbs ? 20 : 0))),
      maxScore: 100,
      suggestions: [
        ...(wordCount < 200 ? ["Expand your resume with more detail — aim for 300-600 words."] : []),
        ...(wordCount > 800 ? ["Consider trimming to one page — focus on most relevant experience."] : []),
        ...(!hasNumbers ? ["Add quantifiable metrics (%, $, team size) to demonstrate impact."] : []),
        ...(!hasActionVerbs ? ["Start bullet points with strong action verbs (Led, Developed, Achieved)."] : []),
        ...(lineCount < 15 ? ["Add more detail to each section for a comprehensive profile."] : []),
      ],
    },
    {
      category: "Skills Alignment",
      score: Math.min(100, Math.round((skills.length / 8) * 100)),
      maxScore: 100,
      suggestions: [
        ...(skills.length < 5 ? ["List more relevant skills — top resumes include 8-12 key skills."] : []),
        ...(skills.length >= 5 ? ["Good skill coverage. Prioritize skills matching your target role."] : []),
        "Align skills with keywords from job descriptions in your target field.",
        "Separate technical skills from soft skills for clarity.",
      ],
    },
    {
      category: "ATS Compatibility",
      score: Math.round(
        (sections.filter((s) => ["Contact Information", "Work Experience", "Skills"].includes(s.name) && s.found).length / 3) * 70 +
          (text.length > 500 ? 15 : 0) +
          (!/[^\x00-\x7F]{3,}/.test(text) ? 15 : 0)
      ),
      maxScore: 100,
      suggestions: [
        "Use standard section headings (Experience, Education, Skills) for ATS parsing.",
        "Avoid tables, text boxes, and graphics that ATS systems can't read.",
        "Include keywords from target job postings naturally in your content.",
        "Save as PDF but ensure text is selectable (not image-based).",
      ],
    },
  ];

  return contentFeedback;
}

function identifySkillGaps(detectedSkills: string[], jobTitle: string): SkillGap[] {
  const jobSkillMap: Record<string, string[]> = {
    "Software Engineer": ["JavaScript", "Python", "Cloud Computing", "DevOps"],
    "Data Scientist": ["Python", "Machine Learning", "Data Analysis", "Cloud Computing"],
    "Data Analyst": ["Data Analysis", "Python", "Communication", "Project Management"],
    "Product Manager": ["Project Management", "Communication", "Leadership", "Data Analysis"],
    "Devops Engineer": ["DevOps", "Cloud Computing", "Python", "Cybersecurity"],
    "Ux Designer": ["UI/UX Design", "Communication", "JavaScript", "Project Management"],
    default: ["Communication", "Leadership", "Project Management", "Data Analysis"],
  };

  const normalizedTitle = jobTitle.toLowerCase();
  let targetSkills = jobSkillMap.default;

  for (const [role, skills] of Object.entries(jobSkillMap)) {
    if (normalizedTitle.includes(role.toLowerCase())) {
      targetSkills = skills;
      break;
    }
  }

  const allRelevant = [...new Set([...targetSkills, ...IN_DEMAND_SKILLS_2026.slice(0, 6)])];
  const gaps: SkillGap[] = [];

  for (const skill of allRelevant) {
    if (!detectedSkills.includes(skill)) {
      const demand = IN_DEMAND_SKILLS_2026.indexOf(skill) < 5 ? "critical" : IN_DEMAND_SKILLS_2026.includes(skill) ? "high" : "moderate";
      gaps.push({
        skill,
        demand,
        currentLevel: "missing",
        recommendation: `Adding ${skill} to your skillset would significantly improve your marketability for ${jobTitle} roles.`,
      });
    }
  }

  return gaps.slice(0, 6);
}

export function analyzeResume(text: string) {
  const name = extractName(text);
  const jobTitle = extractJobTitle(text);
  const yearsExperience = extractYearsExperience(text);
  const industry = detectIndustry(text, jobTitle);
  const detectedSkills = detectSkills(text);
  const sections = analyzeSections(text);
  const feedback = generateFeedback(text, sections, detectedSkills);
  const missingSkills = identifySkillGaps(detectedSkills, jobTitle);

  const layoutScore = Math.round(sections.filter((s) => s.found).length / sections.length * 100);
  const contentScore = Math.round(feedback.reduce((sum, f) => sum + f.score, 0) / feedback.length);
  const overallScore = Math.round(layoutScore * 0.3 + contentScore * 0.7);

  const inDemand = IN_DEMAND_SKILLS_2026.filter(
    (s) => detectedSkills.includes(s) || missingSkills.some((g) => g.skill === s)
  );

  return {
    profile: { name, jobTitle, yearsExperience, industry },
    overallScore,
    layoutScore,
    contentScore,
    sections,
    feedback,
    skills: {
      detected: detectedSkills,
      missing: missingSkills,
      inDemand,
    },
    rawTextLength: text.length,
  };
}
