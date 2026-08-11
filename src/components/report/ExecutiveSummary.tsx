import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Briefcase } from "lucide-react";
import type { Strength, Weakness } from "@/types/api";

interface ExecutiveSummaryProps {
  text?: string;
  strengths?: Strength[];
  weaknesses?: Weakness[];
  overallScore: number;
}

export function ExecutiveSummary({ text, strengths, weaknesses, overallScore }: ExecutiveSummaryProps) {
  if (!text) return null;

  const topStrengths = (strengths || []).filter(s => {
    return s && s.title && s.title.trim().length > 0;
  }).slice(0, 3);

  const topWeaknesses = (weaknesses || []).filter(w => {
    return w && w.title && w.title.trim().length > 0;
  }).slice(0, 3);

  const getHealthStatus = (s: number) => {
    if (s >= 85) return { label: "Excellent", color: "var(--color-success)" };
    if (s >= 70) return { label: "Good", color: "var(--color-teal)" };
    if (s >= 50) return { label: "Fair", color: "var(--color-warning)" };
    if (s >= 30) return { label: "Needs Improvement", color: "var(--color-danger)" };
    return { label: "Critical", color: "var(--color-danger)" };
  };

  const health = getHealthStatus(overallScore);

  return (
    <div className="bg-white rounded-[24px] shadow-[var(--shadow-card)] border border-[var(--color-border-light)] px-6 md:px-8 pt-8 md:pt-10 pb-8 md:pb-10">
      <div className="mb-5 md:mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 md:mb-4" style={{ color: "var(--color-teal)" }}>
          Overall Assessment
        </h3>
        <div className="flex items-center gap-3">
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-navy)]">
            Brand Health
          </h2>
          <span 
            className="px-3 py-1 text-sm font-semibold rounded-full" 
            style={{ backgroundColor: `${health.color}15`, color: health.color }}
          >
            {health.label}
          </span>
        </div>
      </div>

      <div className="mb-8 md:mb-10 max-w-4xl">
        <p className="text-base md:text-lg leading-relaxed whitespace-pre-line text-[var(--color-text-secondary)]">
          {text}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 rounded-[16px] border border-[var(--color-border-light)] bg-[#fafafa]/50">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-5" style={{ color: "var(--color-teal-dark)" }}>
            <CheckCircle2 className="w-4 h-4" /> Top Strengths
          </h4>
          {topStrengths.length > 0 ? (
            <ul className="space-y-4">
              {topStrengths.map((s, i) => {
                const title = typeof s === "object" ? s.title : s;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[var(--color-teal)] font-bold mt-1.5 shrink-0 text-xs">●</span>
                    <span className="text-[15px] font-medium leading-relaxed text-[var(--color-navy)]">{title}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] italic">No significant strengths were identified in this assessment.</p>
          )}
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-5" style={{ color: "#e11d48" }}>
            <AlertTriangle className="w-4 h-4" /> Key Areas to Improve
          </h4>
          {topWeaknesses.length > 0 ? (
            <ul className="space-y-4">
              {topWeaknesses.map((w, i) => {
                const title = typeof w === "object" ? w.title : w;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#e11d48] font-bold mt-1.5 shrink-0 text-xs">●</span>
                    <span className="text-[15px] font-medium leading-relaxed text-[var(--color-navy)]">{title}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] italic">No critical areas were identified in this assessment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
