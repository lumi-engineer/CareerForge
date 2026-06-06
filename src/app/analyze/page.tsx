"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileSearch, Globe, MessageSquare, BookOpen } from "lucide-react";
import { ResumeUploader } from "@/components/ResumeUploader";

const analysisSteps = [
  { icon: FileSearch, label: "Scanning resume layout & content" },
  { icon: MessageSquare, label: "Comparing against top resumes" },
  { icon: Globe, label: "Scraping course platforms" },
  { icon: BookOpen, label: "Building personalized recommendations" },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

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

      if (!result.success) {
        setError(result.error || "Analysis failed. Please try again.");
        return;
      }

      sessionStorage.setItem("careerforge-analysis", JSON.stringify(result.data));
      router.push("/results");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

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
            Our AI will scan your resume, provide expert feedback, and find courses
            to help you acquire in-demand skills.
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="card-glow rounded-2xl bg-surface-elevated p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/20 mx-auto mb-6 animate-pulse-glow">
                {(() => {
                  const StepIcon = analysisSteps[currentStep].icon;
                  return <StepIcon className="h-8 w-8 text-accent" />;
                })()}
              </div>
              <p className="font-medium mb-6">{analysisSteps[currentStep].label}</p>
              <div className="flex gap-2 justify-center">
                {analysisSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i <= currentStep ? "w-8 bg-accent" : "w-4 bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ResumeUploader onAnalyze={handleAnalyze} isLoading={isLoading} error={error} />
          </motion.div>
        )}

        <div className="mt-16 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { title: "Secure", desc: "Your resume is processed locally and never stored." },
            { title: "Fast", desc: "Full analysis completed in under 10 seconds." },
            { title: "Free", desc: "No account required. Start improving today." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-muted mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
