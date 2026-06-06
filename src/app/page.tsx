"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  FileSearch,
  Globe,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Resume Scanner",
    description:
      "Upload your PDF resume and our AI extracts your job title, skills, experience, and evaluates your layout structure.",
  },
  {
    icon: MessageSquare,
    title: "Expert Feedback",
    description:
      "Compare your resume against high-quality benchmarks. Get actionable suggestions for content, ATS compatibility, and formatting.",
  },
  {
    icon: Globe,
    title: "Smart Web Scraping",
    description:
      "Our AI-powered scraper searches Coursera, Udemy, edX, and more to find the most relevant courses for your career path.",
  },
  {
    icon: BookOpen,
    title: "Course Suggestions",
    description:
      "Personalized course recommendations based on your skill gaps and in-demand skills in today's job market.",
  },
];

const steps = [
  { step: "01", title: "Upload Resume", description: "Drop your PDF resume — we handle the rest." },
  { step: "02", title: "AI Analysis", description: "We scan layout, content, skills, and market alignment." },
  { step: "03", title: "Get Feedback", description: "Receive detailed scores and improvement suggestions." },
  { step: "04", title: "Learn & Grow", description: "Discover courses to close skill gaps and advance your career." },
];

const stats = [
  { value: "10K+", label: "Courses Indexed" },
  { value: "50+", label: "Skills Tracked" },
  { value: "5", label: "Platforms Scraped" },
  { value: "98%", label: "Analysis Accuracy" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden hero-glow grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-32 md:pt-32 md:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
              <Sparkles className="h-4 w-4" />
              AI-Powered Career Intelligence
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]">
              Forge Your Career with{" "}
              <span className="gradient-text">In-Demand Skills</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted leading-relaxed">
              Upload your resume, get expert feedback, and discover personalized online courses
              that close your skill gaps — all powered by intelligent web scraping and market data.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-background hover:bg-accent-light transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <Upload className="h-5 w-5" />
                Analyze My Resume
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-medium text-muted hover:text-foreground hover:border-accent/30 transition-colors"
              >
                See How It Works
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 bg-surface/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold">
              Everything You Need to <span className="gradient-text">Level Up</span>
            </h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto">
              CareerForge combines resume intelligence with real-time course discovery
              to help you stay ahead in the job market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glow rounded-2xl bg-surface-elevated p-8 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20 mb-5">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-muted">Four steps from resume to career growth.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-accent/40 to-transparent" />
                )}
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/20 font-[family-name:var(--font-display)] text-2xl font-bold text-accent mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="card-glow rounded-3xl bg-surface-elevated p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-6">
                <Target className="h-5 w-5 text-accent" />
                <TrendingUp className="h-5 w-5 text-accent" />
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold mb-4">
                Ready to Forge Your Future?
              </h2>
              <p className="text-muted max-w-xl mx-auto mb-8 text-lg">
                Join thousands of professionals who use CareerForge to identify skill gaps
                and find the perfect courses to advance their careers.
              </p>
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-background hover:bg-accent-light transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Start Free Analysis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
