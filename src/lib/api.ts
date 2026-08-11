// ---------------------------------------------------------------------------
// Curato Lens — API Client
// Centralised fetch wrapper that reads VITE_API_URL from environment.
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API Error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

import { supabase } from "@/lib/supabase";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(res.status, body);
  }

  return res.json() as Promise<T>;
}

/* ── Typed API methods ───────────────────────────────────────────────────── */

import type {
  AnalysisRequest,
  AnalysisResponse,
  JobStatusResponse,
  ReportResponse,
  HealthResponse,
} from "@/types/api";

export const api = {
  /** POST /analyze — submit a new analysis job */
  createAnalysis: (data: AnalysisRequest) =>
    request<AnalysisResponse>("/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** GET /job/{id} — poll job status */
  getJobStatus: (jobId: string) =>
    request<JobStatusResponse>(`/job/${jobId}`),

  /** GET /report/{job_id} — retrieve completed report */
  getReport: (jobId: string) =>
    request<ReportResponse>(`/report/${jobId}`),

  /** GET /health — system health check */
  getHealth: () => request<HealthResponse>("/health"),

  /** GET /auth/me — get current user profile */
  getMe: () => request<any>("/auth/me"),
};

export { ApiError };
