"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Loader2, Sparkles, Download, AlertCircle } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { downloadDocx } from "@/lib/docx-download";
import type { AnalysisResult, TailoredResume } from "@/lib/types";

interface TailorResumeSectionProps {
  analysis: AnalysisResult;
  tailoredResume?: TailoredResume;
  onTailored: (data: TailoredResume | null) => void;
}

export function TailorResumeSection({ analysis, tailoredResume, onTailored }: TailorResumeSectionProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError("Paste a job description to tailor your resume.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, targetJobDescription: jobDescription }),
      });

      const result = await response.json();
      if (!result.success) {
        setError(result.error || "Failed to tailor resume.");
        return;
      }

      onTailored(result.data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportDocx = async () => {
    if (!tailoredResume) return;
    setExporting(true);
    try {
      await downloadDocx({
        structuredResume: tailoredResume.structuredResume,
        text: tailoredResume.tailoredText,
        fileName: `${analysis.profile.name.replace(/\s+/g, "_")}_Tailored_Resume`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <section>
      <div className="mb-6">
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-accent" />
          Tailor for a Job
        </h3>
        <p className="text-muted mt-1">
          Paste a job description and AI will rewrite your resume to match keywords and requirements.
        </p>
      </div>

      <div className="card-glow rounded-2xl bg-surface-elevated p-6 md:p-8 space-y-4">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={6}
          className="w-full rounded-xl bg-background/50 border border-border/50 px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-accent/30"
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {!tailoredResume && (
          <button
            onClick={handleTailor}
            disabled={loading || !jobDescription.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Tailoring with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Tailor Resume
              </>
            )}
          </button>
        )}

        {tailoredResume && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <ScoreRing score={tailoredResume.estimatedAtsScore} size={100} label="Est. ATS" />
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Changes Made</h4>
                <ul className="space-y-1.5">
                  {tailoredResume.changesSummary.map((c, i) => (
                    <li key={i} className="text-sm text-muted flex gap-2">
                      <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {tailoredResume.keywordMatches.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted mb-2">Keywords Matched</h4>
                <div className="flex flex-wrap gap-2">
                  {tailoredResume.keywordMatches.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-success/10 ring-1 ring-success/20 px-2.5 py-1 text-xs text-success"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportDocx}
                disabled={exporting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent-light transition-colors disabled:opacity-50"
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Download DOCX
              </button>
              <button
                onClick={() => {
                  onTailored(null);
                  setError(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Tailor Again
              </button>
            </div>

            <div className="rounded-xl bg-accent/5 border border-accent/20 p-5">
              <h5 className="text-sm font-medium text-accent mb-3">Tailored Resume</h5>
              <pre className="text-sm whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                {tailoredResume.tailoredText}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
