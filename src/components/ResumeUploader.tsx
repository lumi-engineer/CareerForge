"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, X, AlertCircle, Loader2 } from "lucide-react";

interface ResumeUploaderProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export function ResumeUploader({ onAnalyze, isLoading, error }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          dragActive
            ? "border-accent bg-accent/5 scale-[1.02]"
            : file
              ? "border-success/50 bg-success/5"
              : "border-border hover:border-accent/30 bg-surface-elevated"
        }`}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 ring-1 ring-success/20 mb-4">
                <FileText className="h-8 w-8 text-success" />
              </div>
              <p className="font-medium text-lg">{file.name}</p>
              <p className="text-sm text-muted mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-danger transition-colors"
              >
                <X className="h-4 w-4" />
                Remove file
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/20 mb-4 animate-float">
                <Upload className="h-8 w-8 text-accent" />
              </div>
              <p className="font-medium text-lg">Drop your resume here</p>
              <p className="text-sm text-muted mt-2">or click to browse — PDF only, max 10MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex items-center gap-2 rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => file && onAnalyze(file)}
        disabled={!file || isLoading}
        className="mt-6 w-full rounded-xl bg-accent px-8 py-4 text-base font-semibold text-background hover:bg-accent-light transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing Resume...
          </>
        ) : (
          "Analyze My Resume"
        )}
      </button>
    </div>
  );
}
