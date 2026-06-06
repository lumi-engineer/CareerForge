import Link from "next/link";
import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
              <Flame className="h-4 w-4 text-accent" />
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Career<span className="gradient-text">Forge</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted">
            <Link href="/analyze" className="hover:text-accent transition-colors">
              Analyze Resume
            </Link>
            <Link href="/#features" className="hover:text-accent transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-accent transition-colors">
              How It Works
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} CareerForge. Forge your future.</p>
          <p>Built to help you acquire skills in high demand.</p>
        </div>
      </div>
    </footer>
  );
}
