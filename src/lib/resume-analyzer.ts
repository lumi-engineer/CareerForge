import type { ResumeFeedback, ResumeSection, SkillGap } from "./types";
import { detectJob, getSkillsForJob } from "./job-titles";

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
  Finance: ["finance", "accounting", "financial modeling", "cfa", "cpa", "bookkeeping", "audit", "tax"],
  Nursing: ["patient care", "nursing", "clinical", "medication", "triage", "emr", "ehr"],
  Teaching: ["curriculum", "lesson plan", "classroom", "instruction", "pedagogy", "student assessment"],
  Legal: ["litigation", "legal research", "contract", "compliance", "case management"],
  Hospitality: ["food service", "guest relations", "menu planning", "hospitality", "banquet"],
  Construction: ["blueprint", "osha", "building codes", "construction", "renovation"],
  Healthcare: ["healthcare", "medical", "clinical", "pharma", "hospital", "patient"],
  Retail: ["retail", "point of sale", "merchandising", "inventory", "customer service"],
  Manufacturing: ["lean", "six sigma", "production", "assembly", "quality control", "iso"],
  "Human Resources": ["recruiting", "onboarding", "payroll", "benefits", "employee relations"],
  Logistics: ["supply chain", "logistics", "warehouse", "freight", "shipping", "inventory"],
  "Real Estate": ["real estate", "property", "leasing", "mortgage", "listing"],
  Media: ["journalism", "broadcast", "editing", "news", "media production"],
  Trades: ["electrical", "plumbing", "hvac", "welding", "carpentry"],
};


const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  Technology: ["software", "tech", "engineering", "developer", "it ", "saas", "programming"],
  Finance: ["finance", "banking", "investment", "fintech", "accounting", "audit", "tax"],
  Healthcare: ["healthcare", "medical", "clinical", "pharma", "hospital", "nursing", "patient"],
  Marketing: ["marketing", "brand", "advertising", "digital marketing", "campaign"],
  Education: ["education", "teaching", "academic", "university", "school", "curriculum"],
  Consulting: ["consulting", "advisory", "strategy"],
  Legal: ["legal", "law firm", "litigation", "attorney", "compliance"],
  Hospitality: ["restaurant", "hotel", "hospitality", "food service", "culinary"],
  Retail: ["retail", "store", "merchandise", "customer service", "sales floor"],
  Manufacturing: ["manufacturing", "production", "factory", "assembly", "plant"],
  Construction: ["construction", "building", "contractor", "renovation", "site"],
  Government: ["government", "public sector", "municipal", "federal", "civil service"],
  "Real Estate": ["real estate", "property", "realtor", "leasing", "mortgage"],
  Media: ["media", "journalism", "broadcast", "news", "publishing"],
  Transportation: ["transportation", "logistics", "shipping", "freight", "aviation"],
  Agriculture: ["agriculture", "farm", "crop", "ranch", "environmental"],
  Nonprofit: ["nonprofit", "ngo", "charity", "community", "social services"],
  Trades: ["electrician", "plumber", "hvac", "welding", "carpentry", "skilled trade"],
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

function extractJobTitle(text: string) {
  return detectJob(text);
}

function detectIndustry(text: string, jobTitle: string, jobCategory: string): string {
  if (jobCategory && jobCategory !== "General") {
    const categoryToIndustry: Record<string, string> = {
      "Technology & Engineering": "Technology",
      "Healthcare & Medical": "Healthcare",
      "Education & Teaching": "Education",
      "Finance & Accounting": "Finance",
      Legal: "Legal",
      "Sales & Business": "Consulting",
      "Marketing & Communications": "Marketing",
      "Human Resources": "Consulting",
      "Operations & Logistics": "Transportation",
      "Creative & Design": "Marketing",
      "Hospitality & Food Service": "Hospitality",
      "Trades & Construction": "Construction",
      "Science & Research": "Technology",
      "Government & Public Service": "Government",
      "Retail & Customer Service": "Retail",
      "Manufacturing & Production": "Manufacturing",
      "Real Estate": "Real Estate",
      "Social Services & Nonprofit": "Nonprofit",
      "Arts & Entertainment": "Media",
      "Sports & Fitness": "Healthcare",
      "Administrative & Office": "Consulting",
      "Aviation & Transportation": "Transportation",
      "Agriculture & Environment": "Agriculture",
      "Media & Journalism": "Media",
    };
    if (categoryToIndustry[jobCategory]) return categoryToIndustry[jobCategory];
  }

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

function identifySkillGaps(detectedSkills: string[], jobTitle: string, jobCategory: string): SkillGap[] {
  const targetSkills = getSkillsForJob(jobTitle, jobCategory);
  const allRelevant = [...new Set([...targetSkills, ...IN_DEMAND_SKILLS_2026.slice(0, 4)])];
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
  const jobDetection = extractJobTitle(text);
  const jobTitle = jobDetection.jobTitle;
  const jobCategory = jobDetection.jobCategory;
  const jobConfidence = jobDetection.confidence;
  const yearsExperience = extractYearsExperience(text);
  const industry = detectIndustry(text, jobTitle, jobCategory);
  const detectedSkills = detectSkills(text);
  const sections = analyzeSections(text);
  const feedback = generateFeedback(text, sections, detectedSkills);
  const missingSkills = identifySkillGaps(detectedSkills, jobTitle, jobCategory);

  const layoutScore = Math.round(sections.filter((s) => s.found).length / sections.length * 100);
  const contentScore = Math.round(feedback.reduce((sum, f) => sum + f.score, 0) / feedback.length);
  const overallScore = Math.round(layoutScore * 0.3 + contentScore * 0.7);

  const inDemand = IN_DEMAND_SKILLS_2026.filter(
    (s) => detectedSkills.includes(s) || missingSkills.some((g) => g.skill === s)
  );

  return {
    profile: {
      name,
      jobTitle,
      jobCategory,
      jobConfidence,
      yearsExperience,
      industry,
    },
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
