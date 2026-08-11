// ---------------------------------------------------------------------------
// Curato Lens — API Type Definitions
// Mirrors the backend Pydantic schemas exactly. DO NOT modify to match backend.
// ---------------------------------------------------------------------------

/* ── Analysis ────────────────────────────────────────────────────────────── */

export interface AnalysisRequest {
  website_url: string;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  facebook_url?: string | null;
  youtube_url?: string | null;
}

export interface AnalysisResponse {
  job_id: string;
  status: string;
  message: string;
}

/* ── Job Status ──────────────────────────────────────────────────────────── */

export type JobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface JobStatusResponse {
  job_id: string;
  status: JobStatus;
  progress_pct: number;
  current_step: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

/* ── Report ──────────────────────────────────────────────────────────────── */

export interface CategoryScore {
  category: string;
  score: number;
  weight?: number;
  label?: string;
  description?: string;
}

export interface ReportScores {
  overall_lens_score: number | null;
  website_score: number | null;
  seo_score: number | null;
  social_score: number | null;
  category_scores: CategoryScore[] | null;
}

export interface ReportAnalytics {
  total_views: number;
  first_view: string | null;
  last_view: string | null;
}

export interface ReportMetadata {
  company_name?: string;
  domain?: string;
  industry?: string;
  executive_summary?: string;
  strengths?: Strength[];
  weaknesses?: Weakness[];
  recommendations?: Recommendation[];
  competitive_insights?: CompetitiveInsight[];
  brand_analytics?: BrandAnalytic[];
  [key: string]: unknown;
}

export interface Strength {
  title: string;
  description: string;
  icon?: string;
}

export interface Weakness {
  title: string;
  description: string;
  icon?: string;
}

export interface Recommendation {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  estimated_improvement?: string;
  difficulty?: "easy" | "medium" | "hard";
  priority?: number;
}

export interface CompetitiveInsight {
  title: string;
  description: string;
  ranking?: number;
  score?: number;
  advantages?: string[];
}

export interface BrandAnalytic {
  label: string;
  value: number;
  max?: number;
  unit?: string;
}

export interface ReportResponse {
  report_id: string;
  job_id: string;
  html_content: string | null;
  scores: ReportScores | null;
  analytics: ReportAnalytics | null;
  share_token: string | null;
  report_metadata: ReportMetadata | null;
  prompt_version: string | null;
  created_at: string;
}

/* ── Health ───────────────────────────────────────────────────────────────── */

export interface HealthResponse {
  status: string;
  database: string;
  redis: string;
  version: string;
  environment: string;
}
