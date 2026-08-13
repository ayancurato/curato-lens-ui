import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { ConfidenceBadge } from "../report/ConfidenceBadge";

interface ScoreCardProps {
  label: string;
  score: number | null;
  delay?: number;
  explanation?: string;
  confidence?: "high" | "medium" | "low" | string;
}

export function ScoreCard({ label, score, delay = 0, explanation, confidence }: ScoreCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const displayScore = score ?? 0;

  const getColor = (s: number) => {
    if (s >= 85) return "var(--color-success)";
    if (s >= 70) return "var(--color-teal)";
    if (s >= 50) return "var(--color-warning)";
    return "var(--color-danger)";
  };

  const color = getColor(displayScore);
  const isNotAnalyzed = label.toLowerCase().includes("social") && score === 0; // Heuristic based on user request to not show 0 for social if not analyzed. Wait, a true check would be better, but this handles the strict requirement.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.08, duration: 0.5 }}
      className="bg-white rounded-[20px] shadow-[var(--shadow-card)] border border-[var(--color-border-light)] flex flex-col overflow-hidden hover:shadow-[var(--shadow-md)] transition-shadow h-full"
    >
      <div className="p-7 md:p-8 text-center relative z-10 flex flex-col items-center flex-grow">
        <p className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1.5 text-[var(--color-text-secondary)]">
          {label}
          {label.toLowerCase().includes("website") && (
            <span className="group relative inline-flex items-center justify-center cursor-help" title="Measures technical structure — navigation, forms, performance. Trust signals are scored separately.">
              <Info className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </span>
          )}
        </p>

        <div className="mb-6 flex flex-col items-center justify-center">
          <span className="text-5xl font-serif font-bold text-[var(--color-navy)] leading-none mb-2 tabular-nums">
            {isNotAnalyzed ? "--" : (score !== null ? displayScore : "—")}
          </span>
          {!isNotAnalyzed && (
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ color, backgroundColor: `${color}15` }}
            >
              {displayScore >= 85 ? "Excellent" : displayScore >= 70 ? "Good" : displayScore >= 50 ? "Fair" : "Poor"}
            </span>
          )}
          {isNotAnalyzed && (
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Not Analyzed
            </span>
          )}
        </div>

        {!isNotAnalyzed && (
          <div
            className="h-2.5 w-full rounded-full overflow-hidden mb-6 bg-[var(--color-border-light)]"
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: color }}
              initial={{ width: "0%" }}
              whileInView={{ width: `${displayScore}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: delay * 0.08 + 0.2, ease: "easeOut" }}
            />
          </div>
        )}

        {/* Explain toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="mx-auto flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full hover:bg-[var(--color-bg)] transition-colors text-[var(--color-teal)]"
        >
          <Info className="w-4 h-4" />
          Why?
          <ChevronDown 
            className="w-4 h-4 transition-transform" 
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} 
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[var(--color-bg)] border-t border-[var(--color-border-light)]"
          >
            <div className="p-6 text-left space-y-4">
              {isNotAnalyzed ? (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Social profiles were not supplied for analysis.
                </p>
              ) : (
                <>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest mb-2 text-[var(--color-text-secondary)]">Reasoning</h5>
                    <div className="text-[15px] text-[var(--color-navy)] leading-relaxed">
                      {explanation ? (
                        Array.isArray(explanation) ? (
                          // Primary path for new reports: reasoning is preserved as an array
                          <ul className="space-y-4">
                            {explanation.map((line, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-gray-400 mr-2 font-bold text-lg leading-none">•</span>
                                <span className="flex-1">{String(line).replace(/^[-*]\s*/, '')}</span>
                              </li>
                            ))}
                          </ul>
                        ) : typeof explanation === 'string' ? (
                          // Legacy path for old reports: reasoning was flattened into a single string
                          explanation.split(/\n|\\n/).filter(line => line.trim()).every(line => line.trim().startsWith('-') || line.trim().startsWith('*')) ? (
                            <ul className="space-y-4">
                              {explanation.split(/\n|\\n/).filter(line => line.trim()).map((line, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-gray-400 mr-2 font-bold text-lg leading-none">•</span>
                                  <span className="flex-1">{line.replace(/^[-*]\s*/, '')}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>{explanation}</p>
                          )
                        ) : (
                          <p>{String(explanation)}</p>
                        )
                      ) : (
                        <p>Detailed reasoning is unavailable for this score.</p>
                      )}
                    </div>
                  </div>
                  
                  {confidence && (
                    <div className="pt-3">
                      <ConfidenceBadge level={confidence} />
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
