import { Lightbulb, Info } from "lucide-react";
import React from "react";

export interface Insight {
  title?: string;
  evidence?: string;
  finding?: string;
  what_we_found?: string;
  impact?: string;
  whyItMatters?: string;
  why_it_matters?: string;
  recommendation?: string;
  what_to_do?: string;
  priority?: "high" | "medium" | "low";
}

interface AIConsultantInsightsProps {
  insights?: any[];
  categoryScores?: any[];
}

function cleanText(text: string): string {
  if (!text) return "";
  let clean = text.replace(/VERIFIED_ABSENT/g, "Not detected");
  clean = clean.replace(/NOT_COLLECTED/g, "Not available");
  clean = clean.replace(/PRESENT|MEASURED|\+30|\+20|\+10/g, "");
  return clean.trim();
}

function formatEvidence(text: string): React.ReactNode {
  if (!text) return null;
  
  let processed = cleanText(text);
  
  // Translate common raw JSON keys to readable labels
  const replacements: Record<string, string> = {
    "lcp:": "Largest Contentful Paint:",
    "mobile_pagespeed:": "Mobile PageSpeed:",
    "desktop_pagespeed:": "Desktop PageSpeed:",
    "form_count_total:": "Forms detected:",
    "has_email_capture: false": "Email capture: None detected",
    "has_email_capture: true": "Email capture: Detected",
    "has_trust_signals: false": "Trust signals: None detected",
    "has_trust_signals: true": "Trust signals: Detected",
    "has_lead_magnet: false": "Lead magnets: None detected",
    "has_lead_magnet: true": "Lead magnets: Detected",
    "blog_post_count:": "Blog posts detected:",
    "case_study_count:": "Case studies detected:",
    "social_links_count:": "Social links detected:"
  };

  for (const [key, val] of Object.entries(replacements)) {
    processed = processed.replace(new RegExp(key, "gi"), val);
  }

  // Split by semicolons or newlines to create bullets
  const lines = processed.split(/;|\n/).map(s => s.trim()).filter(s => s.length > 0);
  
  return (
    <ul className="space-y-1">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-[var(--color-teal)] font-bold mt-0.5">•</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

function formatParagraphs(text: string): React.ReactNode {
  if (!text) return null;
  const lines = cleanText(text).split(/\n/).map(s => s.trim()).filter(s => s.length > 0);
  
  if (lines.length === 1) return <>{lines[0]}</>;
  
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // If it looks like a numbered list point, format it nicely
        if (/^\d+\./.test(line)) {
          return (
             <div key={i} className="pl-4 -indent-4">
               {line}
             </div>
          );
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Activity, Globe, Zap, CheckCircle, FileText, Link as LinkIcon, Cpu } from "lucide-react";

// Helper to pick an icon based on insight title/finding
function getIconForInsight(title: string) {
  const t = title.toLowerCase();
  if (t.includes("speed") || t.includes("paint") || t.includes("performance") || t.includes("fast")) return <Zap className="w-5 h-5 text-[var(--color-teal)]" />;
  if (t.includes("tag") || t.includes("meta") || t.includes("seo") || t.includes("canonical")) return <Globe className="w-5 h-5 text-[var(--color-teal)]" />;
  if (t.includes("form") || t.includes("email") || t.includes("contact")) return <FileText className="w-5 h-5 text-[var(--color-teal)]" />;
  if (t.includes("link") || t.includes("url")) return <LinkIcon className="w-5 h-5 text-[var(--color-teal)]" />;
  if (t.includes("trust") || t.includes("secure")) return <CheckCircle className="w-5 h-5 text-[var(--color-teal)]" />;
  return <Activity className="w-5 h-5 text-[var(--color-teal)]" />;
}

function InsightRow({ obj, idx }: { obj: Insight, idx: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const evidenceContent = formatEvidence(obj.evidence || "");
  const findingContent = formatParagraphs(obj.finding || obj.what_we_found || "");
  const impactContent = formatParagraphs(obj.impact || obj.whyItMatters || obj.why_it_matters || "");
  const recContent = formatParagraphs(obj.recommendation || obj.what_to_do || "");

  // Determine a brief subtitle from the impact or finding
  const subtitleRaw = (obj.impact || obj.whyItMatters || obj.why_it_matters || obj.finding || obj.what_we_found || "");
  const subtitle = subtitleRaw.length > 80 ? subtitleRaw.substring(0, 80) + "..." : subtitleRaw;
  const icon = getIconForInsight(obj.title || obj.finding || "");
  
  // Fake priority if not present for the UI example, usually derived from score/impact in real app
  const priority = obj.priority || (idx < 2 ? "high" : idx < 4 ? "medium" : "low");
  const priorityColor = priority === "high" ? "#e11d48" : priority === "medium" ? "#d97706" : "var(--color-teal)";
  const priorityBg = priority === "high" ? "rgba(225,29,72,0.1)" : priority === "medium" ? "rgba(217,119,6,0.1)" : "rgba(43,182,168,0.1)";

  return (
    <div className="border-b border-[var(--color-border-light)] last:border-b-0 bg-white">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between hover:bg-[var(--color-bg)] transition-colors text-left"
        style={{ padding: "32px" }}
      >
        <div className="flex items-start gap-5 md:gap-6 flex-1 min-w-0">
          <div className="hidden md:flex w-10 h-10 rounded-full items-center justify-center bg-[var(--color-bg)] shrink-0 mt-1">
            {icon}
          </div>
          <div className="text-[var(--color-text-secondary)] font-mono text-sm md:text-base font-medium shrink-0 mt-2">
            {String(idx + 1).padStart(2, "0")}
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-base md:text-lg font-bold text-[var(--color-navy)] truncate">{obj.title || "Strategic Insight"}</h4>
            {subtitle && !isExpanded && (
              <p className="text-sm text-[var(--color-text-secondary)] truncate mt-2 md:mt-3">{cleanText(subtitle)}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-4 shrink-0 mt-2">
          <span 
            className="hidden md:inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full"
            style={{ color: priorityColor, backgroundColor: priorityBg }}
          >
            {priority} Impact
          </span>
          <ChevronRight className={`w-5 h-5 text-[var(--color-text-secondary)] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 md:p-8 md:pl-[104px] border-t border-[var(--color-border-light)] bg-[#fafafa]/30">
              <div className="space-y-6 max-w-3xl">
                {evidenceContent && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest mb-3 text-[var(--color-text-secondary)]">EVIDENCE</h5>
                    <div className="text-[15px] leading-relaxed text-[var(--color-text)]">
                      {evidenceContent}
                    </div>
                  </div>
                )}
                {findingContent && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest mb-3 text-[var(--color-text-secondary)]">WHAT WE FOUND</h5>
                    <div className="text-[15px] leading-relaxed text-[var(--color-text)]">
                      {findingContent}
                    </div>
                  </div>
                )}
                {impactContent && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest mb-3 text-[var(--color-text-secondary)]">WHY IT MATTERS</h5>
                    <div className="text-[15px] leading-relaxed text-[var(--color-text)]">
                      {impactContent}
                    </div>
                  </div>
                )}
                {recContent && (
                  <div className="p-5 rounded-[12px] mt-2 border border-[rgba(43,182,168,0.2)]" style={{ background: "rgba(43, 182, 168, 0.04)" }}>
                    <h5 className="text-xs font-bold uppercase tracking-widest mb-3 text-[var(--color-teal-dark)]">WHAT TO DO</h5>
                    <div className="text-[15px] leading-relaxed font-medium text-[var(--color-navy)]">
                      {recContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AIConsultantInsights({ insights, categoryScores }: AIConsultantInsightsProps) {
  const normalizedInsights: Insight[] = [];

  if (Array.isArray(insights)) {
    for (const item of insights) {
      if (typeof item === "object" && item !== null) {
        if (item.finding || item.what_we_found || item.whyItMatters || item.why_it_matters || item.recommendation || item.what_to_do) {
          normalizedInsights.push(item as Insight);
        }
      }
    }
  }

  if (Array.isArray(categoryScores)) {
    for (const cat of categoryScores) {
      if (Array.isArray(cat.recommendations)) {
        for (const rec of cat.recommendations) {
          if (typeof rec === "object" && rec !== null) {
            let generatedTitle = cat.category ? `${cat.category} Insight` : "Strategic Insight";
            if (rec.issue) {
              const words = rec.issue.split(" ");
              if (words.length > 3) {
                 generatedTitle = words.slice(0, 5).join(" ").replace(/[.,:]$/, "") + "...";
              } else {
                 generatedTitle = rec.issue;
              }
            }

            const mappedInsight: Insight = {
              title: generatedTitle,
              finding: rec.issue,
              evidence: rec.evidence,
              impact: rec.business_impact,
              recommendation: rec.expected_outcome,
            };
            
            if (mappedInsight.finding || mappedInsight.evidence || mappedInsight.impact || mappedInsight.recommendation) {
              normalizedInsights.push(mappedInsight);
            }
          }
        }
      }
    }
  }

  if (normalizedInsights.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-[var(--color-border-light)] p-12 text-center shadow-[var(--shadow-card)]">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 bg-[rgba(43,182,168,0.1)]">
          <Lightbulb className="w-8 h-8 text-[var(--color-teal)]" />
        </div>
        <h3 className="text-2xl font-serif text-[var(--color-navy)] mb-3">AI Consultant Insights</h3>
        <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
          No significant AI consultant insights were generated for this report.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] shadow-[var(--shadow-card)] border border-[var(--color-border-light)] overflow-hidden">
      <div className="border-b border-[var(--color-border-light)] flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ padding: "32px" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(43,182,168,0.1)]">
            <Lightbulb className="w-6 h-6 text-[var(--color-teal)]" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[var(--color-navy)] !mb-0">
              AI Consultant Insights
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1 !mb-0">Priority recommendations identified by Curato Lens</p>
          </div>
        </div>
        <div className="text-sm font-semibold text-[var(--color-navy)] bg-[var(--color-bg)] rounded-full" style={{ padding: "8px 16px" }}>
          View All {normalizedInsights.length} Insights
        </div>
      </div>
      
      <div className="flex flex-col pb-4 md:pb-6" style={{ marginTop: "60px" }}>
        {normalizedInsights.map((obj, idx) => (
          <InsightRow key={idx} obj={obj} idx={idx} />
        ))}
      </div>
    </div>
  );
}
