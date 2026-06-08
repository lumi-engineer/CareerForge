"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import type { AnalysisResult } from "@/lib/types";

export default function HistoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [meta, setMeta] = useState<{ userEmail: string; userName: string | null; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/history/${id}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
          setMeta(result.meta);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-muted">
        Loading analysis...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Analysis Not Found</h1>
          <Link href="/history" className="text-accent hover:underline">
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Link>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
            {data.profile.name}&apos;s Analysis
          </h1>
          {meta && (
            <p className="text-muted mt-1 text-sm">
              By {meta.userName || meta.userEmail} · {new Date(meta.createdAt).toLocaleString()}
              {data.analyzedWith === "gemini" && (
                <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                  Gemini AI
                </span>
              )}
            </p>
          )}
        </motion.div>

        <ResultsDashboard data={data} />
      </div>
    </div>
  );
}
