import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, AlertCircle, Target, Zap } from "lucide-react";

interface EvidenceItem {
  metric: string;
  current?: string;
  target?: string;
  impact?: "high" | "medium" | "low" | string;
}

interface EvidenceCardProps {
  title: string;
  status: string;
  evidence: EvidenceItem[];
}

export function EvidenceCard({ title, status, evidence }: EvidenceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card border overflow-hidden" style={{ borderColor: "var(--color-border-light)" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
      >
        <div className="flex items-center gap-4">
          <h4 className="font-semibold text-base" style={{ color: "var(--color-navy)" }}>{title}</h4>
          <span className="text-sm font-medium px-2.5 py-1 rounded bg-[rgba(0,0,0,0.05)] text-[var(--color-text-secondary)]">
            {status}
          </span>
        </div>
        <ChevronDown 
          className="w-5 h-5 transition-transform duration-300" 
          style={{ color: "var(--color-text-secondary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[rgba(255,255,255,0.5)] border-t"
            style={{ borderColor: "var(--color-border-light)" }}
          >
            <div className="p-5 space-y-4">
              {evidence.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg bg-white border border-[rgba(0,0,0,0.05)] shadow-sm">
                  <div className="mb-3 md:mb-0">
                    <span className="text-sm font-medium block text-[var(--color-navy)]">{item.metric}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    {item.current && (
                      <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                        <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />
                        <span>Current: <strong className="text-[var(--color-navy)]">{item.current}</strong></span>
                      </div>
                    )}
                    {item.target && (
                      <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                        <Target className="w-4 h-4 text-[var(--color-success)]" />
                        <span>Target: <strong className="text-[var(--color-navy)]">{item.target}</strong></span>
                      </div>
                    )}
                    {item.impact && (
                      <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                        <Zap className="w-4 h-4 text-[var(--color-teal)]" />
                        <span className="capitalize text-[var(--color-navy)]">{item.impact} Impact</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
