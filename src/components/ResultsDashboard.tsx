"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Star,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import type { AnalysisResult, Course, ResumeFeedback, SkillGap } from "@/lib/types";

function FeedbackCard({ feedback }: { feedback: ResumeFeedback }) {
  const pct = Math.round((feedback.score / feedback.maxScore) * 100);

  return (
    <div className="card-glow rounded-xl bg-surface-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">{feedback.category}</h4>
        <span
          className={`text-sm font-semibold ${
            pct >= 80 ? "text-success" : pct >= 60 ? "text-accent" : "text-danger"
          }`}
        >
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-border mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${
            pct >= 80 ? "bg-success" : pct >= 60 ? "bg-accent" : "bg-danger"
          }`}
        />
      </div>
      <ul className="space-y-2">
        {feedback.suggestions.slice(0, 3).map((s, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted">
            <ArrowUpRight className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillGapBadge({ gap }: { gap: SkillGap }) {
  const demandColors = {
    critical: "bg-danger/10 text-danger ring-danger/20",
    high: "bg-accent/10 text-accent ring-accent/20",
    moderate: "bg-warning/10 text-warning ring-warning/20",
  };

  return (
    <div className="card-glow rounded-xl bg-surface-elevated p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-medium">{gap.skill}</h4>
          <p className="text-sm text-muted mt-1">{gap.recommendation}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${demandColors[gap.demand]}`}>
          {gap.demand} demand
        </span>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="card-glow rounded-xl bg-surface-elevated p-6 flex flex-col h-full transition-all hover:scale-[1.01]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-xs font-medium text-accent">{course.platform}</span>
          <h4 className="font-semibold mt-1 leading-snug">{course.title}</h4>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Star className="h-3.5 w-3.5 text-accent fill-accent" />
          <span className="text-sm font-medium">{course.rating}</span>
        </div>
      </div>

      <p className="text-sm text-muted flex-1">{course.description}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {course.skills.map((skill) => (
          <span key={skill} className="rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
          <span>{course.level}</span>
          <span>{course.price}</span>
        </div>
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-light transition-colors"
        >
          View Course
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

export function ResultsDashboard({ data }: { data: AnalysisResult }) {
  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glow rounded-2xl bg-surface-elevated p-8 md:p-10"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <ScoreRing score={data.overallScore} label="Overall Score" sublabel="Resume Quality" />

          <div className="flex-1 text-center md:text-left">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold">
              {data.profile.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-muted">
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-accent" />
                {data.profile.jobTitle}
              </span>
              <span>{data.profile.yearsExperience}+ years experience</span>
              <span>{data.profile.industry}</span>
            </div>

            <div className="flex gap-6 mt-6 justify-center md:justify-start">
              <ScoreRing score={data.layoutScore} size={100} label="Layout" />
              <ScoreRing score={data.contentScore} size={100} label="Content" />
            </div>
          </div>
        </div>
      </motion.section>

      <section>
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Resume Sections
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.sections.map((section) => (
            <div
              key={section.name}
              className={`rounded-xl p-5 ring-1 ${
                section.found
                  ? "bg-success/5 ring-success/20"
                  : "bg-danger/5 ring-danger/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {section.found ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-danger" />
                )}
                <span className="font-medium text-sm">{section.name}</span>
              </div>
              <p className="text-xs text-muted">{section.feedback}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Resume Feedback
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {data.feedback.map((fb) => (
            <FeedbackCard key={fb.category} feedback={fb} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-2">
          Skills Analysis
        </h3>
        <p className="text-muted mb-6">
          {data.skills.detected.length} skills detected · {data.skills.missing.length} gaps identified
        </p>

        {data.skills.detected.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm font-medium text-muted mb-3">Detected Skills</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.detected.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-success/10 ring-1 ring-success/20 px-3 py-1.5 text-sm text-success"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.skills.missing.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              Skill Gaps — High Market Demand
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {data.skills.missing.map((gap) => (
                <SkillGapBadge key={gap.skill} gap={gap} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold">
              Recommended Courses
            </h3>
            <p className="text-muted mt-1">
              Curated from Coursera, Udemy, edX & more based on your skill gaps
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
