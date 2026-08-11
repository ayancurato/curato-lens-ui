// ---------------------------------------------------------------------------
// Curato Lens — React Query Hooks
// Custom hooks wrapping TanStack Query for all API operations.
// ---------------------------------------------------------------------------

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AnalysisRequest } from "@/types/api";

/** Submit a new brand analysis. Returns mutation with job_id on success. */
export function useCreateAnalysis() {
  return useMutation({
    mutationFn: (data: AnalysisRequest) => api.createAnalysis(data),
  });
}

/**
 * Poll job status every 2 seconds while the job is pending or running.
 * Stops polling once the job completes or fails.
 */
export function useJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: ["job-status", jobId],
    queryFn: () => api.getJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed" || status === "cancelled") {
        return false;
      }
      return 2000;
    },
    refetchIntervalInBackground: true,
  });
}

/** Fetch the completed report for a job. */
export function useReport(jobId: string | null) {
  return useQuery({
    queryKey: ["report", jobId],
    queryFn: () => api.getReport(jobId!),
    enabled: !!jobId,
    staleTime: Infinity,
    retry: 2,
  });
}

/** Health check — one-shot, no auto-refetch. */
export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => api.getHealth(),
    staleTime: 30_000,
  });
}
