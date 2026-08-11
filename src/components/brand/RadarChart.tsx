import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { ReportScores, CategoryScore } from "@/types/api";

interface BrandRadarChartProps {
  scores: ReportScores | null;
  categoryScores: CategoryScore[];
}

export function BrandRadarChart({ scores, categoryScores }: BrandRadarChartProps) {
  // Build radar data from available scores
  const data: { subject: string; score: number; fullMark: number }[] = [];

  if (scores?.website_score != null) {
    data.push({ subject: "Website", score: scores.website_score, fullMark: 100 });
  }
  if (scores?.seo_score != null) {
    data.push({ subject: "SEO", score: scores.seo_score, fullMark: 100 });
  }
  if (scores?.social_score != null) {
    data.push({ subject: "Social", score: scores.social_score, fullMark: 100 });
  }

  // Add category scores
  categoryScores.forEach((cat) => {
    if (cat.score != null) {
      data.push({
        subject: cat.category || cat.label || "Category",
        score: cat.score,
        fullMark: 100,
      });
    }
  });

  // If we don't have enough data points, show a message
  if (data.length < 3) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Not enough data to display radar chart.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid
          stroke="var(--color-border-light)"
          strokeDasharray="3 3"
        />
        <PolarAngleAxis
          dataKey="subject"
          tick={{
            fill: "var(--color-text-secondary)",
            fontSize: 12,
            fontFamily: "var(--font-sans)",
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
          axisLine={false}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="var(--color-teal)"
          fill="var(--color-teal)"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
