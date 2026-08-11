import { motion } from "framer-motion";
import { TrendingUp, Clock, Target, ArrowRight } from "lucide-react";
import type { Recommendation } from "@/types/api";

interface RecommendationsProps {
  recommendations?: Recommendation[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations || recommendations.length === 0) return null;

  // Since time grouping is not in the backend yet, we group by impact as a proxy for priority/time.
  const groups = [
    { impact: "high", title: "Immediate Wins & High Priority", bg: "rgba(239, 68, 68, 0.05)", text: "var(--color-danger)" },
    { impact: "medium", title: "Strategic Improvements", bg: "rgba(245, 158, 11, 0.05)", text: "var(--color-warning)" },
    { impact: "low", title: "Long Term Optimizations", bg: "rgba(43, 182, 168, 0.05)", text: "var(--color-teal)" },
  ] as const;

  return (
    <div className="space-y-12">
      {groups.map((group) => {
        const items = recommendations.filter((r) => r.impact === group.impact);
        if (items.length === 0) return null;

        return (
          <div key={group.impact} className="relative">
            <div className="flex items-center gap-3 mb-6 border-b pb-3" style={{ borderColor: "var(--color-border-light)" }}>
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: group.bg, color: group.text }}>
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "var(--color-navy)" }}>
                {group.title}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {items.map((rec, i) => (
                <div key={i} className="card p-6 border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: group.text }}>
                  <h4 className="text-base font-bold mb-3" style={{ color: "var(--color-navy)" }}>{rec.title}</h4>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-text-secondary)" }}>{rec.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-auto pt-4 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                    <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-bg)]">
                      <Target className="w-3.5 h-3.5" style={{ color: "var(--color-text-secondary)" }} />
                      <span className="capitalize" style={{ color: "var(--color-navy)" }}>Priority: {rec.impact}</span>
                    </div>

                    {rec.difficulty && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-bg)]">
                        <Clock className="w-3.5 h-3.5" style={{ color: "var(--color-text-secondary)" }} />
                        <span className="capitalize" style={{ color: "var(--color-navy)" }}>Difficulty: {rec.difficulty}</span>
                      </div>
                    )}
                    
                    {rec.estimated_improvement && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[rgba(43,182,168,0.1)] text-[var(--color-teal)] ml-auto">
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>{rec.estimated_improvement}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
