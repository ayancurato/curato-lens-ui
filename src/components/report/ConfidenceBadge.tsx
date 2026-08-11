import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface ConfidenceBadgeProps {
  level?: "high" | "medium" | "low" | string;
}

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  if (!level) return null;

  const l = level.toLowerCase();
  
  if (l === "high") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[rgba(43,182,168,0.1)] text-[var(--color-teal)]">
        <ShieldCheck className="w-3.5 h-3.5" />
        High Confidence
      </span>
    );
  }
  
  if (l === "medium") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]">
        <Shield className="w-3.5 h-3.5" />
        Medium Confidence
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)]">
      <ShieldAlert className="w-3.5 h-3.5" />
      Low Confidence
    </span>
  );
}
