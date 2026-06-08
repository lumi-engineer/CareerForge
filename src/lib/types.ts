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
  benchmarkComparisons: BenchmarkComparison[];
  bestMatchArchetype: string;
  improvedResume?: ImprovedResume;
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
