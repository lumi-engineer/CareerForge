"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze Resume" },
  { href: "/history", label: "History" },
  { href: "/#features", label: "Features" },
];

interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) setUser(data.user);
      });
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20 group-hover:bg-accent/20 transition-colors">
            <Flame className="h-5 w-5 text-accent" />
          </div>
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
            Career<span className="gradient-text">Forge</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                pathname === link.href ? "text-accent" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted flex items-center gap-1.5 max-w-[160px] truncate">
                <User className="h-4 w-4 shrink-0" />
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background hover:bg-accent-light transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 text-muted hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-surface"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted hover:bg-surface-elevated hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <p className="px-4 py-2 text-sm text-muted">{user.email}</p>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-muted hover:bg-surface-elevated text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-muted hover:bg-surface-elevated">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="mt-2 rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-background">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
