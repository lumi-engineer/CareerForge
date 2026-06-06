"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import type { AnalysisResult } from "@/lib/types";

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("careerforge-analysis");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(null);
      }
    }
  }, []);

  if (data === null) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-4">
            No Analysis Found
          </h1>
          <p className="text-muted mb-8">
            Upload your resume to get personalized feedback and course recommendations.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-background hover:bg-accent-light transition-colors"
          >
            Analyze Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Upload
            </Link>
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold">
              Your <span className="gradient-text">Analysis</span>
            </h1>
          </div>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Analyze Another
          </Link>
        </motion.div>

        <ResultsDashboard data={data} />
      </div>
    </div>
  );
}
