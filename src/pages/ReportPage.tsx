import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Lock,
} from "lucide-react";
import { useReport } from "@/hooks/useApi";
import { Navbar } from "@/components/layout/Navbar";
import { ReportHero } from "@/components/report/ReportHero";
import { ScoreCard } from "@/components/brand/ScoreCard";
import { ExecutiveSummary } from "@/components/report/ExecutiveSummary";
import { AIConsultantInsights } from "@/components/report/AIConsultantInsights";
import { Recommendations } from "@/components/report/Recommendations";
import { CompetitiveIntelligence } from "@/components/report/CompetitiveIntelligence";
import type { ReportMetadata } from "@/types/api";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export function ReportPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { data: report, isLoading, isError } = useReport(jobId ?? null);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Navbar />
        <div className="pt-40 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-2 rounded-full mx-auto mb-4 border-[var(--color-border)] border-t-[var(--color-teal)]"
          />
          <p className="text-[var(--color-text-secondary)]">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Navbar />
        <div className="pt-40 text-center container-premium">
          <h2 className="text-2xl mb-4 font-serif text-[var(--color-navy)]">Report Not Found</h2>
          <p className="mb-8 text-[var(--color-text-secondary)]">The report may still be generating. Please check back shortly.</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const meta: ReportMetadata = report.report_metadata || {};
  const scores = report.scores;
  const overallScore = scores?.overall_lens_score ?? 0;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryScoreData = scores?.category_scores?.map((cat) => ({
    label: cat.category || cat.label || "",
    score: cat.score ?? 0,
  })) || [];

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <Navbar />

      {/* 1. HERO (Includes Overall Score, Title, Summary, Radar) */}
      <div className="mb-14 max-sm:mb-12 md:mb-20 relative z-20">
        <ReportHero 
          companyName={meta.company_name || meta.domain || "Brand Intelligence Report"} 
          overallScore={overallScore} 
          categoryScores={categoryScoreData}
          executiveSummary={meta.executive_summary}
        />
      </div>

      {/* 2. OVERALL ASSESSMENT */}
      <section className="mb-16 md:mb-20 max-sm:mb-24 relative z-10">
        <div className="container-premium max-w-[1280px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <ExecutiveSummary text={meta.executive_summary} strengths={meta.strengths} weaknesses={meta.weaknesses} overallScore={overallScore} />
          </motion.div>
        </div>
      </section>

      {/* 3. AI CONSULTANT INSIGHTS */}
      <section className="mb-16 md:mb-20 max-sm:mb-24 relative z-0 max-sm:mt-8">
        <div className="container-premium max-w-[1280px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <AIConsultantInsights 
              insights={meta.ai_insights as any[] | undefined} 
              categoryScores={scores?.category_scores || undefined}
            />
          </motion.div>
        </div>
      </section>

      {/* 4. SCORE BREAKDOWN */}
      <section className="mb-20 md:mb-24">
        <div className="container-premium max-w-[1280px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl mb-10 text-center font-serif text-[var(--color-navy)]">
              Score Breakdown
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-8">
              {scores?.category_scores?.map((cat, i) => {
                let explanation = cat.description;
                const labelUpper = (cat.category || cat.label || "").toUpperCase();
                
                if (!explanation || explanation.trim() === "") {
                    if (labelUpper.includes("WEBSITE")) explanation = "Technical foundations, content depth, and user experience.";
                    else if (labelUpper.includes("SEO")) explanation = "Search visibility, structured data, and performance metrics.";
                    else if (labelUpper.includes("BRAND")) explanation = "Brand messaging, trust signals, and market positioning.";
                    else if (labelUpper.includes("MARKETING")) explanation = "Acquisition strategy, conversion funnels, and CTAs.";
                    else if (labelUpper.includes("SOCIAL")) explanation = "Social presence, audience engagement, and platform usage.";
                }

                return (
                  <div key={cat.category || i} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
                    <ScoreCard 
                      label={cat.category || cat.label || `Category ${i + 1}`} 
                      score={cat.score} 
                      delay={i} 
                      explanation={explanation} 
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. ASK CURATO AI */}
      <section className="mb-12 md:mb-16">
        <div className="container-premium max-w-[1280px] flex justify-center mx-auto">
          <motion.div className="w-full max-w-3xl" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="bg-white rounded-[24px] shadow-[var(--shadow-card)] border border-[var(--color-border-light)] py-10 md:py-12 px-8 md:px-12 text-center relative overflow-hidden group hover:border-[var(--color-teal)] transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(43,182,168,0.02)] to-[rgba(11,31,51,0.02)]" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 md:mb-8 bg-[rgba(43,182,168,0.08)] group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-8 h-8 text-[var(--color-teal)]" />
                </div>
                <h3 className="text-2xl md:text-3xl mb-4 font-serif text-[var(--color-navy)]">Ask Curato AI</h3>
                <p className="text-base mb-8 md:mb-10 text-[var(--color-text-secondary)] max-w-md leading-relaxed">
                  Have questions about your report? Our AI assistant will help you dive deeper into your brand intelligence data.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--color-bg)] text-[var(--color-navy)] border border-[var(--color-border-light)]">
                  <Lock className="w-4 h-4 text-[var(--color-text-secondary)]" /> Coming Soon
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. REPORT FOOTER */}
      <footer className="py-8 md:py-10 bg-white border-t border-[var(--color-border-light)] mt-auto">
        <div className="container-premium max-w-[1280px]">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-[15px] font-bold text-[var(--color-navy)] mb-1">Generated by Curato Lens</p>
            <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Analysis Date: {new Date(report.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
