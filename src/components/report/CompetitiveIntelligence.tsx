import { Compass } from "lucide-react";

interface CompetitiveIntelligenceProps {
  insights?: any[];
}

export function CompetitiveIntelligence({ insights }: CompetitiveIntelligenceProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="card p-10 text-center border-dashed border-2" style={{ borderColor: "var(--color-border-light)", background: "rgba(0,0,0,0.01)" }}>
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5" style={{ background: "var(--color-bg)" }}>
          <Compass className="w-8 h-8" style={{ color: "var(--color-teal)" }} />
        </div>
        <h4 className="text-xl md:text-2xl mb-3" style={{ fontFamily: "var(--font-serif)", color: "var(--color-navy)" }}>Competitive Outlook</h4>
        <p className="text-sm md:text-base max-w-lg mx-auto leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Competitive analysis will become available once competitor intelligence is enabled.
        </p>
      </div>
    );
  }

  // Fallback for when data exists, as currently rendered in ReportPage
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {insights.map((ci, i) => (
        <div key={i} className="card p-6">
          <h4 className="text-base font-semibold mb-2" style={{ fontFamily: "var(--font-sans)", color: "var(--color-navy)" }}>
            {ci.title}
          </h4>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-text-secondary)" }}>
            {ci.description}
          </p>
          {ci.advantages && ci.advantages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ci.advantages.map((adv: string, j: number) => (
                <span key={j} className="badge badge-teal text-xs">
                  {adv}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
