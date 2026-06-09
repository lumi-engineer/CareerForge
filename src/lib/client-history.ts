import type { AnalysisResult } from "./types";

const STORAGE_KEY = "careerforge-history";

export interface HistoryEntry {
  id: string;
  fileName: string | null;
  jobTitle: string;
  jobCategory: string;
  overallScore: number;
  userEmail: string;
  userName: string | null;
  createdAt: string;
}

function storageKey(userId: string) {
  return `${STORAGE_KEY}-${userId}`;
}

export function saveAnalysisToLocalHistory(userId: string, userEmail: string, userName: string | null, result: AnalysisResult, fileName?: string) {
  if (typeof window === "undefined") return;

  const entry: HistoryEntry = {
    id: result.id,
    fileName: fileName ?? null,
    jobTitle: result.profile.jobTitle,
    jobCategory: result.profile.jobCategory,
    overallScore: result.overallScore,
    userEmail,
    userName,
    createdAt: result.timestamp,
  };

  try {
    const key = storageKey(userId);
    const existing: HistoryEntry[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    const filtered = existing.filter((e) => e.id !== entry.id);
    localStorage.setItem(key, JSON.stringify([entry, ...filtered].slice(0, 50)));
    localStorage.setItem(`careerforge-analysis-${result.id}`, JSON.stringify(result));
  } catch {
    // ignore quota errors
  }
}

export function getLocalHistory(userId: string): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) ?? "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

export function getLocalAnalysis(id: string): AnalysisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`careerforge-analysis-${id}`);
    return raw ? (JSON.parse(raw) as AnalysisResult) : null;
  } catch {
    return null;
  }
}

export function mergeHistoryEntries(server: HistoryEntry[], local: HistoryEntry[]): HistoryEntry[] {
  const map = new Map<string, HistoryEntry>();
  for (const item of [...server, ...local]) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
