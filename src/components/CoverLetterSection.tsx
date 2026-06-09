"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, Sparkles, Copy, Check, AlertCircle } from "lucide-react";
import type { AnalysisResult, CoverLetter } from "@/lib/types";

interface CoverLetterSectionProps {
  analysis: AnalysisResult;
  coverLetter?: CoverLetter;
  onGenerated: (data: CoverLetter | null) => void;
  jobDescription?: string;
}

export function CoverLetterSection({
  analysis,
  coverLetter,
  onGenerated,
  jobDescription: initialJobDescription = "",
}: CoverLetterSectionProps) {
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Paste a job description to generate a cover letter.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          targetJobDescription: jobDescription,
          companyName: companyName || undefined,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        setError(result.error || "Failed to generate cover letter.");
        return;
      }

      onGenerated(result.data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter?.text) return;
    await navigator.clipboard.writeText(coverLetter.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <div className="mb-6">
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-accent" />
          Cover Letter Generator
        </h3>
        <p className="text-muted mt-1">
          AI writes a tailored cover letter based on your resume and the target role.
        </p>
      </div>

      <div className="card-glow rounded-2xl bg-surface-elevated p-6 md:p-8 space-y-4">
        {!coverLetter && (
          <>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name (optional)"
              className="w-full rounded-xl bg-background/50 border border-border/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={5}
              className="w-full rounded-xl bg-background/50 border border-border/50 px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </>
        )}

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

        {!coverLetter && (
          <button
            onClick={handleGenerate}
            disabled={loading || !jobDescription.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Writing cover letter...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Cover Letter
              </>
            )}
          </button>
        )}

        {coverLetter && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={() => onGenerated(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Generate New
              </button>
            </div>

            {coverLetter.highlights.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted mb-2">Key Selling Points</h4>
                <div className="flex flex-wrap gap-2">
                  {coverLetter.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-md bg-accent/10 px-2.5 py-1 text-xs text-accent ring-1 ring-accent/20"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl bg-background/50 border border-border/50 p-5">
              <pre className="text-sm whitespace-pre-wrap leading-relaxed font-[family-name:var(--font-body)]">
                {coverLetter.text}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
