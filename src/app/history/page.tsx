"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Calendar, ExternalLink, History, Mail, User } from "lucide-react";

interface HistoryItem {
  id: string;
  fileName: string | null;
  jobTitle: string;
  jobCategory: string;
  overallScore: number;
  userEmail: string;
  userName: string | null;
  createdAt: string;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setItems(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <History className="h-7 w-7 text-accent" />
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold">
              Analysis <span className="gradient-text">History</span>
            </h1>
          </div>
          <p className="text-muted">
            All resume analyses from every user — job titles, scores, and results.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-muted py-20">Loading history...</div>
        ) : items.length === 0 ? (
          <div className="card-glow rounded-2xl bg-surface-elevated p-12 text-center">
            <History className="h-12 w-12 text-muted mx-auto mb-4" />
            <p className="text-muted mb-6">No analyses yet. Be the first to upload a resume!</p>
            <Link
              href="/login"
              className="inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-light transition-colors"
            >
              Sign In & Analyze
            </Link>
          </div>
        ) : (
          <div className="card-glow rounded-2xl bg-surface-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-left text-muted">
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Job Title</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">File</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/30 hover:bg-background/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted shrink-0" />
                          <div>
                            <p className="font-medium">{item.userName || "User"}</p>
                            <p className="text-xs text-muted flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {item.userEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-accent shrink-0" />
                          {item.jobTitle}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent ring-1 ring-accent/20">
                          {item.jobCategory}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold ${
                            item.overallScore >= 80
                              ? "text-success"
                              : item.overallScore >= 60
                                ? "text-accent"
                                : "text-danger"
                          }`}
                        >
                          {item.overallScore}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted truncate max-w-[140px]">
                        {item.fileName || "—"}
                      </td>
                      <td className="px-6 py-4 text-muted whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/history/${item.id}`}
                          className="inline-flex items-center gap-1 text-accent hover:text-accent-light text-sm font-medium"
                        >
                          View
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
