export interface ParsedResume {
  name: string;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  location?: string | null;
  summary?: string | null;
  jobTitle: string;
  jobCategory: string;
  yearsExperience: number;
  industry: string;
  skills: { technical: string[]; soft: string[] };
  experience: {
    title: string;
    company: string;
    dates: string;
    location?: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year?: string;
    details?: string;
  }[];
  certifications?: string[];
  languages?: string[];
}

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatting: number;
  sections: number;
  readability: number;
  suggestions: string[];
}

export interface TailoredResume {
  tailoredText: string;
  structuredResume: ParsedResume;
  changesSummary: string[];
  keywordMatches: string[];
  estimatedAtsScore: number;
}

export interface CoverLetter {
  text: string;
  highlights: string[];
}

export interface ResumeSection {
  name: string;
  found: boolean;
  score: number;
  feedback: string;
}

export interface SkillGap {
  skill: string;
  demand: "critical" | "high" | "moderate";
  currentLevel: "missing" | "basic" | "intermediate" | "advanced";
  recommendation: string;
}

export interface ResumeFeedback {
  category: string;
  score: number;
  maxScore: number;
  suggestions: string[];
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  platform: string;
  url: string;
  duration: string;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  price: string;
  description: string;
}

export interface BenchmarkResumeType {
  id: string;
  name: string;
  description: string;
  category: "experience" | "industry" | "style";
  sampleText: string;
}

export interface BenchmarkComparison {
  id: string;
  name: string;
  description: string;
  category: "experience" | "industry" | "style";
  benchmarkScore: number;
  userScore: number;
  scoreDelta: number;
  similarity: number;
  layoutScore: number;
  contentScore: number;
  detectedSkills: string[];
  insights: string[];
  sectionsPresent: string[];
}

export interface AIInsights {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detectedJobTitle?: string;
  detectedJobCategory?: string;
}

/** @deprecated use AIInsights */
export type GeminiInsights = AIInsights;

export interface ImprovedResume {
  improvedText: string;
  structuredResume?: ParsedResume;
  changesSummary: string[];
  estimatedScore: number;
  engine?: "built-in" | "openrouter" | "gemini";
  improvedAnalysis?: {
    overallScore: number;
    layoutScore: number;
    contentScore: number;
  };
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  profile: {
    name: string;
    jobTitle: string;
    jobCategory: string;
    jobConfidence: "high" | "medium" | "low";
    yearsExperience: number;
    industry: string;
  };
  overallScore: number;
  layoutScore: number;
  contentScore: number;
  sections: ResumeSection[];
  feedback: ResumeFeedback[];
  skills: {
    detected: string[];
    missing: SkillGap[];
    inDemand: string[];
  };
  courses: Course[];
  rawTextLength: number;
  originalText: string;
  parsedResume?: ParsedResume;
  atsScore?: ATSScore;
  benchmarkComparisons: BenchmarkComparison[];
  bestMatchArchetype: string;
  improvedResume?: ImprovedResume;
  tailoredResume?: TailoredResume;
  coverLetter?: CoverLetter;
  aiInsights?: AIInsights;
  /** @deprecated use aiInsights */
  geminiInsights?: AIInsights;
  analyzedWith?: "openrouter" | "gemini" | "local";
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

export interface ImproveResumeResponse {
  success: boolean;
  data?: ImprovedResume;
  error?: string;
}

export interface TailorResumeResponse {
  success: boolean;
  data?: TailoredResume;
  error?: string;
}

export interface CoverLetterResponse {
  success: boolean;
  data?: CoverLetter;
  error?: string;
}
