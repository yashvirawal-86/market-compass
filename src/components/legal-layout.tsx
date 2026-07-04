import { Link } from "@tanstack/react-router";
import { Activity, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center">
              <Activity className="h-4 w-4 text-[color:var(--midnight)]" strokeWidth={3} />
            </div>
            <div className="font-display font-bold text-[15px]">Stocketize<span className="gradient-text"> AI</span></div>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--cyan)] font-semibold mb-3">Legal</div>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: {updated}</p>
        <div className="prose prose-invert mt-10 max-w-none text-[15px] leading-relaxed text-muted-foreground space-y-5 [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-[color:var(--cyan)] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5">
          {children}
        </div>
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link>
          <Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
          <Link to="/affiliate-disclosure" className="hover:text-foreground">Affiliate Disclosure</Link>
        </div>
      </main>
    </div>
  );
}
