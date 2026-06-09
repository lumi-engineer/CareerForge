"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Download,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { downloadDocx } from "@/lib/docx-download";
import type { AnalysisResult, ImprovedResume } from "@/lib/types";

interface ImprovedResumeSectionProps {
  analysis: AnalysisResult;
  improvedResume?: ImprovedResume;
  onImproved: (data: ImprovedResume) => void;
}

export function ImprovedResumeSection({
  analysis,
  improvedResume,
  onImproved,
}: ImprovedResumeSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"original" | "improved" | "split">("split");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleImprove = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/improve-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText: analysis.originalText,
          analysis,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Failed to improve resume.");
        return;
      }

      onImproved(result.data);
      setView("split");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!improvedResume?.improvedText) return;
    await navigator.clipboard.writeText(improvedResume.improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocx = async () => {
    if (!improvedResume?.improvedText) return;
    setExporting(true);
    try {
      await downloadDocx({
        structuredResume: improvedResume.structuredResume,
        text: improvedResume.improvedText,
        fileName: `${analysis.profile.name.replace(/\s+/g, "_")}_Improved_Resume`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "DOCX export failed.");
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = () => {
    if (!improvedResume?.improvedText) return;
    const blob = new Blob([improvedResume.improvedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${analysis.profile.name.replace(/\s+/g, "_")}_Improved_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            Resume Improvement
          </h3>
          <p className="text-muted mt-1">
            Automatically rewrites your resume using OpenRouter AI and analysis feedback.
          </p>
        </div>

        {!improvedResume && (
          <button
            onClick={handleImprove}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Improving with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Improved Resume
              </>
            )}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-start gap-2 rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {improvedResume && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="card-glow rounded-2xl bg-surface-elevated p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="flex items-center gap-6">
                <ScoreRing score={analysis.overallScore} size={100} label="Before" />
                <ArrowRight className="h-6 w-6 text-accent hidden md:block" />
                <ScoreRing
                  score={improvedResume.improvedAnalysis?.overallScore ?? improvedResume.estimatedScore}
                  size={100}
                  label="After"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Improvement Summary</h4>
                <ul className="space-y-2">
                  {improvedResume.changesSummary.map((change, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted">
                      <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {(["split", "original", "improved"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    view === v
                      ? "bg-accent text-background"
                      : "bg-border/50 text-muted hover:text-foreground"
                  }`}
                >
                  {v === "split" ? "Side by Side" : v === "original" ? "Original" : "Improved"}
                </button>
              ))}
              <div className="flex-1" />
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownloadDocx}
                disabled={exporting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent-light transition-colors disabled:opacity-50"
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Download DOCX
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                <Download className="h-4 w-4" />
                Download TXT
              </button>
            </div>

            <div
              className={`grid gap-4 ${
                view === "split" ? "md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {(view === "split" || view === "original") && (
                <div className="rounded-xl bg-background/50 border border-border/50 p-5">
                  <h5 className="text-sm font-medium text-muted mb-3">Original Resume</h5>
                  <pre className="text-sm whitespace-pre-wrap font-[family-name:var(--font-body)] leading-relaxed text-foreground/80 max-h-[500px] overflow-y-auto">
                    {analysis.originalText}
                  </pre>
                </div>
              )}
              {(view === "split" || view === "improved") && (
                <div className="rounded-xl bg-accent/5 border border-accent/20 p-5">
                  <h5 className="text-sm font-medium text-accent mb-3">Improved Resume</h5>
                  <pre className="text-sm whitespace-pre-wrap font-[family-name:var(--font-body)] leading-relaxed text-foreground max-h-[500px] overflow-y-auto">
                    {improvedResume.improvedText}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
