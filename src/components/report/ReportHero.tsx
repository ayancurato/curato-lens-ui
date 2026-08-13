import { motion } from "framer-motion";
import { ScoreGauge } from "../brand/ScoreGauge";
import { RadarChart } from "./RadarChart";
import { CheckCircle2, Sparkles, TrendingUp, BarChart2 } from "lucide-react";

interface ReportHeroProps {
  companyName: string;
  overallScore: number;
  categoryScores: { label: string; score: number }[];
  executiveSummary?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function ReportHero({ companyName, overallScore, categoryScores, executiveSummary }: ReportHeroProps) {
  const getStatus = (score: number) => {
    if (score >= 85) return { text: "Excellent", color: "var(--color-success)", bg: "rgba(34, 197, 94, 0.1)" };
    if (score >= 70) return { text: "Good", color: "var(--color-teal)", bg: "rgba(43, 182, 168, 0.1)" };
    if (score >= 50) return { text: "Needs Improvement", color: "var(--color-warning)", bg: "rgba(245, 158, 11, 0.1)" };
    return { text: "Poor", color: "var(--color-danger)", bg: "rgba(239, 68, 68, 0.1)" };
  };

  const status = getStatus(overallScore);

  return (
    <section style={{ paddingTop: "180px" }}>
      <div className="container-premium max-w-[1280px]">
        <div className="bg-white rounded-[24px] border border-[var(--color-border-light)] p-8 md:p-12 shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left: Overall Score */}
            <motion.div 
              custom={0} initial="hidden" animate="visible" variants={fadeUp}
              className="lg:col-span-3 flex flex-col items-center justify-center text-center"
            >
              <ScoreGauge score={overallScore} size={220} />
              <div 
                className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border"
                style={{ color: status.color, backgroundColor: status.bg, borderColor: 'rgba(0,0,0,0.05)' }}
              >
                <CheckCircle2 className="w-4 h-4" />
                {status.text}
              </div>
            </motion.div>

            {/* Middle: Title & Summary */}
            <motion.div 
              custom={1} initial="hidden" animate="visible" variants={fadeUp}
              className="lg:col-span-6 text-center lg:text-left px-4"
            >
              <h1 className="text-4xl md:text-5xl mb-6 font-serif text-[var(--color-navy)] leading-tight">
                Brand Intelligence Report
              </h1>
              {executiveSummary && (
                <p className="text-base md:text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                  {executiveSummary}
                </p>
              )}
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-bg)]" style={{ padding: "8px 16px" }}>
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-teal)]" />
                  AI-Powered Analysis
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-bg)]" style={{ padding: "8px 16px" }}>
                  <BarChart2 className="w-3.5 h-3.5 text-[var(--color-navy)]" />
                  Data-Driven Insights
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-bg)]" style={{ padding: "8px 16px" }}>
                  <TrendingUp className="w-3.5 h-3.5 text-[var(--color-success)]" />
                  Actionable Recommendations
                </span>
              </div>
            </motion.div>

            {/* Right: Radar Chart */}
            <motion.div 
              custom={2} initial="hidden" animate="visible" variants={fadeUp}
              className="lg:col-span-3 flex items-center justify-center lg:justify-end"
            >
              <RadarChart data={categoryScores} size={240} />
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
