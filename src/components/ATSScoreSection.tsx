"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle2 } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import type { ATSScore } from "@/lib/types";

export function ATSScoreSection({ atsScore }: { atsScore: ATSScore }) {
  const metrics = [
    { label: "Keyword Match", value: atsScore.keywordMatch },
    { label: "Formatting", value: atsScore.formatting },
    { label: "Sections", value: atsScore.sections },
    { label: "Readability", value: atsScore.readability },
  ];

  return (
    <section className="card-glow rounded-2xl bg-surface-elevated p-8">
      <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-2 flex items-center gap-2">
        <Target className="h-6 w-6 text-accent" />
        ATS Compatibility Score
      </h3>
      <p className="text-muted mb-8">
        AI-scored for Applicant Tracking System compatibility — how well your resume parses and ranks.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <ScoreRing score={atsScore.overall} label="ATS Score" sublabel="Overall" />
        <div className="flex-1 grid sm:grid-cols-2 gap-4 w-full">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-background/50 border border-border/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">{m.label}</span>
                <span className="font-semibold">{m.value}/100</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${
                    m.value >= 80 ? "bg-success" : m.value >= 60 ? "bg-accent" : "bg-danger"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {atsScore.suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">ATS Improvement Tips</h4>
          <ul className="space-y-2">
            {atsScore.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
