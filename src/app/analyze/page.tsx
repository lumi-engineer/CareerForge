"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileSearch, Globe, MessageSquare, BookOpen, Sparkles } from "lucide-react";
import { ResumeUploader } from "@/components/ResumeUploader";
import { saveAnalysisToLocalHistory } from "@/lib/client-history";

const analysisSteps = [
  { icon: FileSearch, label: "Scanning resume layout & content" },
  { icon: Sparkles, label: "OpenRouter AI analyzing your profile" },
  { icon: MessageSquare, label: "Comparing against top resumes" },
  { icon: Globe, label: "Scraping course platforms" },
  { icon: BookOpen, label: "Building personalized recommendations" },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string | null } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.replace("/login?redirect=/analyze");
        } else {
          setCurrentUser(data.user);
          setAuthChecked(true);
        }
      });
  }, [router]);

  const handleAnalyze = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, analysisSteps.length - 1));
    }, 1200);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.status === 401) {
        router.replace("/login?redirect=/analyze");
        return;
      }

      if (!result.success) {
        setError(result.error || "Analysis failed. Please try again.");
        return;
      }

      sessionStorage.setItem("careerforge-analysis", JSON.stringify(result.data));
      if (currentUser) {
        saveAnalysisToLocalHistory(currentUser.id, currentUser.email, currentUser.name, result.data, file.name);
      }
      router.push("/results");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-muted">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-16">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-4">
            Upload Your <span className="gradient-text">Resume</span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Upload PDF or DOCX — OpenRouter AI parses, scores ATS compatibility, and finds courses to close skill gaps.
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto text-center">
            <div className="card-glow rounded-2xl bg-surface-elevated p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/20 mx-auto mb-6 animate-pulse-glow">
                {(() => {
                  const StepIcon = analysisSteps[currentStep].icon;
                  return <StepIcon className="h-8 w-8 text-accent" />;
                })()}
              </div>
              <p className="font-medium mb-6">{analysisSteps[currentStep].label}</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {analysisSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i <= currentStep ? "w-6 bg-accent" : "w-3 bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResumeUploader onAnalyze={handleAnalyze} isLoading={isLoading} error={error} />
          </motion.div>
        )}

        <div className="mt-16 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { title: "Secure", desc: "Your account keeps your analysis history saved." },
            { title: "OpenRouter AI", desc: "Powered by free-tier models via OpenRouter." },
            { title: "150+ Jobs", desc: "Detects job titles across every profession." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-muted mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in with Google
          </Link>
        </p>
      </div>
    </div>
  );
}
