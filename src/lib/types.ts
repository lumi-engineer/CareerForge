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

export interface AnalysisResult {
  id: string;
  timestamp: string;
  profile: {
    name: string;
    jobTitle: string;
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
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}
