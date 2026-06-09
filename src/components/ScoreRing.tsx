"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

export function ScoreRing({ score, size = 160, label, sublabel }: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            className="score-ring"
            style={
              {
                "--score-offset": animated ? offset : circumference,
                strokeDasharray: circumference,
                strokeDashoffset: animated ? offset : circumference,
                transition: "stroke-dashoffset 1.5s ease-out",
              } as React.CSSProperties
            }
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="font-[family-name:var(--font-display)] text-4xl font-bold"
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted mt-0.5">/ 100</span>
        </div>
      </div>
      {label && <p className="mt-3 text-sm font-medium">{label}</p>}
      {sublabel && <p className="text-xs text-muted">{sublabel}</p>}
    </div>
  );
}
