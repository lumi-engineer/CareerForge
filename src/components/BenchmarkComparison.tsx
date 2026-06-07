"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { BenchmarkComparison } from "@/lib/types";

function DeltaBadge({ delta }: { delta: number }) {
  if (delta > 5) {
    return (
      <span className="inline-flex items-center gap-1 text-success text-sm font-medium">
        <TrendingUp className="h-4 w-4" />
        +{delta}
      </span>
    );
  }
  if (delta < -5) {
    return (
      <span className="inline-flex items-center gap-1 text-danger text-sm font-medium">
        <TrendingDown className="h-4 w-4" />
        {delta}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-muted text-sm font-medium">
      <Minus className="h-4 w-4" />
      {delta >= 0 ? `+${delta}` : delta}
    </span>
  );
}

function CategoryBadge({ category }: { category: BenchmarkComparison["category"] }) {
  const labels = { experience: "Experience Level", industry: "Industry", style: "Format Style" };
  return (
    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent ring-1 ring-accent/20">
      {labels[category]}
    </span>
  );
}

function BenchmarkCard({
  comparison,
  isBestMatch,
  index,
}: {
  comparison: BenchmarkComparison;
  isBestMatch: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`card-glow rounded-xl p-6 ${
        isBestMatch ? "ring-2 ring-accent/40 bg-accent/5" : "bg-surface-elevated"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold">{comparison.name}</h4>
            {isBestMatch && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-background">
                Best Match
              </span>
            )}
          </div>
          <p className="text-sm text-muted mt-1">{comparison.description}</p>
        </div>
        <CategoryBadge category={comparison.category} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center rounded-lg bg-background/50 p-3">
          <p className="text-xs text-muted mb-1">Your Score</p>
          <p className="text-xl font-bold text-accent">{comparison.userScore}</p>
        </div>
        <div className="text-center rounded-lg bg-background/50 p-3">
          <p className="text-xs text-muted mb-1">Benchmark</p>
          <p className="text-xl font-bold">{comparison.benchmarkScore}</p>
        </div>
        <div className="text-center rounded-lg bg-background/50 p-3">
          <p className="text-xs text-muted mb-1">Delta</p>
          <DeltaBadge delta={comparison.scoreDelta} />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>Similarity to your profile</span>
          <span>{comparison.similarity}%</span>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-700"
            style={{ width: `${comparison.similarity}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {comparison.detectedSkills.slice(0, 5).map((skill) => (
          <span key={skill} className="rounded-md bg-border/50 px-2 py-0.5 text-xs text-muted">
            {skill}
          </span>
        ))}
      </div>

      <ul className="space-y-1.5">
        {comparison.insights.map((insight, i) => (
          <li key={i} className="text-sm text-muted flex gap-2">
            <BarChart3 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            {insight}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function BenchmarkComparisonSection({
  comparisons,
  bestMatchArchetype,
}: {
  comparisons: BenchmarkComparison[];
  bestMatchArchetype: string;
}) {
  return (
    <section>
      <div className="mb-6">
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Benchmark Comparison
        </h3>
        <p className="text-muted mt-1">
          Your resume analyzed against {comparisons.length} professional archetypes.
          Best match: <span className="text-accent font-medium">{bestMatchArchetype}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {comparisons.map((comparison, i) => (
          <BenchmarkCard
            key={comparison.id}
            comparison={comparison}
            isBestMatch={comparison.name === bestMatchArchetype}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
