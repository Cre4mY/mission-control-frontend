import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../services/apiClient";
import { queryKeys } from "../lib/queryKeys";

export interface OverviewMetrics {
  totalAgents: number;
  onlineAgents: number;
  offlineAgents: number;
  totalDepartments: number;
  activeCards: number;
  completedCardsToday: number;
  totalTokens: number;
  totalCost: number;
  completionRate: number;
  tasksPerDay: number;
}

export function useOverviewMetrics() {
  return useQuery<OverviewMetrics>({
    queryKey: queryKeys.overviewMetrics,
    queryFn: async () => {
      const data = await apiFetch<OverviewMetrics>("/metrics/overview");
      return data;
    },
    refetchInterval: 30000, // 30 seconds
  });
}

export interface DepartmentSummary {
  id: string;
  name: string;
  icon: string;
  color: string;
  agentCount: number;
  onlineCount: number;
  activeCards: number;
  completedToday: number;
}

export function useDepartmentSummaries() {
  return useQuery<DepartmentSummary[]>({
    queryKey: queryKeys.departmentSummaries,
    queryFn: async () => {
      const data = await apiFetch<{ summaries: DepartmentSummary[] }>("/metrics/departments");
      return data.summaries || [];
    },
    refetchInterval: 30000,
  });
}
